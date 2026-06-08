import { chatWithAI } from '../services/aiService.js';

// POST /api/chatbot/message
export const chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // BUG 1 FIX: use history sent from frontend instead of in-memory Map
    // This makes it stateless and works correctly across page refreshes
    const reply = await chatWithAI(message.trim(), history);

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    // BUG 2 FIX: log the FULL error (not just message) so you can see what's wrong
    console.error('Chatbot error:', error);

    // BUG 2 FIX: return a real 500 so the frontend catch() block fires
    return res.status(500).json({
      success: false,
      message: error.message || 'AI service unavailable. Please try again.',
    });
  }
};