






// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   guest: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   washerman: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true
//   },
//   date: { type: String, required: true },
//   slot: {
//     label: { type: String },
//     range: { type: String }
//   },
//   quantity: {
//     type: Number,
//     default: 1,
//     min: 1
//   },
//   totalAmount: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   status: {
//     type: String,
//     enum: ['booked', 'picked_up', 'in_progress', 'delivered', 'cancelled'],
//     default: 'booked'
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'paid'],
//     default: 'pending'
//   },
// paymentMethod: {
//   type: String,
//   enum: ['cash'], // only allow 'cash' as a valid value
//   required: true
// }

// }, {
//   timestamps: true
// });

// // Indexes for performance
// bookingSchema.index({ guest: 1 });
// bookingSchema.index({ washerman: 1 });
// // bookingSchema.index({ pickupDate: 1 });
// // bookingSchema.index({ pickupTimeSlot: 1 });
// bookingSchema.index({ status: 1 });

// module.exports = mongoose.model('Booking', bookingSchema);







const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  id: { type: String, required: true },    // e.g., "wash"
  name: { type: String, required: true },  // e.g., "Wash"
  price: { type: Number, required: true }  // e.g., 50
}, { _id: false }); // prevent Mongoose from auto-adding _id to subdocuments

const bookingSchema = new mongoose.Schema({
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  washerman: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  date: { type: String, required: true },
  slot: {
    label: { type: String },
    range: { type: String }
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['booked', 'picked_up', 'in_progress', 'delivered', 'cancelled'],
    default: 'booked'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash'], // only allow 'cash' as a valid value
    required: true
  },
  selectedOptions: [optionSchema], // Add selectedOptions field
  // Enhanced delivery address fields
  deliveryAddress: {
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
    }
  },
  deliveryInstructions: String,
  addressSentToWasherman: {
    type: Boolean,
    default: false
  },
  addressSentAt: Date,
  addressUpdatedAt: Date,
  // Customer and washerman references for easier querying
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for performance
bookingSchema.index({ guest: 1 });
bookingSchema.index({ washerman: 1 });
bookingSchema.index({ customer: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'deliveryAddress.pincode': 1 });

module.exports = mongoose.model('Booking', bookingSchema);
