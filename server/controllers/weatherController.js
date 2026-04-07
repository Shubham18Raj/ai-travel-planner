import { getWeatherForecast } from '../services/weatherService.js';

// GET /api/weather/:city
export const getForecast = async (req, res, next) => {
  try {
    const { city } = req.params;
    const weather = await getWeatherForecast(city);
    res.json(weather);
  } catch (error) {
    next(error);
  }
};
