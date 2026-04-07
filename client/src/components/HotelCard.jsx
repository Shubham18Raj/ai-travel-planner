import { FiStar } from 'react-icons/fi';
import { formatCurrency } from '../utils/helpers';

export default function HotelCard({ hotel, onSelect }) {
  const typeColors = {
    'hostel': 'bg-green-500/20 text-green-300 border-green-500/30',
    'budget': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    '3-star': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    '4-star': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    '5-star': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  };

  return (
    <div className="card-hover group cursor-pointer" onClick={() => onSelect?.(hotel)}>
      {/* Image placeholder */}
      <div className="h-48 bg-gradient-to-br from-primary-600/20 to-accent-600/20 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
        <span className="text-5xl">🏨</span>
      </div>

      <div className="space-y-3">
        {/* Type badge */}
        <span className={`badge border ${typeColors[hotel.type] || 'bg-surface-700 text-surface-300'}`}>
          {hotel.type.toUpperCase()}
        </span>

        {/* Name */}
        <h3 className="font-display font-semibold text-lg text-white group-hover:text-primary-400 transition-colors">
          {hotel.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <FiStar key={i} size={14}
              className={i < Math.floor(hotel.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-surface-600'} />
          ))}
          <span className="text-sm text-surface-400 ml-1">{hotel.rating}</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5">
          {hotel.amenities?.slice(0, 4).map(a => (
            <span key={a} className="text-xs px-2 py-0.5 rounded-md bg-surface-700/50 text-surface-300">{a}</span>
          ))}
          {hotel.amenities?.length > 4 && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-surface-700/50 text-surface-400">+{hotel.amenities.length - 4}</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-end justify-between pt-2 border-t border-white/5">
          <div>
            <span className="text-2xl font-bold text-white">{formatCurrency(hotel.pricePerNight)}</span>
            <span className="text-surface-400 text-sm"> /night</span>
          </div>
          <button className="btn-primary !py-2 !px-4 text-sm" onClick={(e) => { e.stopPropagation(); onSelect?.(hotel); }}>
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
