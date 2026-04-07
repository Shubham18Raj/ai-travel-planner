import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function getModel() {
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

/**
 * Generate a day-by-day travel itinerary
 */
async function generateItinerary({ destination, numDays, budget, interests, groupSize, travelMode, startDate }) {
  const model = getModel();

  const prompt = `You are an expert travel planner for India. Generate a detailed day-by-day itinerary for a trip to ${destination}.

Trip Details:
- Duration: ${numDays} days
- Budget Level: ${budget} (budget/moderate/luxury)
- Group Size: ${groupSize} people
- Travel Mode: ${travelMode}
- Interests: ${interests?.join(', ') || 'general sightseeing'}
- Start Date: ${startDate || 'flexible'}

Generate a JSON response with this exact structure (no markdown, just JSON):
{
  "destination": "${destination}",
  "summary": "Brief 2-line trip summary",
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "morning": { "activity": "Activity name", "description": "What to do", "estimatedCost": 500, "duration": "2 hours" },
      "afternoon": { "activity": "Activity name", "description": "What to do", "estimatedCost": 800, "duration": "3 hours" },
      "evening": { "activity": "Activity name", "description": "What to do", "estimatedCost": 300, "duration": "2 hours" },
      "meals": { "breakfast": "Suggestion", "lunch": "Suggestion", "dinner": "Suggestion" },
      "tips": "Useful tip for this day"
    }
  ],
  "totalEstimatedCost": 15000,
  "packingTips": ["tip1", "tip2"],
  "importantNotes": ["note1", "note2"]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse itinerary JSON:', e.message);
  }

  return { raw: text, parseError: true };
}

/**
 * AI Travel Chatbot
 */
async function chatWithAI(message, conversationHistory = []) {
  const model = getModel();

  const systemPrompt = `You are TravelGenius, a friendly and knowledgeable AI travel assistant specializing in Indian travel. You help users:
- Plan trips and suggest destinations
- Recommend hotels, activities, and restaurants
- Provide budget tips and cost estimates
- Share travel safety tips and best practices
- Suggest the best time to visit places
- Help with packing lists based on destination

Keep responses concise (under 200 words), helpful, and enthusiastic. Use emojis occasionally. Always provide specific, actionable advice.`;

  const chatHistory = conversationHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: 'You are a travel assistant. Acknowledge and be ready.' }] },
      { role: 'model', parts: [{ text: systemPrompt }] },
      ...chatHistory,
    ],
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
}

/**
 * Generate a smart packing checklist based on destination and conditions
 */
async function generateChecklist({ destination, destinationType, season, activities, numDays }) {
  const model = getModel();

  const prompt = `Generate a smart packing checklist for a trip to ${destination} (${destinationType} destination) during ${season} season for ${numDays} days.
Activities planned: ${activities?.join(', ') || 'general sightseeing'}

Return JSON with this exact structure (no markdown, just JSON):
{
  "destination": "${destination}",
  "categories": [
    {
      "name": "Category Name",
      "icon": "emoji",
      "items": [
        { "item": "Item name", "essential": true, "note": "Why needed" }
      ]
    }
  ],
  "proTips": ["tip1", "tip2", "tip3"]
}

Categories should include: Clothing, Toiletries, Electronics, Documents, Health & Safety, and any destination-specific categories.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse checklist JSON:', e.message);
  }

  return { raw: text, parseError: true };
}

/**
 * AI Budget Analyzer — suggests cheapest travel mode + hotel type + tips
 */
async function analyzeBudget({ source, destination, numDays, groupSize, totalBudget }) {
  const model = getModel();

  const prompt = `Analyze this trip budget and provide smart recommendations:

Trip: ${source} to ${destination}
Duration: ${numDays} days
Group Size: ${groupSize} people
Total Budget: ₹${totalBudget}

Return JSON with this exact structure (no markdown, just JSON):
{
  "feasibility": "comfortable/tight/over-budget",
  "recommendedMode": "train/bus/flight/car",
  "recommendedHotel": "hostel/budget/3-star/4-star/5-star",
  "budgetBreakdown": {
    "travel": { "amount": 5000, "percentage": 25, "tip": "Savings tip" },
    "accommodation": { "amount": 8000, "percentage": 40, "tip": "Savings tip" },
    "food": { "amount": 4000, "percentage": 20, "tip": "Savings tip" },
    "activities": { "amount": 2000, "percentage": 10, "tip": "Savings tip" },
    "miscellaneous": { "amount": 1000, "percentage": 5, "tip": "Keep buffer" }
  },
  "savingsTips": ["tip1", "tip2", "tip3"],
  "splurgeWorthy": ["experience worth spending on"],
  "perPersonCost": 10000
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse budget JSON:', e.message);
  }

  return { raw: text, parseError: true };
}

export { generateItinerary, chatWithAI, generateChecklist, analyzeBudget };
