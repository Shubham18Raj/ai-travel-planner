import { Router } from 'express';
import { getForecast } from '../controllers/weatherController.js';

const router = Router();

router.get('/:city', getForecast);

export default router;
