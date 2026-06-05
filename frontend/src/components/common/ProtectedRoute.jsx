import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IoCarSportOutline } from 'react-icons/io5';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Loading card */}
        <div className="card-glass p-8 rounded-3xl flex flex-col items-center gap-6 max-w-sm text-center relative z-10 border border-white/5 shadow-2xl">
          <div className="relative flex items-center justify-center">
            {/* Spinning Ring */}
            <div className="w-16 h-16 rounded-full border-2 border-white/5 border-t-accent-cyan animate-spin"></div>
            {/* Ambient Pulse Icon */}
            <IoCarSportOutline className="text-2xl text-accent-cyan absolute animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Verifying Credentials</h3>
            <p className="text-text-muted text-xs">Securing session connection to Car Rental System Services...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to /auth but save the current location they were trying to go to
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (adminOnly && !isAdmin) {
    // Redirect non-admins to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
