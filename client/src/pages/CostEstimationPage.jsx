import { useState } from 'react';
import { tripAPI } from '../services/api';
import CostBreakdownCard from '../components/CostBreakdownCard';
import TravelModeSelector from '../components/TravelModeSelector';
import toast from 'react-hot-toast';

export default function CostEstimationPage() {
  const [form, setForm] = useState({
    source: '', destination: '', travelMode: 'train', numDays: 3,
    hotelType: '3-star', groupSize: 2, startDate: '', activityLevel: 'moderate', foodPreference: 'mixed',
  });
  const [estimation, setEstimation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await tripAPI.estimate(form);
      setEstimation(res.data);
      toast.success('Cost estimated!');
    } catch {
      toast.error('Estimation failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section">
        <div className="text-center mb-12">
          <span className="badge-primary mb-4 inline-block">🤖 ML Model</span>
          <h1 className="section-title mx-auto">Trip Cost Estimator</h1>
          <p className="section-subtitle mx-auto mt-4">Our machine learning model predicts trip costs based on 5000+ data points.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="card">
            <h2 className="font-display font-semibold text-xl text-white mb-6">Trip Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-surface-300 mb-1 block">From</label>
                  <input name="source" value={form.source} onChange={(e) => setForm(f => ({...f, source: e.target.value}))}
                    placeholder="Delhi" className="input-field" required />
                </div>
                <div>
                  <label className="text-sm text-surface-300 mb-1 block">To</label>
                  <input name="destination" value={form.destination} onChange={(e) => setForm(f => ({...f, destination: e.target.value}))}
                    placeholder="Manali" className="input-field" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-surface-300 mb-1 block">Days</label>
                  <input type="number" value={form.numDays} min="1" max="30"
                    onChange={(e) => setForm(f => ({...f, numDays: parseInt(e.target.value)}))} className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-surface-300 mb-1 block">Group Size</label>
                  <input type="number" value={form.groupSize} min="1" max="20"
                    onChange={(e) => setForm(f => ({...f, groupSize: parseInt(e.target.value)}))} className="input-field" />
                </div>
              </div>

              <div>
                <label className="text-sm text-surface-300 mb-1 block">Start Date</label>
                <input type="date" value={form.startDate} onChange={(e) => setForm(f => ({...f, startDate: e.target.value}))} className="input-field" required />
              </div>

              <div>
                <label className="text-sm text-surface-300 mb-2 block">Travel Mode</label>
                <TravelModeSelector selected={form.travelMode} onChange={(mode) => setForm(f => ({...f, travelMode: mode}))} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-surface-300 mb-1 block">Hotel</label>
                  <select value={form.hotelType} onChange={(e) => setForm(f => ({...f, hotelType: e.target.value}))} className="input-field">
                    <option value="hostel">Hostel</option>
                    <option value="budget">Budget</option>
                    <option value="3-star">3-Star</option>
                    <option value="4-star">4-Star</option>
                    <option value="5-star">5-Star</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-surface-300 mb-1 block">Activities</label>
                  <select value={form.activityLevel} onChange={(e) => setForm(f => ({...f, activityLevel: e.target.value}))} className="input-field">
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-surface-300 mb-1 block">Food</label>
                  <select value={form.foodPreference} onChange={(e) => setForm(f => ({...f, foodPreference: e.target.value}))} className="input-field">
                    <option value="budget">Budget</option>
                    <option value="mixed">Mixed</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
                {loading ? '🤖 Estimating...' : '🤖 Estimate Cost with ML'}
              </button>
            </form>
          </div>

          {/* Result */}
          <div>
            {estimation ? (
              <CostBreakdownCard estimation={estimation} />
            ) : (
              <div className="card h-full flex items-center justify-center text-center">
                <div>
                  <span className="text-6xl block mb-4">📊</span>
                  <p className="text-surface-400">Fill in trip details and click estimate to see the ML-powered cost prediction.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
