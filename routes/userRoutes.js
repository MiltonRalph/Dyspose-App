const express = require('express');
const {
  registerUser,
  authUser,
  getUsers,
  getUserById,
  updateUser,
} = require('../controllers/userController');
const upload = require('../middleware/uploads'); // Middleware to handle image uploads
const verifyToken = require('../middleware/authMiddleware'); // Middleware to verify user authentication

userRoutes = express.Router();

// Routes
userRoutes.route('/').get(getUsers);
userRoutes.get('/user/:userId', getUserById);
userRoutes.put(
  '/user/:userId',
  verifyToken,
  upload.single('profilePicture'),
  updateUser
);
userRoutes.post('/register', registerUser);
userRoutes.post('/login', authUser);

module.exports = userRoutes;
