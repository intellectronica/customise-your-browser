// ==UserScript==
// @name         Hacker News - Terminal Style
// @namespace    https://elite-ai-assisted-coding.dev/
// @version      0.0.1
// @description  Transforms Hacker News into a retro terminal aesthetic (green on black, monospace font)
// @author       GitHub Copilot
// @match        https://news.ycombinator.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    /**
     * This userscript applies a classic terminal/CRT aesthetic to Hacker News.
     * Features phosphor green text on a black background with monospace fonts,
     * subtle scanlines, and a text cursor blink effect on hover.
     */

    // Define terminal colour palette
    const colors = {
        black: '#0a0a0a',           // Near-black background
        green: '#00ff41',           // Classic phosphor green (bright)
        greenDim: '#00cc33',        // Dimmed green for secondary text
        greenDark: '#009922',       // Dark green for tertiary elements
        greenGlow: '#00ff4180',     // Green with transparency for glow effects
        amber: '#ffb000',           // Amber accent (for links/highlights)
        amberDim: '#cc8800'         // Dimmed amber
    };

    // Apply comprehensive terminal styling
    GM_addStyle(`
        /* === GLOBAL TERMINAL STYLES === */

        /* Import a proper terminal font if available */
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

        /* Body - black background, green text */
        body {
            background: ${colors.black} !important;
            font-family: 'VT323', 'Courier New', 'Lucida Console', Monaco, monospace !important;
            font-size: 16px !important;
            line-height: 1.4 !important;
            color: ${colors.green} !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        /* Scanline overlay effect for CRT authenticity */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            background: repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.15),
                rgba(0, 0, 0, 0.15) 1px,
                transparent 1px,
                transparent 2px
            );
        }

        /* Subtle screen flicker animation */
        @keyframes flicker {
            0% { opacity: 0.97; }
            50% { opacity: 1; }
            100% { opacity: 0.98; }
        }

        body {
            animation: flicker 0.15s infinite;
        }

        /* Main content container */
        body > center {
            max-width: 1000px !important;
            margin: 0 auto !important;
            background: transparent !important;
            box-shadow: none !important;
            padding: 10px !important;
        }

        /* Main table container */
        body > center > table {
            width: 100% !important;
            border: none !important;
            background: transparent !important;
        }

        /* === HEADER STYLES === */

        /* Header bar - terminal prompt style */
        body > center > table > tbody > tr:first-child {
            background: transparent !important;
            border-bottom: 1px solid ${colors.greenDark} !important;
        }

        body > center > table > tbody > tr:first-child td {
            padding: 10px !important;
            background: transparent !important;
        }

        /* Navigation links in header */
        body > center > table > tbody > tr:first-child .pagetop {
            font-size: 16px !important;
            font-weight: normal !important;
            letter-spacing: 1px !important;
        }

        body > center > table > tbody > tr:first-child .pagetop a {
            color: ${colors.green} !important;
            text-decoration: none !important;
        }

        body > center > table > tbody > tr:first-child .pagetop a:hover {
            color: ${colors.amber} !important;
            text-shadow: 0 0 10px ${colors.greenGlow} !important;
        }

        /* Logo image - apply green filter */
        body > center > table > tbody > tr:first-child img {
            filter: brightness(0) saturate(100%) invert(75%) sepia(100%) saturate(500%) hue-rotate(80deg) !important;
            vertical-align: middle !important;
        }

        /* Header background cell - remove orange */
        body > center > table > tbody > tr:first-child td[bgcolor] {
            background: ${colors.black} !important;
        }

        /* === STORY LIST STYLES === */

        /* Main story table */
        table.itemlist {
            width: 100% !important;
            border-collapse: collapse !important;
            background: transparent !important;
        }

        /* Story rows */
        .athing {
            background: transparent !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        .athing:hover {
            background: rgba(0, 255, 65, 0.05) !important;
        }

        /* Story row layout */
        .athing > tbody > tr {
            display: flex !important;
            align-items: baseline !important;
            padding: 4px 0 !important;
        }

        /* Rank number - display as terminal line number */
        .athing td.title:first-child {
            display: table-cell !important;
            color: ${colors.greenDark} !important;
            font-size: 14px !important;
            padding-right: 8px !important;
            min-width: 30px !important;
            text-align: right !important;
        }

        .athing td.title:first-child .rank {
            color: ${colors.greenDark} !important;
        }

        /* Upvote section */
        .athing td.votelinks {
            padding: 0 8px 0 0 !important;
            width: auto !important;
        }

        .athing td.votelinks a {
            color: ${colors.greenDim} !important;
            opacity: 0.7 !important;
        }

        .athing td.votelinks a:hover {
            opacity: 1 !important;
            filter: drop-shadow(0 0 3px ${colors.green}) !important;
        }

        /* Vote arrow - make it green */
        .athing td.votelinks .votearrow {
            filter: brightness(0) saturate(100%) invert(75%) sepia(100%) saturate(500%) hue-rotate(80deg) !important;
        }

        /* Title section */
        .athing td.title {
            padding: 0 !important;
        }

        /* Story title link */
        .titleline {
            font-size: 16px !important;
            font-weight: normal !important;
            line-height: 1.4 !important;
            font-family: 'VT323', 'Courier New', monospace !important;
        }

        .titleline > a {
            color: ${colors.green} !important;
            text-decoration: none !important;
        }

        .titleline > a:hover {
            color: ${colors.amber} !important;
            text-shadow: 0 0 8px ${colors.greenGlow} !important;
        }

        .titleline > a:visited {
            color: ${colors.greenDim} !important;
        }

        /* Domain name */
        .titleline .sitebit {
            font-size: 14px !important;
            color: ${colors.greenDark} !important;
            margin-left: 8px !important;
        }

        .titleline .sitebit a,
        .titleline .sitestr {
            color: ${colors.greenDark} !important;
        }

        /* Metadata row (points, user, time, comments) */
        .athing + tr {
            background: transparent !important;
        }

        .athing + tr:hover {
            background: rgba(0, 255, 65, 0.05) !important;
        }

        .athing + tr td.subtext {
            padding: 0 0 8px 38px !important;
            font-size: 14px !important;
            color: ${colors.greenDim} !important;
            font-family: 'VT323', 'Courier New', monospace !important;
        }

        .athing + tr td.subtext a {
            color: ${colors.greenDim} !important;
            text-decoration: none !important;
        }

        .athing + tr td.subtext a:hover {
            color: ${colors.amber} !important;
        }

        /* Points/score */
        .athing + tr td.subtext .score {
            color: ${colors.amber} !important;
        }

        /* Spacer rows */
        tr.spacer {
            height: 0 !important;
        }

        tr.morespace {
            height: 4px !important;
        }

        /* === FOOTER STYLES === */

        body > center > table > tbody > tr:last-child td {
            padding: 20px !important;
            text-align: center !important;
            background: transparent !important;
            border-top: 1px solid ${colors.greenDark} !important;
        }

        body > center > table > tbody > tr:last-child a {
            color: ${colors.greenDim} !important;
            text-decoration: none !important;
            margin: 0 10px !important;
        }

        body > center > table > tbody > tr:last-child a:hover {
            color: ${colors.amber} !important;
        }

        /* "More" link - styled as terminal command */
        .morelink {
            display: inline-block !important;
            padding: 8px 16px !important;
            background: transparent !important;
            color: ${colors.green} !important;
            border: 1px solid ${colors.greenDim} !important;
            text-decoration: none !important;
            margin: 16px !important;
        }

        .morelink::before {
            content: '> ' !important;
        }

        .morelink:hover {
            background: rgba(0, 255, 65, 0.1) !important;
            color: ${colors.amber} !important;
            border-color: ${colors.amber} !important;
            box-shadow: 0 0 10px ${colors.greenGlow} !important;
        }

        /* === COMMENT PAGE STYLES === */

        /* Individual comments */
        .comtr {
            background: transparent !important;
            border-left: 2px solid ${colors.greenDark} !important;
            margin: 4px 0 !important;
            padding: 8px 12px !important;
        }

        .comtr:hover {
            background: rgba(0, 255, 65, 0.05) !important;
            border-left-color: ${colors.green} !important;
        }

        /* Comment text */
        .comment {
            font-size: 15px !important;
            line-height: 1.5 !important;
            color: ${colors.green} !important;
            font-family: 'VT323', 'Courier New', monospace !important;
        }

        .comment p {
            margin: 8px 0 !important;
        }

        /* Comment metadata */
        .comhead {
            font-size: 14px !important;
            color: ${colors.greenDim} !important;
            margin-bottom: 6px !important;
        }

        .comhead a {
            color: ${colors.greenDim} !important;
            text-decoration: none !important;
        }

        .comhead a:hover {
            color: ${colors.amber} !important;
        }

        /* Indent guides for nested comments */
        .comment-tree .ind img {
            filter: brightness(0) saturate(100%) invert(75%) sepia(100%) saturate(500%) hue-rotate(80deg) !important;
            opacity: 0.3 !important;
        }

        /* === FORM ELEMENTS === */

        input[type="text"],
        input[type="password"],
        textarea {
            font-family: 'VT323', 'Courier New', monospace !important;
            font-size: 16px !important;
            padding: 8px !important;
            border: 1px solid ${colors.greenDim} !important;
            background: ${colors.black} !important;
            color: ${colors.green} !important;
        }

        input[type="text"]:focus,
        input[type="password"]:focus,
        textarea:focus {
            outline: none !important;
            border-color: ${colors.green} !important;
            box-shadow: 0 0 10px ${colors.greenGlow} !important;
        }

        /* Submit buttons - terminal command style */
        input[type="submit"] {
            background: transparent !important;
            color: ${colors.green} !important;
            border: 1px solid ${colors.greenDim} !important;
            padding: 8px 16px !important;
            font-family: 'VT323', 'Courier New', monospace !important;
            font-size: 16px !important;
            cursor: pointer !important;
        }

        input[type="submit"]:hover {
            background: rgba(0, 255, 65, 0.1) !important;
            border-color: ${colors.green} !important;
            box-shadow: 0 0 10px ${colors.greenGlow} !important;
        }

        /* === MISC TERMINAL EFFECTS === */

        /* All links get terminal treatment */
        a {
            color: ${colors.green} !important;
        }

        a:hover {
            color: ${colors.amber} !important;
            text-shadow: 0 0 5px ${colors.greenGlow} !important;
        }

        /* Code blocks - slightly brighter */
        pre, code {
            font-family: 'VT323', 'Courier New', monospace !important;
            font-size: 15px !important;
            background: rgba(0, 255, 65, 0.05) !important;
            color: ${colors.green} !important;
            padding: 2px 4px !important;
            border: 1px solid ${colors.greenDark} !important;
        }

        pre {
            padding: 12px !important;
            overflow-x: auto !important;
        }

        /* Remove any residual borders and backgrounds */
        table, td {
            border: none !important;
            background: transparent !important;
        }

        /* Hide any images that might break the aesthetic (except vote arrows and logo) */
        img:not([src*="grayarrow"]):not([src*="y18"]):not([src*="s.gif"]) {
            filter: brightness(0) saturate(100%) invert(75%) sepia(100%) saturate(500%) hue-rotate(80deg) !important;
        }

        /* Blinking cursor effect for text inputs */
        @keyframes blink {
            0%, 50% { border-right-color: ${colors.green}; }
            51%, 100% { border-right-color: transparent; }
        }

        input[type="text"]:focus,
        input[type="password"]:focus,
        textarea:focus {
            border-right: 2px solid ${colors.green} !important;
            animation: blink 1s step-end infinite !important;
        }

        /* === MOBILE RESPONSIVENESS === */

        @media (max-width: 768px) {
            body {
                font-size: 14px !important;
            }

            .titleline {
                font-size: 14px !important;
            }

            .athing + tr td.subtext {
                padding-left: 30px !important;
                font-size: 12px !important;
            }
        }
    `);

    // Add a terminal-style header banner
    const header = document.querySelector('body > center > table > tbody > tr:first-child td');
    if (header) {
        const banner = document.createElement('div');
        banner.style.cssText = `
            font-family: 'VT323', 'Courier New', monospace;
            color: ${colors.greenDim};
            font-size: 12px;
            margin-bottom: 8px;
            letter-spacing: 1px;
        `;
        banner.textContent = '> HACKER_NEWS_TERMINAL v1.0 // CONNECTION ESTABLISHED';
        header.insertBefore(banner, header.firstChild);
    }

    // Log successful load in terminal style
    console.log('%c[SYSTEM] Hacker News Terminal Style loaded successfully',
        'color: #00ff41; font-family: monospace; font-size: 12px;');

})();
