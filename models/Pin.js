import mongoose from 'mongoose';

const PinSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['landmark', 'event', 'story', 'alert', 'other'],
    default: 'landmark'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.Pin || mongoose.model('Pin', PinSchema); 