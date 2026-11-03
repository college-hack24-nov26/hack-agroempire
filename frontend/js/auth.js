// =====================================
// KRUSHI DRISHTI - REAL FIREBASE RTDB AUTHENTICATION
// =====================================

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

// 1. Farmer Registration (Stores in Firebase Realtime Database)
if (registerForm) {
    registerForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const submitBtn = registerForm.querySelector("button[type='submit']");
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Creating Account in Firebase...";

        const payload = {
            name: document.getElementById("regName").value.trim(),
            email: document.getElementById("regEmail").value.trim().toLowerCase(),
            phone: document.getElementById("regPhone").value.trim(),
            password: document.getElementById("regPassword").value,
            village: document.getElementById("regVillage").value.trim(),
            state: "Maharashtra"
        };

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (result.success) {
                // Save profile details locally
                localStorage.setItem("krushiUser", JSON.stringify(result.data));
                alert("✅ Registration successful!\nYour farmer account has been created in Firebase Realtime Database. Please login.");
                window.location.href = "login.html";
            } else {
                alert("❌ Registration Error:\n" + (result.error?.message || "Registration failed."));
            }
        } catch (error) {
            alert("❌ Connection Error:\nCould not reach the server. Please ensure the backend is running.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// 2. Farmer Login (Validates against Firebase Realtime Database)
if (loginForm) {
    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const submitBtn = loginForm.querySelector("button[type='submit']");
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Validating with Firebase...";

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const result = await res.json();

            if (result.success) {
                // Store active farmer session
                sessionStorage.setItem("krushiLoggedIn", "true");
                localStorage.setItem("krushiUser", JSON.stringify(result.data));

                alert(`✅ Welcome back, ${result.data.name}!\nLogged into Krushi Drishti.`);
                window.location.href = "dashboard.html";
            } else {
                alert("❌ Login Failed:\n" + (result.error?.message || "Invalid credentials. Please register first."));
            }
        } catch (error) {
            alert("❌ Connection Error:\nCould not reach the server. Please check your network or server status.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}
