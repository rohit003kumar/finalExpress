const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  time: { type: String, required: true }
});

const systemTimeSlotSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // unique date
  slots: [slotSchema]
});

module.exports = mongoose.model("SystemTimeSlot", systemTimeSlotSchema);



