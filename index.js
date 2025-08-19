const http = require("http")

const server = http.createServer((req, res) => {

    res.write("Holaaa, soy Mela.")
    res.end();
})

server.listen((3000), () => {
    console.log("Server is Running");
})