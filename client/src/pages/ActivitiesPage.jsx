import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { activityAPI } from '../services/api';
import ActivityCard from '../components/ActivityCard';

const activityTypes = ['all', 'adventure', 'cultural', 'nature', 'food', 'shopping', 'relaxation', 'sightseeing'];

export default function ActivitiesPage() {
  const [searchParams] = useSearchParams();
  const city = searchParams.get('city') || '';
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const params = { city };
    if (typeFilter !== 'all') params.type = typeFilter;

    activityAPI.search(params)
      .then(res => setActivities(res.data.activities || []))
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, [city, typeFilter]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section">
        <div className="mb-8">
          <span className="badge-accent mb-3 inline-block">Activities</span>
          <h1 className="section-title">
            {city ? `Things to Do in ${city.charAt(0).toUpperCase() + city.slice(1)}` : 'All Activities'}
          </h1>
          <p className="section-subtitle mt-2">Adventure, culture, food, and more — discover what awaits.</p>
        </div>

        {/* Type filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {activityTypes.map(type => (
            <button key={type} onClick={() => setTypeFilter(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                typeFilter === type
                  ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                  : 'glass-card text-surface-300 hover:text-white'
              }`}>
              {type}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-80 rounded-2xl" />)}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-16 text-surface-400">
            <p className="text-6xl mb-4">🎯</p>
            <p className="text-lg">No activities found. Try a different city or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, i) => (
              <ActivityCard key={i} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
