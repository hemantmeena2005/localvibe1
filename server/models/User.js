const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: String,
  bio: String,
  createdVibes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vibe' }],
  rsvpedVibes:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vibe' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 