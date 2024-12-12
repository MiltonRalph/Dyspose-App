const express = require('express');
const {
  getAllProducts,
  createProduct,
  deleteProduct,
} = require('../controllers/productController');
const upload = require('../middleware/uploads'); // Middleware to handle image uploads
const verifyToken = require('../middleware/authMiddleware'); // Middleware to verify user authentication

const router = express.Router();

// Get all products
router.get('/', getAllProducts);

// Create a new product (protected route)
router.post('/', verifyToken, upload.single('image'), createProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
