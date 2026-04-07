import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const { signup, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const result = await signup({ name: form.name, email: form.email, password: form.password });
    if (result.success) {
      toast.success('Account created! 🎉');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-hero">
      <div className="absolute inset-0 bg-gradient-mesh" />

      <div className="relative w-full max-w-md">
        <div className="glass-card p-8 animate-fade-up">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <FiMapPin className="text-white text-xl" />
              </div>
              <span className="font-display font-bold text-2xl text-white">Travel<span className="text-primary-400">Genius</span></span>
            </Link>
            <h1 className="text-2xl font-display font-bold text-white">Create Account</h1>
            <p className="text-surface-400 mt-1">Start planning your dream trip</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3.5 text-surface-400" />
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe" className="input-field !pl-10" required minLength={2} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-surface-400" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com" className="input-field !pl-10" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-surface-400" />
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" className="input-field !pl-10" required minLength={6} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-surface-400" />
                <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••" className="input-field !pl-10" required minLength={6} />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-surface-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium" onClick={clearError}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
