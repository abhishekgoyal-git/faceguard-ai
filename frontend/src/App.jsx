import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FaceEnrollmentPage from './pages/FaceEnrollmentPage';
import LiveRecognitionPage from './pages/LiveRecognitionPage';
import LivenessDetectionPage from './pages/LivenessDetectionPage';
import EmotionDetectionPage from './pages/EmotionDetectionPage';
import AttendanceDashboard from './pages/AttendanceDashboard';
import AccessControlDashboard from './pages/AccessControlDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-['Outfit'] selection:bg-cyan-500 selection:text-slate-950">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected User Pages */}
              <Route
                path="/enrollment"
                element={
                  <ProtectedRoute>
                    <FaceEnrollmentPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/recognition" element={<LiveRecognitionPage />} />
              <Route path="/liveness" element={<LivenessDetectionPage />} />
              <Route path="/emotion" element={<EmotionDetectionPage />} />
              <Route path="/attendance" element={<AttendanceDashboard />} />
              <Route path="/access-control" element={<AccessControlDashboard />} />

              {/* Protected Admin Page */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
