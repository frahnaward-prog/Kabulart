const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./data/artgallery.db");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS paintings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT,
            image TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

module.exports = db;