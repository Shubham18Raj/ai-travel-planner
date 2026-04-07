import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import TravelModeSelector from './TravelModeSelector';
import { FiSearch, FiMapPin, FiCalendar, FiUsers } from 'react-icons/fi';

export default function TripSearchForm({ compact = false }) {
  const navigate = useNavigate();
  const { setSearchParams } = useTrip();
  const [form, setForm] = useState({
    source: '', destination: '', startDate: '', endDate: '',
    groupSize: 1, travelMode: 'train', budget: 'moderate',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(form);
    navigate(`/routes?source=${form.source}&destination=${form.destination}`);
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiMapPin className="absolute left-3 top-3.5 text-surface-400" />
          <input name="source" value={form.source} onChange={handleChange} placeholder="From city"
            className="input-field !pl-10" required />
        </div>
        <div className="relative flex-1">
          <FiMapPin className="absolute left-3 top-3.5 text-primary-400" />
          <input name="destination" value={form.destination} onChange={handleChange} placeholder="To destination"
            className="input-field !pl-10" required />
        </div>
        <button type="submit" className="btn-primary flex items-center gap-2">
          <FiSearch /> Search
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">From</label>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-3.5 text-surface-400" />
            <input name="source" value={form.source} onChange={handleChange}
              placeholder="e.g., Delhi" className="input-field !pl-10" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">To</label>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-3.5 text-primary-400" />
            <input name="destination" value={form.destination} onChange={handleChange}
              placeholder="e.g., Manali" className="input-field !pl-10" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">Start Date</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange}
            className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">End Date</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange}
            className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">Group Size</label>
          <div className="relative">
            <FiUsers className="absolute left-3 top-3.5 text-surface-400" />
            <input type="number" name="groupSize" value={form.groupSize} min="1" max="20"
              onChange={handleChange} className="input-field !pl-10" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">Budget</label>
          <select name="budget" value={form.budget} onChange={handleChange} className="input-field">
            <option value="budget">Budget 💰</option>
            <option value="moderate">Moderate 💎</option>
            <option value="luxury">Luxury 👑</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-300 mb-3">Travel Mode</label>
        <TravelModeSelector selected={form.travelMode} onChange={(mode) => setForm(prev => ({ ...prev, travelMode: mode }))} />
      </div>

      <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 text-lg !py-4">
        <FiSearch size={20} /> Search Routes & Hotels
      </button>
    </form>
  );
}
