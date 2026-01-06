(function() {
    'use strict';

    /**
     * Re-using logic from copy-page-as-markdown.user.js
     */

    // Toast function
    function showToast(message, { timeoutMs = 1800 } = {}) {
        const existing = document.getElementById('cpy-md-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'cpy-md-toast';
        toast.textContent = message;

        toast.style.position = 'fixed';
        toast.style.right = '16px';
        toast.style.bottom = '16px';
        toast.style.zIndex = '2147483647';
        toast.style.padding = '10px 12px';
        toast.style.borderRadius = '8px';
        toast.style.background = 'rgba(20, 20, 20, 0.92)';
        toast.style.color = '#fff';
        toast.style.font = '13px/1.3 system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
        toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
        toast.style.maxWidth = 'min(520px, calc(100vw - 32px))';

        document.documentElement.appendChild(toast);

        window.setTimeout(() => {
            toast.remove();
        }, timeoutMs);
    }

    // Pick content root
    function pickContentRoot() {
        return (
            document.querySelector('article') ||
            document.querySelector('main') ||
            document.querySelector('[role="main"]') ||
            document.body
        );
    }

    // Absolutize URL
    function absolutizeUrl(rawUrl) {
        if (!rawUrl) return rawUrl;
        try {
            return new URL(rawUrl, window.location.href).toString();
        } catch {
            return rawUrl;
        }
    }

    // Clone and clean
    function cloneAndCleanContent(root) {
        const clone = root.cloneNode(true);

        const toRemove = clone.querySelectorAll(
            [
                'script',
                'style',
                'noscript',
                'iframe',
                'canvas',
                'svg',
                'nav',
                'footer',
                'header',
                'aside',
                '[aria-modal="true"]',
                '[role="dialog"]',
                '.cookie',
                '.cookies',
                '.cookie-banner',
                '.consent',
                '.modal',
                '.overlay'
            ].join(',')
        );
        toRemove.forEach((el) => el.remove());

        clone.querySelectorAll('a[href]').forEach((a) => {
            const href = a.getAttribute('href');
            a.setAttribute('href', absolutizeUrl(href));
        });

        clone.querySelectorAll('img[src]').forEach((img) => {
            const src = img.getAttribute('src');
            img.setAttribute('src', absolutizeUrl(src));
        });

        return clone;
    }

    // HTML to Markdown
    function htmlToMarkdown(rootNode) {
        if (typeof TurndownService === 'undefined') {
            throw new Error('Turndown library not found.');
        }

        const turndown = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
            emDelimiter: '*',
            bulletListMarker: '-',
            hr: '---'
        });

        turndown.addRule('lineBreaks', {
            filter: 'br',
            replacement: function() {
                return '  \n';
            }
        });

        turndown.addRule('fencedCodeBlocks', {
            filter: function(node, options) {
                return (
                    options.codeBlockStyle === 'fenced' &&
                    node.nodeName === 'PRE' &&
                    node.firstChild &&
                    node.firstChild.nodeName === 'CODE'
                );
            },
            replacement: function(content, node) {
                const code = node.textContent || '';
                return `\n\n\`\`\`\n${code.replace(/\n$/, '')}\n\`\`\`\n\n`;
            }
        });

        const markdownBody = turndown.turndown(rootNode);

        const title = (document.title || '').trim();
        const url = window.location.href;

        const headerParts = [];
        if (title) headerParts.push(`# ${title}`);
        headerParts.push(`Source: ${url}`);

        return `${headerParts.join('\n')}\n\n${markdownBody.trim()}\n`;
    }

    // Copy to clipboard
    async function copyTextToClipboard(text) {
        // Modern Clipboard API
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            await navigator.clipboard.writeText(text);
            return;
        }

        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        const ok = document.execCommand('copy');
        textarea.remove();
        if (!ok) {
            throw new Error('Copy failed (clipboard API not available).');
        }
    }

    // Main execution
    async function copyPageAsMarkdown() {
        try {
            const root = pickContentRoot();
            const cleaned = cloneAndCleanContent(root);
            const markdown = htmlToMarkdown(cleaned);

            await copyTextToClipboard(markdown);
            showToast('Copied page as Markdown');
        } catch (err) {
            console.error('[Copy Page as Markdown]', err);
            showToast(`Failed to copy as Markdown: ${err && err.message ? err.message : String(err)}`, { timeoutMs: 3200 });
        }
    }

    // Run now
    copyPageAsMarkdown();

})();
