import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoCarSport, 
  IoMenuOutline, 
  IoCloseOutline, 
  IoPersonOutline, 
  IoLogOutOutline, 
  IoChevronDownOutline,
  IoBookmarkOutline
} from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, signOut } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Cars Fleet', path: '/cars' },
    { name: 'Reservations', path: '/booking' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowDropdown(false);
    setIsOpen(false);
    await signOut();
    navigate('/');
  };

  // Get user display name or email prefix
  const getDisplayName = () => {
    if (!user) return '';
    if (user.user_metadata?.name) return user.user_metadata.name;
    if (user.email) return user.email.split('@')[0];
    return 'Premium Member';
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-light bg-slate-950/85 backdrop-blur-xl">
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

        {/* Profile / Account Area */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            /* Authenticated Dropdown Menu */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 text-white hover:text-accent-cyan transition-colors duration-300 cursor-pointer py-1.5 px-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-accent-cyan to-accent-purple text-slate-950 flex items-center justify-center font-bold text-[10px] uppercase">
                  {getDisplayName().slice(0, 2)}
                </div>
                <span className="text-sm font-semibold tracking-wide truncate max-w-[120px]">
                  {getDisplayName()}
                </span>
                <IoChevronDownOutline className={`text-xs transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-56 card-glass rounded-2xl border border-white/10 p-2 shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <span className="text-[10px] text-accent-cyan font-bold uppercase tracking-wider block">Logged In As</span>
                      <span className="text-xs text-text-muted block truncate font-sans">{user.email}</span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/5 hover:text-accent-cyan transition-all text-text-muted hover:-translate-y-0.5"
                    >
                      <IoPersonOutline className="text-lg text-accent-cyan" />
                      <span>User Profile</span>
                    </Link>

                    <Link
                      to="/booking"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/5 hover:text-accent-cyan transition-all text-text-muted hover:-translate-y-0.5"
                    >
                      <IoBookmarkOutline className="text-lg text-accent-purple" />
                      <span>Bookings</span>
                    </Link>

                    <hr className="border-white/5 my-1.5" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all cursor-pointer hover:-translate-y-0.5"
                    >
                      <IoLogOutOutline className="text-lg" />
                      <span>Log Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Unauthenticated Account Trigger */
            <Link to="/auth" className="flex items-center gap-2 text-text-muted hover:text-white transition-colors duration-300">
              <IoPersonOutline className="text-xl" />
              <span className="text-sm font-semibold">Account</span>
            </Link>
          )}

          <Link to="/cars" className="btn-premium btn-premium-hover px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-blue-500/5">
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
                {user ? (
                  <>
                    <div className="flex items-center gap-3 py-2 border-b border-white/5 pb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-cyan to-accent-purple text-slate-950 flex items-center justify-center font-bold text-sm uppercase">
                        {getDisplayName().slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{getDisplayName()}</h4>
                        <span className="text-xs text-text-muted truncate block max-w-[200px]">{user.email}</span>
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-text-muted hover:text-white py-2 font-semibold text-sm"
                    >
                      <IoPersonOutline className="text-xl text-accent-cyan" />
                      <span>User Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 text-red-400 hover:text-red-300 py-2 font-semibold text-sm text-left bg-transparent border-none cursor-pointer"
                    >
                      <IoLogOutOutline className="text-xl" />
                      <span>Log Out</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 justify-center text-text-muted hover:text-white py-2"
                  >
                    <IoPersonOutline className="text-xl" />
                    <span>Profile Account</span>
                  </Link>
                )}

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

