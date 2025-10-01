document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#metricsTable tbody");
    const logoutBtn = document.getElementById("logoutBtn");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");
    const applyFilterBtn = document.getElementById("applyFilter");
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");
    const tableHeaders = document.querySelectorAll("#metricsTable th");

    let currentPage = 1;
    const PAGE_SIZE = 20;
    let currentSort = "";
    let sortOrder = "asc";
    const role = localStorage.getItem("role") || "user";

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("role");
        window.location.href = "login.html";
    });

    applyFilterBtn.addEventListener("click", () => {
        currentPage = 1;
        loadMetrics();
    });

    tableHeaders.forEach(th => {
        th.addEventListener("click", () => {
            const column = th.dataset.column;
            if (currentSort === column) {
                sortOrder = sortOrder === "asc" ? "desc" : "asc";
            } else {
                currentSort = column;
                sortOrder = "asc";
            }
            currentPage = 1;
            loadMetrics();
        });
    });

    async function loadMetrics() {
        const role = localStorage.getItem("role");
        if (!role) {
            window.location.href = "login.html";
            return;
        }

        const start_date = startDateInput?.value;
        const end_date = endDateInput?.value;

        let url = `http://127.0.0.1:8000/api/metrics/?role=${role}&page=${currentPage}&page_size=${PAGE_SIZE}`;
        if (start_date) url += `&start_date=${start_date}`;
        if (end_date) url += `&end_date=${end_date}`;
        if (currentSort) url += `&sort_by=${currentSort}&sort_order=${sortOrder}`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            const metrics = data.metrics;

            tableBody.innerHTML = "";

            if (!metrics || metrics.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='10'>Nenhum dado encontrado</td></tr>";
                pageInfo.innerText = "";
                return;
            }

            metrics.forEach(row => {
                const tr = document.createElement("tr");
                Object.keys(row).forEach(h => {
                    const td = document.createElement("td");
                    td.innerText = row[h];
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });

            pageInfo.innerText = `Página ${data.page} de ${Math.ceil(data.total / data.page_size)}`;

        } catch (err) {
            console.error("Erro ao carregar métricas:", err);
            tableBody.innerHTML = "<tr><td colspan='10'>Erro ao carregar métricas</td></tr>";
            pageInfo.innerText = "";
        }
    }

    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            loadMetrics();
        }
    });

    nextPageBtn.addEventListener("click", () => {
        currentPage++;
        loadMetrics();
    });

    loadMetrics();
});
