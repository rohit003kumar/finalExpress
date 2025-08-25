




const mongoose = require("mongoose");
const  WashermanSlot  = require("../models/wavailable.model");
const Booking = require("../models/booking.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");

// ✅ Create a Booking
// const createBooking = async (req, res) => {
//   try {
//     const { id } = req.params; // productId
//     const { totalAmount, pickupDate, slot, quantity, paymentMethod, upiProvider } = req.body;

//     const quantityNum = Number(quantity);
//     if (isNaN(quantityNum) || quantityNum < 1) {
//       return res.status(400).json({ message: "Invalid quantity" });
//     }

//     const product = await Product.findById(id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const washermanId = product.washerman;
//     const userId = req.userId;

//     if (userId.toString() === washermanId.toString()) {
//       return res.status(400).json({ message: "You cannot book your own service." });
//     }

//     const availability = await WashermanAvailability.findOne({ washerman: washermanId, date: pickupDate });
//     if (!availability) {
//       return res.status(404).json({ message: "Washerman is not available on this date" });
//     }

//     const slotMatch = availability.slots.find(s => s.range === slot.range && s.label === slot.label);
//     if (!slotMatch) {
//       return res.status(404).json({ message: "Selected time slot not available" });
//     }

//     const availableCapacity = slotMatch.maxCapacity - slotMatch.booked;
//     if (availableCapacity < quantityNum) {
//       return res.status(400).json({
//         message: `Only ${availableCapacity} slots available in ${slot.range}`
//       });
//     }

//     const booking = await Booking.create({
//       totalAmount,
//       date: pickupDate,
//       slot,
//       washerman: washermanId,
//       guest: userId,
//       productId: product._id,
//       quantity: quantityNum,
//       paymentMethod,
//       upiProvider
//     });

//     await User.findByIdAndUpdate(userId, { $push: { bookings: booking._id } });
//     await User.findByIdAndUpdate(washermanId, { $push: { bookings: booking._id } });

//     await WashermanAvailability.findOneAndUpdate(
//       {
//         washerman: washermanId,
//         date: pickupDate,
//         "slots.range": slot.range
//       },
//       {
//         $inc: { "slots.$[elem].booked": quantityNum }
//       },
//       {
//         arrayFilters: [{ "elem.range": slot.range }],
//         new: true
//       }
//     );

//     const populatedBooking = await Booking.findById(booking._id)
//       .populate("washerman", "name email")
//       .populate("guest", "name email")
//       .populate("productId");

//     return res.status(201).json({ message: "Booking successful", booking: populatedBooking });
//   } catch (error) {
//     console.error("Booking Error:", error);
//     return res.status(500).json({ message: `Booking error: ${error.message}` });
//   }
// };




// const createMultipleBookings = async (req, res) => {
//   try {
//     const { items, pickupDate, pickupTimeSlot, totalAmount, paymentMethod } = req.body;
//     const userId = req.userId;

//     if (!Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: "No booking items provided" });
//     }

//     const bookings = [];

//     for (const item of items) {
//       const { productId, quantity, selectedOptions = [] } = item;

//       const product = await Product.findById(productId);
//       if (!product) continue;

//       const washermanId = product.washerman;
//       if (userId.toString() === washermanId.toString()) continue;

//       const availability = await WashermanSlot.findOne({ washermanId, date: pickupDate });
//       if (!availability) continue;

//       const slotMatch = availability.enabledSlots.find(
//         s =>
//           s.range.toLowerCase() === pickupTimeSlot.range.toLowerCase() &&
//           s.label.toLowerCase() === pickupTimeSlot.label.toLowerCase()
//       );

//       if (!slotMatch || slotMatch.booked + quantity > slotMatch.maxBookings) continue;

//       const booking = await Booking.create({
//         totalAmount,
//         date: pickupDate,
//         slot: pickupTimeSlot,
//         washerman: washermanId,
//         guest: userId,
//         productId,
//         quantity,
//         selectedOptions,
//         paymentMethod,
//         status: "booked"
//       });

//       // Push booking ref
//       await User.findByIdAndUpdate(userId, { $push: { bookings: booking._id } });
//       await User.findByIdAndUpdate(washermanId, { $push: { bookings: booking._id } });

//       // Update booked count in slot
//       await WashermanSlot.findOneAndUpdate(
//         {
//           washermanId,
//           date: pickupDate,
//           "enabledSlots.range": pickupTimeSlot.range,
//         },
//         {
//           $inc: { "enabledSlots.$[elem].booked": quantity }
//         },
//         {
//           arrayFilters: [{ "elem.range": pickupTimeSlot.range }],
//           new: true
//         }
//       );

//       bookings.push(booking);
//     }

//     if (bookings.length === 0) {
//       return res.status(400).json({ message: "No valid bookings could be created" });
//     }

//     res.status(201).json({ message: "Multiple bookings successful", bookings });
//   } catch (err) {
//     console.error("❌ Multi-booking error:", err);
//     res.status(500).json({ message: "Failed to create bookings", error: err.message });
//   }
// };




const createMultipleBookings = async (req, res) => {
  try {
    const { items, pickupDate, pickupTimeSlot, paymentMethod, deliveryAddress, deliveryInstructions } = req.body;
    const userId = req.userId;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No booking items provided" });
    }

    const bookings = [];

    for (const item of items) {
      const { productId, quantity, selectedOptions: selectedOptionIds = [] } = item;

      const product = await Product.findById(productId);
      if (!product) continue;

      const washermanId = product.washerman;
      if (userId.toString() === washermanId.toString()) continue;

      const availability = await WashermanSlot.findOne({ washermanId, date: pickupDate });
      if (!availability) continue;

      const slotMatch = availability.enabledSlots.find(
        s =>
          s.range.toLowerCase() === pickupTimeSlot.range.toLowerCase() &&
          s.label.toLowerCase() === pickupTimeSlot.label.toLowerCase()
      );

      if (!slotMatch || slotMatch.booked + quantity > slotMatch.maxBookings) continue;

      // ✅ Get selected option details from product
      const validOptions = product.options.filter(opt =>
        selectedOptionIds.includes(opt.id)
      );

      // ✅ Build selectedOptions array
      const selectedOptions = validOptions.map(opt => ({
        id: opt.id,
        name: opt.name,
        price: opt.price
      }));

      // ✅ Calculate total based on selected option prices × quantity
      const calculatedTotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0) * quantity;

      const booking = await Booking.create({
        totalAmount: calculatedTotal,
        date: pickupDate,
        slot: pickupTimeSlot,
        washerman: washermanId,
        guest: userId,
        customer: userId, // Add customer reference
        productId,
        quantity,
        selectedOptions,
        paymentMethod,
        status: "booked",
        deliveryAddress: deliveryAddress || null,
        deliveryInstructions: deliveryInstructions || null
      });

      // ✅ Update both guest and washerman users
      await User.findByIdAndUpdate(userId, { $push: { bookings: booking._id } });
      await User.findByIdAndUpdate(washermanId, { $push: { bookings: booking._id } });

      // ✅ Update slot bookings
      await WashermanSlot.findOneAndUpdate(
        {
          washermanId,
          date: pickupDate,
          "enabledSlots.range": pickupTimeSlot.range
        },
        {
          $inc: { "enabledSlots.$[elem].booked": quantity }
        },
        {
          arrayFilters: [{ "elem.range": pickupTimeSlot.range }],
          new: true
        }
      );

      bookings.push(booking);
    }

    if (bookings.length === 0) {
      return res.status(400).json({ message: "No valid bookings could be created" });
    }

    res.status(201).json({ message: "Multiple bookings successful", bookings });
  } catch (err) {
    console.error("❌ Multi-booking error:", err);
    res.status(500).json({ message: "Failed to create bookings", error: err.message });
  }
};




// ✅ Get bookings for logged-in user
const getMyBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const role = req.userRole;

    const filter = role === "customer"
      ? { guest: userId }
      : { washerman: userId };

    const bookings = await Booking.find(filter)
      .populate("productId")
      .populate("guest", "name email contact address")
      .populate("washerman", "name email contact");

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Fetching bookings failed", error: err.message });
  }
};

// ✅ Admin: Get all bookings
const getAllBookings = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const bookings = await Booking.find()
      .populate("productId")
      .populate("guest", "name email contact address")
      .populate("washerman", "name email contact");

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Fetching all bookings failed", error: err.message });
  }
};





const getAssignedBookings = async (req, res) => {
  try {
    const userId = req.userId;
    if (req.userRole !== "washerman") {
      return res.status(403).json({ message: "Access denied: Washermen only" });
    }

    const bookings = await Booking.find({ washerman: userId })
      .populate("guest", "name email contact address")
      .populate("productId", "name category serviceType image")
      .populate("washerman", "name email");

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Fetching assigned bookings failed", error: err.message });
  }
};








// ✅ Update payment info
const updatePaymentInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, upiProvider, paymentStatus } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentMethod = paymentMethod || booking.paymentMethod;
    booking.upiProvider = upiProvider || booking.upiProvider;
    booking.paymentStatus = paymentStatus || booking.paymentStatus;

    await booking.save();
    res.status(200).json({ message: "Payment updated", booking });
  } catch (err) {
    res.status(500).json({ message: "Error updating payment", error: err.message });
  }
};




// ✅ Cancel or update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.userId;
    const role = req.userRole;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const currentStatus = booking.status;

    if (status === "cancelled") {
      const isWasherman = role === "washerman" && booking.washerman.toString() === userId.toString();
      const isCustomer = role === "customer" && booking.guest.toString() === userId.toString();

      if (!isWasherman && !isCustomer) {
        return res.status(403).json({ message: "Not authorized to cancel this booking" });
      }

      if (!["booked", "picked_up"].includes(currentStatus)) {
        return res.status(400).json({ message: `Cannot cancel booking as it is already '${currentStatus}'` });
      }

      booking.status = "cancelled";
      await booking.save();

      await WashermanAvailability.findOneAndUpdate(
        {
          washerman: booking.washerman,
          date: booking.date,
          "slots.range": booking.slot.range
        },
        {
          $inc: { "slots.$.booked": -booking.quantity }
        }
      );

      return res.status(200).json({ message: "Booking cancelled and slot updated", booking });
    }

    if (role === "washerman" && booking.washerman.toString() === userId.toString()) {
      const allowedTransitions = {
        booked: "picked_up",
        picked_up: "in_progress",
        in_progress: "delivered"
      };

      if (allowedTransitions[currentStatus] !== status) {
        return res.status(400).json({ message: `Invalid status transition from '${currentStatus}' to '${status}'` });
      }

      booking.status = status;
      await booking.save();
      return res.status(200).json({ message: `Status updated to '${status}'`, booking });
    }

    return res.status(403).json({ message: "Unauthorized to update booking status" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


const getOrderSummary = async (req, res) => {
  try {
    const deliveryFee = 49; // Static or calculated

    // Optionally: fetch cart from DB/localStorage and calculate totalAmount
    // But for now, front-end is sending cart and total already

    res.status(200).json({ deliveryFee, total: deliveryFee });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get order summary', error: err.message });
  }
};






module.exports = {
  createMultipleBookings,
  // createBooking,
  getMyBookings,
  getAllBookings,
  getAssignedBookings,
  updatePaymentInfo,
  updateBookingStatus,
  getOrderSummary
};






