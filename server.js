// ==========================================
// KRUSHI DRISHTI — Local Dev Server + Vercel Function Simulator
//
// Usage:  node server.js
// Open:   http://localhost:3000/test-plantnet.html
// ==========================================

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 3000;
const STATIC_DIR = __dirname;
const plantnetHandler = require("./api/plantnet.js");

const MIME_TYPES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};

const server = http.createServer(async function (req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Simulate Vercel helper methods res.status() and res.json()
    res.status = function (code) {
        res.statusCode = code;
        return res;
    };
    res.json = function (obj) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(obj));
        return res;
    };

    // Route /api/plantnet to the Vercel function
    if (pathname === "/api/plantnet" || pathname === "/api/plantnet/") {
        let bodyBuffer = [];
        req.on("data", chunk => bodyBuffer.push(chunk));
        req.on("end", async () => {
            const rawBody = Buffer.concat(bodyBuffer).toString();
            if (rawBody) {
                try {
                    req.body = JSON.parse(rawBody);
                } catch (e) {
                    req.body = rawBody;
                }
            }
            await plantnetHandler(req, res);
        });
        return;
    }

    // Static file serving
    let filePath = pathname === "/" ? "/index.html" : pathname;
    filePath = path.join(STATIC_DIR, filePath);

    if (!filePath.startsWith(STATIC_DIR)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeType = MIME_TYPES[ext] || "application/octet-stream";

    fs.readFile(filePath, function (err, data) {
        if (err) {
            if (err.code === "ENOENT") {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>404 Not Found</h1><p>" + pathname + "</p>");
            } else {
                res.writeHead(500);
                res.end("Server Error");
            }
            return;
        }

        res.writeHead(200, { "Content-Type": mimeType });
        res.end(data);
    });
});

server.listen(PORT, function () {
    console.log("");
    console.log("  🌱 Krushi Drishti Dev Server running!");
    console.log("  ────────────────────────────────────");
    console.log("  Local:   http://localhost:" + PORT);
    console.log("  Test:    http://localhost:" + PORT + "/test-plantnet.html");
    console.log("  App:     http://localhost:" + PORT + "/disease-detection.html");
    console.log("");
    console.log("  Vercel Serverless Function ready at /api/plantnet");
    console.log("");
});
