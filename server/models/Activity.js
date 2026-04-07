import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  type: {
    type: String,
    enum: ['adventure', 'cultural', 'nature', 'food', 'shopping', 'nightlife', 'relaxation', 'sightseeing'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    default: '2-3 hours',
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'hard'],
    default: 'easy',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4,
  },
}, {
  timestamps: true,
});

activitySchema.index({ city: 1, type: 1 });

export default mongoose.model('Activity', activitySchema);
