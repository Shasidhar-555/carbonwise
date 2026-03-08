function calculateCarbon(){

let electricity = Number(document.getElementById("electricity").value) || 0;
let car = Number(document.getElementById("car").value) || 0;
let bus = Number(document.getElementById("bus").value) || 0;
let train = Number(document.getElementById("train").value) || 0;
let bike = Number(document.getElementById("bike").value) || 0;
let plane = Number(document.getElementById("plane").value) || 0;
let meat = Number(document.getElementById("meat").value) || 0;
let waste = Number(document.getElementById("waste").value) || 0;
let water = Number(document.getElementById("water").value) || 0;

let electricityEmission = electricity * 0.85;
let carEmission = car * 0.21;
let busEmission = bus * 0.10;
let trainEmission = train * 0.05;
let bikeEmission = bike * 0.02;
let planeEmission = plane * 0.25;
let meatEmission = meat * 2.5;
let wasteEmission = waste * 0.45;
let waterEmission = water * 0.001;

let transportTotal =
carEmission + busEmission + trainEmission + bikeEmission + planeEmission;

let foodTotal = meatEmission;

let total =
electricityEmission + transportTotal + foodTotal + wasteEmission + waterEmission;

document.getElementById("result").innerText =
"Total Emission: " + total.toFixed(2) + " kg CO2";

let score;

if(total < 20) score = 90;
else if(total < 50) score = 70;
else if(total < 100) score = 50;
else score = 30;

let scoreElement = document.getElementById("score");
scoreElement.innerText = "Green Score: " + score;

if(score >= 80) scoreElement.style.color="green";
else if(score >= 50) scoreElement.style.color="orange";
else scoreElement.style.color="red";

let level="";

if(total < 20) level="Low Carbon Footprint 🌱";
else if(total < 50) level="Moderate Carbon Footprint ⚠️";
else level="High Carbon Footprint 🔥";

document.getElementById("level").innerText = level;

document.getElementById("breakdown").innerText =

"⚡ Electricity: " + electricityEmission.toFixed(2) + " kg CO2\n" +
"🚗 Car: " + carEmission.toFixed(2) + " kg CO2\n" +
"🚌 Bus: " + busEmission.toFixed(2) + " kg CO2\n" +
"🚆 Train: " + trainEmission.toFixed(2) + " kg CO2\n" +
"🚲 Bike: " + bikeEmission.toFixed(2) + " kg CO2\n" +
"✈️ Plane: " + planeEmission.toFixed(2) + " kg CO2\n" +
"🍽 Food: " + foodTotal.toFixed(2) + " kg CO2\n" +
"🗑 Waste: " + wasteEmission.toFixed(2) + " kg CO2\n" +
"💧 Water: " + waterEmission.toFixed(2) + " kg CO2";

document.getElementById("yearly").innerText =
"Estimated Yearly Emission: " + (total * 365).toFixed(2) + " kg CO2";

let tip="";

if(total > 50)
tip="Tip: Use public transport, reduce flights & meat consumption.";
else if(total > 20)
tip="Tip: Reduce electricity usage & recycle more.";
else
tip="Great job! Your lifestyle is eco-friendly.";

document.getElementById("tip").innerText = tip;

localStorage.setItem("electricity", electricityEmission);
localStorage.setItem("transport", transportTotal);
localStorage.setItem("food", foodTotal);
localStorage.setItem("waste", wasteEmission);
localStorage.setItem("water", waterEmission);
localStorage.setItem("totalEmission", total);

}

function resetForm(){

let fields = [
"electricity",
"car",
"bus",
"train",
"bike",
"plane",
"meat",
"waste",
"water"
];

fields.forEach(id => document.getElementById(id).value="");

document.getElementById("result").innerText="";
document.getElementById("score").innerText="";
document.getElementById("level").innerText="";
document.getElementById("breakdown").innerText="";
document.getElementById("yearly").innerText="";
document.getElementById("tip").innerText="";

}