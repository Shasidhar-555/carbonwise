// Protect page
protectPage("user");

function loadHistory(){
    let history = JSON.parse(localStorage.getItem("history")) || [];
    let tbody = document.querySelector("#historyTable tbody");
    tbody.innerHTML = "";

    history.reverse().forEach(entry=>{
        let breakdownText = 
            `Energy: ${entry.breakdown.energy.toFixed(2)}\n` +
            `Transport: ${entry.breakdown.transport.toFixed(2)}\n` +
            `Food: ${entry.breakdown.food.toFixed(2)}\n` +
            `Waste: ${entry.breakdown.waste.toFixed(2)}\n` +
            `Water: ${entry.breakdown.water.toFixed(2)}`;

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.total.toFixed(2)}</td>
            <td>${entry.score.toFixed(0)}</td>
            <td><pre>${breakdownText}</pre></td>
        `;

        tbody.appendChild(row);
    });
}

loadHistory();