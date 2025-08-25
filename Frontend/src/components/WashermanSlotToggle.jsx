




// WashermanSlotToggle.tsx
import React, { useEffect, useState } from "react";
import axios from '../utilss/axios'; // Adjust the import path as necessary 
import {
  Clock,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

const WashermanSlotToggle = () => {
  const [slotTemplates, setSlotTemplates] = useState([]);
  const [enabledSlots, setEnabledSlots] = useState({});
  const [maxBookingInputs, setMaxBookingInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingStates, setSavingStates] = useState({});
  const [savedStates, setSavedStates] = useState({});

  useEffect(() => {
    const fetchAdminSlots = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/show/slot-templates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSlotTemplates(res.data);
        const saved = JSON.parse(localStorage.getItem("washermanEnabledSlots") || "{}");
        setEnabledSlots(saved);
      } catch (err) {
        setError("Failed to load slot templates. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminSlots();
  }, []);

  const handleToggle = (date, slot) => {
    const current = new Set(enabledSlots[date] || []);
    if (current.has(slot.range)) {
      current.delete(slot.range);
    } else {
      current.add(slot.range);
    }
    const updated = [...current];
    setEnabledSlots({ ...enabledSlots, [date]: updated });
    localStorage.setItem("washermanEnabledSlots", JSON.stringify({ ...enabledSlots, [date]: updated }));
    setSavedStates((prev) => ({ ...prev, [date]: false }));
  };

  const handleMaxBookingChange = (date, range, value) => {
    setMaxBookingInputs((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        [range]: parseInt(value),
      },
    }));
  };

  const saveSlotsToBackend = async (date) => {
    setSavingStates((prev) => ({ ...prev, [date]: true }));
    const token = localStorage.getItem("token");
    try {
      const payload = {
        date,
        enabledSlots: (slotTemplates.find((d) => d.date === date)?.slots || [])
          .filter((s) => enabledSlots[date]?.includes(s.range))
          .map((s) => ({
            label: s.label,
            range: s.range,
            maxBookings: maxBookingInputs[date]?.[s.range] || 1,
          })),
      };
      await axios.post("/api/show/slots/washer", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedStates((prev) => ({ ...prev, [date]: true }));
      setTimeout(() => setSavedStates((prev) => ({ ...prev, [date]: false })), 3000);
    } catch (err) {
      setError("Failed to save slots. Please try again.");
    } finally {
      setSavingStates((prev) => ({ ...prev, [date]: false }));
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getEnabledCount = (date) => {
    const enabled = enabledSlots[date] || [];
    return new Set(enabled).size;
  };

  const getTotalSlots = (date) => {
    const slots = slotTemplates.find((t) => t.date === date)?.slots || [];
    const uniqueRanges = new Set(slots.map((slot) => slot.range));
    return uniqueRanges.size;
  };

  const refreshData = () => window.location.reload();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-red-600 mt-2">{error}</p>
          <button
            onClick={refreshData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <RefreshCw className="inline-block w-4 h-4 mr-1" />
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {slotTemplates.map((template) => {
        const date = template.date;
        const total = getTotalSlots(date);
        const active = getEnabledCount(date);
        const saving = savingStates[date];
        const saved = savedStates[date];

        return (
          <div key={date} className="bg-white shadow rounded-lg mb-6 border">
            <div className="flex justify-between items-center bg-blue-100 px-4 py-2 border-b">
              <div>
                <h2 className="font-bold text-blue-800">
                  {formatDate(date)}
                </h2>
                <p className="text-sm text-gray-600">{date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  {active}/{total} Active Slots
                </p>
                <div className="w-full bg-gray-200 h-2 rounded mt-1">
                  <div
                    className="h-2 bg-green-500 rounded"
                    style={{ width: `${(active / total) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {template.slots.map((slot) => {
                const isEnabled = enabledSlots[date]?.includes(slot.range);
                return (
                  <div
                    key={slot.range + slot.label}
                    className={`p-4 rounded border ${
                      isEnabled ? "bg-green-50 border-green-300" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-medium text-gray-800">{slot.label}</h4>
                        <div className="flex items-center text-sm text-gray-600 space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{slot.range}</span>
                        </div>
                        {isEnabled && (
                          <div className="mt-2">
                            <label className="text-xs text-gray-600">Max Bookings</label>
                            <input
                              type="number"
                              min="1"
                              value={maxBookingInputs[date]?.[slot.range] || ""}
                              onChange={(e) =>
                                handleMaxBookingChange(date, slot.range, e.target.value)
                              }
                              className="mt-1 w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        )}
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => handleToggle(date, slot)}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 relative"></div>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => saveSlotsToBackend(date)}
              disabled={saving}
              className={`w-full mt-4 py-2 rounded-lg font-semibold transition ${
                saving
                  ? "bg-gray-400 text-white"
                  : saved
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {saving ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Saving...
                </span>
              ) : saved ? (
                <span className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" /> Saved!
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Save className="w-5 h-5 mr-2" />
                  Save for {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default WashermanSlotToggle;
