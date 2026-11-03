// =====================================
// KRUSHI DRISHTI - CROP DISEASE DETECTION & PL@NTNET AI
// =====================================

const galleryInput = document.getElementById("galleryInput");
const cropPreview = document.getElementById("cropPreview");
const previewMessage = document.getElementById("previewMessage");

const analyzeBtn = document.getElementById("analyzeCropBtn");
const cropType = document.getElementById("cropType");
const advisoryLang = document.getElementById("advisoryLang");
const resultBox = document.getElementById("analysisResult");
const resultText = document.getElementById("resultText");
const severityBadge = document.getElementById("severityBadge");
const botanicalInfo = document.getElementById("botanicalInfo");
const treatmentDetails = document.getElementById("treatmentDetails");

const openCamera = document.getElementById("openCamera");
const cameraBox = document.getElementById("cameraBox");
const cameraVideo = document.getElementById("cameraVideo");
const cameraCanvas = document.getElementById("cameraCanvas");
const capturePhoto = document.getElementById("capturePhoto");
const closeCamera = document.getElementById("closeCamera");

const imageActions = document.getElementById("imageActions");
const changeImageBtn = document.getElementById("changeImageBtn");
const removeImageBtn = document.getElementById("removeImageBtn");

let selectedCropImage = null;
let cameraStream = null;

// 1. Check Pl@ntNet API Status on Load
fetch("/api/diagnose/plantnet-status")
    .then(r => r.json())
    .then(data => {
        const pill = document.getElementById("plantnetStatusPill");
        if (pill && data.success && data.data?.online) {
            const quota = data.data.remainingRequests !== null && data.data.remainingRequests !== undefined
                ? ` (${data.data.remainingRequests} calls left)`
                : "";
            pill.textContent = `🌿 Pl@ntNet AI Active${quota}`;
        }
    })
    .catch(() => {});

// 2. Display Crop Image
function showCropImage(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please select a valid image (JPEG/PNG).");
        return;
    }

    selectedCropImage = file;

    cropPreview.src = URL.createObjectURL(file);
    cropPreview.style.display = "block";
    previewMessage.style.display = "none";
    imageActions.style.display = "flex";
    resultBox.style.display = "none";
}

// 3. Camera Controls
openCamera.addEventListener("click", async function () {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        cameraVideo.srcObject = cameraStream;
        cameraBox.style.display = "block";
        cameraBox.scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        alert("Camera could not start: " + error.message);
    }
});

capturePhoto.addEventListener("click", function () {
    cameraCanvas.width = cameraVideo.videoWidth || 640;
    cameraCanvas.height = cameraVideo.videoHeight || 480;

    const context = cameraCanvas.getContext("2d");
    context.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);

    cameraCanvas.toBlob(function (blob) {
        if (!blob) return;

        const photo = new File([blob], "crop-leaf-photo.jpg", {
            type: "image/jpeg"
        });

        showCropImage(photo);
        stopCamera();
    }, "image/jpeg", 0.9);
});

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    cameraVideo.srcObject = null;
    cameraBox.style.display = "none";
}

closeCamera.addEventListener("click", stopCamera);
window.addEventListener("beforeunload", stopCamera);

galleryInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
        showCropImage(this.files[0]);
    }
});

// Change Image
changeImageBtn.addEventListener("click", function () {
    const chooseCamera = confirm("Click OK to use Camera, or Cancel to choose from Gallery.");
    if (chooseCamera) {
        openCamera.click();
    } else {
        galleryInput.click();
    }
});

// Remove Image
removeImageBtn.addEventListener("click", function () {
    selectedCropImage = null;
    cropPreview.src = "";
    cropPreview.style.display = "none";
    previewMessage.style.display = "block";
    imageActions.style.display = "none";
    galleryInput.value = "";
    resultBox.style.display = "none";
});

// 4. Real AI Diagnosis with Backend & Pl@ntNet API
analyzeBtn.addEventListener("click", async function () {
    if (!selectedCropImage) {
        alert("Please capture or upload a crop leaf image first.");
        return;
    }

    const originalBtnText = analyzeBtn.textContent;
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "⏳ Analyzing with Pl@ntNet AI & Krushi Doctor...";

    const currentUser = JSON.parse(localStorage.getItem("krushiUser") || "null");
    const farmerId = currentUser?.id || "guest_farmer";
    const lang = advisoryLang?.value || "mr";
    const chosenCrop = cropType.value || "";

    const formData = new FormData();
    formData.append("image", selectedCropImage);
    if (chosenCrop) formData.append("crop", chosenCrop);
    formData.append("language", lang);
    formData.append("farmerId", farmerId);
    formData.append("organ", "leaf");

    try {
        const res = await fetch("/api/diagnose", {
            method: "POST",
            body: formData
        });

        const json = await res.json();

        if (json.success) {
            const data = json.data;

            // Severity Badge
            severityBadge.className = `severity-badge severity-${data.severity}`;
            severityBadge.textContent = data.severity;

            // Pl@ntNet Botanical classification
            if (data.plantNet) {
                botanicalInfo.style.display = "block";
                botanicalInfo.innerHTML = `
                    🌿 <strong>Pl@ntNet Botanical Match:</strong> <em>${data.plantNet.scientificName}</em>
                    (Family: ${data.plantNet.family || 'N/A'}, Genus: ${data.plantNet.genus || 'N/A'})
                    • Confidence: <strong>${Math.round((data.plantNet.score || 0) * 100)}%</strong>
                `;
            } else {
                botanicalInfo.style.display = "none";
            }

            // Localized summaries
            const langKey = lang;
            const organicRec = data.treatment?.organic?.[langKey] || data.treatment?.organic?.en || "Apply bio-fungicides.";
            const chemicalRec = data.treatment?.chemical?.[langKey] || data.treatment?.chemical?.en || "Apply recommended fungicide.";
            const prevRec = data.treatment?.prevention?.[langKey] || data.treatment?.prevention?.en || "Maintain clean field.";

            resultText.innerHTML = `
                🌾 Crop: <strong>${data.crop}</strong> (${data.crop_mr || ''})<br>
                🔍 Detected Condition: <span style="color:#b91c1c;">${data.diseaseDetected}</span> (${data.disease_mr || ''})<br>
                📊 Diagnostic Confidence: <strong>${Math.round(data.confidenceScore * 100)}%</strong>
            `;

            treatmentDetails.innerHTML = `
                <div class="treatment-card">
                    <h4>🌱 Organic Treatment (जैविक उपाय)</h4>
                    <p>${organicRec}</p>
                </div>
                <div class="treatment-card">
                    <h4>🧪 Chemical Treatment (रासायनिक उपाय)</h4>
                    <p>${chemicalRec}</p>
                </div>
                <div class="treatment-card">
                    <h4>🛡️ Prevention & Care (प्रतिबंधक उपाय)</h4>
                    <p>${prevRec}</p>
                </div>
            `;

            resultBox.style.display = "block";
            resultBox.scrollIntoView({ behavior: "smooth", block: "center" });

        } else {
            alert("❌ Diagnosis Error:\n" + (json.error?.message || "Could not analyze the image."));
        }
    } catch (err) {
        alert("❌ Network Error:\nCould not connect to the diagnosis server.");
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = originalBtnText;
    }
});
