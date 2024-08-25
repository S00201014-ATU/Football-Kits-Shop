const express = require('express');
const User = require('../models/User');
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

    // Create a new user and save to the database
    const newUser = new User({ username, email, password, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

module.exports = router;
