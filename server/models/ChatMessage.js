const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  vibeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vibe', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema); 