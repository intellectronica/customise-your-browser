// ==UserScript==
// @name         Hacker News - LessWrong Style
// @namespace    https://elite-ai-assisted-coding.dev/
// @version      0.0.1
// @description  Reformats Hacker News to look like LessWrong (styling only, content unchanged)
// @author       GitHub Copilot
// @match        https://news.ycombinator.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    /**
     * This userscript applies LessWrong-inspired styling to Hacker News.
     * It transforms the dense, orange-accented HN interface into a cleaner,
     * more spacious design similar to LessWrong, while preserving all content.
     */

    // Apply comprehensive CSS styling to transform HN into LessWrong-like appearance
    GM_addStyle(`
        /* === GLOBAL STYLES === */
        
        /* Reset body styling - cleaner background and modern fonts */
        body {
            background: #f4f4f4 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            font-size: 16px !important;
            line-height: 1.6 !important;
            color: #333 !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        /* Main content container - centered with max width like LessWrong */
        body > center {
            max-width: 1200px !important;
            margin: 0 auto !important;
            background: #fff !important;
            box-shadow: 0 0 10px rgba(0,0,0,0.1) !important;
        }

        /* Main table container */
        body > center > table {
            width: 100% !important;
            border: none !important;
            background: #fff !important;
        }

        /* === HEADER STYLES === */
        
        /* Header bar - transform orange bar to cleaner design */
        body > center > table > tbody > tr:first-child {
            background: linear-gradient(135deg, #2c5282 0%, #1a365d 100%) !important;
            height: auto !important;
        }

        body > center > table > tbody > tr:first-child td {
            padding: 16px 24px !important;
            background: transparent !important;
        }

        /* Hacker News logo/title */
        body > center > table > tbody > tr:first-child .pagetop {
            font-size: 20px !important;
            font-weight: 600 !important;
            letter-spacing: 0.5px !important;
        }

        body > center > table > tbody > tr:first-child .pagetop a {
            color: #fff !important;
            text-decoration: none !important;
            font-weight: 600 !important;
        }

        body > center > table > tbody > tr:first-child .pagetop a:hover {
            opacity: 0.9 !important;
        }

        /* Logo image - make it blend with new header */
        body > center > table > tbody > tr:first-child img {
            filter: brightness(0) invert(1) !important;
            opacity: 0.9 !important;
        }

        /* === STORY LIST STYLES === */
        
        /* Main story table */
        table.itemlist {
            width: 100% !important;
            border-collapse: separate !important;
            border-spacing: 0 !important;
            background: transparent !important;
        }

        /* Story rows - add card-like appearance */
        .athing {
            background: #fff !important;
            border-radius: 8px !important;
            margin: 16px 24px !important;
            padding: 20px !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.08) !important;
            transition: all 0.2s ease !important;
            border: 1px solid #e5e5e5 !important;
        }

        .athing:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important;
            transform: translateY(-1px) !important;
        }

        /* Story title row */
        .athing td.title {
            padding: 0 !important;
        }

        /* Rank number - larger and styled */
        .athing td.title:first-child {
            font-size: 18px !important;
            font-weight: 600 !important;
            color: #999 !important;
            padding-right: 16px !important;
            min-width: 40px !important;
        }

        /* Upvote arrow - styled button appearance */
        .athing td.votelinks {
            padding-right: 12px !important;
        }

        .athing td.votelinks center {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .athing td.votelinks a {
            display: inline-block !important;
            width: 32px !important;
            height: 32px !important;
            border-radius: 4px !important;
            background: #f0f0f0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.2s ease !important;
        }

        .athing td.votelinks a:hover {
            background: #4a90e2 !important;
        }

        /* Story title link - larger, more prominent */
        .titleline {
            font-size: 20px !important;
            font-weight: 600 !important;
            line-height: 1.4 !important;
            margin-bottom: 8px !important;
        }

        .titleline > a {
            color: #1a1a1a !important;
            text-decoration: none !important;
            transition: color 0.2s ease !important;
        }

        .titleline > a:hover {
            color: #4a90e2 !important;
        }

        .titleline > a:visited {
            color: #666 !important;
        }

        /* Domain name - subtle styling */
        .titleline .sitebit {
            font-size: 14px !important;
            color: #999 !important;
            font-weight: 400 !important;
            margin-left: 8px !important;
        }

        .titleline .sitestr {
            color: #999 !important;
        }

        /* Metadata row (points, user, time, comments) */
        .athing + tr {
            background: #fff !important;
            border-radius: 0 0 8px 8px !important;
            margin: -20px 24px 16px 24px !important;
            padding: 0 20px 16px 20px !important;
        }

        .athing + tr td.subtext {
            padding: 0 !important;
            padding-left: 56px !important;
            font-size: 14px !important;
            color: #666 !important;
        }

        .athing + tr td.subtext span {
            margin-right: 12px !important;
        }

        .athing + tr td.subtext a {
            color: #666 !important;
            text-decoration: none !important;
            transition: color 0.2s ease !important;
        }

        .athing + tr td.subtext a:hover {
            color: #4a90e2 !important;
            text-decoration: underline !important;
        }

        /* Points/score - make it more prominent */
        .athing + tr td.subtext .score {
            font-weight: 600 !important;
            color: #4a90e2 !important;
        }

        /* Spacer rows - increase spacing between stories */
        tr.spacer {
            height: 0 !important;
        }

        tr.morespace {
            height: 0 !important;
        }

        /* === FOOTER STYLES === */
        
        /* Footer links */
        body > center > table > tbody > tr:last-child td {
            padding: 24px !important;
            text-align: center !important;
            background: #f8f8f8 !important;
            border-top: 1px solid #e5e5e5 !important;
        }

        body > center > table > tbody > tr:last-child a {
            color: #666 !important;
            text-decoration: none !important;
            margin: 0 8px !important;
            font-size: 14px !important;
        }

        body > center > table > tbody > tr:last-child a:hover {
            color: #4a90e2 !important;
            text-decoration: underline !important;
        }

        /* "More" link - styled as button */
        .morelink {
            display: inline-block !important;
            padding: 12px 24px !important;
            background: #4a90e2 !important;
            color: #fff !important;
            border-radius: 6px !important;
            text-decoration: none !important;
            font-weight: 600 !important;
            transition: all 0.2s ease !important;
            margin: 24px !important;
        }

        .morelink:hover {
            background: #357abd !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
        }

        /* === COMMENT PAGE STYLES === */
        
        /* Comment table */
        table.comment-tree {
            width: 100% !important;
            max-width: 800px !important;
            margin: 0 auto !important;
            padding: 24px !important;
        }

        /* Individual comments - card styling */
        .comtr {
            background: #fff !important;
            border-radius: 6px !important;
            margin: 12px 0 !important;
            padding: 16px !important;
            border-left: 3px solid #e5e5e5 !important;
            transition: border-color 0.2s ease !important;
        }

        .comtr:hover {
            border-left-color: #4a90e2 !important;
        }

        /* Comment text */
        .comment {
            font-size: 15px !important;
            line-height: 1.6 !important;
            color: #333 !important;
        }

        .comment p {
            margin: 12px 0 !important;
        }

        /* Comment metadata */
        .comhead {
            font-size: 13px !important;
            color: #999 !important;
            margin-bottom: 8px !important;
        }

        .comhead a {
            color: #666 !important;
            text-decoration: none !important;
        }

        .comhead a:hover {
            color: #4a90e2 !important;
        }

        /* === MOBILE RESPONSIVENESS === */
        
        @media (max-width: 768px) {
            body > center {
                max-width: 100% !important;
                box-shadow: none !important;
            }

            .athing {
                margin: 12px 16px !important;
                padding: 16px !important;
            }

            .titleline {
                font-size: 18px !important;
            }

            .athing + tr td.subtext {
                padding-left: 40px !important;
                font-size: 13px !important;
            }
        }

        /* === FORM ELEMENTS === */
        
        /* Text inputs and textareas */
        input[type="text"], 
        input[type="password"], 
        textarea {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            font-size: 15px !important;
            padding: 10px 12px !important;
            border: 1px solid #d0d0d0 !important;
            border-radius: 4px !important;
            transition: border-color 0.2s ease !important;
        }

        input[type="text"]:focus, 
        input[type="password"]:focus, 
        textarea:focus {
            outline: none !important;
            border-color: #4a90e2 !important;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1) !important;
        }

        /* Submit buttons */
        input[type="submit"] {
            background: #4a90e2 !important;
            color: #fff !important;
            border: none !important;
            padding: 10px 20px !important;
            border-radius: 4px !important;
            font-size: 15px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }

        input[type="submit"]:hover {
            background: #357abd !important;
            transform: translateY(-1px) !important;
        }

        /* === MISC IMPROVEMENTS === */
        
        /* Remove underlines from most links */
        a {
            transition: all 0.2s ease !important;
        }

        /* Code blocks */
        pre {
            background: #f5f5f5 !important;
            padding: 12px !important;
            border-radius: 4px !important;
            overflow-x: auto !important;
            border: 1px solid #e5e5e5 !important;
        }

        code {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
            font-size: 14px !important;
            background: #f5f5f5 !important;
            padding: 2px 6px !important;
            border-radius: 3px !important;
        }

        /* Table borders - remove old-style borders */
        table {
            border: none !important;
        }

        td {
            border: none !important;
        }

        /* Improve readability of job listings */
        .athing.athing[id^="job-"] {
            border-left: 4px solid #f39c12 !important;
        }
    `);

    // Log that the script has loaded successfully
    console.log('Hacker News - LessWrong Style userscript loaded successfully!');

})();
