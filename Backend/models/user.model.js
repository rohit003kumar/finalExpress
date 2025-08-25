




const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // recommended
  },
  password: {
    type: String,
    required: true
  },

  // Products posted by washerman (array)
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],

  // Bookings made by customer (array)
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  }],

  role: {
    type: String,
    enum: ['customer', 'washerman','admin'],
    required: true
  },

  contact: String,

  // Enhanced address schema
  address: {
    houseNo: String,
    street: String,
    landmark: String,
    city: String,
    state: String,
    pincode: String,
    fullAddress: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    isDefault: {
      type: Boolean,
      default: true
    }
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      default: [0, 0]
    }
  },

  range: {
    type: Number,
    default: function () {
      return this.role === 'washerman' ? 500 : null;
    }
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
