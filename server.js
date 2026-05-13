// Importera paket
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

// Skapa Express-applikation
const app = express();
const port = process.env.PORT || 3000;

// Anslut till SQLite-databasen
const db = new sqlite3.Database("./database/cv.db");

// Middleware
app.use(cors());
app.use(express.json());

// Startsida för API
app.get("/", (req, res) => {
    res.json({ message: "Välkommen till REST API för arbetserfarenheter." });
});

// Hämta alla arbetserfarenheter
app.get("/workexperience", (req, res) => {
    db.all("SELECT * FROM workexperience ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Fel vid hämtning av data." });
        }

        res.json(rows);
    });
});

// Hämta en specifik arbetserfarenhet
app.get("/workexperience/:id", (req, res) => {
    const id = req.params.id;

    db.get("SELECT * FROM workexperience WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Fel vid hämtning av data." });
        }

        if (!row) {
            return res.status(404).json({ error: "Ingen post hittades med detta id." });
        }

        res.json(row);
    });
});

// Lägg till ny arbetserfarenhet
app.post("/workexperience", (req, res) => {
    const { companyname, jobtitle, location, startdate, enddate, description } = req.body;

    // Validera att inga fält är tomma
    if (!companyname || !jobtitle || !location || !startdate || !enddate || !description) {
        return res.status(400).json({
            error: "Alla fält måste fyllas i."
        });
    }

    db.run(
        `INSERT INTO workexperience(companyname, jobtitle, location, startdate, enddate, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [companyname, jobtitle, location, startdate, enddate, description],
        function (err) {
            if (err) {
                return res.status(500).json({ error: "Fel vid lagring av data." });
            }

            res.status(201).json({
                message: "Arbetserfarenhet har lagts till.",
                id: this.lastID
            });
        }
    );
});

// Uppdatera en arbetserfarenhet
app.put("/workexperience/:id", (req, res) => {
    const id = req.params.id;
    const { companyname, jobtitle, location, startdate, enddate, description } = req.body;

    // Validera att inga fält är tomma
    if (!companyname || !jobtitle || !location || !startdate || !enddate || !description) {
        return res.status(400).json({
            error: "Alla fält måste fyllas i."
        });
    }

    db.run(
        `UPDATE workexperience
         SET companyname = ?, jobtitle = ?, location = ?, startdate = ?, enddate = ?, description = ?
         WHERE id = ?`,
        [companyname, jobtitle, location, startdate, enddate, description, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: "Fel vid uppdatering av data." });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: "Ingen post hittades med detta id." });
            }

            res.json({ message: "Arbetserfarenhet har uppdaterats." });
        }
    );
});

// Radera en arbetserfarenhet
app.delete("/workexperience/:id", (req, res) => {
    const id = req.params.id;

    db.run("DELETE FROM workexperience WHERE id = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({ error: "Fel vid radering av data." });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "Ingen post hittades med detta id." });
        }

        res.json({ message: "Arbetserfarenhet har raderats." });
    });
});

// Starta servern
app.listen(port, () => {
    console.log("Server is started on port: " + port);
});