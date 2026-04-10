import { useState, useEffect } from "react";
import BookingForm from "./BookingForm";
import BookingList from "./BookingList";

const API = "https://meeting-room-booking-git6.onrender.com";

export default function App() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

  const fetchData = async () => {
    const [r, b] = await Promise.all([
      fetch(`${API}/rooms`).then((r) => r.json()),
      fetch(`${API}/bookings`).then((r) => r.json()),
    ]);
    setRooms(r);
    setBookings(b);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-surface-900 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 border-b border-surface-600 pb-6">
          <h1 className="text-2xl font-semibold text-amber-400 tracking-tight">
            Meeting Room Bookings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {rooms.length} rooms available &mdash; overlapping slots are
            automatically rejected
          </p>
        </div>

        {/* Two-col on md+, single col on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BookingForm rooms={rooms} onBooked={fetchData} api={API} />
          <BookingList bookings={bookings} onCancelled={fetchData} api={API} />
        </div>
      </div>
    </div>
  );
}
