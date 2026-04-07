import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiMapPin, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/search', label: 'Plan Trip' },
  { path: '/hotels', label: 'Hotels' },
  { path: '/activities', label: 'Activities' },
  { path: '/weather', label: 'Weather' },
  { path: '/estimate', label: 'Cost Estimator' },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:shadow-glow transition-all">
              <FiMapPin className="text-white text-lg" />
            </div>
            <span className="font-display font-bold text-xl text-white">
              Travel<span className="text-primary-400">Genius</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-surface-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth / Profile */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-surface-200">{user?.name?.split(' ')[0]}</span>
                  <FiChevronDown className={`text-surface-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-56 glass-card p-2 animate-scale-in">
                    <Link to="/profile" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-surface-200 hover:text-white transition-all">
                      <FiUser className="text-primary-400" /> My Profile & Trips
                    </Link>
                    <Link to="/group-split" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-surface-200 hover:text-white transition-all">
                      💰 Group Split
                    </Link>
                    <hr className="border-white/10 my-1" />
                    <button onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-surface-200 hover:text-red-400 w-full transition-all">
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Log In</Link>
                <Link to="/signup" className="btn-primary text-sm !px-4 !py-2">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-surface-300 hover:text-white">
            {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-900/95 backdrop-blur-xl border-t border-white/5 animate-slide-in">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-surface-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-white/10 my-2" />
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm text-surface-300 hover:text-white hover:bg-white/5">Profile</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10">Logout</button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-ghost text-sm flex-1 text-center">Log In</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary text-sm flex-1 text-center !py-2">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
