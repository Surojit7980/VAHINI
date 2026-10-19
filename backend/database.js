const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'vahini_aar.db'), (err) => {
    if (err) console.error('Database connection error:', err.message);
    else console.log('Connected to SQLite Database for AAR Logging.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS action_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        event_type TEXT,
        sender TEXT,
        jamming_level INTEGER,
        original_data TEXT,
        spoofed_data TEXT
    )`);
});

const logEvent = (eventType, sender, jammingLevel, original, spoofed = null) => {
    const query = `INSERT INTO action_logs (timestamp, event_type, sender, jamming_level, original_data, spoofed_data) VALUES (?, ?, ?, ?, ?, ?)`;
    const time = new Date().toISOString();
    db.run(query, [time, eventType, sender, jammingLevel, original, spoofed], (err) => {
        if (err) console.error('Error logging to AAR:', err.message);
    });
};

const getAARLogs = (callback) => {
    db.all(`SELECT * FROM action_logs ORDER BY id ASC`, [], (err, rows) => {
        callback(err, rows);
    });
};

module.exports = { logEvent, getAARLogs };