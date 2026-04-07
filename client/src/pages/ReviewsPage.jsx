import { useState, useEffect } from 'react';
import { reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewBox from '../components/ReviewBox';
import { FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ReviewsPage() {
  const { user, isAuthenticated } = useAuth();
  const [destination, setDestination] = useState('');
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    if (!destination) return;
    try {
      const res = await reviewAPI.getByDestination(destination.toLowerCase());
      setReviews(res.data.reviews || []);
      setAvgRating(res.data.averageRating || 0);
    } catch { setReviews([]); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to add a review');
    setLoading(true);
    try {
      await reviewAPI.create({ destination: destination.toLowerCase(), rating: form.rating, comment: form.comment });
      setForm({ rating: 5, comment: '' });
      fetchReviews();
      toast.success('Review added!');
    } catch { toast.error('Failed to add review'); }
    finally { setLoading(false); }
  };

  const deleteReview = async (id) => {
    try {
      await reviewAPI.delete(id);
      fetchReviews();
      toast.success('Review deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section">
        <div className="text-center mb-12">
          <span className="badge-primary mb-4 inline-block">⭐ Reviews</span>
          <h1 className="section-title mx-auto">Destination Reviews</h1>
          <p className="section-subtitle mx-auto mt-4">Read and share travel experiences.</p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8 flex gap-3">
          <input value={destination} onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination (e.g., Goa)" className="input-field flex-1" />
          <button onClick={fetchReviews} className="btn-primary">Search</button>
        </div>

        {destination && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              {reviews.length > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-white">{avgRating}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <FiStar key={i} size={18} className={i <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-surface-600'} />
                    ))}
                  </div>
                  <span className="text-surface-400 text-sm">({reviews.length} reviews)</span>
                </div>
              )}

              {reviews.length === 0 ? (
                <div className="text-center py-12 text-surface-400">
                  <span className="text-5xl block mb-3">📝</span>
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                reviews.map(r => <ReviewBox key={r._id} review={r} onDelete={deleteReview} currentUserId={user?.id} />)
              )}
            </div>

            {/* Add Review */}
            <div className="card h-fit">
              <h3 className="font-display font-semibold text-lg text-white mb-4">Write a Review</h3>
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="text-sm text-surface-300 mb-2 block">Rating</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <button key={i} type="button" onClick={() => setForm(f => ({...f, rating: i}))}>
                        <FiStar size={24} className={i <= form.rating ? 'text-yellow-400 fill-yellow-400' : 'text-surface-600'} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea value={form.comment} onChange={(e) => setForm(f => ({...f, comment: e.target.value}))}
                  placeholder="Share your experience..." rows="4" className="input-field resize-none" required />
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Posting...' : 'Post Review'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
