import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function MainLayout() {
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
      <Navbar />

      {/* Main Active Route View */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Grid Footer */}
      <Footer />
    </div>
  );
}
