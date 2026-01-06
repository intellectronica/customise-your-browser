// ==UserScript==
// @name         Copy Page as Markdown
// @namespace    https://elite-ai-assisted-coding.dev/
// @version      0.0.1
// @description  Converts page HTML to Markdown and copies it to clipboard
// @author       GitHub Copilot
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @require      https://unpkg.com/turndown/dist/turndown.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Converts the current page content to Markdown and copies it to the clipboard.
     */
    function copyAsMarkdown() {
        console.log('[Copy as Markdown] Starting conversion...');

        try {
            // Initialize Turndown service
            // Documentation: https://github.com/mixmark-io/turndown
            const turndownService = new TurndownService({
                headingStyle: 'atx',
                codeBlockStyle: 'fenced'
            });

            // Get the HTML content of the body (or the whole document if preferred)
            // Using body content is usually more useful than the entire <html> structure
            const html = document.body.innerHTML;

            // Convert HTML to Markdown
            const markdown = turndownService.turndown(html);

            // Copy to clipboard
            GM_setClipboard(markdown);

            console.log('[Copy as Markdown] Markdown copied to clipboard!');
            
            // Optional: Provide visual feedback
            showToast('Page copied as Markdown!');
        } catch (error) {
            console.error('[Copy as Markdown] Error during conversion:', error);
            alert('Failed to copy page as Markdown. See console for details.');
        }
    }

    /**
     * Simple toast notification to provide feedback to the user.
     */
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = '#333';
        toast.style.color = '#fff';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.zIndex = '10000';
        toast.style.fontFamily = 'sans-serif';
        toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 3000);
    }

    // Register a menu command in the script manager (Tampermonkey/Greasemonkey)
    GM_registerMenuCommand('Copy Page as Markdown', copyAsMarkdown);

    // Bind Ctrl+Shift+C (Cmd+Shift+C on Mac would move to DevTools usually)
    // We listen for the keyboard event
    document.addEventListener('keydown', function(e) {
        // Check for Ctrl + Shift + C
        // On macOS, users often expect Cmd, but the request specifically said "control-shift-C"
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyC') {
            e.preventDefault();
            copyAsMarkdown();
        }
    }, true);

})();
