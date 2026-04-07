import { useState } from 'react';
import { splitAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function GroupSplitPage() {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([{ name: '', email: '' }]);
  const [group, setGroup] = useState(null);
  const [settlements, setSettlements] = useState(null);
  const [expense, setExpense] = useState({ description: '', amount: '', paidBy: '', splitAmong: [] });

  const addMember = () => setMembers([...members, { name: '', email: '' }]);
  const removeMember = (i) => setMembers(members.filter((_, idx) => idx !== i));
  const updateMember = (i, field, val) => {
    const updated = [...members];
    updated[i][field] = val;
    setMembers(updated);
  };

  const createGroup = async (e) => {
    e.preventDefault();
    const validMembers = members.filter(m => m.name.trim());
    if (validMembers.length < 2) return toast.error('Need at least 2 members');
    try {
      const res = await splitAPI.createGroup({ groupName, members: validMembers });
      setGroup(res.data.group);
      toast.success('Group created!');
    } catch { toast.error('Failed to create group'); }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    if (!group) return;
    try {
      const splitAmong = expense.splitAmong.length > 0 ? expense.splitAmong : group.members.map(m => m.name);
      const res = await splitAPI.addExpense({
        groupId: group._id, description: expense.description,
        amount: parseFloat(expense.amount), paidBy: expense.paidBy, splitAmong,
      });
      setGroup(res.data.group);
      setExpense({ description: '', amount: '', paidBy: '', splitAmong: [] });
      toast.success('Expense added!');
    } catch { toast.error('Failed to add expense'); }
  };

  const calcSettlements = async () => {
    if (!group) return;
    try {
      const res = await splitAPI.getSettlements(group._id);
      setSettlements(res.data);
    } catch { toast.error('Failed to calculate'); }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section">
        <div className="text-center mb-12">
          <span className="badge-accent mb-4 inline-block">💰 Group Split</span>
          <h1 className="section-title mx-auto">Split Trip Expenses</h1>
          <p className="section-subtitle mx-auto mt-4">Splitwise-style expense tracking — know exactly who owes whom.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Group / Add Expense */}
          <div className="space-y-6">
            {!group ? (
              <div className="card">
                <h2 className="font-display font-semibold text-xl text-white mb-4">Create Group</h2>
                <form onSubmit={createGroup} className="space-y-4">
                  <div>
                    <label className="text-sm text-surface-300 mb-1 block">Group Name</label>
                    <input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Goa Trip 2025" className="input-field" required />
                  </div>
                  {members.map((m, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={m.name} onChange={(e) => updateMember(i, 'name', e.target.value)}
                        placeholder={`Member ${i+1} name`} className="input-field flex-1" required />
                      <input value={m.email} onChange={(e) => updateMember(i, 'email', e.target.value)}
                        placeholder="Email (optional)" className="input-field flex-1" />
                      {members.length > 1 && (
                        <button type="button" onClick={() => removeMember(i)} className="text-red-400 hover:text-red-300 px-2">✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addMember} className="btn-ghost text-sm text-primary-400">+ Add Member</button>
                  <button type="submit" className="btn-primary w-full">Create Group</button>
                </form>
              </div>
            ) : (
              <div className="card">
                <h2 className="font-display font-semibold text-xl text-white mb-4">Add Expense</h2>
                <form onSubmit={addExpense} className="space-y-4">
                  <input value={expense.description} onChange={(e) => setExpense(x => ({...x, description: e.target.value}))}
                    placeholder="What was it for?" className="input-field" required />
                  <input type="number" value={expense.amount} onChange={(e) => setExpense(x => ({...x, amount: e.target.value}))}
                    placeholder="Amount (₹)" className="input-field" required min="1" />
                  <select value={expense.paidBy} onChange={(e) => setExpense(x => ({...x, paidBy: e.target.value}))} className="input-field" required>
                    <option value="">Who paid?</option>
                    {group.members.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                  </select>
                  <button type="submit" className="btn-primary w-full">Add Expense</button>
                </form>

                {/* Expenses List */}
                {group.expenses?.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h3 className="text-sm font-semibold text-surface-400">Expenses ({group.expenses.length})</h3>
                    {group.expenses.map((exp, i) => (
                      <div key={i} className="glass-card p-3 flex justify-between items-center">
                        <div>
                          <p className="text-sm text-white">{exp.description}</p>
                          <p className="text-xs text-surface-400">Paid by {exp.paidBy}</p>
                        </div>
                        <span className="font-bold text-white">{formatCurrency(exp.amount)}</span>
                      </div>
                    ))}
                    <button onClick={calcSettlements} className="btn-secondary w-full mt-4">
                      📊 Calculate Who Owes Whom
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Settlements */}
          <div>
            {settlements ? (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="font-display font-semibold text-xl text-white mb-4">Summary</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="glass-card p-4 text-center">
                      <p className="text-xs text-surface-400">Total Expenses</p>
                      <p className="text-xl font-bold text-white">{formatCurrency(settlements.totalExpenses)}</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                      <p className="text-xs text-surface-400">Per Person</p>
                      <p className="text-xl font-bold text-primary-400">{formatCurrency(settlements.perPersonAverage)}</p>
                    </div>
                  </div>

                  {/* Balances */}
                  <h3 className="text-sm font-semibold text-surface-400 mb-2">Balances</h3>
                  {settlements.balances?.map((b, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <span className="text-white">{b.name}</span>
                      <span className={`font-bold ${b.balance > 0 ? 'text-green-400' : b.balance < 0 ? 'text-red-400' : 'text-surface-400'}`}>
                        {b.balance > 0 ? `+${formatCurrency(b.balance)}` : formatCurrency(b.balance)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Settlement Transactions */}
                <div className="card">
                  <h2 className="font-display font-semibold text-xl text-white mb-4">Settlements</h2>
                  {settlements.settlements?.length === 0 ? (
                    <p className="text-surface-400 text-center py-4">Everyone is settled! 🎉</p>
                  ) : (
                    <div className="space-y-3">
                      {settlements.settlements.map((s, i) => (
                        <div key={i} className="glass-card p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm">
                            {s.from.charAt(0)}
                          </div>
                          <div className="flex-1 text-center">
                            <p className="text-sm text-surface-400">pays</p>
                            <p className="text-lg font-bold text-white">{formatCurrency(s.amount)}</p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">
                            {s.to.charAt(0)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card h-full flex items-center justify-center text-center min-h-[300px]">
                <div>
                  <span className="text-6xl block mb-4">💸</span>
                  <p className="text-surface-400">Create a group, add expenses, then calculate settlements.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
