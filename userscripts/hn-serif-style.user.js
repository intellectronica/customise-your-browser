// ==UserScript==
// @name         Hacker News Serif Style
// @namespace    https://elite-ai-assisted-coding.dev/
// @version      0.0.1
// @description  Applies serif fonts and a white background to Hacker News for a cleaner reading experience
// @author       Eleanor
// @match        https://news.ycombinator.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create a style element to inject our custom CSS
    const style = document.createElement('style');
    style.type = 'text/css';

    // Define the custom styles
    // - Sets a pure white background on the page body
    // - Applies a serif font stack for improved readability
    // - Overrides HN's default bgcolor on tables
    style.textContent = `
        /* Override the default beige background with white */
        body {
            background-color: #ffffff !important;
        }

        /* The main content table also has a bgcolor attribute, so we override it */
        body > center > table {
            background-color: #ffffff !important;
        }

        /* Apply serif fonts to all text elements */
        body, td, th, a, span, div, p, input, textarea {
            font-family: Georgia, "Times New Roman", Times, serif !important;
        }

        /* Keep the header bar its original orange colour for visual distinction */
        /* but still use serif fonts there */
        #hnmain > tbody > tr:first-child > td {
            background-color: #ff6600 !important;
        }

        /* Slightly increase line height for better readability with serif fonts */
        .comment {
            line-height: 1.5 !important;
        }

        /* Make story titles slightly more prominent */
        .titleline > a {
            font-size: 11pt !important;
        }
    `;

    // Append the style element to the document head
    document.head.appendChild(style);
})();
