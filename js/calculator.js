function calculateCarbon(){

let electricity = document.getElementById("electricity").value * 0.85;

let car = document.getElementById("car").value * 0.21;

let meat = document.getElementById("meat").value * 2.5;

let total = electricity + car + meat;

document.getElementById("result").innerText =
"Total Emission: " + total.toFixed(2) + " kg CO2";

}