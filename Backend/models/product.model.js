


// const mongoose = require('mongoose');

// const optionSchema = new mongoose.Schema({
//   id: { type: String, required: true }, // frontend checkbox uses this
//   name: { type: String, required: true },
//   price: { type: Number, required: true }
// });

// const productSchema = new mongoose.Schema({
//   image: {
//     type: String,
//     required: true
//   },
//   washerman: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   guest: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },
//   category: {
//     type: String,
//     enum: ['Shirt', 'Pant', 'Bedsheet', 'Curtain'],
//     required: true
//   },
//   serviceType: {
//     type: String,
//     enum: ['wash', 'dry-clean', 'iron'],
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   title: {
//     type: String,
//     required: true
//   },
//   description: {
//     type: String,
//     default: ""
//   },
//   rating: {
//     type: Number,
//     min: 0,
//     max: 5,
//     default: 0
//   },
//   isBooked: {
//     type: Boolean,
//     default: false
//   },
//   options: {
//     type: [optionSchema],
//     default: []
//   }
// }, {
//   timestamps: true
// });

// const ProductModel = mongoose.model('Product', productSchema);

// module.exports = ProductModel;






const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  id: { type: String, required: true }, // e.g., 'wash'
  name: { type: String, required: true }, // e.g., 'Wash'
  price: { type: Number, required: true } // e.g., 50
});

const productSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  washerman: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  category: {
    type: String,
    enum: ['Shirt', 'Pant', 'Bedsheet', 'Curtain'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  options: {
    type: [optionSchema],
    required: true
  }
}, {
  timestamps: true
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
