const http = require("http");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");
const querystring = require("querystring");
const connectDB = require("./db");

const emitter = new EventEmitter();

const port = 3000;
let visitCount = 0;
let intervalId;

emitter.once("serverStarted", () => {
    console.log("==================================");
    console.log(" Server Started Successfully ");
    console.log("==================================");
});

emitter.on("requestReceived", (url) => {
    visitCount++;
    console.log(`Request Received : ${url}`);
    console.log(`Total Visitors   : ${visitCount}`);
});

emitter.on("fileServed", (file) => {
    console.log(`File Served      : ${file}`);
});

emitter.on("fileNotFound", (file) => {
    console.log(`File Not Found   : ${file}`);
});

emitter.on("responseSent", () => {
    console.log("Response Sent Successfully");
    console.log("----------------------------------");
});

const server = http.createServer(async (req, res) => {
    emitter.emit("requestReceived", req.url);

    // -------- POST /contact (save to MongoDB) --------
    if (req.method === "POST" && req.url === "/contact") {
        let body = "";
        req.on("data", chunk => { body += chunk.toString(); });
        req.on("end", async () => {
            const formData = querystring.parse(body);
            try {
                const db = await connectDB();
                await db.collection("contacts").insertOne({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    createdAt: new Date()
                });
                console.log("✅ Contact Saved Successfully");
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end("<h2>Thank You! Your message has been sent successfully.</h2>");
            } catch (err) {
                console.error("❌ Database error:", err);
                res.writeHead(500, { "Content-Type": "text/html" });
                res.end("<h2>Database Error – please try again later.</h2>");
            }
        });
        return;
    }

    // -------- Serve static files (with correct security) --------
    let filePath;
    if (req.url === "/") {
        filePath = "./index.html";
    } else {
        const cleanUrl = req.url.split("?")[0];
        filePath = "." + cleanUrl;
    }

    // 🔒 Security: ensure the resolved path is inside the current directory
    const absolutePath = path.resolve(filePath);
    const currentDir = process.cwd();
    if (!absolutePath.startsWith(currentDir)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.stat(absolutePath, (statErr, stats) => {
        if (!statErr && stats.isDirectory()) {
            // Try index.html inside the directory
            const indexPath = path.join(absolutePath, "index.html");
            fs.stat(indexPath, (idxErr) => {
                if (!idxErr) serveFile(indexPath);
                else serve404();
            });
            return;
        } else if (statErr) {
            // File doesn't exist – try adding .html
            const ext = path.extname(absolutePath);
            if (!ext) {
                const withHtml = absolutePath + ".html";
                fs.stat(withHtml, (htmlErr) => {
                    if (!htmlErr) serveFile(withHtml);
                    else serve404();
                });
                return;
            } else {
                serve404();
                return;
            }
        }
        // It's a file – serve it
        serveFile(absolutePath);
    });

    function serveFile(filePath) {
        const ext = path.extname(filePath);
        let contentType = "text/plain";
        switch (ext) {
            case ".html": contentType = "text/html"; break;
            case ".css":  contentType = "text/css"; break;
            case ".js":   contentType = "application/javascript"; break;
            case ".png":  contentType = "image/png"; break;
            case ".jpg":
            case ".jpeg": contentType = "image/jpeg"; break;
            case ".gif":  contentType = "image/gif"; break;
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                emitter.emit("fileNotFound", filePath);
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>404 - File Not Found</h1>");
                emitter.emit("responseSent");
            } else {
                emitter.emit("fileServed", filePath);
                res.writeHead(200, { "Content-Type": contentType });
                res.end(data);
                emitter.emit("responseSent");
            }
        });
    }

    function serve404() {
        emitter.emit("fileNotFound", filePath);
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 - File Not Found</h1>");
        emitter.emit("responseSent");
    }
});

// -------- Start server (after 5 seconds) --------
console.log("Server will start after 5 seconds...");
setTimeout(() => {
    server.listen(port, () => {
        emitter.emit("serverStarted");
        console.log(`🚀 Server running at http://localhost:${port}`);
        intervalId = setInterval(() => {
            console.log(`Server Status : Running | Visitors: ${visitCount}`);
        }, 5000);
    });
}, 5000);

// Graceful shutdown
process.on("SIGINT", () => {
    clearInterval(intervalId);
    server.close(() => {
        console.log("\n🛑 Server stopped gracefully.");
        process.exit(0);
    });
});
