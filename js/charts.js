// Protect page access
protectPage("user");

// Get localStorage history
let history = JSON.parse(localStorage.getItem("history")) || [];

// TOTAL EMISSION & GREEN SCORE DISPLAY
let latest = history[history.length - 1] || null;

if(latest){
    document.getElementById("totalEmission").innerText = latest.total + " kg CO2";
    document.getElementById("greenScore").innerText = latest.score;
    document.getElementById("greenScore").style.color = latest.score > 70 ? "green" : (latest.score > 40 ? "orange" : "red");
}

// ----------------- CATEGORY BREAKDOWN CHART -----------------
const ctxCategory = document.getElementById("categoryBreakdownChart").getContext("2d");

let categoryData = latest ? [
    latest.breakdown.energy,
    latest.breakdown.transport,
    latest.breakdown.food,
    latest.breakdown.waste,
    latest.breakdown.water
] : [0,0,0,0,0];

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
let trendData = history.map(h => h.total);

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