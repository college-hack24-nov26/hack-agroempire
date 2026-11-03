// =====================================
// KRUSHI DRISHTI - MAIN JAVASCRIPT & BACKEND INTEGRATION
// =====================================

// SPLASH SCREEN - AUTO CLOSE
const splashScreen = document.getElementById("splash-screen");

if (splashScreen) {
    setTimeout(() => {
        splashScreen.classList.add("hide");
        setTimeout(() => {
            splashScreen.remove();
        }, 500);
    }, 1000);
}

// 1. MOBILE NAVIGATION & USER SESSION CHECK
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");
const navCta = document.querySelector(".nav-cta");

// If logged in, update navigation CTA to point to Farmer Dashboard
const isLoggedIn = sessionStorage.getItem("krushiLoggedIn") === "true";
const savedUser = JSON.parse(localStorage.getItem("krushiUser") || "null");

if (navCta) {
    if (isLoggedIn && savedUser) {
        navCta.textContent = `👨‍🌾 ${savedUser.name.split(' ')[0]}'s Dashboard ↗`;
        navCta.href = "dashboard.html";
    } else {
        navCta.textContent = "Login / Register ↗";
        navCta.href = "login.html";
    }
}

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.textContent = isOpen ? "✕" : "☰";
        menuToggle.setAttribute("aria-expanded", isOpen);
    });
}

navItems.forEach(link => {
    link.addEventListener("click", () => {
        if (navLinks) navLinks.classList.remove("open");
        if (menuToggle) {
            menuToggle.textContent = "☰";
            menuToggle.setAttribute("aria-expanded", "false");
        }
        navItems.forEach(item => item.classList.remove("active"));
        link.classList.add("active");
    });
});


// 2. CROP IMAGE UPLOAD AND PREVIEW
const cropImage = document.getElementById("cropImage");
const cameraImage = document.getElementById("cameraImage");
const chooseBtn = document.getElementById("chooseBtn");
const cameraBtn = document.getElementById("cameraBtn");
const imagePreview = document.getElementById("imagePreview");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");
const analyzeBtn = document.getElementById("analyzeBtn");

let selectedCropImage = null;
let currentPreviewURL = null;

if (chooseBtn && cropImage) {
    chooseBtn.addEventListener("click", () => cropImage.click());
}

if (cameraBtn && cameraImage) {
    cameraBtn.addEventListener("click", () => cameraImage.click());
}

function handleCropUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image (JPEG/PNG/WEBP).");
        event.target.value = "";
        return;
    }

    if (file.size > 15 * 1024 * 1024) {
        alert("Image size should be below 15 MB.");
        event.target.value = "";
        return;
    }

    selectedCropImage = file;

    if (currentPreviewURL) {
        URL.revokeObjectURL(currentPreviewURL);
    }

    currentPreviewURL = URL.createObjectURL(file);
    if (imagePreview) {
        imagePreview.src = currentPreviewURL;
        imagePreview.style.display = "block";
    }

    if (uploadPlaceholder) {
        uploadPlaceholder.style.display = "none";
    }

    if (analyzeBtn) {
        analyzeBtn.disabled = false;
    }

    const res = document.getElementById("analysisResult");
    if (res) res.style.display = "none";
    const status = document.getElementById("analysisStatus");
    if (status) status.style.display = "none";
}

if (cropImage) cropImage.addEventListener("change", handleCropUpload);
if (cameraImage) cameraImage.addEventListener("change", handleCropUpload);


// 3. REAL AI CROP DISEASE ANALYSIS (Powered by Pl@ntNet & Krushi Doctor)
if (analyzeBtn) {
    analyzeBtn.addEventListener("click", async () => {
        if (!selectedCropImage) {
            alert("Please upload a crop image first.");
            return;
        }

        const status = document.getElementById("analysisStatus");
        const result = document.getElementById("analysisResult");
        const resultText = document.getElementById("resultText");
        const resultAdvice = document.getElementById("resultAdvice");

        if (result) result.style.display = "none";
        if (status) {
            status.style.display = "block";
            status.textContent = "🔬 Analyzing leaf image with Pl@ntNet Botanical Vision & Krushi Doctor AI...";
        }

        analyzeBtn.disabled = true;
        analyzeBtn.textContent = "Processing with AI...";

        const formData = new FormData();
        formData.append("image", selectedCropImage);
        formData.append("organ", "leaf");
        formData.append("language", "mr");

        try {
            const res = await fetch("/api/diagnose", {
                method: "POST",
                body: formData
            });

            const json = await res.json();

            if (json.success) {
                const data = json.data;

                if (status) {
                    status.style.display = "none";
                }

                if (result) {
                    result.style.display = "block";

                    let botanicalPrefix = "";
                    if (data.plantNet?.scientificName) {
                        botanicalPrefix = `[Botanical: ${data.plantNet.scientificName}] `;
                    }

                    if (resultText) {
                        resultText.innerHTML = `
                            <strong>${botanicalPrefix}${data.crop} (${data.crop_mr || ''})</strong><br>
                            Condition: <span style="color:#b91c1c; font-weight:700;">${data.diseaseDetected}</span> (${data.disease_mr || ''})<br>
                            Severity: <span style="font-weight:700;">${data.severity}</span> • Confidence: <strong>${Math.round(data.confidenceScore * 100)}%</strong>
                        `;
                    }

                    if (resultAdvice) {
                        const org = data.treatment?.organic?.mr || data.treatment?.organic?.en || "";
                        const chem = data.treatment?.chemical?.mr || data.treatment?.chemical?.en || "";
                        resultAdvice.innerHTML = `
                            <strong>🌱 जैविक उपाय (Organic):</strong> ${org}<br><br>
                            <strong>🧪 रासायनिक उपाय (Chemical):</strong> ${chem}
                        `;
                    }

                    result.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            } else {
                if (status) status.textContent = "❌ Analysis error: " + (json.error?.message || "Could not analyze image.");
            }
        } catch (error) {
            if (status) status.textContent = "❌ Server connection error. Please verify backend is running.";
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = "Analyze Crop →";
        }
    });
}


// 4. COMMUNITY REPORT SYSTEM (Powered by Firebase Realtime Database)
const reportForm = document.getElementById("reportForm");
const alertList = document.getElementById("alertList");
const alertCount = document.getElementById("alertCount");

// Fetch live community alerts from Firebase Realtime Database
async function fetchCommunityReports() {
    try {
        const res = await fetch("/api/community");
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
            displayReports(json.data);
            return;
        }
    } catch (e) {
        console.warn("Using offline cached reports:", e.message);
    }

    // Fallback to local storage if offline
    try {
        const localData = JSON.parse(localStorage.getItem("krushiReports") || "[]");
        displayReports(localData);
    } catch (_) {
        displayReports([]);
    }
}

// Submit Disease Report to Firebase RTDB
if (reportForm) {
    reportForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const farmer = document.getElementById("farmerName").value.trim();
        const crop = document.getElementById("cropName").value;
        const disease = document.getElementById("diseaseName").value.trim();
        const village = document.getElementById("villageName").value.trim();
        const radius = document.getElementById("radius").value;
        const submitBtn = reportForm.querySelector(".form-submit");

        if (!farmer || !crop || !disease || !village) {
            alert("Please complete all required fields.");
            return;
        }

        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Broadcasting Alert to Firebase...";

        const payload = {
            authorName: farmer,
            district: village,
            category: "Crop Alert",
            title: `⚠️ ${crop} - ${disease} reported in ${village}`,
            content: `Farmer ${farmer} reported suspected ${disease} on ${crop} in ${village}. Farms within ${radius} KM are advised to inspect their fields.`
        };

        try {
            const res = await fetch("/api/community", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const json = await res.json();

            if (json.success) {
                alert(`✅ Alert Broadcasted!\nYour crop disease report for ${crop} has been saved to Firebase Realtime Database and broadcasted to nearby farmers.`);
                reportForm.reset();
                fetchCommunityReports();
            } else {
                alert("❌ Failed to broadcast report: " + (json.error?.message || "Error"));
            }
        } catch (err) {
            alert("❌ Connection error while sending report.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// 5. RENDER COMMUNITY ALERTS
function displayReports(reports = []) {
    if (!alertList || !alertCount) return;

    alertList.innerHTML = "";
    alertCount.textContent = `${reports.length} ${reports.length === 1 ? "Report" : "Reports"}`;

    if (reports.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-alert";
        empty.innerHTML = `
            <span>🌱</span>
            <h3>No reports yet</h3>
            <p>Community reports saved in Firebase RTDB will appear here.</p>
        `;
        alertList.appendChild(empty);
        return;
    }

    reports.forEach(report => {
        const card = document.createElement("div");
        card.className = "alert-card";

        const title = report.title || `⚠️ ${report.crop || 'Crop'} - ${report.disease || 'Disease Alert'}`;
        const location = report.district ? `Location: ${report.district}` : (report.village ? `Village: ${report.village}` : "Maharashtra");
        const author = report.authorName ? `Reported by: ${report.authorName}` : "Local Farmer";
        const dateStr = report.timestamp ? new Date(report.timestamp).toLocaleDateString() : (report.date || "Today");

        card.innerHTML = `
            <h4>${title}</h4>
            <p>${report.content || (location + ' | Active alert')}</p>
            <p><small style="color:#64748b;">${author} • ${dateStr}</small></p>
            <span class="alert-status">Verified Community Alert</span>
        `;

        alertList.appendChild(card);
    });
}

// 6. LIVE AGRO-WEATHER UPDATES
async function loadLiveWeather() {
    const weatherGrid = document.querySelector(".weather-grid");
    if (!weatherGrid) return;

    try {
        const res = await fetch("/api/weather");
        const json = await res.json();

        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            weatherGrid.innerHTML = json.data.map(w => `
                <div class="weather-card">
                    <span>${w.rainProbabilityPercent > 40 ? '🌧️' : '☀️'}</span>
                    <h3>${w.district}, ${w.state} (${w.temperatureC}°C)</h3>
                    <p><strong>${w.condition}</strong><br>Humidity: ${w.humidityPercent}% • Rain Prob: ${w.rainProbabilityPercent}%</p>
                    <p style="color:#059669; font-weight:600; margin-top:8px;">
                        ${w.sprayAdvisory?.suitableForSpraying ? '✅ Safe to Spray Pesticides' : '⚠️ Postpone Spraying'}
                    </p>
                </div>
            `).join('');
        }
    } catch (_) {}
}

// 7. INITIALIZE DATA ON LOAD
fetchCommunityReports();
loadLiveWeather();

// 8. NAVIGATION SCROLL HIGHLIGHT
const sections = document.querySelectorAll("main section[id]");
window.addEventListener("scroll", () => {
    let currentSection = "home";
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            currentSection = section.id;
        }
    });

    navItems.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + currentSection) {
            link.classList.add("active");
        }
    });
});
