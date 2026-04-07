import { chatWithAI } from '../services/aiService.js';

// In-memory conversation store (per session — resets on server restart)
const conversations = new Map();

// POST /api/chatbot/message
export const chat = async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const sid = sessionId || req.userId.toString();
    const history = conversations.get(sid) || [];

    const reply = await chatWithAI(message, history);

    // Update conversation history
    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: reply });

    // Keep only last 20 messages to manage context window
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }
    conversations.set(sid, history);

    res.json({ reply, sessionId: sid });
  } catch (error) {
    console.error('Chatbot error:', error.message);
    res.json({
      reply: "I'm having trouble connecting right now. Please try again in a moment! 🔄",
      error: true,
    });
  }
};
