import axios from 'axios';

// Open-Meteo API — 100% FREE, no API key needed
// Docs: https://open-meteo.com/en/docs

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Get coordinates for a city name using Open-Meteo geocoding
 */
async function geocodeCity(cityName) {
  try {
    const { data } = await axios.get(GEOCODING_URL, {
      params: { name: cityName, count: 1, language: 'en', format: 'json' },
    });
    if (data.results && data.results.length > 0) {
      return {
        lat: data.results[0].latitude,
        lng: data.results[0].longitude,
        name: data.results[0].name,
        country: data.results[0].country,
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
}

/**
 * Get 7-day weather forecast for a city
 */
async function getWeatherForecast(cityName) {
  const location = await geocodeCity(cityName);
  if (!location) {
    throw new Error(`City "${cityName}" not found`);
  }

  const { data } = await axios.get(WEATHER_URL, {
    params: {
      latitude: location.lat,
      longitude: location.lng,
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,windspeed_10m_max,uv_index_max',
      current_weather: true,
      timezone: 'Asia/Kolkata',
      forecast_days: 7,
    },
  });

  const weatherCodes = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
    55: 'Dense drizzle', 61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
    80: 'Slight showers', 81: 'Moderate showers', 82: 'Violent showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail',
  };

  const forecast = data.daily.time.map((date, i) => ({
    date,
    maxTemp: data.daily.temperature_2m_max[i],
    minTemp: data.daily.temperature_2m_min[i],
    precipitation: data.daily.precipitation_sum[i],
    weatherCode: data.daily.weathercode[i],
    weatherDescription: weatherCodes[data.daily.weathercode[i]] || 'Unknown',
    windSpeed: data.daily.windspeed_10m_max[i],
    uvIndex: data.daily.uv_index_max[i],
  }));

  return {
    city: location.name,
    country: location.country,
    coordinates: { lat: location.lat, lng: location.lng },
    currentWeather: {
      temperature: data.current_weather.temperature,
      windSpeed: data.current_weather.windspeed,
      weatherCode: data.current_weather.weathercode,
      weatherDescription: weatherCodes[data.current_weather.weathercode] || 'Unknown',
    },
    forecast,
  };
}

export { getWeatherForecast, geocodeCity };
