// const User = require('../models/user.model');


// // ✅ Get all washermen (for admin or customer to view/search)
// const getAllWashermen = async (req, res) => {
//   try {
//     const washermen = await User.find({ role: 'washerman' }).select('-password');
//     res.json(washermen);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch washermen", error: err.message });
//   }
// };

// // ✅ Get a specific washerman by ID
// const getWashermanById = async (req, res) => {
//   try {
//     const washerman = await User.findOne({ _id: req.params.id, role: 'washerman' }).select('-password');
//     if (!washerman) return res.status(404).json({ message: "Washerman not found" });
//     res.json(washerman);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch washerman", error: err.message });
//   }
// };

// // ✅ Washerman: Update own availability range
// const updateRange = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user || user.role !== 'washerman') {
//       return res.status(403).json({ message: "Only washermen can update range" });
//     }

//     const { range } = req.body;
//     if (!range || typeof range !== 'number') {
//       return res.status(400).json({ message: "Invalid range value" });
//     }

//     user.range = range;
//     await user.save();

//     res.json({ message: "Range updated successfully", range: user.range });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to update range", error: err.message });
//   }
// };

// // ✅ Washerman: Update location
// const updateLocation = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user || user.role !== 'washerman') {
//       return res.status(403).json({ message: "Only washermen can update location" });
//     }

//     const { coordinates } = req.body; // e.g., [lng, lat]
//     if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
//       return res.status(400).json({ message: "Invalid coordinates" });
//     }

//     user.location.coordinates = coordinates;
//     await user.save();

//     res.json({ message: "Location updated successfully", location: user.location });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to update location", error: err.message });
//   }
// };



// // const UserModel = require('../models/user.model'); // path to your User model


// const findWashermenWithinRange = async (req, res) => {
//   try {
//     const { latitude, longitude, searchRadius = 600 } = req.query;

//     if (!latitude || !longitude) {
//       return res.status(400).json({ message: 'Latitude and longitude required' });
//     }

//     const washermen = await UserModel.aggregate([
//       {
//         $geoNear: {
//           near: {
//             type: 'Point',
//             coordinates: [parseFloat(longitude), parseFloat(latitude)]
//           },
//           distanceField: 'dist.calculated',
//           spherical: true,
//           maxDistance: parseInt(searchRadius),
//           query: { role: 'washerman' }
//         }
//       }
//     ]);

//     const filteredWashermen = washermen.filter(w => {
//       const range = w.range || 500;
//       return w.dist.calculated <= range;
//     });

//     res.json({ washermen: filteredWashermen });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// module.exports = {
//   getAllWashermen,
//   getWashermanById,
//   updateRange,
//   updateLocation,
//  findWashermenWithinRange

// };






const User = require('../models/user.model');

// ✅ Get all washermen (for admin or customer to view/search)
const getAllWashermen = async (req, res) => {
  try {
    const washermen = await User.find({ role: 'washerman' }).select('-password');
    res.json(washermen);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch washermen", error: err.message });
  }
};

// ✅ Get a specific washerman by ID
const getWashermanById = async (req, res) => {
  try {
    const washerman = await User.findOne({ _id: req.params.id, role: 'washerman' }).select('-password');
    if (!washerman) return res.status(404).json({ message: "Washerman not found" });
    res.json(washerman);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch washerman", error: err.message });
  }
};

// ✅ Washerman: Update own availability range
const updateRange = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'washerman') {
      return res.status(403).json({ message: "Only washermen can update range" });
    }

    const { range } = req.body;
    if (!range || typeof range !== 'number') {
      return res.status(400).json({ message: "Invalid range value" });
    }

    user.range = range;
    await user.save();

    res.json({ message: "Range updated successfully", range: user.range });
  } catch (err) {
    res.status(500).json({ message: "Failed to update range", error: err.message });
  }
};

// ✅ Washerman: Update location
const updateLocation = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'washerman') {
      return res.status(403).json({ message: "Only washermen can update location" });
    }

    const { coordinates } = req.body; // e.g., [lng, lat]
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    user.location.coordinates = coordinates;
    await user.save();

    res.json({ message: "Location updated successfully", location: user.location });
  } catch (err) {
    res.status(500).json({ message: "Failed to update location", error: err.message });
  }
};

// ✅ Washerman: Find washermen within range using geospatial query
const findWashermenWithinRange = async (req, res) => {
  try {
    const { latitude, longitude, searchRadius = 600 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude required' });
    }

    const washermen = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          distanceField: 'dist.calculated',
          spherical: true,
          maxDistance: parseInt(searchRadius),
          query: { role: 'washerman' }
        }
      }
    ]);

    const filteredWashermen = washermen.filter(w => {
      const range = w.range || 500;
      return w.dist.calculated <= range;
    });

    res.json({ washermen: filteredWashermen });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// ✅ Admin: Get dashboard data for all washermen
// const getWashermanDashboardData = async (req, res) => {
//   try {
//     const washermen = await User.find({ role: 'washerman' }).select('-password');

//     const dashboardData = await Promise.all(
//       washermen.map(async (w) => {
//         const orders = await Booking.find({ washerman: w._id });

//         const completed = orders.filter(o => o.status === 'completed').length;
//         const totalEarnings = orders
//           .filter(o => o.status === 'completed')
//           .reduce((sum, o) => sum + (o.total || 0), 0);

//         return {
//           _id: w._id,
//           name: w.name,
//           email: w.email,
//           status: w.status || 'ACTIVE',
//           availability: w.isAvailable ?? true,
//           orders: orders.length,
//           currentBookings: {
//             completed,
//             total: orders.length
//           },
//           earnings: totalEarnings,
//           profileImage: '/profile.png'
//         };
//       })
//     );

//     res.json(dashboardData);
//   } catch (err) {
//     console.error('Dashboard Error:', err);
//     res.status(500).json({ message: 'Failed to fetch washerman dashboard', error: err.message });
//   }
// };
const Booking = require('../models/booking.model');
const WashermanSlot = require('../models/wavailable.model');

const getAllLaundrymen = async (req, res) => {
  try {
    const laundrymen = await User.find({ role: "washerman" }).select("-password");

    const enrichedLaundrymen = await Promise.all(
      laundrymen.map(async (man) => {
        const orders = await Booking.find({ washerman: man._id });

        const completedOrders = orders.filter(order => order.status === "delivered").length;
        const totalOrders = orders.length;
        const totalEarnings = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // ✅ Correct field: enabledSlots, not slots
        const washermanSlots = await WashermanSlot.find({ washermanId: man._id });
        const enabledSlotLabels = [];

        washermanSlots.forEach(doc => {
          doc?.enabledSlots?.forEach(slot => {
            if (slot.isEnabled) {
              if (slot.label) {
                enabledSlotLabels.push(slot.label);
              } else if (slot.start && slot.end) {
                enabledSlotLabels.push(`${slot.start} - ${slot.end}`);
              }
            }
          });
        });

        return {
          id: man._id,
          name: man.name,
          email: man.email,
          contact: man.contact,              // ✅ now included
          createdAt: man.createdAt,          // ✅ now included
          status: man.status || "Active",
          availability: man.availability || "Available",
          totalOrders,
          completedOrders,
          earnings: totalEarnings,
          maxOrders: man.maxOrders || 10,
          specialties: man.specialties || [],
          workingHours: [...new Set(enabledSlotLabels)], // ✅ final corrected list
        };
      })
    );

    res.json(enrichedLaundrymen);
  } catch (err) {
    console.error("Error fetching laundrymen:", err);
    res.status(500).json({ message: "Error fetching laundrymen", error: err.message });
  }
};



module.exports = {
  getAllWashermen,
  getWashermanById,
  updateRange,
  updateLocation,
  findWashermenWithinRange,
  getAllLaundrymen,
};

