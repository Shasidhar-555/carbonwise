// Protect page
protectPage("user");

function saveGoal(){
    let goal = Number(document.getElementById("goalInput").value);
    if(goal <= 0){
        alert("Enter a valid goal!");
        return;
    }

    localStorage.setItem("carbonGoal", goal);
    displayGoal();
}

function displayGoal(){
    let goal = Number(localStorage.getItem("carbonGoal"));
    if(!goal) return;

    document.getElementById("goalDisplay").innerText = `Your Goal: ${goal} kg CO2 per month`;

    // Calculate progress based on total emission this month
    let history = JSON.parse(localStorage.getItem("history")) || [];
    let monthEmissions = history.reduce((sum, entry)=>{
        return sum + entry.total;
    }, 0);

    let progress = Math.min((monthEmissions/goal)*100, 100);
    document.getElementById("goalProgress").value = progress;
}

displayGoal();