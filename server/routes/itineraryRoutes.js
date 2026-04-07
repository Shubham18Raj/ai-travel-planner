import { Router } from 'express';
import { generate } from '../controllers/itineraryController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/generate', auth, generate);

export default router;
