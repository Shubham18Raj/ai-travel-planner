import { Router } from 'express';
import { create, getByDestination, remove } from '../controllers/reviewController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/', auth, create);
router.get('/:destinationId', getByDestination);
router.delete('/:id', auth, remove);

export default router;
