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
  IoBookmarkOutline,
  IoSettingsOutline
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
                `text-sm font-semibold tracking-wide transition-all duration-300 hover:text-accent-cyan relative py-2 ${
                  isActive ? 'text-accent-cyan after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-accent-cyan after:rounded-full' : 'text-text-muted'
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
                className="flex items-center gap-2.5 text-white hover:text-accent-cyan transition-all duration-300 cursor-pointer py-2.5 px-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 select-none"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-accent-cyan to-accent-purple text-slate-950 flex items-center justify-center font-bold text-[11px] uppercase shadow-inner">
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
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
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

                    <Link
                      to="/admin"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/5 hover:text-accent-cyan transition-all text-text-muted hover:-translate-y-0.5"
                    >
                      <IoSettingsOutline className="text-lg text-accent-coral" />
                      <span>Admin Console</span>
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
            <Link to="/auth" className="flex items-center gap-2 text-text-muted hover:text-white transition-colors duration-300 py-2.5 px-3">
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
          className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl border border-white/5 bg-white/5 text-2xl text-text-muted hover:text-white focus:outline-none transition-colors duration-300 cursor-pointer"
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-slate-950/98 border-b border-border-light overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                {links.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `text-base font-bold tracking-wide transition-all py-3 px-4 rounded-xl flex items-center ${
                        isActive 
                          ? 'bg-blue-500/10 text-accent-cyan' 
                          : 'text-text-muted hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
              <hr className="border-white/5" />
              
              <div className="flex flex-col gap-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 py-1 px-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-cyan to-accent-purple text-slate-950 flex items-center justify-center font-bold text-sm uppercase shadow-md shadow-accent-cyan/15">
                        {getDisplayName().slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{getDisplayName()}</h4>
                        <span className="text-xs text-text-muted truncate block max-w-[200px] font-sans">{user.email}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 text-text-muted hover:text-white bg-white/5 border border-white/5 py-3 rounded-xl font-bold text-xs"
                      >
                        <IoPersonOutline className="text-base text-accent-cyan" />
                        <span>Profile</span>
                      </Link>

                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 text-text-muted hover:text-white bg-white/5 border border-white/5 py-3 rounded-xl font-bold text-xs"
                      >
                        <IoSettingsOutline className="text-base text-accent-coral" />
                        <span>Admin</span>
                      </Link>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 text-red-400 hover:text-red-300 bg-red-500/5 border border-red-500/10 py-3 rounded-xl font-bold text-xs cursor-pointer mt-1"
                    >
                      <IoLogOutOutline className="text-base" />
                      <span>Log Out Account</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 text-text-muted hover:text-white bg-white/5 border border-white/5 py-3.5 rounded-xl text-sm font-bold"
                  >
                    <IoPersonOutline className="text-lg" />
                    <span>Access Account</span>
                  </Link>
                )}

                <Link
                  to="/cars"
                  onClick={() => setIsOpen(false)}
                  className="btn-premium btn-premium-hover text-center py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-accent-cyan/15 mt-2"
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

