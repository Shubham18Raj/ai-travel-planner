import { Link } from 'react-router-dom';
import { FiMapPin, FiGithub, FiMail, FiHeart } from 'react-icons/fi';

const footerLinks = {
  'Explore': [
    { label: 'Plan a Trip', path: '/search' },
    { label: 'Hotels', path: '/hotels' },
    { label: 'Activities', path: '/activities' },
    { label: 'Cost Estimator', path: '/estimate' },
  ],
  'AI Features': [
    { label: 'AI Itinerary', path: '/itinerary' },
    { label: 'Travel Chatbot', path: '/search' },
    { label: 'Smart Checklist', path: '/checklist' },
    { label: 'Budget Analyzer', path: '/budget' },
  ],
  'More': [
    { label: 'Weather', path: '/weather' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Group Split', path: '/group-split' },
    { label: 'Best Time to Visit', path: '/search' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-surface-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center">
                <FiMapPin className="text-white text-lg" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Travel<span className="text-primary-400">Genius</span>
              </span>
            </Link>
            <p className="text-surface-400 text-sm leading-relaxed">
              AI-Powered Smart Travel Planner. Plan trips, estimate costs, generate itineraries, and split expenses — all in one place.
            </p>
            <div className="flex gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-surface-400 hover:text-white hover:bg-white/10 transition-all">
                <FiGithub size={18} />
              </a>
              <a href="mailto:contact@travelgenius.app"
                className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-surface-400 hover:text-white hover:bg-white/10 transition-all">
                <FiMail size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-sm text-surface-400 hover:text-primary-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-white/5 my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-surface-500 text-sm">
            © {new Date().getFullYear()} TravelGenius. All rights reserved.
          </p>
          <p className="text-surface-500 text-sm flex items-center gap-1">
            Built with <FiHeart className="text-red-500" size={14} /> for B.Tech Final Year Project
          </p>
        </div>
      </div>
    </footer>
  );
}
