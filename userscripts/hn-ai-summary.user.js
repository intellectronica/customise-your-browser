// ==UserScript==
// @name         Hacker News AI Summary
// @namespace    https://elite-ai-assisted-coding.dev/
// @version      0.0.3
// @description  Adds a "summary" link to Hacker News items that uses Chrome's built-in AI Summarizer API.
// @author       GitHub Copilot
// @match        https://news.ycombinator.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Styles for the summary tooltip, close button, and loading spinner.
     * We use GM_addStyle to inject these into the page.
     */
    GM_addStyle(`
        .hn-summary-tooltip {
            position: absolute;
            background: white;
            border: 1px solid #ccc;
            padding: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            max-width: 450px;
            min-height: 80px;
            font-family: Verdana, Geneva, sans-serif;
            font-size: 10pt;
            color: #000;
            border-radius: 4px;
            line-height: 1.5;
        }
        .hn-summary-close {
            position: absolute;
            top: 5px;
            right: 8px;
            cursor: pointer;
            font-size: 16px;
            color: #828282;
            text-decoration: none;
            font-weight: bold;
        }
        .hn-summary-close:hover {
            color: #ff6600;
        }
        .hn-summary-content {
            margin-top: 10px;
            white-space: pre-wrap; /* Preserve plain text formatting */
        }
        .hn-summary-spinner {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .hn-summary-spinner::after {
            content: "";
            width: 24px;
            height: 24px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #ff6600;
            border-radius: 50%;
            animation: hn-summary-spin 0.8s linear infinite;
        }
        @keyframes hn-summary-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .hn-summary-link {
            cursor: pointer;
            color: #828282;
            text-decoration: none;
        }
        .hn-summary-link:hover {
            text-decoration: underline;
        }
    `);

    // Keep track of the currently open tooltip so we can close it when another is opened.
    let activeTooltip = null;

    /**
     * Helper to get the Summarizer API object.
     * Supports both the standard window.ai.summarizer and the legacy global Summarizer.
     */
    async function getSummarizerAPI() {
        if (typeof Summarizer !== 'undefined') {
            return Summarizer;
        }
        if (typeof ai !== 'undefined' && ai.summarizer) {
            return ai.summarizer;
        }
        return null;
    }

    /**
     * Fetches the content of the linked page, extracts the main text,
     * and uses the Chrome AI Summarizer API to generate a summary.
     * 
     * @param {HTMLElement} anchor - The "summary" link element to position the tooltip near.
     * @param {string} url - The URL of the article to summarize.
     */
    async function showSummary(anchor, url) {
        // Close any existing tooltip
        if (activeTooltip) {
            activeTooltip.remove();
        }

        // Create the tooltip container
        const tooltip = document.createElement('div');
        tooltip.className = 'hn-summary-tooltip';
        
        // Position the tooltip below the clicked link
        const rect = anchor.getBoundingClientRect();
        tooltip.style.top = (window.scrollY + rect.bottom + 8) + 'px';
        tooltip.style.left = (window.scrollX + rect.left) + 'px';

        // Add the close button (clickable ✖︎)
        const closeBtn = document.createElement('span');
        closeBtn.className = 'hn-summary-close';
        closeBtn.innerHTML = '✖︎';
        closeBtn.title = 'Close summary';
        closeBtn.onclick = () => {
            tooltip.remove();
            activeTooltip = null;
        };
        tooltip.appendChild(closeBtn);

        // Add the content area where the spinner and then the summary will appear
        const contentArea = document.createElement('div');
        contentArea.className = 'hn-summary-content';
        contentArea.innerHTML = '<div class="hn-summary-spinner"></div>';
        tooltip.appendChild(contentArea);

        document.body.appendChild(tooltip);
        activeTooltip = tooltip;

        try {
            // 1. Check for AI Summarizer API availability
            const summarizerAPI = await getSummarizerAPI();
            if (!summarizerAPI) {
                throw new Error('Chrome AI Summarizer API not found. Ensure flags are enabled.');
            }

            // Check availability using the correct method (availability or capabilities)
            let isAvailable = false;
            if (typeof summarizerAPI.availability === 'function') {
                const availability = await summarizerAPI.availability();
                isAvailable = (availability !== 'unavailable');
            } else if (typeof summarizerAPI.capabilities === 'function') {
                const capabilities = await summarizerAPI.capabilities();
                isAvailable = (capabilities.available !== 'no');
            } else {
                // If neither method exists, we'll try to proceed to create() and catch errors there
                isAvailable = true; 
            }

            if (!isAvailable) {
                throw new Error('Summarizer API is not supported or model is not yet downloaded.');
            }

            // 2. Fetch the page content using GM_xmlhttpRequest (to bypass CORS)
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    timeout: 15000, // 15 second timeout
                    onload: resolve,
                    onerror: () => reject(new Error('Network error while fetching page.')),
                    ontimeout: () => reject(new Error('Request timed out.'))
                });
            });

            if (response.status !== 200) {
                throw new Error(`Failed to load page (Status ${response.status})`);
            }

            // 3. Parse the HTML and extract readable text
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');
            
            // Strip out non-content elements to reduce noise for the AI
            const noise = doc.querySelectorAll('script, style, nav, footer, header, iframe, noscript, .ads, #sidebar');
            noise.forEach(el => el.remove());

            // Try to find the main article body, fallback to document body
            const mainElement = doc.querySelector('article, main, [role="main"], .post-content, .entry-content') || doc.body;
            let text = mainElement.innerText.trim();
            
            // Clean up whitespace and limit length (Gemini Nano has input limits)
            text = text.replace(/\s+/g, ' ').substring(0, 8000);

            if (text.length < 100) {
                throw new Error('Could not extract enough text from the page to summarize.');
            }

            // 4. Create a summarizer session and generate the summary
            // We use 'teaser' type to get a concise one-paragraph summary.
            const summarizer = await summarizerAPI.create({
                type: 'teaser',
                format: 'plain-text',
                length: 'medium'
            });

            const summary = await summarizer.summarize(text);
            
            // 5. Update the tooltip with the final summary
            contentArea.innerText = summary;
            
            // Clean up the session to free resources
            summarizer.destroy();

        } catch (error) {
            console.error('[HN AI Summary]', error);
            contentArea.innerHTML = `<span style="color: #d00;">${error.message}</span>`;
        }
    }

    /**
     * Scans the page for story items and injects the "summary" link into the subtext line.
     */
    function injectSummaryLinks() {
        // HN stories have a 'subtext' row below the title row
        const subtexts = document.querySelectorAll('.subtext');
        
        subtexts.forEach(subtext => {
            // Avoid duplicate injection
            if (subtext.querySelector('.hn-summary-link')) return;

            // The story title and URL are in the previous table row (tr.athing)
            const athing = subtext.parentElement.previousElementSibling;
            if (!athing || !athing.classList.contains('athing')) return;
            
            const titleLink = athing.querySelector('.titleline a');
            if (!titleLink) return;

            const url = titleLink.href;
            // Skip internal HN links (like Ask HN or Show HN without external URL)
            if (url.startsWith('item?id=')) return;

            // Create the " | summary" link
            const separator = document.createTextNode(' | ');
            const summaryLink = document.createElement('a');
            summaryLink.className = 'hn-summary-link';
            summaryLink.innerText = 'summary';
            summaryLink.href = 'javascript:void(0)';
            summaryLink.onclick = (e) => {
                e.preventDefault();
                showSummary(summaryLink, url);
            };

            subtext.appendChild(separator);
            subtext.appendChild(summaryLink);
        });
    }

    // Run the injection on page load
    injectSummaryLinks();

    // Use a MutationObserver to handle cases where HN content is loaded dynamically
    // (e.g. by other extensions or when navigating "More" pages)
    const observer = new MutationObserver(() => injectSummaryLinks());
    observer.observe(document.body, { childList: true, subtree: true });

})();

