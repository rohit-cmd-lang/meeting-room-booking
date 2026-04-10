const Database = require("better-sqlite3");

const db = new Database("bookings.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    booked_by TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
  );
`);

const roomCount = db.prepare("SELECT COUNT(*) as count FROM rooms").get();
if (roomCount.count === 0) {
  const insert = db.prepare("INSERT INTO rooms (name) VALUES (?)");
  [
    "Conference Room A",
    "Conference Room B",
    "Board Room",
    "Huddle Space",
  ].forEach((name) => {
    insert.run(name);
  });
}

module.exports = db;
