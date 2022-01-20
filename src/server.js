const express = require('express');
const app = express();
require("dotenv").config({ path: "./config.env" });
const http = require('http');
const path = require("path");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});
const port = process.env.PORT || 9000;

io.on('connection', (socket) => {
  // console.log('a user connected, '+socket.id);
  require('./tic-tac-toe/game.js')(socket, io);
  return io;
});

if(process.env.NODE_ENV === "production"){
  console.log("iosdn");
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  // app.use(express.static(path.join(__dirname, '../frontend/public')));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"))
    // res.sendFile(path.join(__dirname, "../frontend", "public", "index.html"))
  })
}
else{
  app.get("/", (req, res) => {
    console.log(process.env.NODE_ENV)
    res.send("api running");
  })
}

server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});

