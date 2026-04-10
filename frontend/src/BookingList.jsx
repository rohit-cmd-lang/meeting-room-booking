import { useState } from "react";

export default function BookingList({ bookings, onCancelled, api }) {
  const [filter, setFilter] = useState("");
  const [cancelling, setCancelling] = useState(null);

  const cancel = async (id) => {
    setCancelling(id);
    await fetch(`${api}/bookings/${id}`, { method: "DELETE" });
    onCancelled();
    setCancelling(null);
  };

  const fmt = (dt) =>
    new Date(dt).toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const uniqueRooms = [
    ...new Map(bookings.map((b) => [b.room_id, b.room_name])).entries(),
  ];

  const filtered = filter
    ? bookings.filter((b) => String(b.room_id) === filter)
    : bookings;

  const inputClass = `
    bg-surface-700 border border-surface-500 text-black
    rounded-md px-3 py-2 text-xs font-mono
    focus:outline-none focus:border-amber-400
    transition-colors duration-150
  `;

  return (
    <div className="bg-surface-800 border border-surface-600 rounded-xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block"></span>
          Existing bookings
          <span className="text-xs font-mono text-slate-500 font-normal">
            ({filtered.length})
          </span>
        </h2>

        {uniqueRooms.length > 0 && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={inputClass}
          >
            <option value="">All rooms</option>
            {uniqueRooms.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto max-h-[480px] pr-1">
        {filtered.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <p className="text-sm font-mono text-slate-600">
              no bookings found
            </p>
          </div>
        ) : (
          filtered.map((b) => (
            <div
              key={b.id}
              className="
                bg-surface-700 border border-surface-500
                rounded-lg px-4 py-3
                flex items-start justify-between gap-3
                hover:border-surface-400 transition-colors duration-150
              "
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {b.title}
                </p>
                <p className="text-xs font-mono text-slate-800 mt-0.5">
                  {fmt(b.start_time)} → {fmt(b.end_time)}
                </p>
                <p className="text-xs text-slate-500 mt-1">{b.booked_by}</p>
                <span
                  className="
                  inline-block mt-1.5 text-xs font-mono
                  bg-surface-600 font-extrabold text-amber-400
                  py-0.5 rounded
                "
                >
                  {b.room_name}
                </span>
              </div>

              <button
                onClick={() => cancel(b.id)}
                disabled={cancelling === b.id}
                className="
                  flex-shrink-0 text-xs font-mono text-slate-500
                  hover:text-red-400 border border-surface-500
                  hover:border-red-800 rounded px-2 py-1
                  transition-colors duration-150
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
                {cancelling === b.id ? "..." : "cancel"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
