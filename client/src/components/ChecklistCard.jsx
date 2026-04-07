import { useState } from 'react';

export default function ChecklistCard({ checklist }) {
  const [checked, setChecked] = useState(() => {
    const saved = localStorage.getItem(`checklist-${checklist?.destination}`);
    return saved ? JSON.parse(saved) : {};
  });

  const toggleItem = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    const newChecked = { ...checked, [key]: !checked[key] };
    setChecked(newChecked);
    localStorage.setItem(`checklist-${checklist?.destination}`, JSON.stringify(newChecked));
  };

  if (!checklist?.categories) return null;

  const totalItems = checklist.categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-surface-400 text-sm">Packing Progress</span>
          <span className="text-primary-400 font-semibold">{checkedCount}/{totalItems}</span>
        </div>
        <div className="w-full bg-surface-700 rounded-full h-3">
          <div className="bg-gradient-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${totalItems > 0 ? (checkedCount / totalItems * 100) : 0}%` }} />
        </div>
      </div>

      {/* Categories */}
      {checklist.categories.map((category, catIdx) => (
        <div key={catIdx} className="card space-y-3">
          <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2">
            <span>{category.icon || '📦'}</span> {category.name}
          </h3>
          <div className="space-y-2">
            {category.items.map((item, itemIdx) => {
              const key = `${catIdx}-${itemIdx}`;
              const isChecked = checked[key];
              return (
                <label key={itemIdx}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                    isChecked ? 'bg-green-500/10 border border-green-500/20' : 'hover:bg-white/5'
                  }`}>
                  <input type="checkbox" checked={isChecked || false} onChange={() => toggleItem(catIdx, itemIdx)}
                    className="w-4 h-4 rounded border-surface-600 text-primary-500 focus:ring-primary-500/20 bg-surface-800" />
                  <span className={`text-sm flex-1 ${isChecked ? 'text-surface-500 line-through' : 'text-surface-200'}`}>
                    {item.item}
                  </span>
                  {item.essential && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">Essential</span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* Pro Tips */}
      {checklist.proTips && (
        <div className="card bg-primary-500/5 border-primary-500/20">
          <h3 className="font-semibold text-primary-400 mb-3">💡 Pro Tips</h3>
          <ul className="space-y-2">
            {checklist.proTips.map((tip, i) => (
              <li key={i} className="text-sm text-surface-300 flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
