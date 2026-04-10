import { useState } from "react";

export default function BookingForm({ rooms, onBooked, api }) {
  const [form, setForm] = useState({
    room_id: "",
    title: "",
    booked_by: "",
    start_time: "",
    end_time: "",
  });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${api}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ text: data.error, type: "error" });
      } else {
        setMsg({ text: "Room booked successfully.", type: "success" });
        setForm({
          room_id: "",
          title: "",
          booked_by: "",
          start_time: "",
          end_time: "",
        });
        onBooked();
      }
    } catch {
      setMsg({ text: "Could not reach server.", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  const inputClass = `
    w-full bg-surface-700 border border-surface-500 text-black
    rounded-md px-3 py-2 text-sm placeholder-slate-500
    focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400
    transition-colors duration-150
  `;

  const labelClass =
    "block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="bg-surface-800 border border-surface-600 rounded-xl p-6">
      <h2 className="text-sm font-semibold text-slate-300 mb-5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block font-bold text-black"></span>
        New booking
      </h2>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>Room</label>
          <select
            value={form.room_id}
            onChange={(e) => set("room_id", e.target.value)}
            className={inputClass}
          >
            <option value="">Select a room...</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.total_bookings} booking
                {r.total_bookings !== 1 ? "s" : ""})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Meeting title</label>
          <input
            type="text"
            placeholder="e.g. Sprint planning"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Your name</label>
          <input
            type="text"
            placeholder="e.g. Priya Sharma"
            value={form.booked_by}
            onChange={(e) => set("booked_by", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Start time</label>
            <input
              type="datetime-local"
              value={form.start_time}
              onChange={(e) => set("start_time", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>End time</label>
            <input
              type="datetime-local"
              value={form.end_time}
              onChange={(e) => set("end_time", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="
          mt-6 w-full bg-amber-400 hover:bg-amber-300 text-surface-900
          font-semibold text-sm rounded-md py-2.5
          transition-colors duration-150
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {loading ? "Booking..." : "Book room →"}
      </button>

      {msg && (
        <div
          className={`
          mt-4 px-4 py-3 rounded-md text-sm font-mono
          ${
            msg.type === "error"
              ? "bg-red-950 border border-red-800 text-red-300"
              : "bg-emerald-950 border border-emerald-800 text-emerald-300"
          }
        `}
        >
          {msg.text}
        </div>
      )}
    </div>
  );
}
