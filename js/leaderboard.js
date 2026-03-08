// Protect page for logged-in users
protectPage("user");

// Sample leaderboard users
let users = [
    {name:"Alex", score:92},
    {name:"Jordan", score:85},
    {name:"You", score:0} // Will replace with current user score
];

// Pull current user emission & calculate green score
let emission = Number(localStorage.getItem("totalEmission")) || 0;
let userScore = Math.max(0, 100 - emission);
users[2].score = userScore;

// Sort descending by score
users.sort((a,b) => b.score - a.score);

// Populate leaderboard table
let table = document.querySelector("#leaderboardTable tbody");
table.innerHTML = "";

users.forEach((u, idx) => {
    let medal = "";
    if(idx === 0) medal = "🥇";
    else if(idx === 1) medal = "🥈";
    else if(idx === 2) medal = "🥉";

    let row = `
        <tr>
            <td>${medal}</td>
            <td>${u.name}</td>
            <td>${u.score}</td>
        </tr>
    `;
    table.innerHTML += row;
});