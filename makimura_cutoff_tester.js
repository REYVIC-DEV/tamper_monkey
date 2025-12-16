// ==UserScript==
// @name         Holiday Cutoff Tester UI - Localhost
// @namespace    http://tampermonkey.net/
// @version      0.5
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
            <div id="panel-header" style="cursor:default;">🎄 Holiday Tester</div>
            <button id="drag-toggle-btn" style="margin-top:5px;width:100%;padding:2px;font-size:10px;">Enable Drag</button>
            <input type="date" id="holiday-date-input" style="margin-top:5px;width:100%;padding:2px;background:#fff;color:#000;border:1px solid #ccc;border-radius:3px;">
            <div id="selected-date-display" style="margin-top:5px;font-size:10px;">Selected: --</div>
            <br><button id="apply-btn" style="margin-top:5px;width:100%;padding:3px;">Apply Date</button>
            <br><button id="reset-btn" style="margin-top:2px;width:100%;padding:3px;background:#666;">Reset to Real Date</button>
        </div>
    `;
    document.body.appendChild(panel);

    // Set default to current date
    const currentDate = new Date().toISOString().split('T')[0];
    document.getElementById('holiday-date-input').value = currentDate;
    document.getElementById('selected-date-display').textContent = `Selected: ${currentDate}`;
    let currentTestDate = currentDate;
    let originalDate = Date;

    // Drag functionality
    let isDragMode = false;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

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
        document.getElementById('selected-date-display').textContent = `Selected: ${currentTestDate}`;
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
        document.getElementById('holiday-date-input').value = currentDate;
        document.getElementById('selected-date-display').textContent = `Selected: ${currentDate}`;
        currentTestDate = currentDate;
    });

    // Drag toggle
    document.getElementById('drag-toggle-btn').addEventListener('click', function() {
        isDragMode = !isDragMode;
        const header = document.getElementById('panel-header');
        const btn = document.getElementById('drag-toggle-btn');
        if (isDragMode) {
            header.style.cursor = 'move';
            btn.textContent = 'Disable Drag';
        } else {
            header.style.cursor = 'default';
            btn.textContent = 'Enable Drag';
        }
    });

    // Drag event listeners
    const panelDiv = panel.querySelector('div'); // The inner div with fixed position
    const header = document.getElementById('panel-header');

    header.addEventListener('mousedown', function(e) {
        if (!isDragMode) return;
        isDragging = true;
        dragOffsetX = e.clientX - panelDiv.offsetLeft;
        dragOffsetY = e.clientY - panelDiv.offsetTop;
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const newLeft = e.clientX - dragOffsetX;
        const newTop = e.clientY - dragOffsetY;
        panelDiv.style.left = newLeft + 'px';
        panelDiv.style.top = newTop + 'px';
        e.preventDefault();
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Initial setup - don't override by default
    console.log('🎄 Holiday Tester UI Loaded - Click "Apply Date" to test');

})();
