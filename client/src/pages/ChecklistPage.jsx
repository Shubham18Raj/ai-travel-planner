import { useState } from 'react';
import { aiAPI } from '../services/api';
import ChecklistCard from '../components/ChecklistCard';
import toast from 'react-hot-toast';

export default function ChecklistPage() {
  const [form, setForm] = useState({ destination: '', destinationType: 'mountain', season: 'summer', activities: '', numDays: 5 });
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await aiAPI.generateChecklist({
        ...form,
        activities: form.activities.split(',').map(s => s.trim()).filter(Boolean),
      });
      setChecklist(res.data);
      toast.success('Smart checklist generated!');
    } catch {
      toast.error('Failed to generate checklist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section">
        <div className="text-center mb-12">
          <span className="badge-primary mb-4 inline-block">✅ Smart Checklist</span>
          <h1 className="section-title mx-auto">AI Packing Checklist</h1>
          <p className="section-subtitle mx-auto mt-4">Gemini AI generates a personalized packing list based on your destination.</p>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-surface-300 mb-1 block">Destination</label>
                  <input value={form.destination} onChange={(e) => setForm(f => ({...f, destination: e.target.value}))}
                    placeholder="e.g., Ladakh" className="input-field" required />
                </div>
                <div>
                  <label className="text-sm text-surface-300 mb-1 block">Type</label>
                  <select value={form.destinationType} onChange={(e) => setForm(f => ({...f, destinationType: e.target.value}))} className="input-field">
                    <option value="mountain">🏔️ Mountain</option>
                    <option value="beach">🏖️ Beach</option>
                    <option value="desert">🏜️ Desert</option>
                    <option value="cultural">🏛️ Cultural</option>
                    <option value="snow">❄️ Snow</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-surface-300 mb-1 block">Season</label>
                  <select value={form.season} onChange={(e) => setForm(f => ({...f, season: e.target.value}))} className="input-field">
                    <option value="summer">☀️ Summer</option>
                    <option value="monsoon">🌧️ Monsoon</option>
                    <option value="autumn">🍂 Autumn</option>
                    <option value="winter">❄️ Winter</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-surface-300 mb-1 block">Days</label>
                  <input type="number" value={form.numDays} min="1" onChange={(e) => setForm(f => ({...f, numDays: parseInt(e.target.value)}))} className="input-field" />
                </div>
              </div>
              <div>
                <label className="text-sm text-surface-300 mb-1 block">Activities (comma separated)</label>
                <input value={form.activities} onChange={(e) => setForm(f => ({...f, activities: e.target.value}))}
                  placeholder="trekking, camping, photography" className="input-field" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
                {loading ? '🧠 Generating...' : '✅ Generate Smart Checklist'}
              </button>
            </form>
          </div>
        </div>

        {checklist && !checklist.parseError && <ChecklistCard checklist={checklist} />}
      </div>
    </div>
  );
}
