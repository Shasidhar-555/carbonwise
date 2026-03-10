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

// Total CO2 tracked
let totalCO2 = history.reduce((sum, entry) => sum + Number(entry.emission || entry.total || 0), 0);
document.getElementById("totalCO2").innerText = totalCO2.toFixed(2) + " kg CO2";

// Average emission across all entries
let averageEmission = 0;
if(history.length > 0){
    averageEmission = totalCO2 / history.length;
}
document.getElementById("averageEmission").innerText = averageEmission.toFixed(2) + " kg CO2";

// Trees required to offset tracking
let totalTrees = Math.ceil(totalCO2 / 21);
document.getElementById("totalTrees").innerText = `${totalTrees} Trees 🌳`;

// Highest green score
let highestScore = leaderboardEntries.length ? Math.max(...leaderboardEntries.map(u => Number(u.score || 0))) : 0;
document.getElementById("highestGreenScore").innerText = highestScore.toFixed(0);

// Most polluting category
let categoryTotals = {energy:0, transport:0, food:0, waste:0, water:0};
history.forEach(entry => {
    if(entry.breakdown){
        categoryTotals.energy += Number(entry.breakdown.energy || 0);
        categoryTotals.transport += Number(entry.breakdown.transport || 0);
        categoryTotals.food += Number(entry.breakdown.food || 0);
        categoryTotals.waste += Number(entry.breakdown.waste || 0);
        categoryTotals.water += Number(entry.breakdown.water || 0);
    }
});
let topCategory = "N/A";
let topValue = 0;
for(let key in categoryTotals){
    if(categoryTotals[key] > topValue){
        topValue = categoryTotals[key];
        topCategory = key.charAt(0).toUpperCase() + key.slice(1);
    }
}
document.getElementById("topCategory").innerText = topCategory;

// Category average chart data (for system-level insight)
let categoryAvgData = [
    (categoryTotals.energy / (users.length || 1)).toFixed(2),
    (categoryTotals.transport / (users.length || 1)).toFixed(2),
    (categoryTotals.food / (users.length || 1)).toFixed(2),
    (categoryTotals.waste / (users.length || 1)).toFixed(2),
    (categoryTotals.water / (users.length || 1)).toFixed(2)
];

// Category doughnut chart
let categoryCtx = document.getElementById("categoryChart").getContext("2d");
new Chart(categoryCtx, {
    type: 'doughnut',
    data: {
        labels: ["Energy","Transport","Food","Waste","Water"],
        datasets: [{
            data: categoryAvgData,
            backgroundColor: ['#00ffff','#ffa500','#00ccff','#ff6666','#ccff00']
        }]
    }
});

// Average emission by category (bar chart)
let avgCategoryCtx = document.getElementById("avgCategoryChart").getContext("2d");
new Chart(avgCategoryCtx, {
    type: 'bar',
    data: {
        labels: ["Energy","Transport","Food","Waste","Water"],
        datasets: [{
            label: 'Avg kg CO2',
            data: categoryAvgData,
            backgroundColor: ['#00ffff','#ffa500','#00ccff','#ff6666','#ccff00']
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true, ticks: { color: '#00ffff' }, grid: { color: '#11141c' } },
            x: { ticks: { color: '#00ffff' }, grid: { color: '#11141c' } }
        },
        plugins: { legend: { labels: { color: '#00ffff' } } }
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

// Admin control buttons
const viewUserDataBtn = document.getElementById('viewUserData');
const exportReportBtn = document.getElementById('exportReport');
const resetDataBtn = document.getElementById('resetData');
const viewLogsBtn = document.getElementById('viewLogs');

if(viewUserDataBtn){
    viewUserDataBtn.addEventListener('click', () => {
        document.getElementById('emissionData').scrollIntoView({behavior:'smooth'});
    });
}

if(exportReportBtn){
    exportReportBtn.addEventListener('click', () => {
        let csv = 'date,user,emission,score,energy,transport,food,waste,water\n';
        history.forEach(e => {
            let b = e.breakdown || {};
            csv += `${e.date || ''},${e.user || ''},${(e.emission||e.total||0).toFixed(2)},${(e.score||'')},${(b.energy||0)},${(b.transport||0)},${(b.food||0)},${(b.waste||0)},${(b.water||0)}\n`;
        });
        let blob = new Blob([csv], { type: 'text/csv' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'emission_report.csv';
        a.click();
        URL.revokeObjectURL(url);
    });
}

if(resetDataBtn){
    resetDataBtn.addEventListener('click', () => {
        if(confirm('Reset all user data and emission history? This cannot be undone.')){
            localStorage.removeItem('history');
            location.reload();
        }
    });
}

if(viewLogsBtn){
    viewLogsBtn.addEventListener('click', () => {
        alert('System logs not implemented yet.');
    });
}