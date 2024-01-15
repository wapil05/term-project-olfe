// server.js
const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const bcrypt = require("bcrypt");

const {
  getDataForRegistration,
  getDataForLogin,
  addUser,
} = require("./db/dbFunctions");

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
let activeRooms = new Set();

io.on("connection", (socket) => {
  console.log("user connected " + socket.id);

  socket.emit("activeLobbies", activeLobbies);

  socket.on("createLobby", (lobby) => {
    let trimmedLobbyName = lobby.name.trim();
    socket.join(trimmedLobbyName);
    console.log(`Client ${socket.id} created room ${trimmedLobbyName}`);
    activeRooms.add(trimmedLobbyName);
    console.log(activeRooms);
    console.log("Received createLobby event:", trimmedLobbyName);

    activeLobbies.push(lobby);

    io.emit("activeLobbies", activeLobbies);
  });

  socket.on("joinLobby", (lobbyName, player2) => {
    console.log("Received joinLobby event:", lobbyName, player2);

    const lobby = activeLobbies.find((lobby) => lobby.name === lobbyName);

    if (!lobby) {
      return socket.emit("joinLobbyError", {
        message: "Lobby does not exist!",
      });
    } else if (lobby.player2) {
      return socket.emit("joinLobbyError", {
        message: "Lobby is already full!",
      });
    } else {
      lobby.player2 = player2;
      io.emit("activeLobbies", activeLobbies);
      socket.join(lobbyName);
      console.log(`Client ${socket.id} joined room ${lobbyName}`);
    }
  });

  socket.on("startGameRequest", (data) => {
    console.log("Lobby Name: ", data.lobbyName);
    // io.emit("startGame", data);
    io.to(data.lobbyName).emit("startGame", data);
    console.log(activeRooms);
    //socket.emit("startGame", data);
    // console.log("start event emitted");
  });

  socket.on("register", async (user) => {
    //console.log("Received register event:", user);

    if (!user.username || !user.email || !user.password) {
      return socket.emit("registerError", {
        message: "Please fill in all fields!",
      });
    }

    try {
      const existingUser = await getDataForRegistration(
        user.username,
        user.email
      );

      if (existingUser) {
        if (
          existingUser.name === user.username &&
          existingUser.email === user.email
        ) {
          return socket.emit("registerError", {
            message: "Username and email already in use!",
          });
        } else if (existingUser.name === user.username) {
          return socket.emit("registerError", {
            message: "Username already in use!",
          });
        } else if (existingUser.email === user.email) {
          return socket.emit("registerError", {
            message: "Email already in use!",
          });
        }
      }

      // Hinzufügen des neuen Benutzers
      const userId = await addUser(user.username, user.email, user.password);
      // Setze die Benutzer-ID für diesen Socket
      socket.currentUserId = userId;
      socket.emit("registerSuccess", { userId });
    } catch (error) {
      console.log(error);
      socket.emit("registerError", { message: error.message });
    }
  });

  socket.on("readyClicked", (lobbyName) => {
    console.log("Received readyClicked event:", lobbyName);
    socket.to(lobbyName).emit("readyClicked");
  });

  socket.on("login", async (loginData) => {
    try {
      const user = await getDataForLogin(
        loginData.username,
        loginData.password
      );

      bcrypt.compare(loginData.password, user.password, (err, result) => {
        if (err) {
          return socket.emit("loginError", {
            message: "Internal Server Error",
          });
        }
        if (result) {
          socket.currentUserId = user.id;
          return socket.emit("loginSuccess", { userId: user.id });
        } else {
          return socket.emit("loginError", {
            message: "Username or password incorrect!",
          });
        }
      });
    } catch (error) {
      return socket.emit("loginError", { message: error.message });
    }
  });

  socket.on("player2Ready", ({ lobbyName, isReady }) => {
    socket.to(lobbyName).emit("player2Ready", isReady);
  });

  socket.on("selectedOptionChanged", (data) => {
    socket
      .to(data.lobbyName)
      .emit("selectedOptionChanged", data.selectedOption);
    console.log(
      "selectedOptionChanged event emitted " + data.selectedOption,
      data.lobbyName
    );
  });

  socket.on(
    "selectedSymbolChanged",
    ({ lobbyName, activePlayer, selectedSymbol }) => {
      socket.to(lobbyName).emit("selectedSymbolChanged", {
        activePlayer,
        selectedSymbol,
      });
    }
  );

  socket.on("disconnect", () => {
    console.log("user disconnected " + socket.id);
    for (const room of socket.rooms) {
      activeRooms.delete(room);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
