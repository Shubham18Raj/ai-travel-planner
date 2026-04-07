import { generateChecklist as generateWithAI } from '../services/aiService.js';

// POST /api/checklist/generate
export const generate = async (req, res, next) => {
  try {
    const { destination, destinationType, season, activities, numDays } = req.body;

    if (!destination) {
      return res.status(400).json({ message: 'Destination is required' });
    }

    const checklist = await generateWithAI({
      destination,
      destinationType: destinationType || 'general',
      season: season || 'summer',
      activities: activities || [],
      numDays: numDays || 3,
    });

    res.json(checklist);
  } catch (error) {
    console.error('Checklist generation error:', error.message);
    next(error);
  }
};
