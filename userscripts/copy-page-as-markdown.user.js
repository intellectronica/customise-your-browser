// ==UserScript==
// @name         Copy Page as Markdown
// @namespace    https://elite-ai-assisted-coding.dev/
// @version      0.0.1
// @description  Adds a menu item (and Ctrl+Shift+C hotkey) to copy the page's main content as Markdown.
// @author       GitHub Copilot
// @match        http://*/*
// @match        https://*/*
// @require      https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.js
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    /**
     * This userscript converts the current page's content (prefer <article>/<main>) into Markdown,
     * then copies it to the clipboard.
     *
     * We use Turndown (HTML -> Markdown), loaded from a CDN via @require.
     */

    const MENU_LABEL = 'Copy page as Markdown';

    /**
     * Basic toast so we can confirm copy without needing extra userscript grants.
     */
    function showToast(message, { timeoutMs = 1800 } = {}) {
        const existing = document.getElementById('cpy-md-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'cpy-md-toast';
        toast.textContent = message;

        // Keep styles self-contained (no GM_addStyle required).
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

    /**
     * Returns true if the event target is an element where typing is expected.
     * We avoid hijacking Ctrl+Shift+C while the user is editing text.
     */
    function isEditableTarget(target) {
        if (!target || !(target instanceof Element)) return false;

        // Common form controls
        const tag = target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;

        // Rich editors
        if (target.isContentEditable) return true;

        // Some editors use ARIA roles
        const role = target.getAttribute('role');
        if (role === 'textbox' || role === 'combobox') return true;

        return false;
    }

    /**
     * Choose a reasonable "main content" root.
     * This is intentionally simple (no Readability extraction) to keep the script lightweight.
     */
    function pickContentRoot() {
        return (
            document.querySelector('article') ||
            document.querySelector('main') ||
            document.querySelector('[role="main"]') ||
            document.body
        );
    }

    /**
     * Turn relative URLs into absolute ones so the Markdown is portable.
     */
    function absolutizeUrl(rawUrl) {
        if (!rawUrl) return rawUrl;
        try {
            return new URL(rawUrl, window.location.href).toString();
        } catch {
            return rawUrl;
        }
    }

    /**
     * Clone and sanitize the selected content before converting it.
     * We remove common non-content elements so Turndown has less junk.
     */
    function cloneAndCleanContent(root) {
        const clone = root.cloneNode(true);

        // Remove obvious noise. (Safe on clones; does not modify the real page.)
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
                // Common cookie banners / overlays
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

        // Make links and images absolute so copied Markdown is standalone.
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

    /**
     * Convert the cleaned HTML subtree to Markdown using Turndown.
     */
    function htmlToMarkdown(rootNode) {
        // TurndownService is provided globally by the @require script.
        if (typeof TurndownService === 'undefined') {
            throw new Error('Turndown did not load (TurndownService is undefined).');
        }

        const turndown = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
            emDelimiter: '*',
            bulletListMarker: '-',
            hr: '---'
        });

        // Keep <br> as hard line breaks. (Turndown otherwise tends to collapse them.)
        turndown.addRule('lineBreaks', {
            filter: 'br',
            replacement: function() {
                return '  \n';
            }
        });

        // Keep "pre" blocks readable.
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

        // Convert the selected subtree.
        const markdownBody = turndown.turndown(rootNode);

        // Prepend a tiny header that helps when pasting into notes.
        const title = (document.title || '').trim();
        const url = window.location.href;

        const headerParts = [];
        if (title) headerParts.push(`# ${title}`);
        headerParts.push(`Source: ${url}`);

        return `${headerParts.join('\n')}\n\n${markdownBody.trim()}\n`;
    }

    /**
     * Copy the produced Markdown into the clipboard.
     * We prefer GM_setClipboard (works even on pages that block navigator.clipboard).
     */
    async function copyTextToClipboard(text) {
        try {
            // Tampermonkey / Violentmonkey
            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(text, 'text/plain');
                return;
            }
        } catch {
            // Fall back below.
        }

        // Browser clipboard API fallback.
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            await navigator.clipboard.writeText(text);
            return;
        }

        // Last-resort fallback: hidden textarea + execCommand.
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

    /**
     * The main action: extract content, convert to Markdown, copy, and notify.
     */
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

    /**
     * Keyboard shortcut: Ctrl+Shift+C
     *
     * Notes:
     * - This combo can conflict with DevTools (inspect element) in some browsers.
     * - We only act when NOT focused in an editable field.
     */
    function onKeyDown(e) {
        if (!e) return;

        // Match Ctrl+Shift+C (case-insensitive). Avoid Meta (Cmd) to reduce accidental triggers on macOS.
        const isHotkey = e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey && (e.code === 'KeyC' || e.key === 'C' || e.key === 'c');
        if (!isHotkey) return;

        if (isEditableTarget(e.target)) return;

        // Prevent the page (or browser) from handling it.
        e.preventDefault();
        e.stopPropagation();

        copyPageAsMarkdown();
    }

    // Register menu command (shows up under the userscript manager menu).
    if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand(MENU_LABEL, copyPageAsMarkdown);
    }

    // Bind the hotkey.
    window.addEventListener('keydown', onKeyDown, true);

})();
