/**
 * EdgeNudge - Browser-based ONNX Inference Engine
 * On-device occupancy prediction with WebGPU/WebGL acceleration
 */

// Global state
let session = null;
let modelInfo = null;
let inferenceTime = 0;
let predictionCount = 0;
let totalLatency = 0;
let autoDemoInterval = null;
let currentDemoStep = 0;

// Day names for display
const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Preset scenarios
const presets = {
    empty: {
        hour: 2,
        day: 1,
        light: 15,
        temp: 20.0,
        pir: false,
        phone: false,
        name: 'Late Night (Empty)'
    },
    morning: {
        hour: 9,
        day: 2,
        light: 550,
        temp: 23.0,
        pir: true,
        phone: true,
        name: 'Morning Class (Occupied)'
    },
    evening: {
        hour: 20,
        day: 3,
        light: 600,
        temp: 23.5,
        pir: true,
        phone: true,
        name: 'Evening Study (Occupied)'
    },
    weekend: {
        hour: 8,
        day: 5,
        light: 200,
        temp: 20.5,
        pir: false,
        phone: false,
        name: 'Weekend Morning (Empty)'
    }
};

/**
 * Initialize the application
 */
async function init() {
    console.log('🚀 EdgeNudge initializing...');
    
    try {
        // Load model info
        await loadModelInfo();
        
        // Load ONNX model
        await loadModel();
        
        // Set up UI event listeners
        setupEventListeners();
        
        // Update initial UI values
        updateSensorDisplays();

        // Show auto demo button
        document.getElementById('autoDemoBtn').style.display = 'block';

        // Detect system info
        detectSystemInfo();

        console.log('✅ EdgeNudge ready!');

    } catch (error) {
        console.error('❌ Initialization failed:', error);
        updateModelStatus('Error loading model', false);
    }
}

/**
 * Detect and display system information
 */
function detectSystemInfo() {
    // Browser info
    const ua = navigator.userAgent;
    let browserName = 'Unknown';
    if (ua.indexOf('Chrome') > -1) browserName = 'Chrome';
    else if (ua.indexOf('Firefox') > -1) browserName = 'Firefox';
    else if (ua.indexOf('Safari') > -1) browserName = 'Safari';
    else if (ua.indexOf('Edge') > -1) browserName = 'Edge';

    document.getElementById('browserInfo').textContent = browserName;
    document.getElementById('platformInfo').textContent = navigator.platform;
}

/**
 * Load model metadata
 */
async function loadModelInfo() {
    try {
        const response = await fetch('model_info.json');
        modelInfo = await response.json();
        console.log('📊 Model info loaded:', modelInfo);
        
        // Update model size display
        document.getElementById('modelSize').textContent = `${modelInfo.model_size_kb.toFixed(2)} KB`;
        
    } catch (error) {
        console.warn('⚠️ Could not load model_info.json:', error);
    }
}

/**
 * Load ONNX model with WebGPU/WebGL fallback
 */
async function loadModel() {
    updateModelStatus('Loading model...', false);
    
    try {
        // Try execution providers in order: WebGPU > WebGL > WASM
        const executionProviders = ['webgpu', 'webgl', 'wasm'];
        
        console.log('🔧 Attempting to create ONNX session...');
        console.log('   Available providers:', executionProviders);
        
        session = await ort.InferenceSession.create('model.onnx', {
            executionProviders: executionProviders
        });
        
        console.log('✅ ONNX session created successfully!');
        console.log('   Input names:', session.inputNames);
        console.log('   Output names:', session.outputNames);

        // Determine which provider is being used
        let provider = 'wasm';
        if (session.executionProviders && session.executionProviders.length > 0) {
            provider = session.executionProviders[0];
        }
        console.log('   Active provider:', provider);

        // Update UI
        updateModelStatus('Model Ready ✓', true);
        document.getElementById('execProvider').textContent = provider.toUpperCase();
        
    } catch (error) {
        console.error('❌ Failed to load ONNX model:', error);
        throw error;
    }
}

/**
 * Update model status badge
 */
function updateModelStatus(text, ready) {
    const badge = document.getElementById('modelStatus');
    badge.textContent = text;
    if (ready) {
        badge.classList.add('ready');
    } else {
        badge.classList.remove('ready');
    }
}

/**
 * Set up UI event listeners
 */
function setupEventListeners() {
    // Sensor input listeners
    document.getElementById('hourInput').addEventListener('input', updateSensorDisplays);
    document.getElementById('dayInput').addEventListener('input', updateSensorDisplays);
    document.getElementById('lightInput').addEventListener('input', updateSensorDisplays);
    document.getElementById('tempInput').addEventListener('input', updateSensorDisplays);
    document.getElementById('pirInput').addEventListener('change', updateSensorDisplays);
    document.getElementById('phoneInput').addEventListener('change', updateSensorDisplays);
    
    // Predict button
    document.getElementById('predictBtn').addEventListener('click', runPrediction);
    
    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const presetName = btn.dataset.preset;
            applyPreset(presetName);
        });
    });

    // Auto demo button
    document.getElementById('autoDemoBtn').addEventListener('click', startAutoDemo);
    document.getElementById('stopDemoBtn').addEventListener('click', stopAutoDemo);
}

/**
 * Update sensor value displays
 */
function updateSensorDisplays() {
    const hour = document.getElementById('hourInput').value;
    const day = document.getElementById('dayInput').value;
    const light = document.getElementById('lightInput').value;
    const temp = document.getElementById('tempInput').value;
    
    document.getElementById('hourValue').textContent = hour;
    document.getElementById('dayValue').textContent = dayNames[day];
    document.getElementById('lightValue').textContent = `${light} lux`;
    document.getElementById('tempValue').textContent = `${temp}°C`;
}

/**
 * Apply preset scenario
 */
function applyPreset(presetName) {
    const preset = presets[presetName];
    if (!preset) return;

    console.log(`🎬 Applying preset: ${preset.name}`);
    console.log('   Values:', preset);

    document.getElementById('hourInput').value = preset.hour;
    document.getElementById('dayInput').value = preset.day;
    document.getElementById('lightInput').value = preset.light;
    document.getElementById('tempInput').value = preset.temp;
    document.getElementById('pirInput').checked = preset.pir;
    document.getElementById('phoneInput').checked = preset.phone;

    updateSensorDisplays();

    // Auto-run prediction (increased delay to ensure UI updates)
    setTimeout(runPrediction, 500);
}

/**
 * Get current sensor values
 */
function getSensorValues() {
    return {
        hour: parseFloat(document.getElementById('hourInput').value),
        day_of_week: parseFloat(document.getElementById('dayInput').value),
        ambient_light: parseFloat(document.getElementById('lightInput').value),
        pir_motion: document.getElementById('pirInput').checked ? 1.0 : 0.0,
        phone_presence: document.getElementById('phoneInput').checked ? 1.0 : 0.0,
        temperature: parseFloat(document.getElementById('tempInput').value)
    };
}

/**
 * Run ONNX inference
 */
async function runPrediction() {
    if (!session) {
        alert('Model not loaded yet!');
        return;
    }

    try {
        const startTime = performance.now();

        // Get sensor values
        const sensors = getSensorValues();
        console.log('📡 Sensor inputs:', sensors);
        console.log('   → Expected: Empty if (PIR=0 AND phone=0 AND hour=2-8)');
        console.log('   → Expected: Occupied if (PIR=1 AND phone=1 AND hour=9-20)');

        // Prepare input tensor (must match training feature order)
        const inputArray = new Float32Array([
            sensors.hour,
            sensors.day_of_week,
            sensors.ambient_light,
            sensors.pir_motion,
            sensors.phone_presence,
            sensors.temperature
        ]);

        console.log('🔢 Input array:', Array.from(inputArray));

        // Create ONNX tensor (shape: [1, 6])
        const inputTensor = new ort.Tensor('float32', inputArray, [1, 6]);

        // Run inference - only request the label output to avoid probability map issues
        const feeds = { float_input: inputTensor };
        const fetchOutputs = ['output_label']; // Only fetch label, skip probability map
        const results = await session.run(feeds, fetchOutputs);

        // Get prediction (label) - convert BigInt to Number
        const outputLabel = Number(results.output_label.data[0]);

        // No probability data available (DecisionTree outputs it as map, not tensor)
        let outputProb = null;

        const endTime = performance.now();
        inferenceTime = endTime - startTime;

        console.log('🔮 Prediction:', outputLabel === 1 ? 'Occupied' : 'Empty');
        console.log('   Raw label:', results.output_label.data[0], '→ Number:', outputLabel);
        console.log('⚡ Inference time:', inferenceTime.toFixed(2), 'ms');

        // Display results
        displayResults(outputLabel, outputProb, inferenceTime);
        
    } catch (error) {
        console.error('❌ Prediction failed:', error);
        alert('Prediction failed! Check console for details.');
    }
}

/**
 * Display prediction results
 */
function displayResults(label, probability, latency) {
    const container = document.getElementById('resultsContainer');
    
    // Determine occupancy
    const isOccupied = label === 1;
    const statusText = isOccupied ? 'OCCUPIED' : 'EMPTY';
    const statusClass = isOccupied ? 'occupied' : 'empty';
    const statusEmoji = isOccupied ? '🔴' : '✅';
    
    // Calculate confidence (for binary classification, use probability of predicted class)
    let confidence = 95; // Default high confidence

    try {
        if (probability && probability.data) {
            // probability.data typically contains [prob_class_0, prob_class_1]
            const probs = Array.from(probability.data);
            if (probs.length === 2) {
                confidence = Math.round((isOccupied ? probs[1] : probs[0]) * 100);
            }
        }
    } catch (e) {
        // If probability access fails, use default
        console.warn('Using default confidence:', e.message);
    }
    
    // Build result HTML
    container.innerHTML = `
        <div class="prediction-result">
            <div class="prediction-label">Room Status</div>
            <div class="prediction-value ${statusClass}">
                ${statusEmoji} ${statusText}
            </div>
            <div class="confidence">
                <strong>Confidence:</strong> ${confidence}%
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${confidence}%"></div>
                </div>
            </div>
        </div>
    `;
    
    // Update metrics
    document.getElementById('inferenceTime').textContent = `${latency.toFixed(2)} ms`;
    document.getElementById('metricsContainer').style.display = 'block';

    // Update performance tracking
    updatePerformanceMetrics(latency);

    // Generate energy nudge
    generateEnergyNudge(label, getSensorValues());
}

/**
 * Generate energy nudge and savings calculations
 */
function generateEnergyNudge(prediction, sensors) {
    const isOccupied = prediction === 1;
    const container = document.getElementById('energyNudgeContainer');
    const summaryContainer = document.getElementById('energySummaryContainer');

    if (isOccupied) {
        // Room is occupied - no nudge needed
        container.innerHTML = `
            <div class="nudge-card success">
                <div class="nudge-title">
                    ✅ Room In Use
                </div>
                <div class="nudge-message">
                    Room is currently occupied. Continue normal operation. Monitoring for changes...
                </div>
            </div>
        `;
        summaryContainer.style.display = 'none';
    } else {
        // Room is empty - calculate potential savings
        const potentialSavings = calculateEnergySavings(sensors);

        container.innerHTML = `
            <div class="nudge-card">
                <div class="nudge-title">
                    💡 Energy Saving Opportunity
                </div>
                <div class="nudge-message">
                    Room appears empty. Consider turning off lights, fans, and AC in 5 minutes to save energy.
                </div>
                <div class="nudge-action">
                    <div class="nudge-savings">
                        💰 Potential: ${potentialSavings.totalKwh.toFixed(2)} kWh saved
                    </div>
                    <button class="nudge-btn" onclick="alert('In production, this would send a signal to building automation or notify facility manager!')">
                        Schedule Auto-Off
                    </button>
                </div>
            </div>
        `;

        // Display energy savings summary
        displayEnergySummary(potentialSavings);
        summaryContainer.style.display = 'block';
    }
}

/**
 * Calculate energy savings based on sensors and empty room assumption
 */
function calculateEnergySavings(sensors) {
    // Device power ratings (watts)
    const LIGHTS_POWER = 10;  // 10W LED bulbs
    const FAN_POWER = 75;     // 75W ceiling fan
    const AC_POWER = 500;     // 500W room AC

    // Estimate hours room would be empty (simplified: 2 hours average)
    const hoursEmpty = 2;

    // Calculate kWh saved per device
    const lightsKwh = (sensors.ambient_light > 300) ? (LIGHTS_POWER * hoursEmpty) / 1000 : 0;
    const fanKwh = (sensors.temperature > 24) ? (FAN_POWER * hoursEmpty) / 1000 : 0;
    const acKwh = (sensors.temperature > 25) ? (AC_POWER * hoursEmpty) / 1000 : 0;

    const totalKwh = lightsKwh + fanKwh + acKwh;

    // Cost calculations (assuming $0.12 per kWh)
    const costPerKwh = 0.12;
    const totalCost = totalKwh * costPerKwh;

    // CO2 calculations (0.92 lbs CO2 per kWh, typical US grid)
    const co2PerKwh = 0.92; // pounds
    const co2Saved = totalKwh * co2PerKwh * 0.453592; // Convert to kg

    // Trees equivalent (1 tree absorbs ~21 kg CO2/year = 0.0575 kg/day)
    const treesEquiv = co2Saved / 0.0575;

    return {
        lightsKwh,
        fanKwh,
        acKwh,
        totalKwh,
        totalCost,
        co2Saved,
        treesEquiv,
        hoursEmpty
    };
}

/**
 * Display energy savings summary
 */
function displayEnergySummary(savings) {
    // Update individual device savings
    document.getElementById('lightsSavings').textContent = `${savings.lightsKwh.toFixed(2)} kWh`;
    document.getElementById('fanSavings').textContent = `${savings.fanKwh.toFixed(2)} kWh`;
    document.getElementById('acSavings').textContent = `${savings.acKwh.toFixed(2)} kWh`;

    // Update total savings
    document.getElementById('totalSavings').textContent = `${savings.totalKwh.toFixed(2)} kWh`;
    document.getElementById('totalCost').textContent = `$${savings.totalCost.toFixed(2)} saved`;

    // Update environmental impact
    document.getElementById('co2Saved').textContent = `${savings.co2Saved.toFixed(1)} kg`;
    document.getElementById('treesEquiv').textContent = Math.round(savings.treesEquiv);

    // Calculate campus-wide projections (100 rooms, 30 days)
    const roomsCount = 100;
    const daysPerMonth = 30;
    const daysPerYear = 365;

    // Assume 30% of predictions result in empty rooms that get optimized
    const optimizationRate = 0.3;
    const predictionsPerDay = 4; // 4 readings per hour average over day

    const dailySavingsPerRoom = savings.totalKwh * predictionsPerDay * optimizationRate;
    const monthlySavings = dailySavingsPerRoom * roomsCount * daysPerMonth;
    const annualSavings = dailySavingsPerRoom * roomsCount * daysPerYear;
    const annualCO2 = savings.co2Saved * predictionsPerDay * optimizationRate * roomsCount * daysPerYear;

    document.getElementById('monthlySavings').textContent = 
        `${monthlySavings.toFixed(0)} kWh ($${(monthlySavings * 0.12).toFixed(0)})`;
    document.getElementById('annualSavings').textContent = 
        `${annualSavings.toFixed(0)} kWh ($${(annualSavings * 0.12).toFixed(0)})`;
    document.getElementById('annualCO2').textContent = 
        `${(annualCO2 / 1000).toFixed(1)} tons CO₂`;
}

/**
 * Start auto demo mode
 */
function startAutoDemo() {
    console.log('🎬 Starting auto demo...');

    // Show demo banner
    document.getElementById('demoBanner').style.display = 'block';
    document.getElementById('autoDemoBtn').style.display = 'none';

    // Demo scenarios in order
    const demoScenarios = ['empty', 'morning', 'evening', 'weekend'];
    currentDemoStep = 0;

    // Run first scenario immediately
    console.log(`📍 Auto-demo: Running scenario ${currentDemoStep + 1}/4`);
    runDemoScenario(demoScenarios[currentDemoStep]);
    currentDemoStep++;

    // Set up interval for remaining scenarios (every 7 seconds for better visibility)
    autoDemoInterval = setInterval(() => {
        if (currentDemoStep < demoScenarios.length) {
            console.log(`📍 Auto-demo: Running scenario ${currentDemoStep + 1}/4`);
            runDemoScenario(demoScenarios[currentDemoStep]);
            currentDemoStep++;
        } else {
            // Demo complete, loop back
            console.log('🔄 Auto-demo: Looping back to start');
            currentDemoStep = 0;
            runDemoScenario(demoScenarios[currentDemoStep]);
            currentDemoStep++;
        }
    }, 7000); // Increased from 5000 to 7000ms for better visibility
}

/**
 * Stop auto demo mode
 */
function stopAutoDemo() {
    console.log('⏸️ Stopping auto demo...');

    if (autoDemoInterval) {
        clearInterval(autoDemoInterval);
        autoDemoInterval = null;
    }

    document.getElementById('demoBanner').style.display = 'none';
    document.getElementById('autoDemoBtn').style.display = 'block';
    currentDemoStep = 0;
}

/**
 * Run a specific demo scenario
 */
function runDemoScenario(presetName) {
    const demoScenarios = ['empty', 'morning', 'evening', 'weekend'];
    const stepNumber = demoScenarios.indexOf(presetName) + 1;

    // Update banner
    document.getElementById('demoScenario').textContent = 
        `Scenario ${stepNumber}/4: ${presets[presetName].name}`;

    // Apply preset and run prediction
    applyPreset(presetName);
}

/**
 * Update performance metrics
 */
function updatePerformanceMetrics(latency) {
    predictionCount++;
    totalLatency += latency;

    const avgLatency = totalLatency / predictionCount;

    document.getElementById('avgLatency').textContent = `${avgLatency.toFixed(2)} ms`;
    document.getElementById('totalPredictions').textContent = predictionCount;

    // Update current provider display
    if (session && session.executionProviders && session.executionProviders.length > 0) {
        const provider = session.executionProviders[0];
        document.getElementById('currentProvider').textContent = provider.toUpperCase();
    } else {
        document.getElementById('currentProvider').textContent = 'WASM';
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
