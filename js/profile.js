// Protect page
protectPage("user");

function loadProfile(){
    let username = localStorage.getItem("username") || "Guest";
    let role = localStorage.getItem("role") || "User";
    let totalEmission = Number(localStorage.getItem("totalEmission")) || 0;
    let score = Math.max(0, 100 - totalEmission);

    document.getElementById("username").innerText = "Username: "+username;
    document.getElementById("role").innerText = "Role: "+role;
    document.getElementById("score").innerText = "Green Score: "+score.toFixed(0);
    document.getElementById("emission").innerText = "Last Total Emission: "+totalEmission.toFixed(2)+" kg CO2";

    // Latest breakdown
    let history = JSON.parse(localStorage.getItem("history")) || [];
    let lastEntry = history[history.length-1];
    if(lastEntry){
        let b = lastEntry.breakdown;
        document.getElementById("breakdown").innerText = 
            `⚡ Energy: ${b.energy.toFixed(2)} kg CO2\n`+
            `🚗 Transport: ${b.transport.toFixed(2)} kg CO2\n`+
            `🍽 Food: ${b.food.toFixed(2)} kg CO2\n`+
            `🗑 Waste: ${b.waste.toFixed(2)} kg CO2\n`+
            `💧 Water: ${b.water.toFixed(2)} kg CO2`;
    }
}

loadProfile();