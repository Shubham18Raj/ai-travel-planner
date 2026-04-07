import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { hotelAPI } from '../services/api';
import HotelCard from '../components/HotelCard';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function HotelsPage() {
  const [searchParams] = useSearchParams();
  const city = searchParams.get('city') || '';
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', sort: 'rating', minRating: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const params = { city, ...filters };
    Object.keys(params).forEach(k => !params[k] && delete params[k]);

    hotelAPI.search(params)
      .then(res => setHotels(res.data.hotels || []))
      .catch(() => setHotels([]))
      .finally(() => setLoading(false));
  }, [city, filters]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section">
        <div className="mb-8">
          <span className="badge-primary mb-3 inline-block">Hotels</span>
          <h1 className="section-title">
            {city ? `Hotels in ${city.charAt(0).toUpperCase() + city.slice(1)}` : 'All Hotels'}
          </h1>
          <p className="section-subtitle mt-2">Find the perfect stay for your trip.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <select value={filters.type} onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
            className="input-field !w-auto !py-2">
            <option value="">All Types</option>
            <option value="hostel">Hostel</option>
            <option value="budget">Budget</option>
            <option value="3-star">3-Star</option>
            <option value="4-star">4-Star</option>
            <option value="5-star">5-Star</option>
          </select>
          <select value={filters.sort} onChange={(e) => setFilters(f => ({ ...f, sort: e.target.value }))}
            className="input-field !w-auto !py-2">
            <option value="rating">Top Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <select value={filters.minRating} onChange={(e) => setFilters(f => ({ ...f, minRating: e.target.value }))}
            className="input-field !w-auto !py-2">
            <option value="">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-96 rounded-2xl" />)}
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-16 text-surface-400">
            <p className="text-6xl mb-4">🏨</p>
            <p className="text-lg">No hotels found{city ? ` in ${city}` : ''}. Try a different city.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel, i) => (
              <HotelCard key={i} hotel={hotel} onSelect={(h) => {
                toast.success(`${h.name} selected for your trip!`);
                navigate('/booking');
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
