const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");
const bodyParser = require("body-parser");
const http = require('http'); // Importiere das http-Modul für die Verwendung mit Socket.IO
const socketSetup = require('./socketSetup'); // Passe den Pfad entsprechend an

const userRoutes = require("./routes/userRoutes.js");

config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(userRoutes);
app.use(express.json());

const server = http.createServer(app); // Erstelle einen HTTP-Server mit deiner Express-App

// Füge Socket.IO hinzu
socketSetup(server); // Verbinde Socket.IO mit dem Server

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
