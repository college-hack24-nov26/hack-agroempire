// ============================================================================
// KRUSHI DRISHTI — FIREBASE CLOUD MESSAGING (FCM) SERVICE WORKER
// Receives background push notifications when website is closed or in background
// ============================================================================

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Initialize Firebase inside the Service Worker
firebase.initializeApp({
    apiKey: "AIzaSyAo_BSV7OVTAuAf_pI8LlCNV0MSMSIINMI",
    authDomain: "krushi-drishti.firebaseapp.com",
    databaseURL: "https://krushi-drishti-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "krushi-drishti",
    storageBucket: "krushi-drishti.firebasestorage.app",
    messagingSenderId: "525076030261",
    appId: "1:525076030261:web:5ffe73877d3b4f4a19627c"
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage(function (payload) {
    console.log("[firebase-messaging-sw.js] Received background message: ", payload);

    const title = payload.notification ? payload.notification.title : "⚠️ Crop Disease Alert!";
    const body = payload.notification ? payload.notification.body : "A new disease was reported in your village.";
    const icon = payload.notification && payload.notification.icon ? payload.notification.icon : "/images/leaf-icon.png";

    const notificationOptions = {
        body: body,
        icon: icon,
        badge: icon,
        data: payload.data || {},
        vibrate: [200, 100, 200]
    };

    self.registration.showNotification(title, notificationOptions);
});

// Click notification event -> opens Dashboard
self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url.includes("dashboard.html") && "focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow("/dashboard.html");
            }
        })
    );
});

