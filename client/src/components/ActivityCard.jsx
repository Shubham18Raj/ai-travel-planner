import { formatCurrency } from '../utils/helpers';

export default function ActivityCard({ activity, onSelect }) {
  const typeIcons = {
    adventure: '🏔️', cultural: '🏛️', nature: '🌿', food: '🍛',
    shopping: '🛍️', nightlife: '🌃', relaxation: '🧘', sightseeing: '📸',
  };

  const difficultyColors = {
    easy: 'text-green-400 bg-green-500/10',
    moderate: 'text-yellow-400 bg-yellow-500/10',
    hard: 'text-red-400 bg-red-500/10',
  };

  return (
    <div className="card-hover group cursor-pointer" onClick={() => onSelect?.(activity)}>
      <div className="h-40 bg-gradient-to-br from-accent-600/20 to-primary-600/20 rounded-xl mb-4 flex items-center justify-center">
        <span className="text-5xl">{typeIcons[activity.type] || '🎯'}</span>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="badge-accent capitalize">{activity.type}</span>
          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${difficultyColors[activity.difficulty]}`}>
            {activity.difficulty}
          </span>
        </div>

        <h3 className="font-display font-semibold text-white group-hover:text-accent-400 transition-colors">
          {activity.name}
        </h3>

        <p className="text-sm text-surface-400 line-clamp-2">{activity.description}</p>

        <div className="flex items-center gap-3 text-sm text-surface-400">
          <span>⏱️ {activity.duration}</span>
          <span>⭐ {activity.rating}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-xl font-bold text-white">
            {activity.price === 0 ? 'Free!' : formatCurrency(activity.price)}
          </span>
          <button className="btn-secondary !py-2 !px-4 text-sm">View Details</button>
        </div>
      </div>
    </div>
  );
}
