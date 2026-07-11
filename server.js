const http = require("http");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

const emitter = new EventEmitter();

const port = 3000;
let visitCount = 0;

let intervalId;
let timeoutId;

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

const server = http.createServer((req, res) => {

    emitter.emit("requestReceived", req.url);

    let filePath;

    if (req.url === "/") {
        filePath = "./index.html";
    } else {
        filePath = "." + req.url;
    }

    let ext = path.extname(filePath);
    let contentType;

    switch (ext) {
        case ".html":
            contentType = "text/html";
            break;

        case ".css":
            contentType = "text/css";
            break;

        case ".js":
            contentType = "application/javascript";
            break;

        case ".png":
            contentType = "image/png";
            break;

        case ".jpg":
        case ".jpeg":
            contentType = "image/jpeg";
            break;

        case ".gif":
            contentType = "image/gif";
            break;

        default:
            contentType = "text/plain";
    }

    fs.readFile(filePath, (err, data) => {

        if (err) {

            emitter.emit("fileNotFound", filePath);

            res.writeHead(404, {
                "Content-Type": "text/html"
            });

            res.end("<h1>404 - File Not Found</h1>");

            emitter.emit("responseSent");

        } else {

            emitter.emit("fileServed", filePath);

            res.writeHead(200, {
                "Content-Type": contentType
            });

            res.end(data);

            emitter.emit("responseSent");
        }

    });

});

console.log("Server will start after 5 seconds...");

timeoutId = setTimeout(() => {

    server.listen(port, () => {

        emitter.emit("serverStarted");

        console.log(`Server running at http://localhost:${port}`);

        intervalId = setInterval(() => {

            console.log("Server Status : Running");
            console.log("Current Visitors :", visitCount);

        }, 5000);

    });

}, 5000);

// Uncomment this line if you want to cancel the server start
// clearTimeout(timeoutId);

setTimeout(() => {

    console.log("30 Seconds Completed");

    clearInterval(intervalId);

    console.log("Interval Stopped");

    server.close(() => {

        console.log("==================================");
        console.log(" Server Stopped Successfully ");
        console.log("==================================");

    });

}, 30000);
