import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import { useTrip } from '../context/TripContext';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function BookingPage() {
  const { searchParams, estimation } = useTrip();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [booking, setBooking] = useState(null);

  const handleBook = async () => {
    setLoading(true);
    try {
      const res = await bookingAPI.create({
        totalCost: estimation?.total_cost || 10000,
        travelers: searchParams.groupSize,
        specialRequests,
      });
      setBooking(res.data.booking);
      setConfirmed(true);
      toast.success('Booking confirmed! 🎉');
    } catch {
      toast.error('Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (confirmed && booking) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="card text-center max-w-md w-full animate-scale-in">
          <span className="text-6xl block mb-4">🎉</span>
          <h1 className="font-display font-bold text-2xl text-white mb-2">Booking Confirmed!</h1>
          <p className="text-surface-400 mb-6">Your trip has been booked successfully.</p>
          <div className="glass-card p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between"><span className="text-surface-400">Booking ID</span><span className="text-white font-mono text-sm">{booking.paymentId}</span></div>
            <div className="flex justify-between"><span className="text-surface-400">Total</span><span className="text-white font-bold">{formatCurrency(booking.totalCost)}</span></div>
            <div className="flex justify-between"><span className="text-surface-400">Status</span><span className="badge-primary">{booking.status}</span></div>
          </div>
          <button onClick={() => navigate('/profile')} className="btn-primary w-full">View My Bookings</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section max-w-lg mx-auto">
        <h1 className="section-title text-center mb-8">Confirm Booking</h1>
        <div className="card space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-surface-400">Route</span><span className="text-white">{searchParams.source || 'N/A'} → {searchParams.destination || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-surface-400">Travelers</span><span className="text-white">{searchParams.groupSize || 1}</span></div>
            <div className="flex justify-between"><span className="text-surface-400">Mode</span><span className="text-white capitalize">{searchParams.travelMode || 'train'}</span></div>
            <hr className="border-white/10" />
            <div className="flex justify-between"><span className="text-surface-400">Estimated Total</span><span className="text-xl font-bold text-primary-400">{formatCurrency(estimation?.total_cost || 10000)}</span></div>
          </div>
          <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Any special requests? (optional)" rows="3" className="input-field resize-none" />
          <button onClick={handleBook} disabled={loading} className="btn-primary w-full !py-3.5">
            {loading ? 'Processing...' : '✅ Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}
