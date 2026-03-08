let emission = localStorage.getItem("emission") || 0;

document.getElementById("totalEmission").innerText =
emission + " kg CO2";

let score = 100 - emission;

if(score < 0) score = 0;

document.getElementById("greenScore").innerText =
score.toFixed(0);


new Chart(document.getElementById("emissionChart"),{

type:"doughnut",

data:{

labels:["Carbon Emission","Remaining Green Score"],

datasets:[{

data:[emission,score]

}]

}

});