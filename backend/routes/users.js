const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

// POST request to register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Check if the username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already in use' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save to the database
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

// POST request to log in a user with username and password
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username' });
    }

    // Compare the password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token to the client
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

// POST request to send reset password link
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user with the given email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User with this email does not exist.' });
    }

    // Generate reset token and expiration time
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    // Configure Nodemailer to use Outlook
    const transporter = nodemailer.createTransport({
      service: 'Outlook',
      auth: {
        user: process.env.OUTLOOK_EMAIL,
        pass: process.env.OUTLOOK_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      to: user.email,
      from: process.env.OUTLOOK_EMAIL,
      subject: 'Password Reset',
      text: `You are receiving this because you have requested to reset your password. Please click the following link to reset your password:\n\n
      http://localhost:4200/reset-password?token=${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error('Error sending email: ', err);
        return res.status(500).json({ message: 'Error sending email.' });
      }
      res.status(200).json({ message: 'Password reset link sent!' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST request to reset password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Find the user by the reset token and ensure the token has not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    // Hash the new password and save it to the user's account
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
