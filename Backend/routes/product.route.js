




const express = require('express');
const productRouter = express.Router();
const { isAuth, isWasherman } = require('../middleware/isAuth');
const upload = require('../middleware/multer');
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts  // ✅ ADD THIS
} = require('../controllers/product.controller');

// ✅ Add your missing route here
productRouter.get('/my-products', isAuth,isWasherman, getMyProducts);

// Create product
productRouter.post('/create', isAuth, upload.single('image'), addProduct);

// Update product
productRouter.put('/:id', isAuth, updateProduct);

// Delete product
productRouter.delete('/:id', isAuth, deleteProduct);

// Get all products
productRouter.get('/all',  getAllProducts);

// Get product by ID
productRouter.get('/:id', isAuth, getProductById);

module.exports = productRouter;
