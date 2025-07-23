document.addEventListener('DOMContentLoaded', () => {
    // 1. Data Definitions
    const municipalWisdomRunes = [
        { id: 'water-flow', name: '💧 Water Flow Insight', type: 'water', description: 'Real-time water table readings.' },
        { id: 'community-pulse', name: '🏡 Community Pulse', type: 'neighborhood', description: 'Aggregated sentiment from neighborhood reports.' },
        { id: 'energy-nexus', name: '⚡ Energy Nexus Data', type: 'energy', description: 'Current renewable energy generation vs. consumption.' },
        { id: 'air-quality', name: '🌬️ Air Quality Index', type: 'environment', description: 'Local particulate matter and ozone levels.' },
        { id: 'biodiversity-watch', name: '🌿 Biodiversity Watch', type: 'environment', description: 'Local flora and fauna health reports.' }
    ];

    let activityLogEntries = [
        "Aetherium Guild initiated communal solar array audit. (+5 SP)",
        "Riverbend sector reported stable water levels, contributing to shared data pool.",
        "Northwood Commons activated new waste-to-resource initiative.",
        "Sunstone Energy achieved 95% renewable energy autonomy today.",
        "Hilltop Reports submitted 2 new insights on local governance structures.",
        "Civic Codex updated with new guidelines for collaborative resource management.",
        "Guild members contributed 7 new 'wisdom layers' to data modules.",
        "Decentralized data node 'Beacon 7' reported optimal function."
    ];

    // 2. DOM Element References
    const stewardPointsDisplay = document.getElementById('stewardPoints');
    const contributeInsightBtn = document.getElementById('contributeInsightBtn');
    const activityLogContainer = document.getElementById('activityLog');
    const revealActivityBtn = document.getElementById('revealActivityBtn');
    const mapTilesContainer = document.getElementById('mapTiles');
    const dataModulesContainer = document.getElementById('dataModules');
    const dataRunesContainer = document.getElementById('dataRunes');
    const codexScrolls = document.querySelector('.codex-scrolls');

    let stewardPoints = parseInt(localStorage.getItem('stewardPoints')) || 0;
    let revealedLogCount = 0;

    // --- Functions ---

    // 3. Local Storage for Dashboard (Simplified: just steward points and a basic log marker)
    function updateStewardPoints(amount) {
        stewardPoints += amount;
        stewardPointsDisplay.textContent = stewardPoints;
        localStorage.setItem('stewardPoints', stewardPoints);
    }

    // 4. Populate Municipal Wisdom Runes
    function populateDataRunes() {
        dataRunesContainer.innerHTML = ''; // Clear existing
        municipalWisdomRunes.forEach(rune => {
            const runeElement = document.createElement('div');
            runeElement.className = 'data-rune';
            runeElement.textContent = rune.name;
            runeElement.setAttribute('draggable', true);
            runeElement.setAttribute('data-rune-id', rune.id);
            runeElement.setAttribute('data-rune-type', rune.type);
            dataRunesContainer.appendChild(runeElement);
        });
    }

    // 5. Animate Civic Activity Logs (scroll-bound effect simulated by button click)
    function revealActivityLogEntry() {
        if (revealedLogCount < activityLogEntries.length) {
            const entryText = activityLogEntries[revealedLogCount];
            const entryElement = document.createElement('div');
            entryElement.className = 'activity-entry';
            entryElement.textContent = entryText;
            activityLogContainer.appendChild(entryElement);

            // Trigger animation
            setTimeout(() => {
                entryElement.classList.add('visible');
                activityLogContainer.scrollTop = activityLogContainer.scrollHeight; // Scroll to bottom
            }, 50); // Small delay to ensure reflow for animation

            revealedLogCount++;
            if (revealedLogCount === activityLogEntries.length) {
                revealActivityBtn.textContent = "All Insights Revealed";
                revealActivityBtn.disabled = true;
                revealActivityBtn.style.opacity = 0.7;
            }
        }
    }

    // --- Interaction Design Seeds ---

    // Users earn steward points
    contributeInsightBtn.addEventListener('click', () => {
        updateStewardPoints(10);
        // Add a temporary confirmation message
        const confirmMsg = document.createElement('span');
        confirmMsg.textContent = " +10 SP! Ritual Affirmed.";
        confirmMsg.style.color = '#4ef0d3';
        confirmMsg.style.marginLeft = '10px';
        confirmMsg.style.opacity = 0;
        confirmMsg.style.transition = 'opacity 1s ease-out';
        stewardPointsDisplay.parentNode.appendChild(confirmMsg);

        setTimeout(() => {
            confirmMsg.style.opacity = 1;
        }, 10);

        setTimeout(() => {
            confirmMsg.style.opacity = 0;
            confirmMsg.addEventListener('transitionend', () => confirmMsg.remove());
        }, 2000);
    });

    // Animate civic activity logs with scroll-bound transitions (simplified)
    revealActivityBtn.addEventListener('click', revealActivityLogEntry);


    // Ostromian Codex UI - Collapsible scrolls/pages
    if (codexScrolls) {
        codexScrolls.addEventListener('click', (event) => {
            const scrollItem = event.target.closest('.scroll-item');
            if (scrollItem) {
                // Deactivate all others
                document.querySelectorAll('.scroll-item').forEach(item => {
                    if (item !== scrollItem) {
                        item.classList.remove('active');
                    }
                });
                // Toggle active state
                scrollItem.classList.toggle('active');
            }
        });
    }


    // --- Drag and Drop for Data Runes / Modules ---

    let draggedModule = null;

    // Make Data Modules draggable
    document.querySelectorAll('.data-module.draggable').forEach(module => {
        module.addEventListener('dragstart', (e) => {
            draggedModule = module;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', module.dataset.type); // Store type for validation
            module.style.opacity = '0.4'; // Visual cue for dragging
        });

        module.addEventListener('dragend', () => {
            draggedModule.style.opacity = '1';
            draggedModule = null;
        });
    });

    // Data Runes Container as Drop Zone
    dataRunesContainer.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necessary to allow drop
        e.dataTransfer.dropEffect = 'move';
        dataRunesContainer.classList.add('drag-over');
    });

    dataRunesContainer.addEventListener('dragleave', () => {
        dataRunesContainer.classList.remove('drag-over');
    });

    dataRunesContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        dataRunesContainer.classList.remove('drag-over');

        if (draggedModule) {
            // Create a "data rune" representation from the dropped module
            const runeName = draggedModule.querySelector('h3').textContent;
            const runeType = draggedModule.dataset.type; // Get original type

            const newRune = document.createElement('div');
            newRune.className = 'data-rune';
            newRune.textContent = runeName.replace(' Insight', '').replace(' Data', ''); // Clean up name
            newRune.setAttribute('data-rune-id', `custom-${Date.now()}`); // Unique ID
            newRune.setAttribute('data-rune-type', runeType);
            newRune.setAttribute('draggable', true); // Make the new rune draggable too

            dataRunesContainer.appendChild(newRune);

            // Optionally, remove the original module or mark it as "linked"
            // For this POC, we'll just let the original stay as a source
            // draggedModule.remove(); // Uncomment to move instead of copy
        }
    });

    // Make dynamically created data runes draggable (event delegation)
    dataRunesContainer.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('data-rune')) {
            draggedModule = e.target; // Re-use draggedModule for runes as well
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', e.target.dataset.runeId);
            e.target.style.opacity = '0.4';
        }
    });

    // Federated Intelligence Map Shrine - Tile Interactions
    if (mapTilesContainer) {
        mapTilesContainer.addEventListener('click', (event) => {
            const clickedTile = event.target.closest('.map-tile');
            if (clickedTile) {
                const region = clickedTile.dataset.region;
                const insights = [
                    "Community collaboration on new water conservation project.",
                    "Shared resource management guidelines adopted.",
                    "Local data contributed to common pool, enhancing regional understanding.",
                    "Decentralized energy network shows increased resilience."
                ];
                const randomInsight = insights[Math.floor(Math.random() * insights.length)];

                // Simulate "local insight" contribution
                const insightDiv = document.createElement('div');
                insightDiv.className = 'map-insight';
                insightDiv.textContent = `Region ${region}: ${randomInsight}`;
                insightDiv.style.cssText = `
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: rgba(78, 240, 211, 0.9); /* Bio-luminescent teal */
                    color: #0b132b;
                    padding: 5px 10px;
                    border-radius: 5px;
                    font-size: 0.8em;
                    opacity: 0;
                    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
                    z-index: 10;
                    white-space: nowrap;
                `;
                clickedTile.style.position = 'relative'; // Ensure positioning context
                clickedTile.appendChild(insightDiv);

                setTimeout(() => {
                    insightDiv.style.opacity = 1;
                    insightDiv.style.transform = 'translateX(-50%) translateY(-10px)';
                }, 10);

                setTimeout(() => {
                    insightDiv.style.opacity = 0;
                    insightDiv.style.transform = 'translateX(-50%) translateY(-30px)';
                    insightDiv.addEventListener('transitionend', () => insightDiv.remove());
                }, 3000);

                // Update a dummy data value to show activity
                if (region === 'waterbend') {
                    document.getElementById('waterLevel').textContent = `Optimal: 88% capacity (+3%)`;
                } else if (region === 'sunstone') {
                    document.getElementById('energyUse').textContent = `Optimal: 130 kWh (up 10%)`;
                } else if (region === 'hilltop') {
                    document.getElementById('neighborhoodReports').textContent = `5 new communal initiatives`;
                }
            }
        });
    }


    // --- Initializations ---
    stewardPointsDisplay.textContent = stewardPoints;
    populateDataRunes();
    // Initially reveal a few log entries
    for (let i = 0; i < 3; i++) {
        revealActivityLogEntry();
    }
});
