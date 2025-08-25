import React, { useState, useEffect } from "react";
import axios from "../utilss/axios";
import {
  Calendar,
  Clock,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings,
  Plus,
  X,
  CalendarDays,
  Timer,
  Sparkles,
  Grid3X3,
  RefreshCw,
  Edit,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  Zap,
  CalendarPlus,
  Archive
} from "lucide-react";

// Utility: generate next 10 dates starting from today (timezone-safe)
const generateNextNDates = (n) => {
  const dates = [];
  const today = new Date();

  // Get today's date in local timezone
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  for (let i = 0; i < n; i++) {
    // Create new date for each iteration to avoid timezone issues
    const date = new Date(year, month, day + i);
    const dateString = date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
    dates.push(dateString);
  }
  return dates;
};

// Utility: get today's date string in YYYY-MM-DD format
const getTodayString = () => {
  const today = new Date();
  return today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');
};

const EnhancedSlotTemplateManager = () => {
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAutoGenerateModal, setShowAutoGenerateModal] = useState(false);
  const [slots, setSlots] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [allSlotTemplates, setAllSlotTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentDates, setCurrentDates] = useState(generateNextNDates(10));
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [autoGenerating, setAutoGenerating] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [expandedTemplates, setExpandedTemplates] = useState(new Set());
  const [selectedTemplateForAutoGen, setSelectedTemplateForAutoGen] = useState('');

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

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/slots",
        { dates: selectedDates, slots },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      setSlots([]);
      setSelectedDates([]);
      fetchAllSlotTemplates();
    } catch (err) {
      console.error(err);
      alert("Failed to save slot templates.");
    } finally {
      setSaving(false);
    }
  };

  const fetchAllSlotTemplates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/slot-templates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllSlotTemplates(res.data);
    } catch (err) {
      console.error("Failed to fetch slot templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDates = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/next-available-dates?numberOfDays=10", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableDates(res.data.availableDates);
    } catch (err) {
      console.error("Failed to fetch available dates:", err);
    }
  };

  const removeSlot = (indexToRemove) => {
    setSlots(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setSlots(template.slots.map(slot => ({
      label: slot.label,
      range: slot.range,
      maxBookings: slot.maxBookings || 10,
      isActive: slot.isActive !== false
    })));
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (slots.length === 0) {
      alert("Please add at least one slot.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/slot-template/${editingTemplate.date}`,
        { slots },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setShowEditModal(false);
      setEditingTemplate(null);
      setSlots([]);
      fetchAllSlotTemplates();
    } catch (err) {
      console.error(err);
      alert("Failed to update slot template.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (date) => {
    if (!confirm(`Are you sure you want to delete the template for ${date}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/slot-template/${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAllSlotTemplates();
      alert("Template deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete template.");
    }
  };

  const handleAutoGenerate = async () => {
    if (!selectedTemplateForAutoGen) {
      alert("Please select a template to copy from.");
      return;
    }

    setAutoGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/auto-generate-dates",
        { 
          templateDate: selectedTemplateForAutoGen, 
          numberOfDays: 10 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Auto-generation completed! ${res.data.results.filter(r => r.status === 'success').length} dates generated.`);
      setShowAutoGenerateModal(false);
      setSelectedTemplateForAutoGen('');
      fetchAllSlotTemplates();
      fetchAvailableDates();
    } catch (err) {
      console.error(err);
      alert("Failed to auto-generate dates.");
    } finally {
      setAutoGenerating(false);
    }
  };

  const handleCleanupPastDates = async () => {
    if (!confirm("Are you sure you want to clean up all past dates? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/cleanup-past-dates", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Cleanup completed! ${res.data.deletedCount} past templates deleted.`);
      fetchAllSlotTemplates();
    } catch (err) {
      console.error(err);
      alert("Failed to cleanup past dates.");
    }
  };

  const toggleTemplateExpansion = (date) => {
    setExpandedTemplates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string' || !dateString.includes('-')) {
      return 'Invalid Date';
    }

    const todayStr = getTodayString();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.getFullYear() + '-' +
      String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' +
      String(tomorrow.getDate()).padStart(2, '0');

    if (dateString === todayStr) return 'Today';
    if (dateString === tomorrowStr) return 'Tomorrow';

    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Real-time date management
  useEffect(() => {
    fetchAllSlotTemplates();
    fetchAvailableDates();

    // Set up interval to check for date changes every minute
    const dateCheckInterval = setInterval(() => {
      const currentTodayString = getTodayString();
      const firstDateInList = currentDates[0];

      if (currentTodayString !== firstDateInList) {
        console.log('Date changed detected:', firstDateInList, '->', currentTodayString);
        updateDatesAndCleanup();
      }
    }, 60000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const currentTodayString = getTodayString();
        const firstDateInList = currentDates[0];

        if (currentTodayString !== firstDateInList) {
          console.log('Visibility change - Date update needed:', firstDateInList, '->', currentTodayString);
          updateDatesAndCleanup();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(dateCheckInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentDates]);

  const updateDatesAndCleanup = () => {
    const newDates = generateNextNDates(10);
    const todayString = getTodayString();
    setCurrentDates(newDates);
    setSelectedDates(prev => prev.filter(date => date >= todayString));
    console.log('Dates updated - Today:', todayString, 'New dates:', newDates);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading slot templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
                <Grid3X3 className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Enhanced Slot Template Manager</h1>
                <p className="text-gray-600 mt-1">Create, edit, and auto-generate time slot templates</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCleanupPastDates}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Archive className="w-4 h-4" />
                <span>Cleanup Past</span>
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Settings className="w-4 h-4" />
                <span>Admin Panel</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Template Creation */}
          <div className="lg:col-span-2 space-y-8">
            {/* Auto-Generation Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-6 h-6" />
                    <div>
                      <h3 className="text-xl font-semibold">Auto-Generate Dates</h3>
                      <p className="text-green-100 text-sm">Quickly generate next 10 days from existing template</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAutoGenerateModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    <span className="text-sm font-medium">Auto Generate</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="font-medium text-green-800">Available Dates</div>
                    <div className="text-green-600">{availableDates.length} dates ready for generation</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800">Total Templates</div>
                    <div className="text-blue-600">{allSlotTemplates.length} templates created</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Date Selection Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-white">
                <div className="flex items-center space-x-3">
                  <CalendarDays className="w-6 h-6" />
                  <div>
                    <h3 className="text-xl font-semibold">Select Dates</h3>
                    <p className="text-purple-100 text-sm">Real-time dates (auto-updates daily, no past dates)</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {currentDates.map((date) => {
                    const isSelected = selectedDates.includes(date);
                    return (
                      <label key={date} className="group cursor-pointer">
                        <div className={`p-3 rounded-xl border-2 transition-all duration-200 ${isSelected
                            ? 'border-purple-200 bg-purple-50 shadow-sm'
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300 group-hover:bg-gray-100'
                          }`}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleCheckboxChange(date)}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className={`text-sm font-medium ${isSelected ? 'text-purple-900' : 'text-gray-900'}`}>
                              {formatDate(date)}
                            </div>
                            <div className={`text-xs mt-1 ${isSelected ? 'text-purple-600' : 'text-gray-500'}`}>
                              {date}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="flex justify-center mt-2">
                              <CheckCircle className="w-4 h-4 text-purple-600" />
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>

                {selectedDates.length > 0 && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-700">
                      <span className="font-medium">{selectedDates.length}</span> date{selectedDates.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Time Slots Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Timer className="w-6 h-6" />
                    <div>
                      <h3 className="text-xl font-semibold">Time Slots</h3>
                      <p className="text-blue-100 text-sm">Define your service time slots</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTimeSlotModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add Slot</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {slots.length > 0 ? (
                  <div className="space-y-3">
                    {slots.map((slot, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 group hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Clock className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{slot.label}</div>
                            <div className="text-sm text-gray-600">{slot.range}</div>
                            <div className="text-xs text-gray-500">Max: {slot.maxBookings || 10} bookings</div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeSlot(idx)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Timer className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No time slots added yet</p>
                    <button
                      onClick={() => setShowTimeSlotModal(true)}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Your First Slot</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            {(selectedDates.length > 0 && slots.length > 0) && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${saved
                      ? 'bg-green-600 text-white shadow-lg'
                      : saving
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                    }`}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Saving Templates...</span>
                    </>
                  ) : saved ? (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      <span>Templates Saved Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      <span>Save Slot Templates</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Templates Display */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-6 h-6" />
                    <div>
                      <h3 className="text-xl font-semibold">Existing Templates</h3>
                      <p className="text-indigo-100 text-sm">{allSlotTemplates.length} template{allSlotTemplates.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      fetchAllSlotTemplates();
                      fetchAvailableDates();
                    }}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto">
                {allSlotTemplates.length > 0 ? (
                  <div className="space-y-4">
                    {allSlotTemplates
                      .filter((template) => template?.date && typeof template.date === 'string')
                      .map((template, index) => {
                        const isExpanded = expandedTemplates.has(template.date);
                        return (
                          <div key={index} className="border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4 text-indigo-600" />
                                  <span className="font-medium text-indigo-700">{formatDate(template.date)}</span>
                                  {template.isAutoGenerated && (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Auto</span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => toggleTemplateExpansion(template.date)}
                                    className="p-1 hover:bg-gray-200 rounded"
                                  >
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mb-2">{template.date}</div>
                              
                              {isExpanded && (
                                <div className="space-y-2 mb-3">
                                  {template.slots?.map((slot, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                                      <div>
                                        <span className="text-gray-700">{slot.label}</span>
                                        <span className="text-gray-500 ml-2">({slot.range})</span>
                                      </div>
                                      <span className="text-xs text-gray-500">Max: {slot.maxBookings || 10}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => handleEditTemplate(template)}
                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                    title="Edit Template"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setSelectedTemplateForAutoGen(template.date)}
                                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                                    title="Use for Auto-Generation"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleDeleteTemplate(template.date)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                                  title="Delete Template"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No templates created yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Time Slot Modal */}
      {showTimeSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Add New Time Slot</h3>
              </div>
              <button
                onClick={() => setShowTimeSlotModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newSlot = {
                  label: formData.get("label"),
                  range: formData.get("range"),
                  maxBookings: 10, // Default value, admin cannot set this
                  isActive: true
                };
                handleAddTimeSlot(newSlot);
                setShowTimeSlotModal(false);
              }}
              className="p-6"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Slot Label
                  </label>
                  <input
                    name="label"
                    type="text"
                    required
                    placeholder="e.g., Morning Shift"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time Range
                  </label>
                  <input
                    name="range"
                    type="text"
                    required
                    placeholder="e.g., 07:00-09:00"
                    pattern="[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: HH:MM-HH:MM (24-hour format)</p>
                </div>

                {/* Removed maxBookings input field - admin cannot set this value */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Maximum bookings will be set to 10 by default. Only washermen can adjust this value.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowTimeSlotModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {showEditModal && editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Edit className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Edit Template</h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Editing:</strong> {formatDate(editingTemplate.date)} ({editingTemplate.date})
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {slots.map((slot, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{slot.label}</div>
                      <div className="text-xs text-gray-500">{slot.range}</div>
                    </div>
                    <button
                      onClick={() => removeSlot(idx)}
                      className="p-1 text-red-500 hover:bg-red-100 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowTimeSlotModal(true)}
                className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Add New Slot
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-colors disabled:bg-gray-400"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Generate Modal */}
      {showAutoGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Auto-Generate Dates</h3>
              </div>
              <button
                onClick={() => setShowAutoGenerateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Template to Copy From
                </label>
                <select
                  value={selectedTemplateForAutoGen}
                  onChange={(e) => setSelectedTemplateForAutoGen(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Choose a template...</option>
                  {allSlotTemplates
                    .filter(template => template?.date && typeof template.date === 'string')
                    .map((template) => (
                      <option key={template.date} value={template.date}>
                        {formatDate(template.date)} ({template.date}) - {template.slots?.length || 0} slots
                      </option>
                    ))}
                </select>
              </div>

              <div className="mb-6 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Available for generation:</strong> {availableDates.length} dates
                </p>
                <p className="text-xs text-green-600 mt-1">
                  This will create templates for the next 10 available dates using the selected template as a base.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAutoGenerateModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAutoGenerate}
                  disabled={autoGenerating || !selectedTemplateForAutoGen}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-colors disabled:bg-gray-400"
                >
                  {autoGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 inline mr-2" />
                      Auto Generate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSlotTemplateManager;

