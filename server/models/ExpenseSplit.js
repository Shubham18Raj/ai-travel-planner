import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  paidBy: {
    type: String,
    required: true,
    trim: true,
  },
  splitAmong: [{
    type: String,
    trim: true,
  }],
  date: {
    type: Date,
    default: Date.now,
  },
});

const expenseSplitSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
  },
  groupName: {
    type: String,
    required: true,
    trim: true,
  },
  members: [{
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
  }],
  expenses: [expenseSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('ExpenseSplit', expenseSplitSchema);
