import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import SaleBanner from './components/SaleBanner';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import CommunitiesPage from './pages/CommunitiesPage';
import CommunityDetailPage from './pages/CommunityDetailPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import FloorPlanPage from './pages/FloorPlanPage';

import AdminDashboard from './pages/AdminDashboard';
import PropertyForm from './pages/admin/PropertyForm';
import PropertyList from './pages/admin/PropertyList';
import ImageManager from './pages/admin/ImageManager';
import AdminLogin from './pages/admin/AdminLogin';
import Settings from './pages/admin/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

// Scroll to top component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Main app content component
const AppContent: React.FC = () => {
  // Removed database initialization to prevent authentication issues

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50">
        <SaleBanner />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/floor-plans" element={<FloorPlanPage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/communities/:id" element={<CommunityDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <AuthProvider>
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              </AuthProvider>
            } />
            <Route path="/admin/properties" element={
              <AuthProvider>
                <ProtectedRoute>
                  <PropertyList />
                </ProtectedRoute>
              </AuthProvider>
            } />
            <Route path="/admin/properties/new" element={
              <AuthProvider>
                <ProtectedRoute>
                  <PropertyForm />
                </ProtectedRoute>
              </AuthProvider>
            } />
            <Route path="/admin/properties/edit/:id" element={
              <AuthProvider>
                <ProtectedRoute>
                  <PropertyForm />
                </ProtectedRoute>
              </AuthProvider>
            } />
            <Route path="/admin/images" element={
              <AuthProvider>
                <ProtectedRoute>
                  <ImageManager />
                </ProtectedRoute>
              </AuthProvider>
            } />
            <Route path="/admin/settings" element={
              <AuthProvider>
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              </AuthProvider>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}

export default App; 