import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  source: {
    type: String,
    required: [true, 'Source city is required'],
    trim: true,
  },
  destination: {
    type: String,
    required: [true, 'Destination city is required'],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  travelMode: {
    type: String,
    enum: ['bus', 'train', 'flight', 'car'],
    default: 'train',
  },
  numDays: {
    type: Number,
    required: true,
    min: 1,
  },
  groupSize: {
    type: Number,
    default: 1,
    min: 1,
  },
  budget: {
    type: String,
    enum: ['budget', 'moderate', 'luxury'],
    default: 'moderate',
  },
  hotelType: {
    type: String,
    enum: ['hostel', 'budget', '3-star', '4-star', '5-star'],
    default: '3-star',
  },
  activities: [{
    type: String,
  }],
  estimatedCost: {
    total: { type: Number, default: 0 },
    travel: { type: Number, default: 0 },
    stay: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    perPerson: { type: Number, default: 0 },
  },
  status: {
    type: String,
    enum: ['planning', 'booked', 'completed', 'cancelled'],
    default: 'planning',
  },
}, {
  timestamps: true,
});

tripSchema.index({ source: 1, destination: 1 });
tripSchema.index({ userId: 1 });

export default mongoose.model('Trip', tripSchema);
