import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { tripAPI } from '../services/api';
import { useTrip } from '../context/TripContext';
import MapView from '../components/MapView';
import { formatCurrency } from '../utils/helpers';
import { FiClock, FiMapPin, FiStar } from 'react-icons/fi';

export default function RoutesPage() {
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source') || '';
  const destination = searchParams.get('destination') || '';
  const { setRoutes } = useTrip();
  const [routes, setLocalRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (source && destination) {
      tripAPI.getRoutes({ source, destination })
        .then(res => {
          setLocalRoutes(res.data.routes || []);
          setRoutes(res.data.routes || []);
        })
        .catch(() => setLocalRoutes([]))
        .finally(() => setLoading(false));
    }
  }, [source, destination]);

  const filtered = filter === 'all' ? routes : routes.filter(r => r.mode === filter);

  const modeIcons = { bus: '🚌', train: '🚂', flight: '✈️', car: '🚗' };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section">
        <div className="mb-8">
          <span className="badge-primary mb-3 inline-block">Routes</span>
          <h1 className="section-title">
            {source} <FiMapPin className="inline text-primary-400" /> {destination}
          </h1>
          <p className="section-subtitle mt-2">Compare travel options and choose your ride.</p>
        </div>

        {/* Map */}
        <div className="mb-8">
          <MapView source={source} destination={destination}
            sourceCoords={routes[0] ? { lat: 28.61, lng: 77.20 } : null}
            destCoords={routes[0] ? { lat: 32.24, lng: 77.18 } : null} />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'bus', 'train', 'flight', 'car'].map(mode => (
            <button key={mode} onClick={() => setFilter(mode)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === mode ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'glass-card text-surface-300 hover:text-white'
              }`}>
              {mode === 'all' ? '🔀 All' : `${modeIcons[mode]} ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
            </button>
          ))}
        </div>

        {/* Route Cards */}
        {loading ? (
          <div className="grid gap-4">{[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-surface-400">
            <p className="text-6xl mb-4">🗺️</p>
            <p className="text-lg">No routes found. Try different cities.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((route, i) => (
              <div key={i} className="card-hover flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="text-4xl">{modeIcons[route.mode]}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{route.operator}</h3>
                    <span className="badge-primary capitalize">{route.mode}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-surface-400">
                    <span className="flex items-center gap-1"><FiClock /> {route.duration}</span>
                    <span>📏 {route.distance}</span>
                    <span>🕐 {route.departureTime} → {route.arrivalTime}</span>
                    <span className="flex items-center gap-1"><FiStar className="text-yellow-400" /> {route.rating}</span>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {route.amenities?.map(a => (
                      <span key={a} className="text-xs px-2 py-0.5 rounded-md bg-surface-700/50 text-surface-400">{a}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{formatCurrency(route.price)}</p>
                  <Link to={`/hotels?city=${destination}`} className="btn-primary !py-2 !px-4 text-sm mt-2 inline-block">
                    Select & Continue
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
