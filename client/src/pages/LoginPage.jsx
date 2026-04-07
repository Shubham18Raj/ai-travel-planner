import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result.success) {
      toast.success('Welcome back! 🎉');
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
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <FiMapPin className="text-white text-xl" />
              </div>
              <span className="font-display font-bold text-2xl text-white">Travel<span className="text-primary-400">Genius</span></span>
            </Link>
            <h1 className="text-2xl font-display font-bold text-white">Welcome Back</h1>
            <p className="text-surface-400 mt-1">Sign in to continue planning</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="••••••••" className="input-field !pl-10" required />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-surface-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium" onClick={clearError}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
