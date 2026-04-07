import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../utils/helpers';

const COLORS = ['#338dff', '#d946ef', '#f97316', '#22c55e', '#eab308'];

export default function CostBreakdownCard({ estimation, chartType = 'pie' }) {
  if (!estimation) return null;

  const breakdown = estimation.breakdown || {};
  const data = [
    { name: 'Travel', value: breakdown.travel || 0, color: COLORS[0] },
    { name: 'Stay', value: breakdown.stay || 0, color: COLORS[1] },
    { name: 'Food', value: breakdown.food || 0, color: COLORS[2] },
    { name: 'Activities', value: breakdown.activities || breakdown.activity || 0, color: COLORS[3] },
  ].filter(d => d.value > 0);

  return (
    <div className="card space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-xl text-white">Cost Breakdown</h3>
        <span className={`badge ${estimation.source === 'ml_model' ? 'badge-primary' : 'badge-accent'}`}>
          {estimation.source === 'ml_model' ? '🤖 ML Model' : '📊 Estimated'}
        </span>
      </div>

      {/* Total & Per Person */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-surface-400 text-sm">Total Cost</p>
          <p className="text-2xl font-bold text-white mt-1">{formatCurrency(estimation.total_cost)}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-surface-400 text-sm">Per Person</p>
          <p className="text-2xl font-bold text-primary-400 mt-1">{formatCurrency(estimation.per_person)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        {chartType === 'pie' ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: '#64748b' }}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip formatter={(val) => formatCurrency(val)} contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f1f5f9' }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip formatter={(val) => formatCurrency(val)} contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f1f5f9' }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {data.map(item => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
            <span className="text-surface-300">{item.name}:</span>
            <span className="text-white font-medium">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>

      {estimation.confidence && (
        <div className="text-center text-xs text-surface-500">
          Model confidence: {(estimation.confidence * 100).toFixed(1)}%
        </div>
      )}
    </div>
  );
}
