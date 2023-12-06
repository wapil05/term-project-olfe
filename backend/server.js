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

  socket.on("register", async (user) => {
    //console.log("Received register event:", user);

    if (!user.name || !user.email || !user.password) {
      return socket.emit("registerError", {
        message: "Please fill in all fields!",
      });
    }

    try {
      const existingUser = await getDataForRegistration(user.name, user.email);

      if (existingUser) {
        if (
          existingUser.name === user.name &&
          existingUser.email === user.email
        ) {
          return socket.emit("registerError", {
            message: "Username and email already in use!",
          });
        } else if (existingUser.name === user.name) {
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
      const userId = await addUser(user.name, user.email, user.password);
      // Setze die Benutzer-ID für diesen Socket
      socket.currentUserId = userId;
      socket.emit("registerSuccess", { userId });
    } catch (error) {
      console.log(error);
      socket.emit("registerError", { message: error.message });
    }
  });

  socket.on("login", async (loginData) => {
    try {
      const user = await getDataForLogin(
        loginData.usernameOrEmail,
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
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
