import Trip from '../models/Trip.js';
import Booking from '../models/Booking.js';
import { generateRoutes } from '../data/mockRoutes.js';
import { destinations } from '../data/destinations.js';
import { predictTripCost } from '../services/mlService.js';
import { analyzeBudget as analyzeWithAI } from '../services/aiService.js';
import { BEST_TIME_DATA } from '../utils/constants.js';

// GET /api/trips/search
export const search = async (req, res, next) => {
  try {
    const { source, destination, popular } = req.query;

    if (popular === 'true') {
      return res.json({ destinations: destinations.slice(0, 8) });
    }

    const filteredDestinations = destinations.filter(d => {
      if (destination) {
        return d.name.toLowerCase().includes(destination.toLowerCase());
      }
      return true;
    });

    res.json({ destinations: filteredDestinations, source, destination });
  } catch (error) {
    next(error);
  }
};

// POST /api/trips
export const create = async (req, res, next) => {
  try {
    const trip = await Trip.create({ ...req.body, userId: req.userId });
    res.status(201).json({ message: 'Trip created', trip });
  } catch (error) {
    next(error);
  }
};

// GET /api/trips/:id
export const getById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('userId', 'name email');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json({ trip });
  } catch (error) {
    next(error);
  }
};

// GET /api/trips/user/my-trips
export const getMyTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ trips });
  } catch (error) {
    next(error);
  }
};

// POST /api/trips/estimate
export const estimate = async (req, res, next) => {
  try {
    const result = await predictTripCost(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// GET /api/trips/routes
export const getRoutes = (req, res, next) => {
  try {
    const { source, destination } = req.query;
    if (!source || !destination) {
      return res.status(400).json({ message: 'Source and destination are required' });
    }
    const routes = generateRoutes(source, destination);
    res.json({ source, destination, routes });
  } catch (error) {
    next(error);
  }
};

// GET /api/trips/best-time
export const getBestTime = (req, res, next) => {
  try {
    const { destination } = req.query;
    if (!destination) {
      return res.status(400).json({ message: 'Destination is required' });
    }

    const key = destination.toLowerCase();
    const data = BEST_TIME_DATA[key];

    if (!data) {
      return res.json({
        destination,
        message: 'Best time data not available for this destination',
        suggestion: 'October to March is generally a good time to visit most places in India.',
      });
    }

    const currentMonth = new Date().toLocaleString('en', { month: 'long' });
    const isGoodTime = data.best.includes(currentMonth);
    const isPeakTime = data.peak.includes(currentMonth);

    res.json({
      destination,
      bestMonths: data.best,
      peakMonths: data.peak,
      avoidMonths: data.avoid,
      reason: data.reason,
      currentMonth,
      recommendation: isGoodTime
        ? isPeakTime
          ? '🔥 Peak season — great weather but expect crowds and higher prices!'
          : '✅ Good time to visit — pleasant weather and moderate crowds.'
        : '⚠️ Not the ideal time — consider visiting during recommended months.',
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/budget/analyze
export const analyzeBudget = async (req, res, next) => {
  try {
    const result = await analyzeWithAI(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// POST /api/bookings
export const createBooking = async (req, res, next) => {
  try {
    const booking = await Booking.create({ ...req.body, userId: req.userId });
    // Update trip status
    if (req.body.tripId) {
      await Trip.findByIdAndUpdate(req.body.tripId, { status: 'booked' });
    }
    res.status(201).json({ message: 'Booking confirmed!', booking });
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings/my-bookings
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.userId })
      .populate('tripId')
      .populate('hotelId')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};
