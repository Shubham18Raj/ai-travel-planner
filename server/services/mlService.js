import axios from 'axios';

const ML_SERVER_URL = process.env.ML_SERVER_URL || 'http://localhost:8000';

/**
 * Call the FastAPI ML server for cost prediction
 */
async function predictTripCost(tripData) {
  try {
    const response = await axios.post(`${ML_SERVER_URL}/predict`, {
      source_city: tripData.source,
      destination_city: tripData.destination,
      travel_mode: tripData.travelMode,
      num_days: tripData.numDays,
      hotel_type: tripData.hotelType || '3-star',
      group_size: tripData.groupSize || 1,
      season: getSeason(tripData.startDate),
      activity_level: tripData.activityLevel || 'moderate',
      food_preference: tripData.foodPreference || 'mixed',
    }, {
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    console.error('ML Server error:', error.message);

    // Fallback: rule-based estimation if ML server is down
    return fallbackEstimation(tripData);
  }
}

function getSeason(dateStr) {
  const month = new Date(dateStr).getMonth() + 1;
  if (month >= 3 && month <= 5) return 'summer';
  if (month >= 6 && month <= 9) return 'monsoon';
  if (month >= 10 && month <= 11) return 'autumn';
  return 'winter';
}

function fallbackEstimation(tripData) {
  const baseCosts = {
    travel: { bus: 800, train: 1200, flight: 4500, car: 2000 },
    hotel: { hostel: 600, budget: 1200, '3-star': 2500, '4-star': 5000, '5-star': 10000 },
    food: { budget: 500, moderate: 1000, luxury: 2000 },
    activity: { low: 500, moderate: 1500, high: 3000 },
  };

  const seasonMultiplier = { summer: 1.3, monsoon: 0.8, autumn: 1.1, winter: 1.5 };
  const season = getSeason(tripData.startDate);
  const multiplier = seasonMultiplier[season] || 1;

  const travelCost = (baseCosts.travel[tripData.travelMode] || 1500) * multiplier;
  const stayCost = (baseCosts.hotel[tripData.hotelType] || 2500) * tripData.numDays * multiplier;
  const foodCost = (baseCosts.food[tripData.budget] || 1000) * tripData.numDays;
  const activityCost = (baseCosts.activity[tripData.activityLevel] || 1500) * tripData.numDays * 0.6;

  const totalCost = Math.round(travelCost + stayCost + foodCost + activityCost);
  const perPerson = Math.round(totalCost / (tripData.groupSize || 1));

  return {
    total_cost: totalCost,
    per_person: perPerson,
    breakdown: {
      travel: Math.round(travelCost),
      stay: Math.round(stayCost),
      food: Math.round(foodCost),
      activities: Math.round(activityCost),
    },
    season,
    confidence: 0.7,
    source: 'fallback',
  };
}

async function checkMLHealth() {
  try {
    const response = await axios.get(`${ML_SERVER_URL}/health`, { timeout: 3000 });
    return response.data;
  } catch {
    return { status: 'offline' };
  }
}

export { predictTripCost, checkMLHealth, getSeason };
