// ==UserScript==
// @name         Holiday Cutoff Tester UI - Localhost
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Interactive holiday cutoff testing with UI (no reload)
// @author       You
// @match        http://localhost:3000/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create floating control panel
    const panel = document.createElement('div');
    panel.innerHTML = `
        <div style="position:fixed;top:10px;left:10px;z-index:9999;background:#333;color:#fff;padding:10px;border-radius:5px;font-size:12px;font-family:monospace;max-width:200px;">
            <div>🎄 Holiday Tester</div>
            <input type="date" id="holiday-date-input" value="2024-12-15" style="margin-top:5px;width:100%;padding:2px;background:#fff;color:#000;border:1px solid #ccc;border-radius:3px;">
            <br><button id="apply-btn" style="margin-top:5px;width:100%;padding:3px;">Apply Date</button>
            <br><button id="reset-btn" style="margin-top:2px;width:100%;padding:3px;background:#666;">Reset to Real Date</button>
        </div>
    `;
    document.body.appendChild(panel);

    let currentTestDate = null;
    let originalDate = Date;

    // Override Date function
    function setTestDate(dateString) {
        if (!dateString) {
            // Reset to real date
            Date = originalDate;
            currentTestDate = null;
            console.log('🎄 Holiday Tester: Reset to real date');
            return;
        }

        const [year, month, day] = dateString.split('-').map(Number);

        Date = class extends originalDate {
            constructor(...args) {
                if (args.length === 0) {
                    return new originalDate(year, month-1, day);
                }
                return new originalDate(...args);
            }
            static now() {
                return new originalDate(year, month-1, day).getTime();
            }
        };

        currentTestDate = dateString;
        console.log(`🎄 Holiday Tester: Now simulating ${dateString}`);
        
        // Trigger Vue reactivity by dispatching a custom event
        window.dispatchEvent(new CustomEvent('holiday-date-changed', { detail: dateString }));
    }

    // Event listeners
    document.getElementById('holiday-date-input').addEventListener('change', function(e) {
        currentTestDate = e.target.value;
    });

    document.getElementById('apply-btn').addEventListener('click', function() {
        setTestDate(currentTestDate);
        // Optional: Show brief success message
        const btn = document.getElementById('apply-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Applied!';
        btn.style.background = '#4CAF50';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 1000);
    });

    document.getElementById('reset-btn').addEventListener('click', function() {
        setTestDate(null);
        document.getElementById('holiday-date-input').value = '2024-12-15';
    });

    // Initial setup - don't override by default
    console.log('🎄 Holiday Tester UI Loaded - Click "Apply Date" to test');

})();
