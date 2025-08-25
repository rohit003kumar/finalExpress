
// const bcrypt = require("bcryptjs")
// const User = require('../models/user.model')
// const Booking = require("../models/booking.model");



// // //get current logged-in user
// // const getCurrentUser = async (req, res) => {
// //   try {
// //     const user = await User.findById(req.userId).select('-password');
// //     if (!user) return res.status(404).json({ message: "User not found" });
// //     res.json(user);
// //   } catch (error) {
// //     res.status(500).json({ message: "Error fetching user" });
// //   }
// // };


// // Get current logged-in user
// const getCurrentUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching user" });
//   }
// };


// //update user 
// const updateUser = async (req, res) => {
//   try {
//     const userId = req.params.id;
// console.log(userId)
//     if (userId !== req.userId) {
//       return res.status(403).json({ message: "unauthorized: you can only update your own info" });
//     }

//     const user = await User.findById(userId);
//     // console.log("user",user)
//     if (!user) {
//       return res.status(404).json({ message: "user not found" });
//     }
//     const {
//       name,
//       contact,
//       address,
//       email,
//       location,
//       range,
//       role,
//       password
//     } = req.body;

//     //disallow updates to email,role, and password cannot be change
//      // Disallow updates to sensitive fields
//     if (email && email !== user.email) {
//       return res.status(400).json({ message: "Email change not allowed" });
//     }

//     if (password) {
//       return res.status(400).json({ message: "Password change not allowed here" });
//     }


//     //not role change
//     if (role && role !== user.role) {
//       return res.status(400).json({ message: "Role change not allowed" });
//     }

//     //only washerman can update range 
//     if (range !== undefined) {
//       if (user.role !== 'washerman') {
//         return res.status(403).json({ message: "Only washerman can update range" });
//       }
//       else {
//         user.range = range;
//       }
//     }

//     //update other fields
//     if (name !== undefined) user.name = name;
//     if (contact !== undefined) user.contact = contact;
//     if (address !== undefined) user.address = address;
//     if (location !== undefined) user.location = location;
 
//     await user.save();
//     const updatedUser = user.toObject();
//         console.log("updateUser",updateUser)
//     delete updateUser.password;
//     res.json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ message: "Error updating user", error: err.message });
//   }

// }


// //delete User after verifying password

// const deleteUser = async (req, res) => {
//   try {

//     const userId = req.params.id;
//     const { password } = req.body;

//     //only logged-in user can delete own account
//     if (userId !== req.userId) {
//       return res.status(403).json({ message: "Unauthorized: You can only delete your own account" });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "user not found" });
//     }

//     //check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(404).json({ message: "Incorrect password" });
//     }

//     await User.findByIdAndDelete(userId);
//     res.json({ message: "Account deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting account", error: error.message });
//   }
// };





// // OPTIONAL: ADMIN - GET ALL USERS
// // const getAllUsers = async (req, res) => {
// //   try {
// //     const users = await User.find().select('-password');
// //     res.json(users);
// //   } catch (err) {
// //     res.status(500).json({ message: "Error fetching users" });
// //   }
// // };


// // GET ALL CUSTOMERS ONLY
// // const getAllCustomers = async (req, res) => {
// //   try {
// //     const customers = await User.find({ role: "customer" }).select("-password");
// //     res.json(customers);
// //   } catch (err) {
// //     res.status(500).json({ message: "Error fetching customers" });
// //   }
// // };


// // const Booking = require("../models/booking.model");
// // const User = require("../models/user.model");

// const getAllCustomers = async (req, res) => {
//   try {
//     const customers = await User.find({ role: "customer" }).select("-password");
//     console.log("👥 Customers:", customers.length);

//     const enrichedCustomers = await Promise.all(
//       customers.map(async (user) => {
//         const orders = await Booking.find({ guest: user._id });
//         console.log(`📦 Orders for ${user.email}:`, orders.length);
//         const spent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
//         console.log(`💰 Spent by ${user.email}: ₹${spent}`);

//        return {
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           contact: user.contact || null,
//           address: user.address || null,
//           createdAt: user.createdAt || null,
//           totalOrders: orders.length,
//           totalSpent: spent,
//           preferences: user.preferences || [],
//         };
//       })
//     );

//     res.json(enrichedCustomers);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching customers", error: err.message });
//   }
// };









// module.exports = { getCurrentUser, updateUser, deleteUser,getAllCustomers };












const bcrypt = require("bcryptjs");
const User = require('../models/user.model');
const Booking = require("../models/booking.model");

// ✅ Get current logged-in user (excluding password)
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

// ✅ Update user info (email, role, password updates restricted)
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId !== req.userId) {
      return res.status(403).json({ message: "Unauthorized: You can only update your own info" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, contact, address, email, location, range, role, password } = req.body;

    if (email && email !== user.email) {
      return res.status(400).json({ message: "Email change not allowed" });
    }

    if (password) {
      return res.status(400).json({ message: "Password change not allowed here" });
    }

    if (role && role !== user.role) {
      return res.status(400).json({ message: "Role change not allowed" });
    }

    // Allow range update only for washerman
    if (range !== undefined) {
      if (user.role !== 'washerman') {
        return res.status(403).json({ message: "Only washerman can update range" });
      }
      user.range = range;
    }

    // Safe updates
    if (name !== undefined) user.name = name;
    if (contact !== undefined) user.contact = contact;
    if (address !== undefined) user.address = address;
    if (location !== undefined) user.location = location;

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
};

// ✅ Delete user account after verifying password
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { password } = req.body;

    if (userId !== req.userId) {
      return res.status(403).json({ message: "Unauthorized: You can only delete your own account" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    await User.findByIdAndDelete(userId);
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting account", error: error.message });
  }
};

// ✅ Get all customers with total orders and total amount spent
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }).select("-password");

    const enrichedCustomers = await Promise.all(
      customers.map(async (user) => {
        const orders = await Booking.find({ guest: user._id });
        const spent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          contact: user.contact || null,
          address: user.address || null,
          createdAt: user.createdAt || null,
          totalOrders: orders.length,
          totalSpent: spent,
          preferences: user.preferences || [],
        };
      })
    );

    res.json(enrichedCustomers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching customers", error: err.message });
  }
};

module.exports = {
  getCurrentUser,
  updateUser,
  deleteUser,
  getAllCustomers,
};
