// Protect page access
protectPage("user");

// Get localStorage history
let history = JSON.parse(localStorage.getItem("history")) || [];

// TOTAL EMISSION & GREEN SCORE DISPLAY
let latest = history[history.length - 1] || null;

const weeklyHistory = history.filter(entry => typeof entry.emission === 'number');
const numEntries = weeklyHistory.length;
const monthlyEmissionValue = numEntries > 0 ? (weeklyHistory.reduce((sum, entry) => sum + entry.emission, 0) / numEntries) * 4 : 0;

if(latest){
    const latestTotal = Number(latest.emission || latest.total || 0);
    const latestScore = Number(latest.score || Math.max(0, 100 - latestTotal));

    document.getElementById("totalEmission").innerText = `${latestTotal.toFixed(2)} kg CO2`;
    document.getElementById("greenScore").innerText = latestScore.toFixed(0);
    document.getElementById("greenScore").style.color = latestScore > 70 ? "#00ff00" : (latestScore > 40 ? "#ffff00" : "#ff4d4d");
}

document.getElementById("monthlyEmission").innerText = `${monthlyEmissionValue.toFixed(2)} kg CO2`;

const userGoal = Number(localStorage.getItem("carbonGoal")) || 0;
if(userGoal > 0){
    document.getElementById("goalText").innerText = `Goal: ${userGoal} kg CO2 / month`;
    const goalProgress = Math.min((monthlyEmissionValue / userGoal) * 100, 100);
    document.getElementById("goalProgress").value = goalProgress;
    document.getElementById("goalProgress").textContent = `${goalProgress.toFixed(0)}%`;
} else {
    document.getElementById("goalText").innerText = "No monthly goal set in Goals page.";
    document.getElementById("goalProgress").value = 0;
}

// Carbon Impact Insights
const yearlyFootprint = monthlyEmissionValue * 12;
const treesEstimated = yearlyFootprint > 0 ? Math.ceil(yearlyFootprint / 22) : 0; // ~22 kg CO2/year per mature tree
const globalAvgYearly = 4700; // kg CO2 per year average

document.getElementById("treesOffset").innerText = `Equivalent trees needed per year: ${treesEstimated}`;
document.getElementById("yearlyFootprint").innerText = `Estimated yearly footprint: ${yearlyFootprint.toFixed(2)} kg CO2`;

document.getElementById("globalAverage").innerText = yearlyFootprint > 0 ?
    `Compared to global average: ${(yearlyFootprint / globalAvgYearly).toFixed(2)}x` :
    `Compared to global average: 0.00x`;

// Recent activity
const recentTable = document.getElementById("recentActivity").querySelector("tbody");
if(weeklyHistory.length > 0){
    recentTable.innerHTML = weeklyHistory.slice(-5).reverse().map(entry => {
        const score = Number(entry.score || Math.max(0, 100 - (entry.emission || entry.total || 0)));
        const emission = Number(entry.emission || entry.total || 0);
        return `<tr><td>${entry.date}</td><td>${emission.toFixed(2)}</td><td>${score.toFixed(0)}</td></tr>`;
    }).join("");
} else {
    recentTable.innerHTML = `<tr><td colspan="3" style="text-align:center;">No activity yet.</td></tr>`;
}

// ----------------- CATEGORY BREAKDOWN CHART -----------------
const ctxCategory = document.getElementById("categoryBreakdownChart").getContext("2d");

let categoryData = latest ? [
    latest.breakdown?.energy || 0,
    latest.breakdown?.transport || 0,
    latest.breakdown?.food || 0,
    latest.breakdown?.waste || 0,
    latest.breakdown?.water || 0
] : [0,0,0,0,0];

categoryData = categoryData.map(value => value === 0 ? 0.0001 : value); // ensure all segments render in donut chart

const categoryChart = new Chart(ctxCategory,{
    type:'doughnut',
    data:{
        labels:["Home Energy","Transport","Food","Waste","Water"],
        datasets:[{
            data: categoryData,
            backgroundColor:["#00ffff","#ff8c00","#ff2e2e","#9b59b6","#3498db"],
            borderColor:"#0d1117",
            borderWidth:2
        }]
    },
    options:{
        responsive:true,
        plugins:{
            legend:{
                position:'bottom',
                labels:{color:'#00ffff', font:{size:14}}
            },
            tooltip:{
                callbacks:{
                    label:function(context){
                        return context.label + ": "+context.raw+" kg CO2";
                    }
                }
            }
        },
        animation:{
            animateScale:true,
            animateRotate:true
        }
    }
});

// ----------------- TREND LINE CHART -----------------
const ctxTrend = document.getElementById("trendChart").getContext("2d");

let trendLabels = history.map(h => h.date);
let trendData = history.map(h => h.emission || h.total || 0);

const trendChart = new Chart(ctxTrend,{
    type:'line',
    data:{
        labels: trendLabels,
        datasets:[{
            label:"Weekly CO2 Emission",
            data: trendData,
            fill:false,
            borderColor:"#00ffff",
            tension:0.3,
            pointBackgroundColor:"#0d1117",
            pointBorderColor:"#00ffff",
            pointRadius:5
        }]
    },
    options:{
        responsive:true,
        plugins:{
            legend:{
                labels:{color:'#00ffff', font:{size:14}}
            },
            tooltip:{
                callbacks:{
                    label:function(context){
                        return context.dataset.label+": "+context.raw+" kg CO2";
                    }
                }
            }
        },
        scales:{
            x:{
                ticks:{color:'#00ffff'},
                grid:{color:'#11141c'}
            },
            y:{
                ticks:{color:'#00ffff'},
                grid:{color:'#11141c'}
            }
        }
    }
});