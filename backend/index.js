const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

// GET ROOMS
app.get("/rooms", (req, res) => {
  const rooms = db
    .prepare(
      `
    SELECT r.id, r.name,
           COUNT(b.id) AS total_bookings
    FROM rooms r
    LEFT JOIN bookings b ON r.id = b.room_id
    GROUP BY r.id, r.name
  `,
    )
    .all();
  res.json(rooms);
});

//GET BOOKINGS
app.get("/bookings", (req, res) => {
  const bookings = db
    .prepare(
      `
    SELECT b.id, b.title, b.booked_by, b.start_time, b.end_time,
           r.id AS room_id, r.name AS room_name
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    ORDER BY b.start_time ASC
  `,
    )
    .all();
  res.json(bookings);
});

//SINGLE BOOKING DETAIL
app.get("/bookings/:id", (req, res) => {
  const booking = db
    .prepare(
      `
    SELECT b.*, r.name AS room_name
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.id = ?
  `,
    )
    .get(req.params.id);

  if (!booking) {
    return res.status(404).json({ error: "Booking not found." });
  }
  res.json(booking);
});

// ── POST /bookings ──────────────────────────────────────────────────
// Creates a new booking after overlap check
app.post("/bookings", (req, res) => {
  const { room_id, title, booked_by, start_time, end_time } = req.body;

  // Validation
  if (!room_id || !title || !booked_by || !start_time || !end_time) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (start_time >= end_time) {
    return res
      .status(400)
      .json({ error: "End time must be after start time." });
  }

  // Verify the room actually exists — JOIN approach: if no row returned, room is invalid
  const room = db
    .prepare(
      `
    SELECT r.id, r.name
    FROM rooms r
    WHERE r.id = ?
  `,
    )
    .get(room_id);

  if (!room) {
    return res.status(404).json({ error: "Room not found." });
  }

  // Overlap detection — check existing bookings for same room
  // Overlap condition: new.start < existing.end AND new.end > existing.start
  const overlap = db
    .prepare(
      `
    SELECT b.id, b.title, b.start_time, b.end_time,
           r.name AS room_name
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.room_id = ?
      AND b.start_time < ?
      AND b.end_time > ?
  `,
    )
    .get(room_id, end_time, start_time);

  if (overlap) {
    return res.status(409).json({
      error: `"${overlap.room_name}" is already booked: "${overlap.title}" from ${overlap.start_time} to ${overlap.end_time}.`,
    });
  }

  // Safe to insert
  const result = db
    .prepare(
      `
    INSERT INTO bookings (room_id, title, booked_by, start_time, end_time)
    VALUES (?, ?, ?, ?, ?)
  `,
    )
    .run(room_id, title, booked_by, start_time, end_time);

  res.status(201).json({
    id: result.lastInsertRowid,
    message: "Booking confirmed!",
  });
});

//Delete bookings
app.delete("/bookings/:id", (req, res) => {
  const booking = db
    .prepare("SELECT id FROM bookings WHERE id = ?")
    .get(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found." });
  }
  db.prepare("DELETE FROM bookings WHERE id = ?").run(req.params.id);
  res.json({ message: "Booking cancelled." });
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
