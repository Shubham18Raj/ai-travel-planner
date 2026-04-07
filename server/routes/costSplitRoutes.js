import { Router } from 'express';
import { createGroup, addExpense, getGroup, getSettlements } from '../controllers/costSplitController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/groups', auth, createGroup);
router.post('/expenses', auth, addExpense);
router.get('/groups/:id', auth, getGroup);
router.get('/groups/:id/settle', auth, getSettlements);

export default router;
