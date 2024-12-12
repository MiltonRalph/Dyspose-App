const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password, state, city } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .send({ success: false, message: 'User already exists' });
    }

    // Hash Password
    var salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      state,
      city,
    });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      res.status(201).send({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: 'Server error', error: error.message });
  }
};

// Authenticate and login user
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // CHeck user password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: 'Wrong Password',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Find user by ID from token

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields if provided
    if (req.body.username) user.username = req.body.username;
    if (req.file) user.profilePicture = req.file.path; // Store the image path

    // Save the updated user
    await user.save();

    // Return the updated user data
    res.json({
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to get a user by their ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params; // The userId will come from the route parameter

    // Find the user by their ID
    const user = await User.findById(userId).select('-password'); // Exclude password from the response

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
// Get Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json(users); // Send the list of users as a response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

module.exports = { registerUser, authUser, getUserById, updateUser, getUsers };
