import { getWeatherIcon } from '../utils/helpers';

export default function WeatherWidget({ data }) {
  if (!data) return null;

  return (
    <div className="card space-y-4">
      {/* Current Weather */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-2xl text-white">{data.city}</h3>
          <p className="text-surface-400 text-sm">{data.country}</p>
        </div>
        <div className="text-right">
          <span className="text-4xl">{getWeatherIcon(data.currentWeather?.weatherCode)}</span>
          <p className="font-display font-bold text-3xl text-white">{data.currentWeather?.temperature}°C</p>
          <p className="text-surface-400 text-sm">{data.currentWeather?.weatherDescription}</p>
        </div>
      </div>

      {/* 7-day forecast */}
      <div className="grid grid-cols-7 gap-2">
        {data.forecast?.map((day, i) => (
          <div key={i} className="glass-card p-2 text-center hover:bg-white/10 transition-all">
            <p className="text-xs text-surface-400 font-medium">
              {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
            </p>
            <span className="text-2xl block my-1">{getWeatherIcon(day.weatherCode)}</span>
            <p className="text-sm font-semibold text-white">{Math.round(day.maxTemp)}°</p>
            <p className="text-xs text-surface-500">{Math.round(day.minTemp)}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}
