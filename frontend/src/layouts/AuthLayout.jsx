import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { IoCarSport, IoArrowBackOutline } from 'react-icons/io5';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-bg-deep flex flex-col justify-between items-center p-6 relative overflow-hidden">
      {/* Decorative Blur Background Accents */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header back-link */}
      <div className="w-full max-w-6xl flex justify-between items-center z-10">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-tr from-accent-cyan to-accent-purple p-2 rounded-xl text-bg-deep group-hover:scale-105 transition-transform duration-300">
            <IoCarSport className="text-2xl" />
          </div>
          <span className="font-display font-black text-2xl tracking-tight text-white">
            ANTIGRAVITY
          </span>
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors duration-300 group text-sm font-semibold">
          <IoArrowBackOutline className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Center login box layout */}
      <div className="w-full flex-grow flex items-center justify-center z-10 py-12">
        <Outlet />
      </div>

      {/* Simple footer note */}
      <div className="w-full text-center text-xs text-text-muted z-10">
        <span>© {new Date().getFullYear()} Antigravity Rentals. Encrypted SSL Connection.</span>
      </div>
    </div>
  );
}
