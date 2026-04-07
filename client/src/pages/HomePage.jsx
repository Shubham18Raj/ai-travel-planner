import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripAPI } from '../services/api';
import TripSearchForm from '../components/TripSearchForm';
import { FiMapPin, FiDollarSign, FiCalendar, FiUsers, FiCpu, FiCloud, FiCheckCircle, FiMessageCircle } from 'react-icons/fi';

const features = [
  { icon: <FiCpu />, title: 'AI Itinerary', desc: 'Gemini AI generates day-by-day travel plans' },
  { icon: <FiDollarSign />, title: 'ML Cost Estimator', desc: 'Machine learning predicts trip expenses' },
  { icon: <FiUsers />, title: 'Group Split', desc: 'Splitwise-style expense settling' },
  { icon: <FiCloud />, title: 'Live Weather', desc: 'Real-time forecasts from Open-Meteo' },
  { icon: <FiCheckCircle />, title: 'Smart Checklist', desc: 'AI packing list based on destination' },
  { icon: <FiMessageCircle />, title: 'AI Chatbot', desc: 'Ask anything about travel' },
];

export default function HomePage() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    tripAPI.search({ popular: true }).then(res => setDestinations(res.data.destinations || [])).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh" />
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative section w-full">
          <div className="max-w-3xl">
            <span className="badge-primary mb-6 inline-block">🚀 AI-Powered Travel Planning</span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white leading-tight mb-6">
              Plan Your Dream Trip with{' '}
              <span className="bg-clip-text text-transparent bg-hero-pattern">AI & ML</span>
            </h1>
            <p className="text-lg sm:text-xl text-surface-300 mb-10 max-w-xl leading-relaxed">
              Smart itineraries, ML-powered cost estimation, live weather, and group expense splitting — all in one beautiful app.
            </p>
            <TripSearchForm compact />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="text-center mb-16">
          <span className="badge-accent mb-4 inline-block">Features</span>
          <h2 className="section-title mx-auto">Everything You Need to Travel Smart</h2>
          <p className="section-subtitle mx-auto mt-4">Powered by Google Gemini AI, Machine Learning, and real-time APIs.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="card-hover group" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-xl mb-4 group-hover:shadow-glow transition-all">
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-lg text-white mb-2">{feature.title}</h3>
              <p className="text-surface-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="section bg-surface-900/50">
        <div className="text-center mb-16">
          <span className="badge-primary mb-4 inline-block">Popular</span>
          <h2 className="section-title mx-auto">Trending Destinations</h2>
          <p className="section-subtitle mx-auto mt-4">Explore the most loved travel destinations across India.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.slice(0, 8).map((dest, i) => (
            <Link key={i} to={`/routes?destination=${dest.name}&source=Delhi`}
              className="card-hover group relative overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-primary-600/20 to-accent-600/20 rounded-xl mb-4 flex items-center justify-center relative">
                <span className="text-6xl">
                  {dest.type === 'mountain' ? '🏔️' : dest.type === 'beach' ? '🏖️' : dest.type === 'desert' ? '🏜️' : '🏛️'}
                </span>
                <div className="absolute top-3 right-3 badge-primary">{dest.type}</div>
              </div>
              <h3 className="font-display font-semibold text-lg text-white group-hover:text-primary-400 transition-colors">{dest.name}</h3>
              <p className="text-sm text-surface-400 mt-1">{dest.state}</p>
              <p className="text-xs text-surface-500 mt-2 line-clamp-2">{dest.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section text-center">
        <div className="glass-card p-12 bg-gradient-mesh">
          <h2 className="section-title mx-auto mb-4">Ready to Plan Your Next Adventure?</h2>
          <p className="text-surface-300 mb-8 max-w-lg mx-auto">
            Join thousands of travelers who plan smarter with AI. Start your journey today.
          </p>
          <Link to="/search" className="btn-primary text-lg !px-8 !py-4 inline-flex items-center gap-2">
            <FiMapPin /> Start Planning
          </Link>
        </div>
      </section>
    </div>
  );
}
