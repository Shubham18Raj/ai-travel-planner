import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotUI from './components/ChatbotUI';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SearchTripPage from './pages/SearchTripPage';
import RoutesPage from './pages/RoutesPage';
import HotelsPage from './pages/HotelsPage';
import ActivitiesPage from './pages/ActivitiesPage';
import WeatherPage from './pages/WeatherPage';
import CostEstimationPage from './pages/CostEstimationPage';
import BudgetAnalysisPage from './pages/BudgetAnalysisPage';
import ItineraryPage from './pages/ItineraryPage';
import ChecklistPage from './pages/ChecklistPage';
import GroupSplitPage from './pages/GroupSplitPage';
import ReviewsPage from './pages/ReviewsPage';
import ProfilePage from './pages/ProfilePage';
import BookingPage from './pages/BookingPage';

export default function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <div className="min-h-screen bg-surface-950 text-surface-100">
          <Navbar />
          <main>
            <Routes>
              {/* Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/search" element={<SearchTripPage />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/hotels" element={<HotelsPage />} />
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />

              {/* Protected */}
              <Route path="/estimate" element={<ProtectedRoute><CostEstimationPage /></ProtectedRoute>} />
              <Route path="/budget" element={<ProtectedRoute><BudgetAnalysisPage /></ProtectedRoute>} />
              <Route path="/itinerary" element={<ProtectedRoute><ItineraryPage /></ProtectedRoute>} />
              <Route path="/checklist" element={<ProtectedRoute><ChecklistPage /></ProtectedRoute>} />
              <Route path="/group-split" element={<ProtectedRoute><GroupSplitPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
          <ChatbotUI />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
              success: { iconTheme: { primary: '#338dff', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </div>
      </TripProvider>
    </AuthProvider>
  );
}
