const express = require('express');
const User = require('../models/User');
const Vibe = require('../models/Vibe');

const router = express.Router();

// Get user profile info
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get vibes created and attending by user
router.get('/:userId/vibes', async (req, res) => {
  try {
    const created = await Vibe.find({ creator: req.params.userId });
    const attending = await Vibe.find({ attendees: req.params.userId });
    res.json({ created, attending });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user profile (bio, profilePicture)
router.put('/:userId', async (req, res) => {
  try {
    const { bio, profilePicture } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { bio, profilePicture },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 