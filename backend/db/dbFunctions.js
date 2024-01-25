const sqlite3 = require("sqlite3").verbose(); // Importiere die sqlite3-Bibliothek
const bcrypt = require("bcrypt"); // Importiere die bcrypt-Bibliothek
const dbPath = "./db/olfe.db"; // Pfad zur Datenbank

// Funktion zum Initialisieren der Datenbanken user
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);

    db.serialize(() => {
      db.run(
        `
        CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          name TEXT, 
          email TEXT, 
          password TEXT,
          wins INTEGER DEFAULT 0,
          losses INTEGER DEFAULT 0,
          roundsWon INTEGER DEFAULT 0,
          roundsLost INTEGER DEFAULT 0,
          flawlessVictories INTEGER DEFAULT 0
        )
      `,
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(); // Resolve, nachdem die Tabelle erstellt wurde
          }
        }
      );
    });
  });
}

async function addUser(name, email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      await initializeDatabase();
      const db = new sqlite3.Database(dbPath);

      // Hashen des Passworts mit bcrypt
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
          reject(err);
        } else {
          const stmt = db.prepare(
            "INSERT INTO user (name, email, password) VALUES (?, ?, ?)"
          );
          stmt.run(name, email, hash, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(this.lastID);
            }
            stmt.finalize();
            db.close();
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function deleteUserStats(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      await initializeDatabase();
      const db = new sqlite3.Database(dbPath);

      const stmt = db.prepare(
        "UPDATE user SET wins = 0, losses = 0, roundsWon = 0, roundsLost = 0, flawlessVictories = 0 WHERE id = ?"
      );
      stmt.run(userId, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
        stmt.finalize();
        db.close();
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Funktion zum Abrufen aller Benutzer
async function getAllUsers() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);

    db.all(
      "SELECT id, name, wins,	losses,	roundsWon,	roundsLost,	flawlessVictories FROM user",
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
        db.close();
      }
    );
  });
}

async function getUserIdByName(name) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);

    db.get("SELECT id FROM user WHERE name = ?", [name], (err, row) => {
      if (err) {
        reject(err);
      }
      if (!row) {
        resolve(null);
      }
      resolve(row.id);
      db.close();
    });
  });
}

// Funktion zum Löschen eines Benutzers und aller zugehörigen Verlaufseinträge
async function deleteUser(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = new sqlite3.Database(dbPath);

      db.run("DELETE FROM user WHERE id = ?", [userId], function (err) {
        if (err) {
          reject(err);
        } else {
          const deletedUserId = this.changes;
          resolve({ deletedUserId });
        }
        db.close();
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Funktion zum Abrufen der Daten eines Benutzers für den Login
async function getDataForLogin(nameOrEmail) {
  return new Promise(async (resolve, reject) => {
    try {
      await initializeDatabase();
      const db = new sqlite3.Database(dbPath);

      const query = "SELECT * FROM user WHERE name = ? OR email = ?";
      const params = [nameOrEmail, nameOrEmail];

      db.get(query, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
        db.close();
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Funktion zum Abrufen der Daten eines Benutzers für die Registrierung
async function getDataForRegistration(name, email) {
  return new Promise(async (resolve, reject) => {
    try {
      await initializeDatabase();
      const db = new sqlite3.Database(dbPath);

      const query = "SELECT * FROM user WHERE name = ? OR email = ?";
      const params = [name, email];

      db.get(query, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
        db.close();
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Funktion zum Hinzufügen eines Gewinns für einen Benutzer
async function addWin(userId) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);

    // Überprüfung, ob die UserID vorhanden ist, bevor der Updatevorgang ausgeführt wird
    const getUserQuery = "SELECT * FROM user WHERE id = ?";
    db.get(getUserQuery, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (!row) {
          return reject({ message: "UserID nicht gefunden" });
        }

        // UserID vorhanden, führe den Updatevorgang aus
        db.run(
          "UPDATE user SET wins = wins + 1 WHERE id = ?",
          [userId],
          function (err) {
            if (err) {
              reject(err);
            } else {
              const updatedUserId = this.changes;
              resolve({ updatedUserId });
            }
            db.close();
          }
        );
      }
    });
  });
}

// Funktion zum Hinzufügen eines verlorenen Spiels für einen Benutzer
async function addLoss(userId) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);

    // Überprüfung, ob die UserID vorhanden ist, bevor der Updatevorgang ausgeführt wird
    const getUserQuery = "SELECT * FROM user WHERE id = ?";
    db.get(getUserQuery, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (!row) {
          return reject({ message: "UserID nicht gefunden" });
        }

        // UserID vorhanden, führe den Updatevorgang aus
        db.run(
          "UPDATE user SET losses = losses + 1 WHERE id = ?",
          [userId],
          function (err) {
            if (err) {
              reject(err);
            } else {
              const updatedUserId = this.changes;
              resolve({ updatedUserId });
            }
            db.close();
          }
        );
      }
    });
  });
}

// Funktion zum Hinzufügen eines Sieges bei einer Runde für einen Benutzer (roundsWon)
async function addRoundWin(userId) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);

    // Überprüfung, ob die UserID vorhanden ist, bevor der Updatevorgang ausgeführt wird
    const getUserQuery = "SELECT * FROM user WHERE id = ?";
    db.get(getUserQuery, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (!row) {
          return reject({ message: "UserID nicht gefunden" });
        }

        // UserID vorhanden, führe den Updatevorgang aus
        db.run(
          "UPDATE user SET roundsWon = roundsWon + 1 WHERE id = ?",
          [userId],
          function (err) {
            if (err) {
              reject(err);
            } else {
              const updatedUserId = this.changes;
              resolve({ updatedUserId });
            }
            db.close();
          }
        );
      }
    });
  });
}

// Funktion zum Hinzufügen eines verlorenen Spiels in einer Runde (roundsLost) für einen Benutzer
async function addRoundLoss(userId) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);

    // Überprüfung, ob die UserID vorhanden ist, bevor der Updatevorgang ausgeführt wird
    const getUserQuery = "SELECT * FROM user WHERE id = ?";
    db.get(getUserQuery, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (!row) {
          return reject({ message: "UserID nicht gefunden" });
        }

        // UserID vorhanden, führe den Updatevorgang aus
        db.run(
          "UPDATE user SET roundsLost = roundsLost + 1 WHERE id = ?",
          [userId],
          function (err) {
            if (err) {
              reject(err);
            } else {
              const updatedUserId = this.changes;
              resolve({ updatedUserId });
            }
            db.close();
          }
        );
      }
    });
  });
}

// Funktion zum Hinzufügen eines flawlessVictories für einen Benutzer
async function addFlawlessVictory(userId) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);

    // Überprüfung, ob die UserID vorhanden ist, bevor der Updatevorgang ausgeführt wird
    const getUserQuery = "SELECT * FROM user WHERE id = ?";
    db.get(getUserQuery, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (!row) {
          return reject({ message: "UserID nicht gefunden" });
        }

        // UserID vorhanden, führe den Updatevorgang aus
        db.run(
          "UPDATE user SET flawlessVictories = flawlessVictories + 1 WHERE id = ?",
          [userId],
          function (err) {
            if (err) {
              reject(err);
            } else {
              const updatedUserId = this.changes;
              resolve({ updatedUserId });
            }
            db.close();
          }
        );
      }
    });
  });
}

// Export der Funktionen
module.exports = {
  addUser,
  getAllUsers,
  deleteUser,
  getDataForLogin,
  getDataForRegistration,
  addWin,
  addLoss,
  addRoundWin,
  addRoundLoss,
  addFlawlessVictory,
  deleteUserStats,
  getUserIdByName,
};
