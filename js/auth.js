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
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    if(!username || !email || !password){
        document.getElementById("loginMessage").innerText = "Please enter username, email and password.";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if(users[username]){
        document.getElementById("loginMessage").innerText = "Username already exists.";
        return;
    }

    users[username] = {
        email: email,
        password: hashPassword(password),
        role: role,
        profileComplete: false,
        profile: {
            fullName: "",
            country: "",
            lifestyle: ""
        }
    };

    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("loginMessage").innerText = "Registered successfully! You can login now.";
}

// Login function
function login() {
    let username = document.getElementById("username").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    if(!username || !email || !password){
        document.getElementById("loginMessage").innerText = "Username, email, and password are required.";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if(!users[username]){
        document.getElementById("loginMessage").innerText = "User does not exist. Please register.";
        return;
    }

    if(users[username].password !== hashPassword(password) || users[username].role !== role){
        document.getElementById("loginMessage").innerText = "Invalid credentials or role.";
        return;
    }

    // Admin hardcoded credentials
    if(username === "12345" && password === "12345" && role === "admin"){
        localStorage.setItem("loggedInUser", "admin");
        localStorage.setItem("loggedInRole", "admin");
        window.location.href = "admin.html";
        return;
    }

    localStorage.setItem("loggedInUser", username);
    localStorage.setItem("loggedInRole", role);

    // Optional: keep username/email globally
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);

    // Always redirect to setup profile before dashboard
    window.location.href = "setup-profile.html";
}

// Page protection function (call at top of restricted pages)
function protectPage(roleRequired){
    let loggedInUser = localStorage.getItem("loggedInUser");
    let loggedInRole = localStorage.getItem("loggedInRole");

    if(!loggedInUser || (roleRequired && loggedInRole !== roleRequired)){
        alert("You must be logged in with proper access!");
        window.location.href = "login.html";
        return;
    }

    if(roleRequired === "user"){
        let users = JSON.parse(localStorage.getItem("users")) || {};
        let currentUser = users[loggedInUser];
        if(!currentUser || currentUser.profileComplete !== true){
            if(!window.location.pathname.includes("setup-profile.html")){
                window.location.href = "setup-profile.html";
            }
            return;
        }
    }
}

// Logout function
function logout(){
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInRole");
    window.location.href = "login.html";
}