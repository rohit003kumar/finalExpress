



// const SlotTemplate = require("../models/predefine.model"); // Global slot templates
// const WashermanSlot = require("../models/wavailable.model"); // Washerman-specific slots

// // ✅ Washerman enables slots for a specific date
// // exports.enableWashermanSlots = async (req, res) => {
// //   try {
// //     const washermanId = req.userId;
// //     const { date, enabledSlots } = req.body;

// //     // 1. Validate input
// //     if (!date || !Array.isArray(enabledSlots)) {
// //       return res.status(400).json({ error: "Date and enabledSlots are required." });
// //     }

// //     // 2. Check if global slot template exists for that date
// //     const template = await SlotTemplate.findOne({ date });
// //     if (!template) {
// //       return res.status(404).json({ error: "No slot template found for this date." });
// //     }

// //     // 3. Validate if enabled slots are within global template
// //     const allowedRanges = template.slots.map(s => s.range);
// //     const invalidSlots = enabledSlots.filter(
// //       (s) => !allowedRanges.includes(s.range)
// //     );

// //     if (invalidSlots.length > 0) {
// //       return res.status(400).json({
// //         error: "Invalid slot(s) selected",
// //         invalidSlots,
// //       });
// //     }

// //     // 4. Save (or update) washerman's enabled slots
// //     await WashermanSlot.updateOne(
// //       { washermanId, date },
// //       { $set: { enabledSlots } },
// //       { upsert: true }
// //     );

// //     return res.status(200).json({ message: "Washerman slots saved successfully." });
// //   } catch (error) {
// //     console.error("Washerman slot error:", error);
// //     return res.status(500).json({ error: "Failed to update washerman slots." });
// //   }
// // };

// exports.enableWashermanSlots = async (req, res) => {
//   try {
//     const washermanId = req.userId;
//     const { date, enabledSlots } = req.body;

//     if (!date || !Array.isArray(enabledSlots)) {
//       return res.status(400).json({ error: "Date and enabledSlots are required." });
//     }

//     // ✅ Fetch global slot template for the date
//     const template = await SlotTemplate.findOne({ date });
//     if (!template) {
//       return res.status(404).json({ error: "No slot template found for this date." });
//     }

//     const validRanges = template.slots.map(s => s.range);

//     // ✅ Validate all provided slots: must be from template & have maxBookings
//     const invalidSlots = enabledSlots.filter(slot => {
//       return (
//         !validRanges.includes(slot.range) ||
//         typeof slot.maxBookings !== "number" ||
//         slot.maxBookings < 1
//       );
//     });

//     if (invalidSlots.length > 0) {
//       return res.status(400).json({
//         error: "Invalid slots provided",
//         invalidSlots,
//       });
//     }

//     // ✅ Upsert washerman's enabled slots
//     await WashermanSlot.updateOne(
//       { washermanId, date },
//       { $set: { enabledSlots } },
//       { upsert: true }
//     );

//     return res.status(200).json({ message: "Washerman slots updated with max bookings." });
//   } catch (error) {
//     console.error("Washerman slot error:", error);
//     return res.status(500).json({ error: "Failed to update washerman slots." });
//   }
// };





// // ✅ Get available slots for a washerman (for a given date)
// exports.getAvailableSlots = async (req, res) => {
//   try {
//     const { washermanId, date } = req.query;

//     if (!washermanId || !date) {
//       return res.status(400).json({ error: "washermanId and date are required." });
//     }

//     const washermanSlots = await WashermanSlot.findOne({ washermanId, date });

//     if (!washermanSlots) {
//       return res.status(200).json({ enabledSlots: [] });
//     }

//     return res.status(200).json({ enabledSlots: washermanSlots.enabledSlots });
//   } catch (error) {
//     console.error("Fetch washerman slots error:", error);
//     return res.status(500).json({ error: "Failed to fetch available slots." });
//   }
// };

// // ✅ Get all dates with enabled slots for a washerman
// exports.getAllWashermanSlotDates = async (req, res) => {
//   try {
//     const washermanId = req.userId;

//     const allSlots = await WashermanSlot.find({ washermanId });

//     return res.status(200).json(allSlots); // [{ date, enabledSlots }]
//   } catch (error) {
//     console.error("Fetch all washerman slots error:", error);
//     return res.status(500).json({ error: "Failed to fetch washerman slots." });
//   }
// };

// exports.getAllAdminSlotTemplates = async (req, res) => {
//   try {
//     const templates = await SlotTemplate.find().sort({ date: 1 });
//     res.status(200).json(templates); // [{ date, slots: [ { label, range } ] }]
//   } catch (error) {
//     console.error("Error fetching slot templates:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };




// ✅ Optionally delete slots for a specific date
// exports.deleteWashermanSlot = async (req, res) => {
//   try {
//     const washermanId = req.userId;
//     const { date } = req.body;

//     if (!date) {
//       return res.status(400).json({ error: "Date is required." });
//     }

//     await WashermanSlot.deleteOne({ washermanId, date });

//     return res.status(200).json({ message: "Slot deleted successfully." });
//   } catch (error) {
//     console.error("Delete slot error:", error);
//     return res.status(500).json({ error: "Failed to delete slot." });
//   }
// };





const SlotTemplate = require("../models/predefine.model"); // Global slot templates
const WashermanSlot = require("../models/wavailable.model"); // Washerman-specific slots

// ✅ Washerman enables slots for a specific date with maxBookings
exports.enableWashermanSlots = async (req, res) => {
  try {
    const washermanId = req.userId;
    const { date, enabledSlots } = req.body;

    if (!date || !Array.isArray(enabledSlots)) {
      return res.status(400).json({ error: "Date and enabledSlots are required." });
    }

    // ✅ Fetch global slot template for the date
    const template = await SlotTemplate.findOne({ date });
    if (!template) {
      return res.status(404).json({ error: "No slot template found for this date." });
    }

    const validRanges = template.slots.map(s => s.range);

    // ✅ Validate all provided slots: must be from template & have maxBookings
    const invalidSlots = enabledSlots.filter(slot => {
      return (
        !validRanges.includes(slot.range) ||
        typeof slot.maxBookings !== "number" ||
        slot.maxBookings < 1
      );
    });

    if (invalidSlots.length > 0) {
      return res.status(400).json({
        error: "Invalid slots provided",
        invalidSlots,
      });
    }

    // ✅ Initialize booked count if not present
    const slotsToSave = enabledSlots.map(slot => ({
      ...slot,
      booked: slot.booked || 0
    }));

    // ✅ Upsert washerman's enabled slots
    await WashermanSlot.updateOne(
      { washermanId, date },
      { $set: { enabledSlots: slotsToSave } },
      { upsert: true }
    );

    return res.status(200).json({ message: "Washerman slots updated with max bookings." });
  } catch (error) {
    console.error("Washerman slot error:", error);
    return res.status(500).json({ error: "Failed to update washerman slots." });
  }
};

// ✅ Get available slots for a washerman (for a given date)
exports.getAvailableSlots = async (req, res) => {
  try {
    const { washermanId, date } = req.query;

    if (!washermanId || !date) {
      return res.status(400).json({ error: "washermanId and date are required." });
    }

    const washermanSlots = await WashermanSlot.findOne({ washermanId, date });

    if (!washermanSlots) {
      return res.status(200).json({ enabledSlots: [] });
    }

    return res.status(200).json({ enabledSlots: washermanSlots.enabledSlots });
  } catch (error) {
    console.error("Fetch washerman slots error:", error);
    return res.status(500).json({ error: "Failed to fetch available slots." });
  }
};

// ✅ Washerman: Get all dates with enabled slots
exports.getAllWashermanSlotDates = async (req, res) => {
  try {
    const washermanId = req.userId;

    const allSlots = await WashermanSlot.find({ washermanId });

    return res.status(200).json(allSlots); // [{ date, enabledSlots }]
  } catch (error) {
    console.error("Fetch all washerman slots error:", error);
    return res.status(500).json({ error: "Failed to fetch washerman slots." });
  }
};

// ✅ Admin: Get all slot templates created by admin
exports.getAllAdminSlotTemplates = async (req, res) => {
  try {
    const templates = await SlotTemplate.find().sort({ date: 1 });
    res.status(200).json(templates); // [{ date, slots: [ { label, range } ] }]
  } catch (error) {
    console.error("Error fetching slot templates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Washerman: View booking counts per slot for a given date
exports.getSlotBookingCounts = async (req, res) => {
  try {
    const washermanId = req.userId;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const availability = await WashermanSlot.findOne({ washermanId, date });

    if (!availability) {
      return res.status(404).json({ message: "No slot availability found for this date" });
    }

    res.status(200).json({
      enabledSlots: availability.enabledSlots.map(slot => ({
        _id: slot._id,
        label: slot.label,
        range: slot.range,
        maxBookings: slot.maxBookings,
        booked: slot.booked || 0
      }))
    });
  } catch (err) {
    console.error("Slot fetch error:", err);
    res.status(500).json({ message: "Failed to fetch slot booking counts", error: err.message });
  }
};
