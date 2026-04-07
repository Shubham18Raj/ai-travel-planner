import { useState } from 'react';
import { weatherAPI } from '../services/api';
import WeatherWidget from '../components/WeatherWidget';
import { FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function WeatherPage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    setLoading(true);
    try {
      const res = await weatherAPI.getForecast(city);
      setWeather(res.data);
    } catch {
      toast.error('City not found. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section">
        <div className="text-center mb-12">
          <span className="badge-primary mb-4 inline-block">☁️ Weather</span>
          <h1 className="section-title mx-auto">Weather Forecast</h1>
          <p className="section-subtitle mx-auto mt-4">Check 7-day weather for any destination. Powered by Open-Meteo (free, no API key).</p>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <form onSubmit={fetchWeather} className="flex gap-3">
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city name (e.g., Manali)"
              className="input-field flex-1" required />
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <FiSearch /> {loading ? 'Loading...' : 'Search'}
            </button>
          </form>
        </div>

        {weather && <WeatherWidget data={weather} />}
      </div>
    </div>
  );
}
