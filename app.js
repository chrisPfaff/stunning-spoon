const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, () => console.log("Listening on 3000"));

process.on("SIGINT", () => {
  wss.clients.forEach((client) => {
    client.close();
  });
  server.close(() => {
    shutDownDB();
  });
});

//begin web socket server//

const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ server: server });

wss.on("connection", (ws) => {
  const numClients = wss.clients.size;
  console.log("Client connected. Total clients: " + numClients);

  wss.broadcast("New client connected. Total clients: " + numClients);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to the chat!");
  }
  db.run(`INSERT INTO visitors (count, time) 
 		VALUES (${numClients}, datetime('now')) 
  `);

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

// end web socket server //

// begin database //

const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");

db.serialize(() => {
  db.run(`
	CREATE TABLE visitors (
		count INTEGER,
		time TEXT
	)
	`);
});

function getCounts() {
  db.each(`SELECT * FROM visitors`, (err, row) => {
    console.log(row);
  });
}

function shutDownDB() {
  console.log("Shutting down database");
  getCounts();
}
