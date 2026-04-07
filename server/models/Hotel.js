import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
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
    enum: ['hostel', 'budget', '3-star', '4-star', '5-star'],
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  amenities: [{
    type: String,
  }],
  image: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  latitude: Number,
  longitude: Number,
}, {
  timestamps: true,
});

hotelSchema.index({ city: 1, type: 1 });

export default mongoose.model('Hotel', hotelSchema);
