protectPage("user");

const loggedInUser = localStorage.getItem("loggedInUser");
if(!loggedInUser){
    window.location.href = "login.html";
}

const usersDb = JSON.parse(localStorage.getItem("users")) || {};
const currentUser = usersDb[loggedInUser] || {profile: {fullName: "", country: ""}};

const fullNameEl = document.getElementById("fullName");
const emailEl = document.getElementById("email");
const usernameEl = document.getElementById("username");
const countryEl = document.getElementById("country");
const statusEl = document.getElementById("status");

fullNameEl.value = currentUser.profile?.fullName || "";
emailEl.value = currentUser.email || "";
usernameEl.value = loggedInUser;
countryEl.value = currentUser.profile?.country || "";

const setupForm = document.getElementById("setupForm");
setupForm.addEventListener("submit", function(event){
    event.preventDefault();

    const fullName = fullNameEl.value.trim();
    const country = countryEl.value.trim();

    if(!fullName || !country){
        statusEl.style.color = "#ff6666";
        statusEl.innerText = "Full Name and Country are required.";
        return;
    }

    const updatedUser = {
        ...currentUser,
        profileComplete: true,
        profile: {
            fullName,
            country
        }
    };

    usersDb[loggedInUser] = updatedUser;
    localStorage.setItem("users", JSON.stringify(usersDb));

    statusEl.style.color = "#00ff00";
    statusEl.innerText = "Profile saved successfully. Redirecting to dashboard...";

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1000);
});