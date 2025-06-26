const express = require('express');
const jwt = require('jsonwebtoken');
const Vibe = require('../models/Vibe');
const User = require('../models/User');

const router = express.Router();

// Middleware to verify JWT
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Create a new vibe
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, time, address, city } = req.body;
    const vibe = new Vibe({
      title,
      description,
      category,
      time,
      address,
      city,
      creator: req.user.id,
      attendees: [req.user.id]
    });
    await vibe.save();
    await User.findByIdAndUpdate(req.user.id, { $push: { createdVibes: vibe._id } });
    res.status(201).json(vibe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all vibes, with optional search by title or city
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    let filter = {};
    if (q) {
      filter = {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { city: { $regex: q, $options: 'i' } }
        ]
      };
    }
    const vibes = await Vibe.find(filter)
      .populate('creator', 'username email')
      .populate('attendees', 'username email profilePicture');
    res.json(vibes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single vibe by id
router.get('/:id', async (req, res) => {
  try {
    const vibe = await Vibe.findById(req.params.id)
      .populate('creator', 'username email')
      .populate('attendees', 'username email profilePicture');
    if (!vibe) return res.status(404).json({ message: 'Vibe not found' });
    res.json(vibe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a vibe (only creator)
router.put('/:id', auth, async (req, res) => {
  try {
    const vibe = await Vibe.findById(req.params.id);
    if (!vibe) return res.status(404).json({ message: 'Vibe not found' });
    if (vibe.creator.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    const { title, description, category, time, address, city } = req.body;
    vibe.title = title;
    vibe.description = description;
    vibe.category = category;
    vibe.time = time;
    vibe.address = address;
    vibe.city = city;
    await vibe.save();
    res.json(vibe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a vibe (only creator)
router.delete('/:id', auth, async (req, res) => {
  try {
    const vibe = await Vibe.findById(req.params.id);
    if (!vibe) return res.status(404).json({ message: 'Vibe not found' });
    if (vibe.creator.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    // Remove vibe from creator's createdVibes
    await User.findByIdAndUpdate(vibe.creator, { $pull: { createdVibes: vibe._id } });
    // Remove vibe from all users' rsvpedVibes
    await User.updateMany({ rsvpedVibes: vibe._id }, { $pull: { rsvpedVibes: vibe._id } });
    await vibe.deleteOne();
    res.json({ message: 'Vibe deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// RSVP/attend a vibe (toggle)
router.post('/:id/rsvp', auth, async (req, res) => {
  try {
    const vibe = await Vibe.findById(req.params.id);
    if (!vibe) return res.status(404).json({ message: 'Vibe not found' });
    const userId = req.user.id;
    const isAttending = vibe.attendees.includes(userId);
    if (isAttending) {
      vibe.attendees.pull(userId);
      await User.findByIdAndUpdate(userId, { $pull: { rsvpedVibes: vibe._id } });
    } else {
      vibe.attendees.push(userId);
      await User.findByIdAndUpdate(userId, { $addToSet: { rsvpedVibes: vibe._id } });
    }
    await vibe.save();
    res.json({ attending: !isAttending, attendees: vibe.attendees });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 