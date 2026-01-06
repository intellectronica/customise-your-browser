// ==UserScript==
// @name         Hacker News AI Summary
// @namespace    https://elite-ai-assisted-coding.dev/
// @version      0.0.2
// @description  Adds a "summary" link to each HN item that uses Chrome's built-in AI to summarize linked pages
// @author       Eleanor
// @match        https://news.ycombinator.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @connect      *
// @connect      github.com
// @connect      medium.com
// @connect      substack.com
// @connect      arxiv.org
// @connect      nytimes.com
// @connect      theguardian.com
// @connect      bbc.com
// @connect      bbc.co.uk
// @connect      techcrunch.com
// @connect      arstechnica.com
// @connect      wired.com
// @connect      theregister.com
// @connect      reuters.com
// @connect      bloomberg.com
// @connect      wsj.com
// @connect      twitter.com
// @connect      x.com
// @connect      youtube.com
// @connect      reddit.com
// @connect      wikipedia.org
// @connect      stackoverflow.com
// @connect      dev.to
// @connect      hackernoon.com
// @connect      lobste.rs
// ==/UserScript==

(function() {
    'use strict';

    // ========================================
    // STYLES - Inject CSS for tooltip and spinner
    // ========================================
    const style = document.createElement('style');
    style.textContent = `
        /* The tooltip container that appears on click */
        .hn-summary-tooltip {
            position: absolute;
            z-index: 10000;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 12px 16px;
            max-width: 400px;
            min-width: 250px;
            font-size: 13px;
            line-height: 1.5;
            color: #333;
        }

        /* Close button in top-right corner */
        .hn-summary-close {
            position: absolute;
            top: 6px;
            right: 10px;
            cursor: pointer;
            font-size: 18px;
            color: #999;
            background: none;
            border: none;
            padding: 0;
            line-height: 1;
        }

        .hn-summary-close:hover {
            color: #333;
        }

        /* Spinner animation for loading state */
        .hn-summary-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #ddd;
            border-top-color: #ff6600;
            border-radius: 50%;
            animation: hn-spin 0.8s linear infinite;
            margin-right: 8px;
            vertical-align: middle;
        }

        @keyframes hn-spin {
            to { transform: rotate(360deg); }
        }

        /* Loading text alongside spinner */
        .hn-summary-loading {
            display: flex;
            align-items: center;
            color: #666;
        }

        /* The summary link we add to each item */
        .hn-summary-link {
            cursor: pointer;
            color: #828282;
        }

        .hn-summary-link:hover {
            text-decoration: underline;
        }

        /* Error state styling */
        .hn-summary-error {
            color: #c00;
        }

        /* Summary content text */
        .hn-summary-content {
            margin-top: 4px;
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // TOOLTIP MANAGEMENT
    // ========================================

    // Keep track of the currently open tooltip so we can close it
    let activeTooltip = null;

    // Create and display a tooltip near the clicked element
    function showTooltip(anchorElement) {
        // Close any existing tooltip first
        closeTooltip();

        // Create the tooltip container
        const tooltip = document.createElement('div');
        tooltip.className = 'hn-summary-tooltip';

        // Add a close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'hn-summary-close';
        closeBtn.textContent = '×';
        closeBtn.onclick = closeTooltip;
        tooltip.appendChild(closeBtn);

        // Add loading state with spinner
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'hn-summary-loading';
        loadingDiv.innerHTML = '<div class="hn-summary-spinner"></div><span>Loading summary...</span>';
        tooltip.appendChild(loadingDiv);

        // Position the tooltip below the anchor element
        document.body.appendChild(tooltip);
        const rect = anchorElement.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;

        activeTooltip = tooltip;

        // Close tooltip when clicking outside
        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 0);

        return tooltip;
    }

    // Close the currently active tooltip
    function closeTooltip() {
        if (activeTooltip) {
            activeTooltip.remove();
            activeTooltip = null;
            document.removeEventListener('click', handleOutsideClick);
        }
    }

    // Handler for clicks outside the tooltip
    function handleOutsideClick(e) {
        if (activeTooltip && !activeTooltip.contains(e.target) && !e.target.classList.contains('hn-summary-link')) {
            closeTooltip();
        }
    }

    // Update tooltip content (replaces loading spinner with actual content)
    function updateTooltipContent(tooltip, content, isError = false) {
        // Find and remove the loading div
        const loadingDiv = tooltip.querySelector('.hn-summary-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }

        // Create content div
        const contentDiv = document.createElement('div');
        contentDiv.className = isError ? 'hn-summary-error' : 'hn-summary-content';
        contentDiv.textContent = content;
        tooltip.appendChild(contentDiv);
    }

    // ========================================
    // PAGE FETCHING
    // ========================================

    // Fetch page content using GM_xmlhttpRequest to bypass CORS
    function fetchPageContent(url) {
        return new Promise((resolve, reject) => {
            // Check if GM_xmlhttpRequest is available (Tampermonkey/Greasemonkey)
            if (typeof GM_xmlhttpRequest === 'undefined') {
                reject(new Error('GM_xmlhttpRequest not available. Please use Tampermonkey or Greasemonkey.'));
                return;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 15000, // 15 second timeout
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        // Extract text content from HTML
                        const textContent = extractTextFromHtml(response.responseText);
                        resolve(textContent);
                    } else {
                        reject(new Error(`Failed to fetch page: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('Network error while fetching page'));
                },
                ontimeout: function() {
                    reject(new Error('Request timed out'));
                }
            });
        });
    }

    // Extract readable text content from HTML string
    function extractTextFromHtml(html) {
        // Create a temporary DOM parser
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Remove script, style, and other non-content elements
        const elementsToRemove = doc.querySelectorAll('script, style, nav, header, footer, aside, iframe, noscript');
        elementsToRemove.forEach(el => el.remove());

        // Try to find the main content area
        const mainContent = doc.querySelector('article, main, [role="main"], .content, .post, .article');

        // Get text from main content or fall back to body
        const textSource = mainContent || doc.body;
        let text = textSource ? textSource.textContent : '';

        // Clean up the text: collapse whitespace, trim
        text = text.replace(/\s+/g, ' ').trim();

        // Limit text length to avoid overwhelming the summarizer
        // Chrome's Summarizer API works best with reasonable text lengths
        const maxLength = 15000;
        if (text.length > maxLength) {
            text = text.substring(0, maxLength) + '...';
        }

        return text;
    }

    // ========================================
    // AI SUMMARIZATION
    // ========================================

    // Check if the Summarizer API is available
    async function checkSummarizerAvailability() {
        if (typeof Summarizer === 'undefined') {
            return { available: false, reason: 'Summarizer API not available in this browser' };
        }

        try {
            const availability = await Summarizer.availability();
            if (availability === 'unavailable') {
                return { available: false, reason: 'Summarizer model is not available' };
            }
            return { available: true, downloadRequired: availability === 'downloadable' };
        } catch (e) {
            return { available: false, reason: `Error checking availability: ${e.message}` };
        }
    }

    // Create a summarizer instance and summarize the given text
    async function summarizeText(text, onStatusUpdate) {
        // Create summarizer with key-points format for concise summaries
        const summarizer = await Summarizer.create({
            type: 'key-points',      // Get key points rather than prose
            format: 'plain-text',    // Plain text output
            length: 'short',         // Keep it concise
            monitor(m) {
                // Monitor download progress if model needs to be downloaded
                m.addEventListener('downloadprogress', (e) => {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    onStatusUpdate(`Downloading AI model: ${percent}%`);
                });
            }
        });

        // Generate the summary
        const summary = await summarizer.summarize(text);

        // Clean up the summarizer instance
        summarizer.destroy();

        return summary;
    }

    // ========================================
    // MAIN SUMMARY HANDLER
    // ========================================

    // Handle click on summary link - orchestrates the whole process
    async function handleSummaryClick(event, url) {
        event.preventDefault();
        event.stopPropagation();

        // Show tooltip with loading spinner
        const tooltip = showTooltip(event.target);

        try {
            // Step 1: Check if Summarizer API is available
            const availability = await checkSummarizerAvailability();
            if (!availability.available) {
                updateTooltipContent(tooltip, availability.reason, true);
                return;
            }

            // Step 2: Update status and fetch page content
            const loadingSpan = tooltip.querySelector('.hn-summary-loading span');
            if (loadingSpan) {
                loadingSpan.textContent = 'Fetching page...';
            }

            const pageContent = await fetchPageContent(url);

            if (!pageContent || pageContent.length < 100) {
                updateTooltipContent(tooltip, 'Could not extract enough content from the page to summarize.', true);
                return;
            }

            // Step 3: Summarize the content
            if (loadingSpan) {
                loadingSpan.textContent = 'Generating summary...';
            }

            const summary = await summarizeText(pageContent, (status) => {
                if (loadingSpan) {
                    loadingSpan.textContent = status;
                }
            });

            // Step 4: Display the summary
            updateTooltipContent(tooltip, summary);

        } catch (error) {
            console.error('HN AI Summary error:', error);
            updateTooltipContent(tooltip, `Error: ${error.message}`, true);
        }
    }

    // ========================================
    // DOM MANIPULATION - Add summary links
    // ========================================

    // Add summary links to all story items on the page
    function addSummaryLinks() {
        // Find all subtext rows (the row with points, user, time, comments)
        const subtextRows = document.querySelectorAll('.subtext');

        subtextRows.forEach(subtext => {
            // Skip if we've already added a summary link
            if (subtext.querySelector('.hn-summary-link')) {
                return;
            }

            // Find the corresponding title row to get the story URL
            // The structure is: tr.athing (title) followed by tr with .subtext
            const titleRow = subtext.closest('tr')?.previousElementSibling;
            if (!titleRow || !titleRow.classList.contains('athing')) {
                return;
            }

            // Get the story link from the title row
            const titleLink = titleRow.querySelector('.titleline > a');
            if (!titleLink) {
                return;
            }

            const storyUrl = titleLink.href;

            // Don't add summary for HN internal links (like "Ask HN", "Show HN" without external link)
            if (storyUrl.startsWith('https://news.ycombinator.com/item')) {
                return;
            }

            // Create the summary link element
            const summaryLink = document.createElement('a');
            summaryLink.className = 'hn-summary-link';
            summaryLink.textContent = 'summary';
            summaryLink.href = '#';

            // Attach click handler
            summaryLink.addEventListener('click', (e) => handleSummaryClick(e, storyUrl));

            // Add separator and link to the subtext
            const separator = document.createTextNode(' | ');
            subtext.appendChild(separator);
            subtext.appendChild(summaryLink);
        });
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addSummaryLinks);
    } else {
        addSummaryLinks();
    }

    // Also observe for dynamically loaded content (e.g., infinite scroll if HN ever adds it)
    const observer = new MutationObserver((mutations) => {
        // Check if new story items were added
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                addSummaryLinks();
                break;
            }
        }
    });

    // Start observing the main content area
    const mainTable = document.querySelector('#hnmain');
    if (mainTable) {
        observer.observe(mainTable, { childList: true, subtree: true });
    }
})();
