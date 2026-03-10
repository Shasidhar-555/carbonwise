// Protect admin page
protectPage("admin");

// Protect data
let usersData = JSON.parse(localStorage.getItem("users")) || {};
let users = Object.keys(usersData).map(key => ({name: key, role: usersData[key].role || 'user'}));

// Ensure admin user info appears if login session exists
let loggedInUser = localStorage.getItem("loggedInUser");
let loggedInRole = localStorage.getItem("loggedInRole");
if(loggedInUser && !users.some(u => u.name === loggedInUser)){
    users.push({name: loggedInUser, role: loggedInRole || 'user'});
}

// History entries
let history = JSON.parse(localStorage.getItem("history")) || [];

// Compute emission + green score per user from historical data
let perUserStats = {};
history.forEach(entry => {
    let user = entry.user || 'Guest';
    if(!perUserStats[user]){
        perUserStats[user] = {emissions: [], breakdowns: [], goals: [], scores: []};
    }
    perUserStats[user].emissions.push(entry.emission || entry.total || 0);
    perUserStats[user].breakdowns.push(entry.breakdown || {});
    if(entry.score !== undefined) perUserStats[user].scores.push(entry.score);
});

// Build leaderboard with latest scores
let leaderboardEntries = Object.entries(perUserStats).map(([user, stats]) => {
    let score = stats.scores.length ? stats.scores[stats.scores.length - 1] : 0;
    return {name: user, score};
});
if(leaderboardEntries.length === 0 && users.length > 0){
    leaderboardEntries = users.map(u => ({name: u.name, score: 0}));
}
leaderboardEntries.sort((a,b) => b.score - a.score);

// Populate admin leaderboard
document.querySelector("#adminLeaderboard tbody").innerHTML = leaderboardEntries.map((u, idx) => {
    let medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "";
    return `<tr><td>${medal}</td><td>${u.name}</td><td>${u.score.toFixed ? u.score.toFixed(0) : u.score}</td></tr>`;
}).join('');

// Total registered users
document.getElementById("totalUsers").innerText = users.length;

// Average emission across all entries
let averageEmission = 0;
if(history.length > 0){
    averageEmission = history.reduce((sum, entry) => sum + Number(entry.emission || entry.total || 0), 0) / history.length;
}
document.getElementById("averageEmission").innerText = averageEmission.toFixed(2) + " kg CO2";

// Category breakdown aggregated
let aggregated = {energy:0, transport:0, food:0, waste:0, water:0};
history.forEach(entry => {
    if(entry.breakdown){
        aggregated.energy += Number(entry.breakdown.energy || 0);
        aggregated.transport += Number(entry.breakdown.transport || 0);
        aggregated.food += Number(entry.breakdown.food || 0);
        aggregated.waste += Number(entry.breakdown.waste || 0);
        aggregated.water += Number(entry.breakdown.water || 0);
    }
});

// Category doughnut chart
let categoryCtx = document.getElementById("categoryChart").getContext("2d");
new Chart(categoryCtx, {
    type: 'doughnut',
    data: {
        labels: ["Energy","Transport","Food","Waste","Water"],
        datasets: [{
            data: [aggregated.energy,aggregated.transport,aggregated.food,aggregated.waste,aggregated.water],
            backgroundColor: ['#00ffff','#ffa500','#00ccff','#ff6666','#ccff00']
        }]
    }
});

// Trend chart from history
let trendCtx = document.getElementById("trendChart").getContext("2d");
new Chart(trendCtx, {
    type: 'line',
    data: {
        labels: history.map(h => h.date),
        datasets: [{
            label: "CO2 Emission",
            data: history.map(h => h.emission || h.total || 0),
            backgroundColor: '#00ffff40',
            borderColor: '#00ffff',
            fill: true,
            tension: 0.3
        }]
    }
});

// All submissions table
const submissionBody = document.querySelector('#submissionTable tbody');
if(history.length > 0){
    submissionBody.innerHTML = history.map(entry => {
        let b = entry.breakdown || {};
        return `<tr>
            <td>${entry.date || 'N/A'}</td>
            <td>${entry.user || 'Guest'}</td>
            <td>${(entry.emission || entry.total || 0).toFixed(2)}</td>
            <td>${entry.score !== undefined ? entry.score.toFixed(0) : '--'}</td>
            <td>${(b.energy || 0).toFixed(2)}</td>
            <td>${(b.transport || 0).toFixed(2)}</td>
            <td>${(b.food || 0).toFixed(2)}</td>
            <td>${(b.waste || 0).toFixed(2)}</td>
            <td>${(b.water || 0).toFixed(2)}</td>
        </tr>`;
    }).join('');
} else {
    submissionBody.innerHTML = `<tr><td colspan="9" style="text-align:center;">No submissions yet.</td></tr>`;
}