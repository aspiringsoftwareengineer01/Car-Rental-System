import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Reset scroll position to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    if (!loading && isAdmin && location.pathname !== '/admin' && location.pathname !== '/dashboard') {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, loading, location.pathname, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-bg-deep selection:bg-accent-cyan/30">
      {/* Toast Notification Provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(223, 47%, 16%)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />

      {/* Sticky Premium Navigation */}
      {location.pathname !== '/dashboard' && <Navbar />}

      {/* Main Active Route View */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Grid Footer */}
      {location.pathname !== '/dashboard' && <Footer />}
    </div>
  );
}
