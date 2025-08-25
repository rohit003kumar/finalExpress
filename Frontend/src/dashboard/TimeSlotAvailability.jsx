import React, { useState } from "react";

const TIME_SLOTS = ["6–9", "9–12", "12–3", "3–6"];
const MAX_TRIPS_PER_SLOT = 5;

export default function Availability() {
  // We store available trip count per slot (initially 0)
  const [availability, setAvailability] = useState(
    TIME_SLOTS.reduce((acc, slot) => {
      acc[slot] = 0;
      return acc;
    }, {})
  );

  const increase = (slot) => {
    setAvailability((prev) => {
      if (prev[slot] < MAX_TRIPS_PER_SLOT) {
        return { ...prev, [slot]: prev[slot] + 1 };
      }
      return prev;
    });
  };

  const decrease = (slot) => {
    setAvailability((prev) => {
      if (prev[slot] > 0) {
        return { ...prev, [slot]: prev[slot] - 1 };
      }
      return prev;
    });
  };

  return (
    <section className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Manage Availability</h2>
      <div className="space-y-4">
        {TIME_SLOTS.map((slot) => (
          <div
            key={slot}
            className="flex items-center justify-between border p-4 rounded shadow-sm"
          >
            <div className="font-semibold">{slot}</div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => decrease(slot)}
                className="px-3 py-1 bg-red-500 text-white rounded disabled:bg-red-300"
                disabled={availability[slot] === 0}
              >
                -
              </button>
              <div
                className={`w-10 text-center font-bold ${
                  availability[slot] < MAX_TRIPS_PER_SLOT
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {availability[slot]} / {MAX_TRIPS_PER_SLOT}
              </div>
              <button
                onClick={() => increase(slot)}
                className="px-3 py-1 bg-green-500 text-white rounded disabled:bg-green-300"
                disabled={availability[slot] === MAX_TRIPS_PER_SLOT}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
