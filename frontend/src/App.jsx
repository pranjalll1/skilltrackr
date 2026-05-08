import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminRoute from './components/routing/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Overview from './pages/dashboard/Overview';
import ProfileSettings from './pages/dashboard/ProfileSettings';
import NewAssessment from './pages/dashboard/NewAssessment';
import TakeAssessment from './pages/dashboard/TakeAssessment';
import AssessmentResult from './pages/dashboard/AssessmentResult';
import Chatbot from './pages/dashboard/Chatbot';
import Analytics from './pages/dashboard/Analytics';
import StudyPlanner from './pages/dashboard/StudyPlanner';
import History from './pages/dashboard/History';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        className: 'bg-brand-primary text-brand-light border border-brand-accent/20 glass-card',
        style: { background: 'rgba(2, 26, 84, 0.9)', color: '#F5F5F5', backdropFilter: 'blur(12px)' }
      }} />
      <Router>
        <div className="min-h-screen flex flex-col bg-brand-dark text-brand-light">
          <Routes>
            {/* Public Routes with Navbar and Footer */}
            <Route path="/" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
              </>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="planner" element={<StudyPlanner />} />
              <Route path="chat" element={<Chatbot />} />
              <Route path="history" element={<History />} />
              <Route path="settings" element={<ProfileSettings />} />
              <Route path="assessments/new" element={<NewAssessment />} />
              <Route path="assessments/:id/take" element={<TakeAssessment />} />
              <Route path="assessments/:id/result" element={<AssessmentResult />} />
              
              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="admin" element={<AdminDashboard />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
