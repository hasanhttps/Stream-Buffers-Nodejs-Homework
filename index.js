const fs = require("fs");
const path = require("path");
const http = require("http");
const { parse } = require("url");

const itemarray = ["1132", "12323", "543", "78"];

const logFilePath = path.join(__dirname, "logs/app.log");
const maxLogSize = 5 * 1024 * 1024; // 5 MB

const server = http.createServer((req, res) => {

    const { method, url } = req;
    res.setHeader("Content-Type", "application/json");

    switch (method){
        case "POST":
            if (url.startsWith("/products/")){
                const id = url.split("/")[2];

                const isinclude = itemarray.includes(id);
                let body = "";
                req.on("data", (chunk) => {
                    body += chunk.toString();
                });

                req.on("end", () => {
                    res.statusCode = 200;
                    if (isinclude){
                        res.end(
                            JSON.stringify({
                                message: id
                            })
                        )
                    }
                    else{
                        res.end(
                            JSON.stringify({
                                message: "Look at the logs located in logs/app.log file."
                            })
                        )

                        const timestamp = new Date().toISOString();
                        const logMessage = `Error: Item with id:[${id}] doesn't exist, ${timestamp}\n`;

                        fs.appendFile(logFilePath, logMessage, (err) => {
                            if (err) {
                                console.error("Error writing to log file", err);
                            }
                        });
                    }
                })
            }
            break;
    }
});

const port = 3000;

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
})