import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, bookingAPI, tripAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('trips');

  useEffect(() => {
    tripAPI.getMyTrips().then(res => setTrips(res.data.trips || [])).catch(() => {});
    bookingAPI.getMyBookings().then(res => setBookings(res.data.bookings || [])).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section">
        {/* Profile header */}
        <div className="card flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="font-display font-bold text-2xl text-white">{user?.name}</h1>
            <p className="text-surface-400">{user?.email}</p>
            <p className="text-surface-500 text-sm mt-1">Member since {user?.createdAt ? formatDate(user.createdAt) : 'recently'}</p>
          </div>
          <div className="flex gap-3">
            <div className="glass-card px-4 py-2 text-center">
              <p className="text-xl font-bold text-primary-400">{trips.length}</p>
              <p className="text-xs text-surface-400">Trips</p>
            </div>
            <div className="glass-card px-4 py-2 text-center">
              <p className="text-xl font-bold text-accent-400">{bookings.length}</p>
              <p className="text-xs text-surface-400">Bookings</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['trips', 'bookings'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                tab === t ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'glass-card text-surface-300'
              }`}>{t}</button>
          ))}
        </div>

        {/* Content */}
        {tab === 'trips' && (
          <div className="space-y-4">
            {trips.length === 0 ? (
              <div className="text-center py-12 text-surface-400">
                <span className="text-5xl block mb-3">🗺️</span>
                <p>No trips yet. Start planning!</p>
              </div>
            ) : trips.map(trip => (
              <div key={trip._id} className="card-hover flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="font-semibold text-white">{trip.source} → {trip.destination}</h3>
                  <p className="text-sm text-surface-400">{trip.numDays} days · {trip.groupSize} people · {trip.travelMode}</p>
                  <p className="text-xs text-surface-500">{formatDate(trip.startDate)}</p>
                </div>
                <div className="text-right">
                  <span className={`badge ${trip.status === 'booked' ? 'badge-primary' : 'badge-accent'}`}>{trip.status}</span>
                  {trip.estimatedCost?.total > 0 && (
                    <p className="text-sm text-white mt-1">{formatCurrency(trip.estimatedCost.total)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-surface-400">
                <span className="text-5xl block mb-3">🎫</span>
                <p>No bookings yet.</p>
              </div>
            ) : bookings.map(b => (
              <div key={b._id} className="card-hover">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">Booking #{b.paymentId}</p>
                    <p className="text-sm text-surface-400">{formatDate(b.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <span className="badge-primary">{b.status}</span>
                    <p className="text-lg font-bold text-white mt-1">{formatCurrency(b.totalCost)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
