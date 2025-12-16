// ==UserScript==
// @name         Holiday Cutoff Tester Pro - Localhost
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Interactive holiday cutoff testing with UI
// @author       You
// @match        http://localhost:3000/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Create floating control panel
  const panel = document.createElement("div");
  panel.innerHTML = `
        <div style="position:fixed;top:10px;left:10px;z-index:9999;background:#333;color:#fff;padding:10px;border-radius:5px;font-size:12px;font-family:monospace;">
            <div>🎄 Holiday Tester</div>
            <select id="holiday-date-select" style="margin-top:5px;width:180px;">
                <option value="2024-12-15">Dec 15 - Both Available</option>
                <option value="2024-12-22">Dec 22 - Dec 31 Only</option>
                <option value="2024-12-25">Dec 25 - None Available</option>
                <option value="2024-12-28">Dec 28 - None Available</option>
            </select>
            <br><button id="apply-btn" style="margin-top:5px;">Apply & Reload</button>
        </div>
    `;
  document.body.appendChild(panel);

  let currentTestDate = "2024-12-15";

  // Override Date function
  function setTestDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    const OriginalDate = Date;

    Date = class extends OriginalDate {
      constructor(...args) {
        if (args.length === 0) {
          return new OriginalDate(year, month - 1, day);
        }
        return new OriginalDate(...args);
      }
      static now() {
        return new OriginalDate(year, month - 1, day).getTime();
      }
    };

    currentTestDate = dateString;
    console.log(`🎄 Holiday Tester: Simulating ${dateString}`);
    location.reload();
  }

  // Event listeners
  document
    .getElementById("holiday-date-select")
    .addEventListener("change", function (e) {
      currentTestDate = e.target.value;
    });

  document.getElementById("apply-btn").addEventListener("click", function () {
    setTestDate(currentTestDate);
  });

  // Initial setup
  setTestDate(currentTestDate);
})();
