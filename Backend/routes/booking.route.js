

const express = require('express');
const { isAuth,isWasherman } = require('../middleware/isAuth');
const Booking = require('../models/booking.model'); // adjust path if needed
const {
  createMultipleBookings,
  // createBooking,
  getMyBookings,
  getAllBookings,
  getAssignedBookings,
  updateBookingStatus,
  updatePaymentInfo,
  getOrderSummary
} = require('../controllers/booking.controller');

const bookingRouter = express.Router();

// // 📦 Create a booking (customer only) — requires product ID
// bookingRouter.post('/create/:id', isAuth, createBooking);
// 📦   Create multiple bookings (customer only) — requires product IDs
bookingRouter.post('/create-multi', isAuth, createMultipleBookings);

// 👤 Get bookings for logged-in user (customer/washerman)
bookingRouter.get('/', isAuth, getMyBookings);

// 🧺 Washerman: Get assigned bookings
bookingRouter.get('/assigned', isAuth, getAssignedBookings);

// 🛡️ Admin: Get all bookings
bookingRouter.get('/all', isAuth, getAllBookings);

// 🔄 Update booking status (cancel, pick-up, delivered)
bookingRouter.put('/:id/status', isAuth, updateBookingStatus);

// 💳 Update payment status/method
bookingRouter.put('/:id/payment', isAuth, updatePaymentInfo);

bookingRouter.get('/summary', isAuth, getOrderSummary); 


// ✅ Mark COD as paid (washerman only)
bookingRouter.put('/:id/mark-paid', isAuth,isWasherman, async (req, res) => {
  const { id } = req.params;

  try {
    await Order.updateOne(
      { _id: id },
      { $set: { paymentStatus: "Success", paidBy: "Cash" } }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Failed to mark payment as paid:', err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});



// Require your Booking model at the top


// Mark payment as paid
bookingRouter.post('/orders/:id/mark-paid', isAuth,isWasherman, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.paymentStatus = 'paid';
    await booking.save();

    res.json({ success: true, message: 'Payment marked as paid' });
  } catch (err) {
    console.error('Error marking payment as paid:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});




module.exports = bookingRouter;
