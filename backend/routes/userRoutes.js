const { addUser, getAllUsers, deleteUser, getDataForLogin, getDataForRegistration, addWin, addLoss, addRoundWin, addRoundLoss, addFlawlessVictory } = require("../db/dbFunctions");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const socketIO = require('socket.io-client');
const socket = socketIO('http://localhost:3000'); // Verbindung zum Socket-Server herstellen, anpassen, wenn nötig


router.post("/addUser", async (req, res) => {
  const { name, email, password, wins, losses, roundsWon, roundsLost, flawlessVictories } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, E-Mail und Passwort erforderlich" });
  }

  try {
    const userId = await addUser(name, email, password, wins, losses, roundsWon, roundsLost, flawlessVictories);
    res.json({ message: "Benutzer wurde hinzugefügt", userId });

    // Sende ein Event an den Socket, um das Hinzufügen eines Benutzers zu signalisieren
    socket.emit('userAdded', { name, email }); // Hier könntest du Daten übertragen, die du an den Client senden möchtest
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Hinzufügen des Benutzers" });
  }
});


// FÜr das Abrufen aller Users
router.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Abrufen der Benutzer" });
  }
});


// Für das Löschen eines Users mit der jeweiligen ID
router.delete("/deleteUser/:id", async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "Benutzer-ID erforderlich" });
  }

  try {
    const result = await deleteUser(userId);
    if (result.deletedUserId > 0) {
      res.json({
        message: "Benutzer und zugehörige Verlaufseinträge wurden gelöscht",
      });
    } else {
      res.status(404).json({ message: "Benutzer nicht gefunden" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Fehler beim Löschen des Benutzers und der Verlaufseinträge",
    });
  }
});


// Für das Einloggen eines Users
router.post("/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ message: "Fehlende Anmeldeinformationen" });
  }

  try {
    const user = await getDataForLogin(usernameOrEmail);
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Interner Serverfehler" });
      }
      if (result) {
        // Bei erfolgreicher Anmeldung Event an den Socket senden
        socket.emit('userLoggedIn', { userId: user.id, usernameOrEmail });

        return res.status(200).json({ userId: user.id });
      } else {
        return res.status(401).json({ message: "Falsches Passwort" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Interner Serverfehler" });
  }
});


// Für die Registrierung eines Users
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Fehlende Registrierungsinformationen" });
  }

  try {
    const existingUser = await getDataForRegistration(name, email);

    if (existingUser) {
      if (existingUser.name === name && existingUser.email === email) {
        return res.status(400).json({ message: "Benutzername und E-Mail existieren bereits" });
      } else if (existingUser.name === name) {
        return res.status(400).json({ message: "Benutzername existiert bereits, bitte einen anderen wählen" });
      } else if (existingUser.email === email) {
        return res.status(400).json({ message: "E-Mail existiert bereits, bitte eine andere wählen" });
      }
    }

    // Falls der neue Benutzer erfolgreich registriert wurde, Event an den Socket senden
    socket.emit('userRegistered', { name, email });

    // Hier wird die Antwort gesendet, nachdem das Socket-Event gesendet wurde
    return res.status(201).json({ message: "Benutzer erfolgreich registriert" });

  } catch (error) {
    return res.status(500).json({ message: "Interner Serverfehler" });
  }
});


// All these routes are not really secured by a login credentials,
// I can simply call them from the command line or anywhere else without credentials
// and increase my wins and losses. 
// Route zum Erhöhen der Gewinne eines Benutzers
app.post("/addWin/:userId", async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "UserID erforderlich" });
  }

  try {
    const result = await addWin(userId);
    res.json({ message: "Wurde erfolgreich hinzugefügt" });
  } catch (error) {
    if (error.message === 'UserID nicht gefunden') {
      return res.status(404).json({ message: 'UserID nicht gefunden' });
    }
    res.status(500).json({ message: "Fehler beim Hinzufügen" });
  }
});

// Route zum Erhöhen der Verluste eines Benutzers
app.post("/addLoss/:userId", async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "UserID erforderlich" });
  }

  try {
    const result = await addLoss(userId);
    res.json({ message: "Wurde erfolgreich hinzugefügt" });
  } catch (error) {
    if (error.message === 'UserID nicht gefunden') {
      return res.status(404).json({ message: 'UserID nicht gefunden' });
    }
    res.status(500).json({ message: "Fehler beim Hinzufügen" });
  }
});

// Route zum Erhöhen eines Sieges einer Runde (roundsWon) eines Benutzers
app.post("/addRoundWin/:userId", async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "UserID erforderlich" });
  }

  try {
    const result = await addRoundWin(userId);
    res.json({ message: "Wurde erfolgreich hinzugefügt" });
  } catch (error) {
    if (error.message === 'UserID nicht gefunden') {
      return res.status(404).json({ message: 'UserID nicht gefunden' });
    }
    res.status(500).json({ message: "Fehler beim Hinzufügen" });
  }
});

// Route zum Erhöhen eines verlorenen Spiels einer Runde (roundsLost) eines Benutzers
app.post("/addRoundLoss/:userId", async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "UserID erforderlich" });
  }

  try {
    const result = await addRoundLoss(userId);
    res.json({ message: "Wurde erfolgreich hinzugefügt" });
  } catch (error) {
    if (error.message === 'UserID nicht gefunden') {
      return res.status(404).json({ message: 'UserID nicht gefunden' });
    }
    res.status(500).json({ message: "Fehler beim Hinzufügen" });
  }
});

// Route zum Erhöhen von flawlessVictories von einem bestimmten Benutzer
app.post("/addFlawlessVictory/:userId", async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "UserID erforderlich" });
  }

  try {
    const result = await addFlawlessVictory(userId);
    res.json({ message: "Wurde erfolgreich hinzugefügt" });
  } catch (error) {
    if (error.message === 'UserID nicht gefunden') {
      return res.status(404).json({ message: 'UserID nicht gefunden' });
    }
    res.status(500).json({ message: "Fehler beim Hinzufügen" });
  }
});

module.exports = router;


