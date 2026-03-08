// Simple hash function for password simulation
function hashPassword(password) {
    let hash = 0;
    for(let i = 0; i < password.length; i++) {
        hash = ((hash << 5) - hash) + password.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

// Register function (store in localStorage)
function register() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    if(!username || !password){
        document.getElementById("loginMessage").innerText = "Please enter username and password.";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if(users[username]){
        document.getElementById("loginMessage").innerText = "Username already exists.";
        return;
    }

    users[username] = {
        password: hashPassword(password),
        role: role
    };

    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("loginMessage").innerText = "Registered successfully! You can login now.";
}

// Login function
function login() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if(!users[username]){
        document.getElementById("loginMessage").innerText = "User does not exist. Please register.";
        return;
    }

    if(users[username].password !== hashPassword(password) || users[username].role !== role){
        document.getElementById("loginMessage").innerText = "Invalid credentials or role.";
        return;
    }

    // Save session info
    localStorage.setItem("loggedInUser", username);
    localStorage.setItem("loggedInRole", role);

    // Redirect based on role
    if(role === "admin"){
        window.location.href = "admin.html";
    } else {
        window.location.href = "dashboard.html";
    }
}

// Page protection function (call at top of restricted pages)
function protectPage(roleRequired){
    let loggedInUser = localStorage.getItem("loggedInUser");
    let loggedInRole = localStorage.getItem("loggedInRole");

    if(!loggedInUser || (roleRequired && loggedInRole !== roleRequired)){
        alert("You must be logged in with proper access!");
        window.location.href = "login.html";
    }
}

// Logout function
function logout(){
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInRole");
    window.location.href = "login.html";
}