import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
  },
  totalCost: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
  },
  paymentId: {
    type: String,
    default: () => 'PAY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
  },
  travelers: {
    type: Number,
    default: 1,
  },
  specialRequests: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

bookingSchema.index({ userId: 1 });

export default mongoose.model('Booking', bookingSchema);
