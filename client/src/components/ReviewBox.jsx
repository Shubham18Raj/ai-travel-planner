import { FiStar } from 'react-icons/fi';
import { formatDate } from '../utils/helpers';

export default function ReviewBox({ review, onDelete, currentUserId }) {
  return (
    <div className="card space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
            {review.userId?.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="font-medium text-white">{review.userId?.name || 'Anonymous'}</p>
            <p className="text-xs text-surface-400">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <FiStar key={i} size={14}
              className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-surface-600'} />
          ))}
        </div>
      </div>

      <p className="text-surface-300 text-sm leading-relaxed">{review.comment}</p>

      {onDelete && currentUserId === (review.userId?._id || review.userId?.id) && (
        <button onClick={() => onDelete(review._id)}
          className="text-xs text-red-400 hover:text-red-300 transition-colors">
          Delete Review
        </button>
      )}
    </div>
  );
}
