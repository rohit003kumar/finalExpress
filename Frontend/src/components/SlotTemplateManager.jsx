







import React, { useState, useEffect } from "react";
import axios from '../utilss/axios'; // Adjust the import path as necessary  

// Utility: generate next 10 dates
const generateNextNDates = (n) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
};

const SlotTemplateManager = () => {
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [slots, setSlots] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [allSlotTemplates, setAllSlotTemplates] = useState([]);

  const allDates = generateNextNDates(10);

  const handleAddTimeSlot = (newSlot) => {
    setSlots((prev) => [...prev, newSlot]);
  };

  const handleCheckboxChange = (date) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const handleSubmit = async () => {
    if (selectedDates.length === 0 || slots.length === 0) {
      alert("Please select dates and add at least one slot.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/slots",
        { dates: selectedDates, slots },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Slot templates saved successfully.");
      setSlots([]);
      setSelectedDates([]);
      fetchAllSlotTemplates(); // Fetch after successful save
    } catch (err) {
      console.error(err);
      alert("Failed to save slot templates.");
    }
  };

  const fetchAllSlotTemplates = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/slot-templates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllSlotTemplates(res.data);
    } catch (err) {
      console.error("Failed to fetch slot templates:", err);
    }
  };

  useEffect(() => {
    fetchAllSlotTemplates(); // Initial fetch
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-xl rounded-2xl mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Slot Template Manager</h2>

      {/* Date Selection */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-3">Select Dates</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {allDates.map((date) => (
            <label key={date} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedDates.includes(date)}
                onChange={() => handleCheckboxChange(date)}
                className="accent-blue-500"
              />
              <span className="text-sm">{date}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Defined Slots */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-3">Defined Slots</h4>
        {slots.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700 mb-4">
            {slots.map((slot, idx) => (
              <li key={idx}>
                <strong>{slot.label}</strong> - {slot.range}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 mb-4">No slots added yet.</p>
        )}
        <button
          onClick={() => setShowTimeSlotModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          + Add Time Slot
        </button>
      </div>

      {/* Save Button */}
      <div className="text-right">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Save Slot Templates
        </button>
      </div>

      {/* Modal */}
      {showTimeSlotModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowTimeSlotModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Time Slot</h3>
              <button
                onClick={() => setShowTimeSlotModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newSlot = {
                  label: formData.get("label"),
                  range: formData.get("range"),
                };
                handleAddTimeSlot(newSlot);
                setShowTimeSlotModal(false);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Label</label>
                <input
                  name="label"
                  type="text"
                  required
                  placeholder="e.g., Morning"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Time Range</label>
                <input
                  name="range"
                  type="text"
                  required
                  placeholder="e.g., 07:00-09:00"
                  pattern="[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTimeSlotModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* All Slot Templates Display */}
      {allSlotTemplates.length > 0 && (
        <div className="mt-10">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">All Slot Templates</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allSlotTemplates.map((template, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-sm bg-gray-50"
              >
                <p className="text-sm font-medium text-blue-700 mb-2">
                  📅 Date: {template.date}
                </p>
                {template.slots?.map((slot, idx) => (
                  <p key={idx} className="text-sm text-gray-700">
                    • {slot.label}: {slot.range}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotTemplateManager;
