


const mongoose = require("mongoose");

const washermanSlotSchema = new mongoose.Schema({
  washermanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  enabledSlots: [
    {
      label: String,      // Optional: e.g., "Morning Slot"
      range: String,      // Required: e.g., "09:00-10:00"
      maxBookings: {
        type: Number,
        required: true,
        min: 1
      },
      booked: {
        type: Number,
        default: 0
      }
    }
  ]
});

module.exports = mongoose.model("WashermanSlot", washermanSlotSchema);
