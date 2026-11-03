// =====================================
// KRUSHI DRISHTI - FARMER DASHBOARD SCRIPT
// =====================================

const loggedIn = sessionStorage.getItem("krushiLoggedIn");

if (loggedIn !== "true") {
    alert("Please login to access your Farmer Dashboard.");
    window.location.href = "login.html";
}

const user = JSON.parse(
    localStorage.getItem("krushiUser") || "null"
);

if (user) {
    if (document.getElementById("farmerName")) document.getElementById("farmerName").textContent = user.name || "Farmer";
    if (document.getElementById("profileName")) document.getElementById("profileName").textContent = user.name || "-";
    if (document.getElementById("profileEmail")) document.getElementById("profileEmail").textContent = user.email || "-";
    if (document.getElementById("profilePhone")) document.getElementById("profilePhone").textContent = user.phone || "-";
    if (document.getElementById("profileVillage")) document.getElementById("profileVillage").textContent = user.village || "-";
    if (document.getElementById("profileState")) document.getElementById("profileState").textContent = user.state || "Maharashtra";
}

// Check Backend & Firebase Realtime Database Status
fetch("/api/health")
    .then(r => r.json())
    .then(data => {
        const pill = document.getElementById("backendStatusPill");
        if (pill) {
            if (data.success && data.database?.connected) {
                pill.style.background = "#dcfce7";
                pill.style.color = "#166534";
                pill.textContent = `🟢 Firebase RTDB Online (${data.database.latencyMs}ms)`;
            } else {
                pill.style.background = "#fef3c7";
                pill.style.color = "#b45309";
                pill.textContent = "🟡 Offline Cache Active";
            }
        }
    })
    .catch(() => {
        const pill = document.getElementById("backendStatusPill");
        if (pill) {
            pill.style.background = "#fee2e2";
            pill.style.color = "#b91c1c";
            pill.textContent = "🔴 Server Offline";
        }
    });

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
        sessionStorage.removeItem("krushiLoggedIn");
        alert("You have been logged out.");
        window.location.href = "login.html";
    });
}
