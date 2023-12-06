// server.js
const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");

const app = express();

app.use(cors());
app.use(bodyParser.json());
config();

const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Haltet die Liste der aktiven Lobbys im Server-Speicher
let activeLobbies = [];

io.on("connection", (socket) => {
  console.log("a user connected " + socket.id);

  // Sende alle aktiven Lobbys an den gerade verbundenen Benutzer
  socket.emit("activeLobbies", activeLobbies);

  socket.on("createLobby", (lobby) => {
    console.log("Received createLobby event:", lobby);

    // Füge die Lobby zur Liste der aktiven Lobbys hinzu
    activeLobbies.push(lobby);

    // Sende die aktualisierten Lobbys an alle Benutzer
    io.emit("activeLobbies", activeLobbies);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
