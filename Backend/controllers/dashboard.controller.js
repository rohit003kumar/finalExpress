







const mongoose = require("mongoose");
const Booking = require("../models/booking.model");
const User = require("../models/user.model");
const moment = require('moment');

const getUserDashboardStats = async (req, res) => {
  try {
    const guestId = req.userId;

    const totalOrders = await Booking.countDocuments({ guest: guestId });

    const activeOrders = await Booking.countDocuments({ 
      guest: guestId, 
      status: { $in: ['booked', 'in_progress', 'picked_up'] }
    });

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const totalSpentAgg = await Booking.aggregate([
      { $match: { guest: new mongoose.Types.ObjectId(guestId), createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalSpent = totalSpentAgg[0]?.total || 0;

    res.json({ totalOrders, activeOrders, totalSpent });

  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getWasherDashboard = async (req, res) => {
  const washerId = req.userId;

  try {
    const washer = await User.findById(washerId);
    console.log("Washerman ID received:", washerId);
    if (!washer || washer.role !== 'washerman') {
      return res.status(404).json({ error: 'Washerman not found' });
    }

    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();
    console.log("Today's date range:", todayStart, todayEnd);

    const todaysBookings = await Booking.find({
      washerman: washerId,
      createdAt: { $gte: todayStart, $lte: todayEnd }
    });

    const totalOrders = todaysBookings.length;
    console.log("Today's bookings:", todaysBookings);

    const completedOrders = todaysBookings.filter(b => b.status === 'delivered').length;
    const earnings = todaysBookings
      .filter(b => b.status === 'delivered')
      .reduce((acc, cur) => acc + (cur.totalAmount || 0), 0);
 
    console.log("Total earnings for today:", earnings);
    return res.json({
      name: washer.name,
      totalOrders,
      completedOrders,
      earnings,
      date: moment().format("YYYY-MM-DD"),
      time: moment().format("hh:mm A")
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getUserDashboardStats, getWasherDashboard };
