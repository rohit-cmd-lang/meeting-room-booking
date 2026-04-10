# Meeting Room Booking System

A full-stack app to book meeting rooms with overlap prevention.

## Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** SQLite (via better-sqlite3)

## Features

- Book a room with start & end time
- Prevents overlapping bookings (checked server-side)
- View and cancel existing bookings
- Filter bookings by room

## Setup

### Backend

cd backend
npm install
node index.js
Server runs on http://localhost:3001

### Frontend

cd frontend
npm install
npm run dev
App runs on http://localhost:5173

## API Endpoints

| Method | Endpoint      | Description                      |
| ------ | ------------- | -------------------------------- |
| GET    | /rooms        | All rooms with booking count     |
| GET    | /bookings     | All bookings with room info      |
| GET    | /bookings/:id | Single booking detail            |
| POST   | /bookings     | Create booking (overlap checked) |
| DELETE | /bookings/:id | Cancel a booking                 |

## Key Design Decisions

- Overlap detection uses SQL: `start_time < new.end AND end_time > new.start`
- All times stored as UTC ISO strings to handle DST correctly
- LEFT JOIN on rooms ensures rooms with zero bookings still appear
- Server-side validation is the source of truth — frontend validation is UX only
