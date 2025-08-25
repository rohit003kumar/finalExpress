const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");

    const createAdmin = async () => {
      const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
      if (existing) {
        console.log("⚠️ Admin already exists.");
        return;
      }

      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await User.create({
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      });
      console.log("✅ Admin created");
    };

    createAdmin();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
