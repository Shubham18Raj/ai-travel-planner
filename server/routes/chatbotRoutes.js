import { Router } from 'express';
import { chat } from '../controllers/chatbotController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/message', auth, chat);

export default router;
