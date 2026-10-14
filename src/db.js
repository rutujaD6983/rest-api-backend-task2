const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let db;
let dbPath;

async function initDb() {
  const SQL = await initSqlJs();

  dbPath = path.join(__dirname, '..', 'data', 'items.sqlite');

  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT ''
    )
  `);

  saveDb();
  return db;
}

function saveDb() {
  if (db && dbPath) {
    fs.writeFileSync(dbPath, Buffer.from(db.export()));
  }
}

function getDb() {
  if (!db) {
    throw new Error('Database is not initialized');
  }
  return db;
}

function closeDb() {
  saveDb();

  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { initDb, getDb, closeDb, saveDb };
