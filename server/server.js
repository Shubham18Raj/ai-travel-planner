import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import costSplitRoutes from './routes/costSplitRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import checklistRoutes from './routes/checklistRoutes.js';

// Booking routes are on tripRoutes
import { createBooking, getMyBookings } from './controllers/tripController.js';
import { analyzeBudget } from './controllers/tripController.js';
import auth from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/split', costSplitRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/checklist', checklistRoutes);

// Booking routes
app.post('/api/bookings', auth, createBooking);
app.get('/api/bookings/my-bookings', auth, getMyBookings);

// Budget analyze route
app.post('/api/budget/analyze', auth, analyzeBudget);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), environment: process.env.NODE_ENV || 'development' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
