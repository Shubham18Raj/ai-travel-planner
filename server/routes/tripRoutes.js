import { Router } from 'express';
import { search, create, getById, getMyTrips, estimate, getRoutes, getBestTime, analyzeBudget, createBooking, getMyBookings } from '../controllers/tripController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/search', search);
router.get('/routes', getRoutes);
router.get('/best-time', getBestTime);
router.post('/', auth, create);
router.get('/user/my-trips', auth, getMyTrips);
router.post('/estimate', auth, estimate);
router.get('/:id', auth, getById);

export default router;
