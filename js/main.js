// ----------------------------
// Page Protection Function
// ----------------------------
function protectPage(requiredRole) {
    let loggedIn = localStorage.getItem("loggedIn") === "true";
    let role = localStorage.getItem("role") || "user";

    if(!loggedIn){
        alert("You must be logged in to access this page.");
        window.location.href = "login.html";
        return;
    }

    if(requiredRole && role !== requiredRole){
        alert("Access denied. Insufficient permissions.");
        window.location.href = "dashboard.html";
        return;
    }
}

// ----------------------------
// Logout Function
// ----------------------------
function logout(){
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("totalEmission");
    localStorage.removeItem("latestBreakdown");
    window.location.href = "login.html";
}

// ----------------------------
// Helper: Save latest emission breakdown
// ----------------------------
function saveLatestBreakdown(breakdown){
    localStorage.setItem("latestBreakdown", JSON.stringify(breakdown));
}

// ----------------------------
// Helper: Save user info after login simulation
// ----------------------------
function simulateLogin(username, role){
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
}

// ----------------------------
// Optional: Format numbers
// ----------------------------
function formatNumber(num){
    return Number(num).toFixed(2);
}