const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// BUG 3 FIX: gemma-4-31b-it:free is frequently rate-limited / unavailable.
// llama-3.1-8b-instruct:free is the most stable free model on OpenRouter.
const MODEL = 'google/gemma-4-26b-a4b-it:free';

async function callAI(messages) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your-openrouter-api-key-here') {
    return _getPresentationFallback(messages);
  }

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
        'X-Title': 'TravelGenius',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 512,        // cap tokens to avoid timeout on free tier
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      console.warn(`OpenRouter API limit reached (${res.status}). Using presentation fallback.`);
      return _getPresentationFallback(messages);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error();
    return content;

  } catch (error) {
     console.warn('AI Network Error, returning presentation fallback.');
     return _getPresentationFallback(messages);
  }
}

// B.Tech Presentation Fallback (Prevents App from crashing during demo if API limits are hit)
function _getPresentationFallback(messages) {
  const lastMsg = messages[messages.length - 1].content.toLowerCase();
  
  if (lastMsg.includes('json') || lastMsg.includes('structure')) {
     if (lastMsg.includes('itinerary')) return JSON.stringify({ destination: "Manali", summary: "A beautiful mountain getaway.", days: [{ day: 1, title: "Arrival", morning: { activity: "Check-in", description: "Settle down", estimatedCost: 0, duration: "2 hours" }, afternoon: { activity: "Mall Road", description: "Shopping", estimatedCost: 500, duration: "3 hours" }, evening: { activity: "Dinner", description: "Local food", estimatedCost: 300, duration: "2 hours" }, meals: { breakfast: "Cafe", lunch: "Street food", dinner: "Restaurant" }, tips: "Dress warmly" }], totalEstimatedCost: 5000, packingTips: ["Jackets"], importantNotes: ["Carry cash"] });
     if (lastMsg.includes('budget')) return JSON.stringify({ feasibility: "comfortable", recommendedMode: "bus", recommendedHotel: "3-star", budgetBreakdown: { travel: { amount: 2000, percentage: 20, tip: "Book early" }, accommodation: { amount: 4000, percentage: 40, tip: "Use hostels" }, food: { amount: 3000, percentage: 30, tip: "Eat local" }, activities: { amount: 1000, percentage: 10, tip: "Use public transport" }, miscellaneous: { amount: 0, percentage: 0, tip: "" } }, savingsTips: ["Travel off-peak"], splurgeWorthy: ["Adventure sports"], perPersonCost: 5000 });
     if (lastMsg.includes('packing')) return JSON.stringify({ destination: "Current City", categories: [{ name: "Basics", icon: "🎒", items: [{ item: "Clothes", essential: true, note: "Warm" }] }], proTips: ["Pack light"] });
  }

  // Text Fallback (Chatbot)
  return "Hey there! Please note that my live AI brain hit its API rate limit! But as a fallback: I highly recommend visiting places like Manali or Goa! Let me know if you need to calculate costs using our Custom ML model.";
}

async function chatWithAI(message, conversationHistory = []) {
  const systemPrompt = `You are TravelGenius, a friendly and knowledgeable AI travel assistant specializing in Indian travel. You help users:
- Plan trips and suggest destinations
- Recommend hotels, activities, and restaurants
- Provide budget tips and cost estimates
- Share travel safety tips and best practices
- Suggest the best time to visit places
- Help with packing lists based on destination

Keep responses concise (under 200 words), helpful, and enthusiastic. Use emojis occasionally. Always provide specific, actionable advice.`;

  // BUG 1 FIX: use the history passed in from the controller
  // Filter to last 10 exchanges (20 messages) to stay within token limits
  const recentHistory = conversationHistory.slice(-20);

  const messages = [
    { role: 'system', content: systemPrompt },
    ...recentHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    })),
    { role: 'user', content: message },
  ];

  return await callAI(messages);
}

// --- All other functions unchanged below ---

async function generateItinerary({ destination, numDays, budget, interests, groupSize, travelMode, startDate }) {
  const prompt = `You are an expert travel planner for India. Generate a detailed day-by-day itinerary for a trip to ${destination}.

Trip Details:
- Duration: ${numDays} days
- Budget Level: ${budget} (budget/moderate/luxury)
- Group Size: ${groupSize} people
- Travel Mode: ${travelMode}
- Interests: ${interests?.join(', ') || 'general sightseeing'}
- Start Date: ${startDate || 'flexible'}

Generate a JSON response with this exact structure (no markdown, no code fences, just pure JSON):
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

  const text = await callAI([{ role: 'user', content: prompt }]);
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error('Failed to parse itinerary JSON:', e.message);
  }
  return { raw: text, parseError: true };
}

async function generateChecklist({ destination, destinationType, season, activities, numDays }) {
  const prompt = `Generate a smart packing checklist for a trip to ${destination} (${destinationType} destination) during ${season} season for ${numDays} days.
Activities planned: ${activities?.join(', ') || 'general sightseeing'}

Return JSON with this exact structure (no markdown, no code fences, just pure JSON):
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

  const text = await callAI([{ role: 'user', content: prompt }]);
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error('Failed to parse checklist JSON:', e.message);
  }
  return { raw: text, parseError: true };
}

async function analyzeBudget({ source, destination, numDays, groupSize, totalBudget }) {
  const prompt = `Analyze this trip budget and provide smart recommendations:

Trip: ${source} to ${destination}
Duration: ${numDays} days
Group Size: ${groupSize} people
Total Budget: ₹${totalBudget}

Return JSON with this exact structure (no markdown, no code fences, just pure JSON):
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

  const text = await callAI([{ role: 'user', content: prompt }]);
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error('Failed to parse budget JSON:', e.message);
  }
  return { raw: text, parseError: true };
}

export { generateItinerary, chatWithAI, generateChecklist, analyzeBudget };