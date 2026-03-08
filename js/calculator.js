// Protect page
protectPage("user");

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
    plastic: 0.2,       // per item
    water: 0.001,       // per litre
    laundry: 0.5,       // per load
    shower: 0.05        // per minute
};

// Calculate Carbon Footprint
function calculateCarbon(){
    let b = {}; // breakdown

    b.energy = (Number(document.getElementById("electricity").value) || 0) * factors.electricity
             + (Number(document.getElementById("ac").value) || 0) * factors.ac
             + (Number(document.getElementById("gas").value) || 0) * factors.gas;

    b.transport = (Number(document.getElementById("car").value) || 0) * factors.car
                + (Number(document.getElementById("bus").value) || 0) * factors.bus
                + (Number(document.getElementById("train").value) || 0) * factors.train
                + (Number(document.getElementById("plane").value) || 0) * factors.plane
                + (Number(document.getElementById("bike").value) || 0) * factors.bike;

    b.food = (Number(document.getElementById("meat").value) || 0) * factors.meat
           + (Number(document.getElementById("dairy").value) || 0) * factors.dairy
           + (Number(document.getElementById("veg").value) || 0) * factors.veg;

    let recyclingFactor = (Number(document.getElementById("recycling").value) || 0) / 100;
    b.waste = ((Number(document.getElementById("waste").value) || 0) * factors.waste
             + (Number(document.getElementById("plastic").value) || 0) * factors.plastic) * (1 - recyclingFactor);

    b.water = (Number(document.getElementById("water").value) || 0) * factors.water
            + (Number(document.getElementById("laundry").value) || 0) * factors.laundry
            + (Number(document.getElementById("shower").value) || 0) * factors.shower;

    let totalEmission = b.energy + b.transport + b.food + b.waste + b.water;

    // Save history
    let history = JSON.parse(localStorage.getItem("history")) || [];
    let now = new Date();
    history.push({date: now.toLocaleDateString(), emission: totalEmission, breakdown: b});
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem("totalEmission", totalEmission);
    localStorage.setItem("latestBreakdown", JSON.stringify(b));

    // Green Score
    let score = Math.max(0, 100 - totalEmission);

    // Level
    let level = score > 80 ? "🌱 Eco Hero"
              : score > 50 ? "🌿 Green"
              : score > 20 ? "🍂 Average"
              : "🔥 High Emitter";

    // Yearly estimate
    let yearly = totalEmission * 52; // per year

    // Tips
    let tip = "Tip: Reduce high-emission categories like transport and energy.";

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
    document.getElementById("tip").innerText = tip;
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
}