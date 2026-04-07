import { generateItinerary as generateWithAI } from '../services/aiService.js';

// POST /api/itinerary/generate
export const generate = async (req, res, next) => {
  try {
    const { destination, numDays, budget, interests, groupSize, travelMode, startDate } = req.body;

    if (!destination || !numDays) {
      return res.status(400).json({ message: 'Destination and number of days are required' });
    }

    const itinerary = await generateWithAI({
      destination,
      numDays: parseInt(numDays),
      budget: budget || 'moderate',
      interests: interests || [],
      groupSize: parseInt(groupSize) || 1,
      travelMode: travelMode || 'train',
      startDate,
    });

    res.json(itinerary);
  } catch (error) {
    console.error('Itinerary generation error:', error.message);
    next(error);
  }
};
