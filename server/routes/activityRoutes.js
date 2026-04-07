import { Router } from 'express';
import { getAll, getById, search } from '../controllers/activityController.js';

const router = Router();

router.get('/search', search);
router.get('/', getAll);
router.get('/:id', getById);

export default router;
