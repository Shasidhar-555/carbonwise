// Protect page
protectPage("user");

function loadProfile(){
    let loggedInUser = localStorage.getItem("loggedInUser") || "Guest";
    let usersDb = JSON.parse(localStorage.getItem("users")) || {};
    let currentUser = usersDb[loggedInUser] || {};

    let username = loggedInUser;
    let email = currentUser.email || "user@example.com";
    let role = currentUser.role || "User";

    let history = JSON.parse(localStorage.getItem("history")) || [];
    let lastEntry = history[history.length - 1] || {};
    let latestEmission = Number(lastEntry.emission || lastEntry.total || 0);
    let latestScore = Number(lastEntry.score || Math.max(0, 100 - latestEmission));

    let monthlyEmission = 0;
    if(history.length > 0){
        let weekSum = history.reduce((sum, entry) => sum + Number(entry.emission || entry.total || 0), 0);
        monthlyEmission = (weekSum / history.length) * 4;
    }

    let personalGoal = Number(localStorage.getItem("carbonGoal")) || 0;
    let goalProgress = personalGoal > 0 ? Math.min((monthlyEmission / personalGoal) * 100, 100) : 0;

    let yearlyFootprint = monthlyEmission * 12;
    let treesNeeded = yearlyFootprint > 0 ? Math.ceil(yearlyFootprint / 22) : 0;
    const globalAvgYearly = 4700;
    let globalComparison = globalAvgYearly > 0 ? (yearlyFootprint / globalAvgYearly).toFixed(2) : "0.00";

    document.getElementById("username").innerText = "Username: " + username;
    document.getElementById("email").innerText = "Email: " + email;
    document.getElementById("role").innerText = "Role: " + role;
    document.getElementById("fullname").innerText = `Full Name: ${currentUser.profile?.fullName || '—'}`;
    document.getElementById("country").innerText = `Country: ${currentUser.profile?.country || '—'}`;

    document.getElementById("latestEmission").innerText = `Latest Carbon Emission: ${latestEmission.toFixed(2)} kg CO2`;
    document.getElementById("currentGreenScore").innerText = `Current Green Score: ${latestScore.toFixed(0)}`;
    document.getElementById("monthlyFootprint").innerText = `Monthly Carbon Footprint: ${monthlyEmission.toFixed(2)} kg CO2`;
    document.getElementById("personalGoal").innerText = personalGoal > 0 ? `Personal Goal: ${personalGoal} kg CO2 / month` : `Personal Goal: Not set`;

    document.getElementById("goalStatusText").innerText = personalGoal > 0 ? `Goal progress: ${goalProgress.toFixed(0)}%` : "No goal set";
    document.getElementById("goalStatusProgress").value = goalProgress;

    document.getElementById("yearlyFootprint").innerText = `Estimated yearly footprint: ${yearlyFootprint.toFixed(2)} kg CO2`;
    document.getElementById("treesNeeded").innerText = `Trees required to offset: ${treesNeeded}`;
    document.getElementById("globalComparison").innerText = `Comparison with global average: ${globalComparison}x`;

    if(history.length > 0){
        const tbody = document.getElementById("recentActivity").querySelector("tbody");
        tbody.innerHTML = history.slice(-5).reverse().map(entry => {
            const date = entry.date || "Unknown";
            const value = Number(entry.emission || entry.total || 0).toFixed(2);
            const score = Number(entry.score || Math.max(0, 100 - Number(entry.emission || entry.total || 0))).toFixed(0);
            return `<tr><td>${date}</td><td>${value}</td><td>${score}</td></tr>`;
        }).join("");
    }

    document.getElementById("editProfileBtn").addEventListener("click", () => {
        window.location.href = "setup-profile.html";
    });
    document.getElementById("changePasswordBtn").addEventListener("click", () => {
        alert("Change password function is not implemented yet.");
    });
    document.getElementById("logoutBtn").addEventListener("click", () => {
        logout();
    });
}

loadProfile();