const mongoose = require('mongoose');

const VibeSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  time: Date,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  address: String,
  city: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: false
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: false
    }
  }
}, { timestamps: true });

VibeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Vibe', VibeSchema); 