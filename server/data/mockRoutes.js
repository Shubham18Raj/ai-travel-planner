import { cityCoordinates } from './destinations.js';

// Calculate approximate distance between two cities (Haversine formula)
function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function generateRoutes(source, destination) {
  const src = cityCoordinates[source.toLowerCase()];
  const dest = cityCoordinates[destination.toLowerCase()];

  if (!src || !dest) return [];

  const distance = Math.round(calcDistance(src.lat, src.lng, dest.lat, dest.lng));
  const routes = [];

  // Bus route
  if (distance < 1500) {
    const busHours = Math.round(distance / 45);
    routes.push({
      mode: 'bus',
      operator: distance > 500 ? 'Volvo AC Sleeper' : 'State Transport AC',
      duration: `${busHours}h`,
      price: Math.round(distance * 1.2 + 200),
      distance: `${distance} km`,
      departureTime: '21:00',
      arrivalTime: `${(21 + busHours) % 24}:00`,
      rating: 3.8,
      amenities: ['AC', 'Charging Point', 'Blanket'],
    });
    routes.push({
      mode: 'bus',
      operator: 'Non-AC Seater',
      duration: `${busHours + 2}h`,
      price: Math.round(distance * 0.7 + 100),
      distance: `${distance} km`,
      departureTime: '20:00',
      arrivalTime: `${(20 + busHours + 2) % 24}:00`,
      rating: 3.2,
      amenities: ['Seater'],
    });
  }

  // Train route
  if (distance < 2500) {
    const trainHours = Math.round(distance / 60);
    routes.push({
      mode: 'train',
      operator: 'Rajdhani Express',
      duration: `${trainHours}h`,
      price: Math.round(distance * 1.5 + 500),
      distance: `${distance} km`,
      departureTime: '16:30',
      arrivalTime: `${(16 + trainHours) % 24}:30`,
      rating: 4.3,
      amenities: ['AC', 'Meals', 'Bedding', 'Charging'],
    });
    routes.push({
      mode: 'train',
      operator: 'Shatabdi Express',
      duration: `${Math.round(trainHours * 0.85)}h`,
      price: Math.round(distance * 1.8 + 400),
      distance: `${distance} km`,
      departureTime: '06:00',
      arrivalTime: `${(6 + Math.round(trainHours * 0.85)) % 24}:00`,
      rating: 4.5,
      amenities: ['AC Chair Car', 'Meals', 'Charging'],
    });
    routes.push({
      mode: 'train',
      operator: 'Sleeper Class',
      duration: `${trainHours + 4}h`,
      price: Math.round(distance * 0.5 + 150),
      distance: `${distance} km`,
      departureTime: '22:00',
      arrivalTime: `${(22 + trainHours + 4) % 24}:00`,
      rating: 3.5,
      amenities: ['Fan', 'Bedding'],
    });
  }

  // Flight route
  if (distance > 300) {
    const flightHours = Math.max(1, Math.round(distance / 700 * 10) / 10);
    routes.push({
      mode: 'flight',
      operator: 'IndiGo',
      duration: `${flightHours}h`,
      price: Math.round(2500 + distance * 2.5),
      distance: `${distance} km`,
      departureTime: '08:00',
      arrivalTime: `${Math.round(8 + flightHours)}:00`,
      rating: 4.1,
      amenities: ['Cabin Baggage', 'Snacks (paid)'],
    });
    routes.push({
      mode: 'flight',
      operator: 'Air India',
      duration: `${flightHours}h`,
      price: Math.round(3000 + distance * 3),
      distance: `${distance} km`,
      departureTime: '14:00',
      arrivalTime: `${Math.round(14 + flightHours)}:00`,
      rating: 4.0,
      amenities: ['Cabin Baggage', 'Meals', 'Entertainment'],
    });
  }

  // Car route
  if (distance < 1000) {
    const carHours = Math.round(distance / 50);
    routes.push({
      mode: 'car',
      operator: 'Self Drive / Cab',
      duration: `${carHours}h`,
      price: Math.round(distance * 8 + 500),
      distance: `${distance} km`,
      departureTime: 'Flexible',
      arrivalTime: 'Flexible',
      rating: 4.0,
      amenities: ['AC', 'Flexible Stops', 'Door to Door'],
    });
  }

  return routes;
}

export { generateRoutes, calcDistance };
export default generateRoutes;
