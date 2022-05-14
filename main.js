const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const colors = require("colors");
const ejs = require("ejs");

const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use("/assets", express.static("assets"));

app.get("/", (req, res) => {
  res.render("index", { nombre: "Ortega" });
});

io.on("connection", (socket) => {

  console.log(colors.rainbow("New connection established"));

});

server.listen(80, () => {
  console.log(colors.green("Local development server running..."));
});

