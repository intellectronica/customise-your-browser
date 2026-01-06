(() => {
  'use strict';

  /**
   * Converts the current page content or selection to Markdown and copies it to the clipboard.
   */
  async function copyAsMarkdown() {
    console.log('[Copy as Markdown] Starting conversion...');

    try {
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
      });

      let html = '';
      let source = 'page';

      const selection = window.getSelection();

      console.log('[Copy as Markdown] Selection state:', {
        rangeCount: selection ? selection.rangeCount : 'none',
        isCollapsed: selection ? selection.isCollapsed : 'n/a',
        toString: selection ? `${selection.toString().substring(0, 50)}...` : 'n/a'
      });

      if (selection && selection.rangeCount > 0 && selection.toString().trim() !== '') {
        const container = document.createElement('div');
        for (let i = 0; i < selection.rangeCount; i += 1) {
          const range = selection.getRangeAt(i);
          container.appendChild(range.cloneContents());
        }
        html = container.innerHTML;
        source = 'selection';
      } else if (window.self === window.top) {
        html = document.body ? document.body.innerHTML : '';
        source = 'page';
      } else {
        console.log('[Copy as Markdown] No selection in iframe, skipping full-page copy.');
        return;
      }

      if (!html || html.trim() === '') {
        console.warn('[Copy as Markdown] No content found to copy.');
        return;
      }

      const markdown = turndownService.turndown(html);

      await copyToClipboard(markdown);

      console.log(`[Copy as Markdown] ${source} copied to clipboard!`);
      showToast(source === 'selection' ? 'Selection copied as Markdown!' : 'Page copied as Markdown!');
    } catch (error) {
      console.error('[Copy as Markdown] Error during conversion:', error);
      alert('Failed to copy as Markdown. See console for details.');
    }
  }

  /**
   * Copy the provided text to the clipboard with fallbacks.
   */
  async function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (!successful) {
      throw new Error('document.execCommand("copy") failed');
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
    toast.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 500);
    }, 3000);
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message && message.type === 'copy-page-as-markdown') {
      copyAsMarkdown();
    }
  });
})();
