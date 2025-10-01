const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const res = await fetch("http://127.0.0.1:8000/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("role", data.role);
                localStorage.setItem("username", data.username);
                window.location.href = "metrics.html";
            } else {
                document.getElementById("message").innerText = data.message;
            }
        } catch (err) {
            document.getElementById("message").innerText = "Erro na conexão";
            console.error(err);
        }
    });
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        window.location.href = "login.html";
    });
}

async function loadMetrics() {
    const role = localStorage.getItem("role");
    if (!role) {
        window.location.href = "login.html"; 
        return;
    }

    const start_date = document.getElementById("start_date")?.value;
    const end_date = document.getElementById("end_date")?.value;

    let url = `http://127.0.0.1:8000/api/metrics/?role=${role}`;
    if (start_date) url += `&start_date=${start_date}`;
    if (end_date) url += `&end_date=${end_date}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        const tableHead = document.getElementById("tableHead");
        const tableBody = document.getElementById("tableBody");
        tableHead.innerHTML = "";
        tableBody.innerHTML = "";

        if (data.length === 0) return;

        const headers = Object.keys(data[0]);
        const trHead = document.createElement("tr");
        headers.forEach(h => {
            const th = document.createElement("th");
            th.innerText = h;
            th.style.cursor = "pointer";
            th.onclick = () => sortTable(h);
            trHead.appendChild(th);
        });
        tableHead.appendChild(trHead);

        data.forEach(row => {
            const tr = document.createElement("tr");
            headers.forEach(h => {
                const td = document.createElement("td");
                td.innerText = row[h];
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    } catch (err) {
        console.error("Erro ao carregar métricas:", err);
    }
}

function sortTable(column) {
    const start_date = document.getElementById("start_date")?.value;
    const end_date = document.getElementById("end_date")?.value;
    const role = localStorage.getItem("role");

    let url = `http://127.0.0.1:8000/api/metrics/?role=${role}&sort_by=${column}`;
    if (start_date) url += `&start_date=${start_date}`;
    if (end_date) url += `&end_date=${end_date}`;

    fetch(url)
        .then(res => res.json())
        .then(() => loadMetrics());
}

document.getElementById("filterBtn")?.addEventListener("click", loadMetrics);

if (document.getElementById("metricsTable")) {
    loadMetrics();
}
