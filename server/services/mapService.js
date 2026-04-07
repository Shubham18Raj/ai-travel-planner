import { cityCoordinates } from '../data/destinations.js';

/**
 * Get coordinates for a city
 */
function getCoordinates(city) {
  return cityCoordinates[city.toLowerCase()] || null;
}

/**
 * Calculate distance between two cities
 */
function calculateDistance(source, destination) {
  const src = getCoordinates(source);
  const dest = getCoordinates(destination);

  if (!src || !dest) return null;

  const R = 6371;
  const dLat = (dest.lat - src.lat) * Math.PI / 180;
  const dLng = (dest.lng - src.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(src.lat * Math.PI / 180) * Math.cos(dest.lat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export { getCoordinates, calculateDistance };
