const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

// GET request to retrieve all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
});

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

    // Log plain text password
    console.log('Plain Text Password:', password);

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Log hashed password for verification
    console.log('Hashed Password Just Before Saving:', hashedPassword);

    // Create a new user and save to the database
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    // Log the hashed password saved to the database
    console.log('Hashed Password Saved to DB:', newUser.password);

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

// POST request to log in a user with username and password
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username' });
    }

    // Log user and password details
    console.log('User found:', user.username);
    console.log('Password from client:', password);
    console.log('Hashed password retrieved from DB:', user.password);

    // Compare the password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // Log the result of the password comparison
    console.log('Password comparison result:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

// POST request to send reset password link
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User with this email does not exist.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 3600000; // 1 hour expiration
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Outlook',
      auth: {
        user: process.env.OUTLOOK_EMAIL,
        pass: process.env.OUTLOOK_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: `"Football Kits Shop" <${process.env.OUTLOOK_EMAIL}>`,
      subject: 'Password Reset',
      text: `You are receiving this because you have requested to reset your password. Please click the following link to reset your password:\n\n
      http://localhost:4200/reset-password?token=${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error sending email.' });
      }
      res.status(200).json({ message: 'Password reset link sent!' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST request to reset password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    console.log('New plain text password:', newPassword);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log('Hashed password before saving:', hashedPassword);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error during password reset.' });
  }
});

module.exports = router;
