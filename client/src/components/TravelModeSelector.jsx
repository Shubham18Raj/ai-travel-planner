import { FiNavigation } from 'react-icons/fi';

const modes = [
  { id: 'bus', label: 'Bus', icon: '🚌', desc: 'Affordable, overnight options' },
  { id: 'train', label: 'Train', icon: '🚂', desc: 'Comfortable, scenic routes' },
  { id: 'flight', label: 'Flight', icon: '✈️', desc: 'Fastest option' },
  { id: 'car', label: 'Car', icon: '🚗', desc: 'Flexible, door-to-door' },
];

export default function TravelModeSelector({ selected, onChange }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {modes.map(mode => (
        <button key={mode.id} onClick={() => onChange(mode.id)}
          className={`p-4 rounded-xl border text-center transition-all duration-200 ${
            selected === mode.id
              ? 'bg-primary-500/10 border-primary-500/50 shadow-glow'
              : 'bg-surface-800/30 border-surface-700/50 hover:border-surface-600 hover:bg-surface-800/50'
          }`}>
          <span className="text-3xl block mb-2">{mode.icon}</span>
          <p className={`font-semibold text-sm ${selected === mode.id ? 'text-primary-400' : 'text-white'}`}>{mode.label}</p>
          <p className="text-xs text-surface-400 mt-1">{mode.desc}</p>
        </button>
      ))}
    </div>
  );
}
