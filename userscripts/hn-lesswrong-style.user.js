// ==UserScript==
// @name         Hacker News - LessWrong Style
// @namespace    https://elite-ai-assisted-coding.dev/
// @version      0.0.2
// @description  Reformats Hacker News to look like LessWrong (styling only, content unchanged)
// @author       GitHub Copilot
// @match        https://news.ycombinator.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    /**
     * This userscript applies authentic LessWrong styling to Hacker News.
     * It replicates the elegant, minimal design of LessWrong with its characteristic
     * beige background, serif fonts, and clean row-based layout.
     */

    // Apply comprehensive CSS styling to transform HN into LessWrong-like appearance
    GM_addStyle(`
        /* === GLOBAL STYLES === */
        
        /* Body - characteristic beige/cream background like LessWrong */
        body {
            background: rgb(248, 244, 238) !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
            color: rgba(0, 0, 0, 0.87) !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        /* Main content container - no shadow, just clean content */
        body > center {
            max-width: 1000px !important;
            margin: 0 auto !important;
            background: transparent !important;
            box-shadow: none !important;
        }

        /* Main table container */
        body > center > table {
            width: 100% !important;
            border: none !important;
            background: transparent !important;
        }

        /* === HEADER STYLES === */
        
        /* Header bar - minimal white header like LessWrong */
        body > center > table > tbody > tr:first-child {
            background: #fff !important;
            height: auto !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
        }

        body > center > table > tbody > tr:first-child td {
            padding: 12px 16px !important;
            background: transparent !important;
        }

        /* Hacker News logo/title */
        body > center > table > tbody > tr:first-child .pagetop {
            font-size: 16px !important;
            font-weight: 600 !important;
            letter-spacing: 0.5px !important;
        }

        body > center > table > tbody > tr:first-child .pagetop a {
            color: rgba(0, 0, 0, 0.87) !important;
            text-decoration: none !important;
            font-weight: 600 !important;
        }

        body > center > table > tbody > tr:first-child .pagetop a:hover {
            opacity: 0.7 !important;
        }

        /* Logo image - subtle styling */
        body > center > table > tbody > tr:first-child img {
            opacity: 0.7 !important;
            vertical-align: middle !important;
        }

        /* === STORY LIST STYLES === */
        
        /* Main story table */
        table.itemlist {
            width: 100% !important;
            border-collapse: collapse !important;
            border-spacing: 0 !important;
            background: transparent !important;
        }

        /* Story rows - clean white rows with subtle borders like LessWrong */
        .athing {
            background: #fff !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            transition: background 0.15s ease !important;
            border: none !important;
            border-bottom: 2px solid rgba(0, 0, 0, 0.05) !important;
        }

        .athing:hover {
            background: rgb(245, 245, 245) !important;
            box-shadow: none !important;
            transform: none !important;
        }

        /* Create flex layout for story content */
        .athing > tbody > tr {
            display: flex !important;
            align-items: center !important;
            padding: 10px 10px 10px 6px !important;
        }

        /* Hide the rank number column */
        .athing td.title:first-child {
            display: none !important;
        }

        /* Upvote/vote section - minimal styling */
        .athing td.votelinks {
            padding: 0 !important;
            width: auto !important;
            order: -1 !important;
            margin-right: 8px !important;
        }

        .athing td.votelinks center {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .athing td.votelinks a {
            display: block !important;
            width: auto !important;
            height: auto !important;
            border-radius: 0 !important;
            background: transparent !important;
            padding: 0 !important;
            opacity: 0.5 !important;
            transition: opacity 0.2s ease !important;
        }

        .athing td.votelinks a:hover {
            opacity: 1 !important;
            background: transparent !important;
        }

        /* Title section - takes up remaining space */
        .athing td.title {
            padding: 0 !important;
            flex: 1 !important;
        }

        /* Story title link - serif font like LessWrong */
        .titleline {
            font-size: 16.9px !important;
            font-weight: 400 !important;
            line-height: 22.1px !important;
            margin-bottom: 0 !important;
            font-family: warnock-pro, Palatino, "Palatino Linotype", "Palatino LT STD", "Book Antiqua", Georgia, serif !important;
        }

        .titleline > a {
            color: rgba(0, 0, 0, 0.87) !important;
            text-decoration: none !important;
            transition: color 0.2s ease !important;
        }

        .titleline > a:hover {
            color: rgba(0, 0, 0, 0.6) !important;
        }

        .titleline > a:visited {
            color: rgba(0, 0, 0, 0.6) !important;
        }

        /* Domain name - very subtle */
        .titleline .sitebit {
            font-size: 12px !important;
            color: rgba(0, 0, 0, 0.4) !important;
            font-weight: 400 !important;
            margin-left: 6px !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        .titleline .sitestr {
            color: rgba(0, 0, 0, 0.4) !important;
        }

        /* Metadata row (points, user, time, comments) - hide it as LessWrong shows this differently */
        .athing + tr {
            display: none !important;
        }

        /* Spacer rows - minimal spacing */
        tr.spacer {
            height: 0 !important;
        }

        tr.morespace {
            height: 8px !important;
            background: transparent !important;
        }

        /* === ADD KARMA/POINTS DISPLAY IN LESSWRONG STYLE === */
        
        /* We need to inject the points before the title using CSS pseudo-elements where possible,
           but since we can't easily access the text content, we'll style the existing layout */
        
        /* Make the subtext row visible but style it LessWrong-way */
        .athing + tr {
            display: table-row !important;
            background: #fff !important;
            border-bottom: 2px solid rgba(0, 0, 0, 0.05) !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        .athing + tr:hover {
            background: rgb(245, 245, 245) !important;
        }

        /* Make the metadata appear inline before the title */
        .athing + tr > td {
            padding: 0 10px 10px 10px !important;
        }

        .athing + tr td.subtext {
            padding: 0 10px 10px 38px !important;
            font-size: 14.3px !important;
            color: rgb(117, 117, 117) !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        .athing + tr td.subtext span {
            margin-right: 8px !important;
        }

        .athing + tr td.subtext a {
            color: rgb(117, 117, 117) !important;
            text-decoration: none !important;
            transition: color 0.2s ease !important;
        }

        .athing + tr td.subtext a:hover {
            color: rgba(0, 0, 0, 0.87) !important;
        }

        /* Points/score - subtle gray like LessWrong karma */
        .athing + tr td.subtext .score {
            font-weight: 400 !important;
            color: rgb(117, 117, 117) !important;
        }

        /* === FOOTER STYLES === */
        
        /* Footer links */
        body > center > table > tbody > tr:last-child td {
            padding: 24px !important;
            text-align: center !important;
            background: #fff !important;
            border-top: 1px solid rgba(0, 0, 0, 0.08) !important;
        }

        body > center > table > tbody > tr:last-child a {
            color: rgb(117, 117, 117) !important;
            text-decoration: none !important;
            margin: 0 8px !important;
            font-size: 13px !important;
        }

        body > center > table > tbody > tr:last-child a:hover {
            color: rgba(0, 0, 0, 0.87) !important;
        }

        /* "More" link - subtle styling */
        .morelink {
            display: inline-block !important;
            padding: 8px 16px !important;
            background: #fff !important;
            color: rgb(117, 117, 117) !important;
            border-radius: 0 !important;
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
            text-decoration: none !important;
            font-weight: 400 !important;
            transition: all 0.2s ease !important;
            margin: 16px !important;
        }

        .morelink:hover {
            background: rgb(245, 245, 245) !important;
            border-color: rgba(0, 0, 0, 0.2) !important;
            transform: none !important;
            box-shadow: none !important;
        }

        /* === COMMENT PAGE STYLES === */
        
        /* Comment table */
        table.comment-tree {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* Individual comments - minimal styling */
        .comtr {
            background: #fff !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 12px !important;
            border-left: none !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
            transition: background 0.15s ease !important;
        }

        .comtr:hover {
            background: rgb(245, 245, 245) !important;
        }

        /* Comment text */
        .comment {
            font-size: 14px !important;
            line-height: 1.6 !important;
            color: rgba(0, 0, 0, 0.87) !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        .comment p {
            margin: 8px 0 !important;
        }

        /* Comment metadata */
        .comhead {
            font-size: 13px !important;
            color: rgb(117, 117, 117) !important;
            margin-bottom: 8px !important;
        }

        .comhead a {
            color: rgb(117, 117, 117) !important;
            text-decoration: none !important;
        }

        .comhead a:hover {
            color: rgba(0, 0, 0, 0.87) !important;
        }

        /* === MOBILE RESPONSIVENESS === */
        
        @media (max-width: 768px) {
            body > center {
                max-width: 100% !important;
            }

            .titleline {
                font-size: 15px !important;
            }

            .athing + tr td.subtext {
                padding-left: 30px !important;
                font-size: 13px !important;
            }
        }

        /* === FORM ELEMENTS === */
        
        /* Text inputs and textareas */
        input[type="text"], 
        input[type="password"], 
        textarea {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            font-size: 14px !important;
            padding: 8px 10px !important;
            border: 1px solid rgba(0, 0, 0, 0.15) !important;
            border-radius: 2px !important;
            transition: border-color 0.2s ease !important;
            background: #fff !important;
        }

        input[type="text"]:focus, 
        input[type="password"]:focus, 
        textarea:focus {
            outline: none !important;
            border-color: rgba(0, 0, 0, 0.3) !important;
            box-shadow: none !important;
        }

        /* Submit buttons */
        input[type="submit"] {
            background: #fff !important;
            color: rgba(0, 0, 0, 0.87) !important;
            border: 1px solid rgba(0, 0, 0, 0.15) !important;
            padding: 8px 16px !important;
            border-radius: 2px !important;
            font-size: 14px !important;
            font-weight: 400 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }

        input[type="submit"]:hover {
            background: rgb(245, 245, 245) !important;
            border-color: rgba(0, 0, 0, 0.25) !important;
            transform: none !important;
        }

        /* === MISC IMPROVEMENTS === */
        
        /* Links */
        a {
            transition: color 0.2s ease !important;
        }

        /* Code blocks */
        pre {
            background: rgb(245, 245, 245) !important;
            padding: 12px !important;
            border-radius: 2px !important;
            overflow-x: auto !important;
            border: 1px solid rgba(0, 0, 0, 0.08) !important;
        }

        code {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
            font-size: 13px !important;
            background: rgb(245, 245, 245) !important;
            padding: 2px 4px !important;
            border-radius: 2px !important;
        }

        /* Table borders - remove old-style borders */
        table {
            border: none !important;
        }

        td {
            border: none !important;
        }
    `);

    // Log that the script has loaded successfully
    console.log('Hacker News - LessWrong Style userscript loaded successfully!');

})();
