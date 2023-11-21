const sqlite3 = require("sqlite3").verbose(); // Importiere die sqlite3-Bibliothek
const bcrypt = require("bcrypt"); // Importiere die bcrypt-Bibliothek

const dbPath = "./db/olfe.db";

// Funktion zum Initialisieren der Datenbanken ... also der Tabellen (user, history)
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);

    db.run(
      `CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT)`,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(); // Resolve, nachdem die user-Tabelle erstellt wurde
        }
        db.close();
      }
    );
  });
}



// Funktion zum Hinzufügen eines Benutzers
async function addUser(name, email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      await initializeDatabase();
      const db = new sqlite3.Database(dbPath);

      // Hashen des Passworts
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


// Funktion zum Abrufen aller Benutzer
async function getAllUsers() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);

    db.all("SELECT * FROM user", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
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

      const query = 'SELECT * FROM user WHERE name = ? OR email = ?';
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

      const query = 'SELECT * FROM user WHERE name = ? OR email = ?';
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


// Export der Funktionen
module.exports = {
  addUser,
  getAllUsers,
  deleteUser,
  getDataForLogin,
  getDataForRegistration,
};


