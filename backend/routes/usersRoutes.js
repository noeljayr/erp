const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// User Login
// Get All Users with Optional Role Filter
router.get('/', async (req, res) => {
  const { role } = req.query;

  try {
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password'); // exclude password field
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something tripped on our end.' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT Token
    const payload = {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1000232320h',
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something tripped on our end.' });
  }
});

router.post('/signup', async (req, res) => {
  const { first_name, last_name, email, password, phone, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already taken' });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: 'Phone already taken' });
    }

    // Create new user
    const newUser = new User({
      first_name,
      last_name,
      email,
      phone,
      role,
      password,
    });

    // Save user to database (password will be hashed due to pre-save middleware)
    await newUser.save();

    res.status(200).json({ message: 'You’re all set.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something tripped on our end.' });
  }
});

router.put('/edit-user', async (req, res) => {
  const { first_name, last_name, email } = req.body;

  try {
    // Extract user_id from the JWT payload
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.user_id;

    // Find the user
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user information if provided
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (email) user.email = email;

    // Save updated user information
    await user.save();

    const wallet = await Wallet.findOne({ user_id: user.user_id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    const payload = {
      user_id: user.user_id,
      full_name: user.first_name + ' ' + user.last_name,
      email: user.email,
    };

    const newToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1232320h',
    });

    res.status(200).json({
      message: 'Update successfully',
      token: newToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something tripped on our end.' });
  }
});

router.put('/update-password', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.user_id;

    // Get current and new passwords from the request body
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Both current password and new password are required.',
      });
    }

    // Find the user in the database
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the provided current password matches the stored hashed password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password.' });
    }

    // Hash the new password and update the user's password field
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something tripped on our end.' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email, new_password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    user.password = new_password;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something tripped on our end.' });
  }
});

module.exports = router;
