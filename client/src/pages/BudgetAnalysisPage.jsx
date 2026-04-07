import { useState } from 'react';
import { aiAPI } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

const COLORS = ['#338dff', '#d946ef', '#f97316', '#22c55e', '#eab308'];

export default function BudgetAnalysisPage() {
  const [form, setForm] = useState({ source: '', destination: '', numDays: 3, groupSize: 2, totalBudget: 20000 });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await aiAPI.analyzeBudget(form);
      setAnalysis(res.data);
      toast.success('Budget analyzed by AI!');
    } catch {
      toast.error('Analysis failed. Check your Gemini API key.');
    } finally {
      setLoading(false);
    }
  };

  const getBreakdownData = () => {
    if (!analysis?.budgetBreakdown) return [];
    return Object.entries(analysis.budgetBreakdown).map(([key, val], i) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: val.amount,
      color: COLORS[i % COLORS.length],
    }));
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section">
        <div className="text-center mb-12">
          <span className="badge-accent mb-4 inline-block">🧠 AI Analysis</span>
          <h1 className="section-title mx-auto">Smart Budget Analyzer</h1>
          <p className="section-subtitle mx-auto mt-4">AI analyzes your budget and suggests the best travel mode, hotel, and savings tips.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="font-display font-semibold text-xl text-white mb-6">Enter Your Budget</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-surface-300 mb-1 block">From</label>
                  <input value={form.source} onChange={(e) => setForm(f => ({...f, source: e.target.value}))}
                    placeholder="Delhi" className="input-field" required />
                </div>
                <div>
                  <label className="text-sm text-surface-300 mb-1 block">To</label>
                  <input value={form.destination} onChange={(e) => setForm(f => ({...f, destination: e.target.value}))}
                    placeholder="Goa" className="input-field" required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-surface-300 mb-1 block">Days</label>
                  <input type="number" value={form.numDays} min="1" onChange={(e) => setForm(f => ({...f, numDays: parseInt(e.target.value)}))} className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-surface-300 mb-1 block">Group</label>
                  <input type="number" value={form.groupSize} min="1" onChange={(e) => setForm(f => ({...f, groupSize: parseInt(e.target.value)}))} className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-surface-300 mb-1 block">Budget (₹)</label>
                  <input type="number" value={form.totalBudget} min="1000" onChange={(e) => setForm(f => ({...f, totalBudget: parseInt(e.target.value)}))} className="input-field" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
                {loading ? '🧠 Analyzing...' : '🧠 Analyze Budget with AI'}
              </button>
            </form>
          </div>

          {analysis && !analysis.parseError ? (
            <div className="space-y-6">
              {/* Feasibility */}
              <div className={`card text-center ${
                analysis.feasibility === 'comfortable' ? 'border-green-500/30' :
                analysis.feasibility === 'tight' ? 'border-yellow-500/30' : 'border-red-500/30'
              }`}>
                <span className="text-4xl block mb-2">
                  {analysis.feasibility === 'comfortable' ? '✅' : analysis.feasibility === 'tight' ? '⚠️' : '❌'}
                </span>
                <p className="text-xl font-bold text-white capitalize">{analysis.feasibility}</p>
                <p className="text-surface-400 text-sm mt-1">Per person: {formatCurrency(analysis.perPersonCost || 0)}</p>
              </div>

              {/* Recommendations */}
              <div className="card">
                <h3 className="font-semibold text-white mb-3">AI Recommendations</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card p-3 text-center">
                    <p className="text-xs text-surface-400">Travel Mode</p>
                    <p className="text-lg font-bold text-primary-400 capitalize">{analysis.recommendedMode}</p>
                  </div>
                  <div className="glass-card p-3 text-center">
                    <p className="text-xs text-surface-400">Hotel Type</p>
                    <p className="text-lg font-bold text-accent-400 capitalize">{analysis.recommendedHotel}</p>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="card">
                <h3 className="font-semibold text-white mb-3">Budget Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getBreakdownData()}>
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip formatter={(val) => formatCurrency(val)}
                        contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f1f5f9' }} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {getBreakdownData().map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tips */}
              {analysis.savingsTips && (
                <div className="card bg-green-500/5 border-green-500/20">
                  <h3 className="font-semibold text-green-400 mb-3">💡 Savings Tips</h3>
                  <ul className="space-y-2">
                    {analysis.savingsTips.map((tip, i) => (
                      <li key={i} className="text-sm text-surface-300 flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">•</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center text-center">
              <div>
                <span className="text-6xl block mb-4">💰</span>
                <p className="text-surface-400">Enter your budget details and let AI analyze the best way to spend it.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
