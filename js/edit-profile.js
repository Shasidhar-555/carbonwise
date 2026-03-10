// Protect page
protectPage("user");

const form = document.getElementById("editProfileForm");
const editUsername = document.getElementById("editUsername");
const editEmail = document.getElementById("editEmail");
const editRole = document.getElementById("editRole");
const editJoinDate = document.getElementById("editJoinDate");
const status = document.getElementById("editStatus");

// Load existing profile values from localStorage
editUsername.value = localStorage.getItem("username") || "";
editEmail.value = localStorage.getItem("email") || "";
editRole.value = localStorage.getItem("role") || "User";
editJoinDate.value = localStorage.getItem("joinDate") || "";

form.addEventListener("submit", function(event){
    event.preventDefault();

    localStorage.setItem("username", editUsername.value.trim() || "Guest");
    localStorage.setItem("email", editEmail.value.trim() || "user@example.com");
    localStorage.setItem("role", editRole.value);

    status.innerText = "Profile updated successfully! Redirecting...";

    setTimeout(() => {
        window.location.href = "profile.html";
    }, 1000);
});

document.getElementById("cancelEdit").addEventListener("click", () => {
    window.location.href = "profile.html";
});