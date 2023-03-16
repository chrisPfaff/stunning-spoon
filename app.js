const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, () => console.log("Listening on 3000"));

const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ server: server });

wss.on("connection", (ws) => {
  const numClients = wss.clients.size;
  console.log("Client connected. Total clients: " + numClients);

  wss.broadcast("New client connected. Total clients: " + numClients);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to the chat!");
  }

  ws.on("close", () => {
    wss.broadcast("New client connected. Total clients: " + numClients);
    console.log("Client disconnected");
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
