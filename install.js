// Importera SQLite3
const sqlite3 = require("sqlite3").verbose();

// Skapa databasen
const db = new sqlite3.Database("./database/cv.db");

// Skapa tabellen workexperience
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS workexperience (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            companyname TEXT NOT NULL,
            jobtitle TEXT NOT NULL,
            location TEXT NOT NULL,
            startdate TEXT NOT NULL,
            enddate TEXT NOT NULL,
            description TEXT NOT NULL,
            created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        )
    `);

    console.log("Databasen och tabellen workexperience är skapad.");
});

// Stäng databasanslutningen
db.close();