import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCarSport, IoMenuOutline, IoCloseOutline, IoPersonOutline } from 'react-icons/io5';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Cars Fleet', path: '/cars' },
    { name: 'Reservations', path: '/booking' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-light bg-bg-glass backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-tr from-accent-cyan to-accent-purple p-2 rounded-xl text-bg-deep group-hover:scale-105 transition-transform duration-300">
            <IoCarSport className="text-2xl" />
          </div>
          <span className="font-display font-black text-2xl tracking-tight bg-gradient-to-r from-white via-white to-accent-cyan bg-clip-text text-transparent">
            ANTIGRAVITY
          </span>
        </Link>

        {/* Desktop NavLinks */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide transition-colors duration-300 hover:text-accent-cyan ${
                  isActive ? 'text-accent-cyan' : 'text-text-muted'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Profile CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/auth" className="flex items-center gap-2 text-text-muted hover:text-white transition-colors duration-300">
            <IoPersonOutline className="text-xl" />
            <span className="text-sm font-semibold">Account</span>
          </Link>
          <Link to="/cars" className="btn-premium btn-premium-hover px-5 py-2.5 rounded-lg text-sm font-bold">
            Book Now
          </Link>
        </div>

        {/* Mobile Toggle Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-3xl text-text-muted hover:text-white focus:outline-none"
        >
          {isOpen ? <IoCloseOutline /> : <IoMenuOutline />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-bg-surface/95 border-b border-border-light overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `text-lg font-bold tracking-wide transition-colors ${
                      isActive ? 'text-accent-cyan' : 'text-text-muted'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <hr className="border-border-light" />
              <div className="flex flex-col gap-4">
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 justify-center text-text-muted hover:text-white py-2"
                >
                  <IoPersonOutline className="text-xl" />
                  <span>Profile Account</span>
                </Link>
                <Link
                  to="/cars"
                  onClick={() => setIsOpen(false)}
                  className="btn-premium btn-premium-hover text-center py-3 rounded-xl font-bold"
                >
                  Reserve Car
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
