// Protect admin page
protectPage("admin");

// Sample users stored locally (replace with real DB in future)
let users = JSON.parse(localStorage.getItem("users")) || [
    {name:"Alex", score:92},
    {name:"Jordan", score:85},
    {name:"You", score:0} // placeholder
];

// Compute current user score if logged in
let username = localStorage.getItem("username");
if(username){
    let totalEmission = Number(localStorage.getItem("totalEmission")) || 0;
    let userScore = Math.max(0, 100 - totalEmission);

    // Update user if exists, else push new
    let existing = users.find(u => u.name === username);
    if(existing){
        existing.score = userScore;
    } else {
        users.push({name: username, score: userScore});
    }
}

// Sort descending by score
users.sort((a,b) => b.score - a.score);

// Populate leaderboard
let leaderboardTable = document.querySelector("#adminLeaderboard tbody");
leaderboardTable.innerHTML = "";
users.forEach((u, idx) => {
    let medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "";
    let row = `
        <tr>
            <td>${medal}</td>
            <td>${u.name}</td>
            <td>${u.score}</td>
        </tr>
    `;
    leaderboardTable.innerHTML += row;
});

// Total users & average emission
document.getElementById("totalUsers").innerText = users.length;
let avgEmission = users.reduce((sum,u) => sum + (100-u.score),0)/users.length;
document.getElementById("averageEmission").innerText = avgEmission.toFixed(2) + " kg CO2";

// Charts
let categoryCtx = document.getElementById("categoryChart").getContext("2d");
let trendCtx = document.getElementById("trendChart").getContext("2d");

// Sample category breakdown (replace with real data)
let lastBreakdown = JSON.parse(localStorage.getItem("latestBreakdown")) || {
    energy: 20, transport: 15, food: 10, waste: 5, water: 8
};

new Chart(categoryCtx, {
    type: 'doughnut',
    data: {
        labels: ["Energy","Transport","Food","Waste","Water"],
        datasets: [{
            data: [lastBreakdown.energy,lastBreakdown.transport,lastBreakdown.food,lastBreakdown.waste,lastBreakdown.water],
            backgroundColor: ['#00ffff','#ffa500','#00ccff','#ff6666','#ccff00']
        }]
    }
});

// Trend chart from history
let history = JSON.parse(localStorage.getItem("history")) || [];
new Chart(trendCtx, {
    type: 'line',
    data: {
        labels: history.map(h => h.date),
        datasets: [{
            label: "CO2 Emission",
            data: history.map(h => h.emission),
            backgroundColor: '#00ffff40',
            borderColor: '#00ffff',
            fill: true,
            tension: 0.3
        }]
    }
});