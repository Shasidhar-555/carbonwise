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

// Calculate Carbon Footprint
function calculateCarbon(){
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

    // Save history
    let history = JSON.parse(localStorage.getItem("history")) || [];
    let now = new Date();
    history.push({
        date: now.toLocaleDateString(),
        emission: totalEmission,
        total: totalEmission,
        score: score,
        breakdown: b
    });
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem("totalEmission", totalEmission);
    localStorage.setItem("latestBreakdown", JSON.stringify(b));

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
    document.getElementById("result").innerText = `Total Emission: ${totalEmission.toFixed(2)} kg CO2`;
    document.getElementById("score").innerText = `Green Score: ${score.toFixed(0)}`;
    document.getElementById("level").innerText = `Level: ${level}`;
    document.getElementById("yearly").innerText = `Estimated Yearly Emission: ${yearly.toFixed(2)} kg CO2`;
    document.getElementById("breakdown").innerText = 
        `⚡ Energy: ${b.energy.toFixed(2)} kg CO2\n`+
        `🚗 Transport: ${b.transport.toFixed(2)} kg CO2\n`+
        `🍽 Food: ${b.food.toFixed(2)} kg CO2\n`+
        `🗑 Waste: ${b.waste.toFixed(2)} kg CO2\n`+
        `💧 Water: ${b.water.toFixed(2)} kg CO2`;
    document.getElementById("tip").innerHTML = tip;

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
            calculateCarbon();
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
});