// Protect page
protectPage("user");

// Global chart variable
let emissionChart;

// CO2 emission factors (example values)
const factors = {
    electricity: 0.233, // kg CO2 per kWh
    ac: 0.05,           // per hour
    gas: 2.0,           // per cylinder
    car: 0.12,          // per km
    bus: 0.05,
    train: 0.04,
    plane: 0.25,        // per km
    bike: 0,
    meat: 2.5,          // per meal
    dairy: 1.2,
    veg: 0.5,
    waste: 0.3,         // per kg
    water: 0.001,       // per litre
    laundry: 0.5,       // per load
    shower: 0.05        // per minute
};

function createToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.innerText = message;
    container.appendChild(toastEl);

    setTimeout(() => {
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateY(-10px)';
        setTimeout(() => toastEl.remove(), 250);
    }, 2000);
}

function shootConfetti() {
    for (let i = 0; i < 25; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        const startX = window.innerWidth * Math.random();
        const startY = -20;
        c.style.left = `${startX}px`;
        c.style.top = `${startY}px`;
        c.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(c);

        const endX = startX + (Math.random() * 200 - 100);
        const endY = window.innerHeight + 50;
        const duration = 1000 + Math.random() * 800;

        c.animate([
            { transform: `translate(0, 0) rotate(${Math.random()*360}deg)`, opacity: 1 },
            { transform: `translate(${endX - startX}px, ${endY - startY}px) rotate(${Math.random()*720}deg)`, opacity: 0 }
        ], { duration, easing: 'ease-out' });

        setTimeout(() => c.remove(), duration);
    }
}

function launchCelebration(score) {
    if (score >= 90) {
        createToast('🎉 Awesome! You are an Eco Hero!');
        shootConfetti();
    } else if (score >= 75) {
        createToast('✅ Great work! Keep pushing your green score higher.');
    } else if (score >= 50) {
        createToast('🌿 Good progress—your habits are improving.');
    }
}

function generateRoadmap(breakdown, totalEmission) {
    const roadmapEl = document.getElementById('roadmap');
    if (!roadmapEl) return;

    if (totalEmission < 1) {
        roadmapEl.innerHTML = '<h3>Carbon Reduction Roadmap</h3><p>Enter some values or move sliders to generate your personalized roadmap.</p>';
        return;
    }

    const categories = [
        { name: 'Energy', value: breakdown.energy },
        { name: 'Transport', value: breakdown.transport },
        { name: 'Food', value: breakdown.food },
        { name: 'Waste', value: breakdown.waste },
        { name: 'Water', value: breakdown.water }
    ];
    categories.sort((a, b) => b.value - a.value);

    const top = categories[0];
    const second = categories[1];

    const reductionTarget = (totalEmission * 0.3).toFixed(2);

    let steps = [];
    if (top.name === 'Transport') {
        steps = [
            'Reduce car travel by using public transport twice a week.',
            'Carpool, bike, or walk for short-distance trips.',
            'Consider switching to a low-emission vehicle when possible.'
        ];
    } else if (top.name === 'Energy') {
        steps = [
            'Reduce AC usage by 1 hour per day and use natural ventilation when possible.',
            'Switch to energy-efficient appliances and LED lighting.',
            'Unplug idle devices and use smart power strips.'
        ];
    } else if (top.name === 'Food') {
        steps = [
            'Replace 3 meat meals per week with vegetarian meals.',
            'Reduce dairy-heavy meals and choose plant-based alternatives.',
            'Buy local, seasonal food and minimize food waste.'
        ];
    } else if (top.name === 'Waste') {
        steps = [
            'Start recycling plastic, glass and paper waste regularly.',
            'Reduce single-use plastic usage and bring reusable bags/bottles.',
            'Compost organic waste where possible.'
        ];
    } else if (top.name === 'Water') {
        steps = [
            'Cut shower time and install a low-flow showerhead.',
            'Fix leaks and avoid letting taps run unnecessarily.',
            'Reuse greywater for gardening and choose water-efficient appliances.'
        ];
    }

    if (second && second.value > 0) {
        const secondStep = `Also monitor ${second.name.toLowerCase()} and apply improvements there as well.`;
        steps.push(secondStep);
    }

    steps.push('Continue regular tracking with CarbonWise to keep improving.');

    roadmapEl.innerHTML = `<h3>Goal: Reduce emission by 30% (${reductionTarget} kg CO2)</h3><ol>${steps.map(step => `<li>${step}</li>`).join('')}</ol>`;
}

function displayResults(prefix, totalEmission, score, level, breakdown, yearly) {
    const target = prefix === 'main' 
        ? { result: 'result', score: 'score', level: 'level', yearly: 'yearly', breakdown: 'breakdown' }
        : { result: `${prefix}Result`, score: `${prefix}Score`, level: `${prefix}Level`, yearly: `${prefix}Yearly`, breakdown: `${prefix}Breakdown` };

    const resultEl = document.getElementById(target.result);
    const scoreEl = document.getElementById(target.score);
    const levelEl = document.getElementById(target.level);
    const yearlyEl = document.getElementById(target.yearly);
    const breakdownEl = document.getElementById(target.breakdown);

    if (resultEl) resultEl.innerText = `Total Emission: ${totalEmission.toFixed(2)} kg CO2`;
    if (scoreEl) scoreEl.innerText = `Green Score: ${score.toFixed(0)}`;
    if (levelEl) levelEl.innerText = `Level: ${level}`;
    if (yearlyEl) yearlyEl.innerText = `Estimated Yearly Emission: ${yearly.toFixed(2)} kg CO2`;
    if (breakdownEl) breakdownEl.innerText =
        `⚡ Energy: ${breakdown.energy.toFixed(2)} kg CO2\n` +
        `🚗 Transport: ${breakdown.transport.toFixed(2)} kg CO2\n` +
        `🍽 Food: ${breakdown.food.toFixed(2)} kg CO2\n` +
        `🗑 Waste: ${breakdown.waste.toFixed(2)} kg CO2\n` +
        `💧 Water: ${breakdown.water.toFixed(2)} kg CO2`;

    // New additional quick summary below water category
    const quickResult = document.getElementById('quickResult');
    if (quickResult) {
        quickResult.innerHTML = `
            <strong>Total Emission:</strong> ${totalEmission.toFixed(2)} kg CO2<br>
            <strong>Green Score:</strong> ${score.toFixed(0)}<br>
            <strong>Level:</strong> ${level}<br>
            <strong>Energy:</strong> ${breakdown.energy.toFixed(2)} kg CO2<br>
            <strong>Transport:</strong> ${breakdown.transport.toFixed(2)} kg CO2<br>
            <strong>Food:</strong> ${breakdown.food.toFixed(2)} kg CO2<br>
            <strong>Waste:</strong> ${breakdown.waste.toFixed(2)} kg CO2<br>
            <strong>Water:</strong> ${breakdown.water.toFixed(2)} kg CO2
        `;
    }
}

function calculateEmissionFromValues(values) {
    const b = {};
    b.energy = values.electricity * factors.electricity + values.ac * factors.ac + values.gasWeekly * factors.gas;
    b.transport = values.car * factors.car + values.bus * factors.bus + values.train * factors.train + values.plane * factors.plane + values.bike * factors.bike;
    b.food = values.meat * factors.meat + values.dairy * factors.dairy + values.veg * factors.veg;
    b.waste = values.waste * factors.waste;
    b.water = values.water * factors.water + values.laundry * factors.laundry + values.shower * factors.shower;
    const total = b.energy + b.transport + b.food + b.waste + b.water;
    return { breakdown: b, total };
}

// Calculate Carbon Footprint
function calculateCarbon(saveHistory = false){
    let b = {}; // breakdown

    const electricity = Number(document.getElementById("electricity").value) || 0;
    const ac = Number(document.getElementById("ac").value) || 0;
    const gasYear = Number(document.getElementById("gas").value) || 0;
    const gasWeekly = gasYear / 52;

    b.energy = electricity * factors.electricity
             + ac * factors.ac
             + gasWeekly * factors.gas;

    b.transport = (Number(document.getElementById("car").value) || 0) * factors.car
                + (Number(document.getElementById("bus").value) || 0) * factors.bus
                + (Number(document.getElementById("train").value) || 0) * factors.train
                + (Number(document.getElementById("plane").value) || 0) * factors.plane
                + (Number(document.getElementById("bike").value) || 0) * factors.bike;

    b.food = (Number(document.getElementById("meat").value) || 0) * factors.meat
           + (Number(document.getElementById("dairy").value) || 0) * factors.dairy
           + (Number(document.getElementById("veg").value) || 0) * factors.veg;

    b.waste = (Number(document.getElementById("waste").value) || 0) * factors.waste;

    b.water = (Number(document.getElementById("water").value) || 0) * factors.water
            + (Number(document.getElementById("laundry").value) || 0) * factors.laundry
            + (Number(document.getElementById("shower").value) || 0) * factors.shower;

    let totalEmission = b.energy + b.transport + b.food + b.waste + b.water;

    // Green Score
    let score = Math.max(0, 100 - totalEmission);

    if (saveHistory) {
        let history = JSON.parse(localStorage.getItem("history")) || [];
        let now = new Date();
        let currentUser = localStorage.getItem("loggedInUser") || "Guest";
        history.push({
            date: now.toLocaleDateString(),
            user: currentUser,
            emission: totalEmission,
            total: totalEmission,
            score: score,
            breakdown: b,
            inputs: {
                electricity, ac, gasYear,
                car: Number(document.getElementById("car").value) || 0,
                bus: Number(document.getElementById("bus").value) || 0,
                train: Number(document.getElementById("train").value) || 0,
                plane: Number(document.getElementById("plane").value) || 0,
                bike: Number(document.getElementById("bike").value) || 0,
                meat: Number(document.getElementById("meat").value) || 0,
                dairy: Number(document.getElementById("dairy").value) || 0,
                veg: Number(document.getElementById("veg").value) || 0,
                waste: Number(document.getElementById("waste").value) || 0,
                water: Number(document.getElementById("water").value) || 0,
                laundry: Number(document.getElementById("laundry").value) || 0,
                shower: Number(document.getElementById("shower").value) || 0
            }
        });
        localStorage.setItem("history", JSON.stringify(history));
        localStorage.setItem("totalEmission", totalEmission);
        localStorage.setItem("latestBreakdown", JSON.stringify(b));
    }

    // Level
    let level = score > 80 ? "🌱 Eco Hero"
              : score > 50 ? "🌿 Green"
              : score > 20 ? "🍂 Average"
              : "🔥 High Emitter";

    // Yearly estimate
    let yearly = totalEmission * 52; // per year

    // Dynamic Tips
    let categories = [
        {name: 'Energy', value: b.energy},
        {name: 'Transport', value: b.transport},
        {name: 'Food', value: b.food},
        {name: 'Waste', value: b.waste},
        {name: 'Water', value: b.water}
    ];
    categories.sort((a, b) => b.value - a.value);
    let topCategories = categories.slice(0, 2);
    let tips = {
        'Energy': 'Switch to LED bulbs, unplug electronics when not in use, and use a programmable thermostat to reduce heating/cooling. For bigger impact, install solar panels or switch to a green energy provider. Track your usage with smart meters to identify high-consumption periods.',
        'Transport': 'Walk, bike, or use public transit for short trips. Carpool or use ride-sharing services. If driving, maintain proper tire pressure and combine errands. Consider an electric or hybrid vehicle for long-term savings. Calculate your carbon footprint from flights and offset if necessary.',
        'Food': 'Reduce meat and dairy intake by incorporating more plant-based meals like beans, lentils, and vegetables. Buy local and seasonal produce to cut transportation emissions. Compost food waste and avoid processed foods with excessive packaging. Try meal planning to minimize food waste.',
        'Waste': 'Recycle all paper, plastics, glass, and metals. Compost organic waste instead of sending it to landfills. Choose products with minimal or recyclable packaging. Repair items instead of buying new, and donate or sell unused goods. Participate in community clean-ups.',
        'Water': 'Install low-flow showerheads and faucets. Fix leaky taps immediately. Take shorter showers and turn off the tap while brushing teeth. Use a dishwasher instead of hand-washing when possible. Collect rainwater for outdoor use and install greywater systems for irrigation.'
    };
    let tipText = topCategories.map(cat => `<li><strong>${cat.name}:</strong> ${tips[cat.name]}</li>`).join('');
    let tip = `<h4>AI Advice:</h4><ul>${tipText}</ul>`;

    // Display results
    displayResults('main', totalEmission, score, level, b, yearly);
    document.getElementById("tip").innerHTML = tip;
    generateRoadmap(b, totalEmission);

    // Create Doughnut Chart
    if (emissionChart) {
        emissionChart.destroy();
    }
    const ctx = document.getElementById('emissionChart').getContext('2d');
    const categoryData = [b.energy, b.transport, b.food, b.waste, b.water];
    const anyNonZero = categoryData.some(value => value > 0);
    const chartData = anyNonZero
        ? categoryData.map(value => value === 0 ? 0.0001 : value)
        : [1, 1, 1, 1, 1]; // show all categories evenly when no inputs set
    emissionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['⚡ Energy', '🚗 Transport', '🍽 Food', '🗑 Waste', '💧 Water'],
            datasets: [{
                data: chartData,
                backgroundColor: [
                    '#FF6384', // red
                    '#36A2EB', // blue
                    '#FFCE56', // yellow
                    '#4BC0C0', // teal
                    '#9966FF'  // purple
                ],
                borderColor: '#161b22',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#fff'
                    }
                }
            }
        }
    });
}

function calculateSimulator() {
    const car = Number(document.getElementById('simCar').value) || 0;
    const electricity = Number(document.getElementById('simElectricity').value) || 0;
    const meat = Number(document.getElementById('simMeat').value) || 0;
    const ac = Number(document.getElementById('simAc').value) || 0;
    const bus = Number(document.getElementById('simBus').value) || 0;

    const values = {
        electricity,
        ac,
        gasWeekly: 0,
        car,
        bus,
        train: 0,
        plane: 0,
        bike: 0,
        meat,
        dairy: 0,
        veg: 0,
        waste: 0,
        water: 0,
        laundry: 0,
        shower: 0
    };

    const computed = calculateEmissionFromValues(values);
    const totalEmission = computed.total;
    const b = computed.breakdown;

    const score = Math.max(0, 100 - totalEmission);
    const level = score > 80 ? '🌱 Eco Hero' : score > 50 ? '🌿 Green' : score > 20 ? '🍂 Average' : '🔥 High Emitter';
    const yearly = totalEmission * 52;

    displayResults('sim', totalEmission, score, level, b, yearly);
    generateRoadmap(b, totalEmission);
}

// Reset form
function resetForm(){
    document.querySelectorAll(".calculator input").forEach(input => input.value = "");
    document.getElementById("result").innerText = "";
    document.getElementById("score").innerText = "";
    document.getElementById("level").innerText = "";
    document.getElementById("yearly").innerText = "";
    document.getElementById("breakdown").innerText = "";
    document.getElementById("tip").innerText = "";
    if (emissionChart) {
        emissionChart.destroy();
        emissionChart = null;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const calcBtn = document.getElementById("calculateBtn");
    const resetBtn = document.getElementById("resetBtn");
    const viewDashBtn = document.getElementById("viewDashboardBtn");

    if (calcBtn) {
        calcBtn.addEventListener("click", (e) => {
            e.preventDefault();
            calculateCarbon(true);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener("click", (e) => {
            e.preventDefault();
            resetForm();
        });
    }

    if (viewDashBtn) {
        viewDashBtn.addEventListener("click", () => {
            window.location.href = "dashboard.html";
        });
    }

    const simulatorInputs = [
        'simCar', 'simElectricity', 'simMeat', 'simAc', 'simBus'
    ];

    simulatorInputs.forEach(id => {
        const el = document.getElementById(id);
        const display = document.getElementById(`${id}Value`);
        if (el) {
            const update = () => {
                if (display) display.innerText = el.value;
                calculateSimulator();
            };
            el.addEventListener('input', update);
            update();
        }
    });

    const syncPairs = [
        ['electricity', 'electricitySlider'],
        ['ac', 'acSlider'],
        ['gas', 'gasSlider'],
        ['car', 'carSlider'],
        ['bus', 'busSlider'],
        ['train', 'trainSlider'],
        ['plane', 'planeSlider'],
        ['bike', 'bikeSlider'],
        ['meat', 'meatSlider'],
        ['dairy', 'dairySlider'],
        ['veg', 'vegSlider']
    ];

    syncPairs.forEach(([num, slider]) => syncInputPair(num, slider));
    calculateCarbon(false);
    calculateSimulator();
});