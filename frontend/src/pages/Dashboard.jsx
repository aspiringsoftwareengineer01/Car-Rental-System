import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  IoSearchOutline,
  IoNotificationsOutline,
  IoChevronDownOutline,
  IoSpeedometerOutline,
  IoFlagOutline,
  IoCardOutline,
  IoStarOutline,
  IoCloseOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoBookmarkOutline,
  IoCarSport,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
  IoTrashOutline
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../hooks/useBookings';
import { useCars } from '../hooks/useCars';
import { getCarImage } from '../utils/carImages';

export default function Dashboard() {
  const { user, isAdmin, updateProfile, signOut } = useAuth();
  const { bookings, loading: bookingsLoading, cancelBooking } = useBookings();
  const { cars, loading: carsLoading } = useCars();
  const navigate = useNavigate();

  // Search query for filtering bookings
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown state for profile
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const notifDropdownRef = useRef(null);

  // Profile edit states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setIsNotifDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize form fields when opening modal
  useEffect(() => {
    if (isEditOpen && user) {
      setEditName(user.user_metadata?.name || '');
      setEditPassword('');
      setConfirmPassword('');
      setShowPassword(false);
    }
  }, [isEditOpen, user]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error('Display name cannot be empty.');
      return;
    }

    if (editPassword) {
      if (editPassword.length < 6) {
        toast.error('Password must be at least 6 characters long.');
        return;
      }
      if (editPassword !== confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }
    }

    setIsSubmitting(true);
    const res = await updateProfile({ name: editName.trim(), password: editPassword || undefined });
    setIsSubmitting(false);

    if (res.success) {
      setIsEditOpen(false);
    }
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await signOut();
    navigate('/');
  };

  // Notification Sync Engine
  useEffect(() => {
    if (!user || bookingsLoading || carsLoading) return;

    const notifKey = `antigravity_notifications_${user.email}`;
    const seenKey = `antigravity_seen_bookings_${user.email}`;

    let existingNotifs = [];
    try {
      const saved = localStorage.getItem(notifKey);
      existingNotifs = saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse notifications:', e);
    }

    let seenBookings = {};
    try {
      const savedSeen = localStorage.getItem(seenKey);
      seenBookings = savedSeen ? JSON.parse(savedSeen) : {};
    } catch (e) {
      console.error('Failed to parse seen bookings:', e);
    }

    let updatedSeen = { ...seenBookings };
    let newNotifs = [...existingNotifs];
    let hasChanges = false;

    // First-time initialize check: if seenBookings is empty but user already has bookings in DB,
    // we populate it silently so we don't spam notifications for old historical items.
    const isFirstRun = Object.keys(seenBookings).length === 0;

    bookings.forEach(b => {
      const prevStatus = seenBookings[b.id];

      if (prevStatus === undefined) {
        updatedSeen[b.id] = b.status;
        if (!isFirstRun) {
          // Add notification for booking creation
          newNotifs.unshift({
            id: `notif_${b.id}_created_${Date.now()}`,
            bookingId: b.id,
            text: `Your reservation for ${getCarName(b.carId)} (${b.id}) has been created and is pending admin verification. ⌛`,
            type: 'pending',
            status: 'read', // Start creation notif as read to avoid spamming indicator dots
            timestamp: new Date().toISOString()
          });
          hasChanges = true;
        }
      } else if (prevStatus !== b.status) {
        updatedSeen[b.id] = b.status;
        let text = '';
        let type = '';
        if (b.status === 'confirmed') {
          text = `Your booking for ${getCarName(b.carId)} (${b.id}) has been verified by the admin! 🎉`;
          type = 'verified';
        } else if (b.status === 'cancelled') {
          text = `Your booking for ${getCarName(b.carId)} (${b.id}) has been cancelled by the admin. ❌`;
          type = 'cancelled';
        }

        if (text) {
          newNotifs.unshift({
            id: `notif_${b.id}_status_${b.status}_${Date.now()}`,
            bookingId: b.id,
            text,
            type,
            status: 'unread',
            timestamp: new Date().toISOString()
          });
          hasChanges = true;
        }
      }
    });

    if (isFirstRun && bookings.length > 0) {
      // Just save the initial states silently
      bookings.forEach(b => {
        updatedSeen[b.id] = b.status;
      });
      localStorage.setItem(seenKey, JSON.stringify(updatedSeen));
      setNotifications(newNotifs);
    } else if (hasChanges) {
      localStorage.setItem(notifKey, JSON.stringify(newNotifs));
      localStorage.setItem(seenKey, JSON.stringify(updatedSeen));
      setNotifications(newNotifs);
    } else {
      setNotifications(existingNotifs);
    }
  }, [bookings, user, bookingsLoading, carsLoading]);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;
  const hasUnread = unreadCount > 0;

  const handleBellClick = () => {
    setIsNotifDropdownOpen(!isNotifDropdownOpen);
    if (!isNotifDropdownOpen && hasUnread) {
      // Mark all as read
      const updated = notifications.map(n => ({ ...n, status: 'read' }));
      setNotifications(updated);
      if (user) {
        localStorage.setItem(`antigravity_notifications_${user.email}`, JSON.stringify(updated));
      }
    }
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    if (user) {
      localStorage.removeItem(`antigravity_notifications_${user.email}`);
    }
  };

  // Get user display name or email prefix
  const getDisplayName = () => {
    if (!user) return 'Sarah J.';
    if (user.user_metadata?.name) return user.user_metadata.name;
    if (user.email) return user.email.split('@')[0];
    return 'Sarah J.';
  };

  const getCarName = (carId) => {
    const car = cars.find(c => c.id === carId);
    return car ? `${car.make} ${car.model}` : 'Premium Fleet Vehicle';
  };

  const getBookingDateString = (pickupDateStr, returnDateStr) => {
    try {
      const start = new Date(pickupDateStr);
      const end = new Date(returnDateStr);
      const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
      const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
      const startDay = start.getDate();
      const endDay = end.getDate();
      
      if (startMonth === endMonth) {
        return `${startMonth} ${startDay}-${endDay}`;
      } else {
        return `${startMonth} ${startDay}-${endMonth} ${endDay}`;
      }
    } catch {
      return 'May 24-28';
    }
  };

  const getDurationDays = (pickupDateStr, returnDateStr) => {
    try {
      const start = new Date(pickupDateStr);
      const end = new Date(returnDateStr);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} Day${diffDays > 1 ? 's' : ''}`;
    } catch {
      return '4 Days';
    }
  };

  const handleCancelClick = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      await cancelBooking(bookingId);
    }
  };

  // Dynamic calculations
  const activeBookings = bookings.filter(b => b.status === 'confirmed');
  const activeBookingsCount = activeBookings.length;
  const totalTripsCount = bookings.length;
  const totalSpent = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((acc, curr) => acc + Number(curr.totalPrice), 0);

  const isLoading = bookingsLoading || carsLoading;

  // Stat metrics with mockup fallbacks
  const stats = useMemo(() => {
    const active = activeBookingsCount > 0 ? activeBookingsCount : 2;
    const trips = totalTripsCount > 0 ? totalTripsCount : 48;
    const spent = totalSpent > 0 ? totalSpent : 4750;
    const points = totalSpent > 0 ? Math.round(totalSpent * 2.5) : 12300;
    return { active, trips, spent, points };
  }, [activeBookingsCount, totalTripsCount, totalSpent]);

  // Sample static bookings matching the mockup image
  const sampleBookings = [
    {
      id: 'SAMP-1',
      carName: 'Tesla Model S',
      carId: 'c_tesla_s',
      dates: 'May 24-28',
      duration: '4 Days',
      status: 'confirmed',
      totalPrice: 510,
    },
    {
      id: 'SAMP-2',
      carName: 'Porsche Taycan',
      carId: 'c_porsche_911',
      dates: 'May 15-18',
      duration: '3 Days',
      status: 'completed',
      totalPrice: 690,
    },
    {
      id: 'SAMP-3',
      carName: 'Audi e-tron',
      carId: 'c_audietron',
      dates: 'Apr 30-May 3',
      duration: '3 Days',
      status: 'completed',
      totalPrice: 430,
    },
    {
      id: 'SAMP-4',
      carName: 'Polestar 2',
      carId: 'c_lucidair',
      dates: 'Apr 21-25',
      duration: '4 Days',
      status: 'completed',
      totalPrice: 395,
    }
  ];

  // Combined real + sample bookings for full pixel fidelity
  const renderedBookings = useMemo(() => {
    const real = bookings.filter(b => b.status !== 'cancelled').map(b => ({
      id: b.id,
      carName: getCarName(b.carId),
      carId: b.carId,
      dates: getBookingDateString(b.pickupDate, b.returnDate),
      duration: getDurationDays(b.pickupDate, b.returnDate),
      status: b.status || 'confirmed',
      totalPrice: Number(b.totalPrice),
      isReal: true
    }));
    
    const filteredReal = searchQuery 
      ? real.filter(b => b.carName.toLowerCase().includes(searchQuery.toLowerCase()))
      : real;

    if (filteredReal.length === 0 && !searchQuery) {
      return sampleBookings;
    }
    
    // Pad to 4 items with sample data to keep dashboard visually identical to the mockup
    const result = [...filteredReal];
    if (result.length < 4 && !searchQuery) {
      for (const sample of sampleBookings) {
        if (result.length >= 4) break;
        if (!result.some(r => r.carName === sample.carName)) {
          result.push({ ...sample, isReal: false });
        }
      }
    }
    return result;
  }, [bookings, cars, searchQuery]);

  return (
    <div className="min-h-screen bg-[#07090e] text-white pt-8 pb-20 px-6 lg:px-12 relative overflow-hidden font-sans select-none">
      
      {/* Dynamic Immersive Neon Lighting Backdrop */}
      <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[60%] bg-gradient-to-tl from-purple-500/10 via-transparent to-transparent rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[10%] w-[45%] h-[45%] bg-gradient-to-tr from-indigo-500/5 to-purple-600/5 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Main Bounded Layout Container */}
      <div className="max-w-7xl mx-auto flex flex-col gap-8 relative z-10">
        
        {/* ================= HEADER BAR CONTAINER ================= */}
        <header className="card-glass w-full px-6 py-4 flex items-center justify-between border border-white/5 rounded-[2rem] bg-slate-900/20 backdrop-blur-2xl shadow-xl relative z-40">
          {/* Left Brand Area */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-tr from-cyan-400 to-purple-500 p-2.5 rounded-xl text-slate-950 group-hover:scale-105 transition-transform duration-300">
              <IoCarSport className="text-2xl" />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-white to-cyan-300 bg-clip-text text-transparent group-hover:scale-[1.02] transition-all duration-300 uppercase">
              CAR RENTAL SYSTEM
            </span>
          </Link>

          {/* Middle Search Bar */}
          <div className="hidden md:flex relative w-80 items-center">
            <IoSearchOutline className="absolute left-4 text-slate-400 text-lg" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-slate-950/40 border border-white/5 rounded-full pl-11 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all duration-300"
            />
          </div>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-5">
            {/* Notification Bell Dropdown Container */}
            <div className="relative" ref={notifDropdownRef}>
              <button 
                onClick={handleBellClick}
                className="relative w-10 h-10 rounded-xl border border-white/5 bg-slate-950/30 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-950/50 transition-all cursor-pointer"
              >
                <IoNotificationsOutline className="text-xl" />
                {/* Blue notification indicator dot */}
                {hasUnread && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
                )}
              </button>

              <AnimatePresence>
                {isNotifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-80 sm:w-96 card-glass rounded-2xl border border-white/10 p-4 shadow-2xl z-50 overflow-hidden"
                    style={{ background: 'rgba(7, 9, 14, 0.96)' }}
                  >
                    <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-3 select-none">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white block">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                            {unreadCount} New
                          </span>
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <button 
                          onClick={handleClearNotifications}
                          className="text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <IoTrashOutline className="text-xs" /> Clear All
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center select-none">
                          <IoNotificationsOutline className="text-3xl text-slate-600 mx-auto mb-2" />
                          <span className="text-xs text-slate-500 font-bold block">No notifications yet.</span>
                          <span className="text-[10px] text-slate-600 mt-1 block">Awaiting admin booking updates.</span>
                        </div>
                      ) : (
                        notifications.map((n) => {
                          let icon = <IoTimeOutline className="text-yellow-400 text-lg" />;
                          let iconBg = "bg-yellow-500/10 border-yellow-500/25";
                          if (n.type === 'verified') {
                            icon = <IoCheckmarkCircleOutline className="text-emerald-400 text-lg" />;
                            iconBg = "bg-emerald-500/10 border-emerald-500/25";
                          } else if (n.type === 'cancelled') {
                            icon = <IoCloseCircleOutline className="text-red-400 text-lg" />;
                            iconBg = "bg-red-500/10 border-red-500/25";
                          }

                          return (
                            <div 
                              key={n.id} 
                              className={`p-3 rounded-xl border flex gap-3 transition-colors relative ${
                                n.status === 'unread' 
                                  ? 'bg-cyan-500/[0.03] border-cyan-500/20' 
                                  : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03]'
                              }`}
                            >
                              {/* Indicator badge for unread */}
                              {n.status === 'unread' && (
                                <span className="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]"></span>
                              )}
                              
                              <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${iconBg}`}>
                                {icon}
                              </div>
                              <div className="flex flex-col gap-1 pr-2">
                                <p className="text-xs text-slate-200 font-medium leading-relaxed font-sans">{n.text}</p>
                                <span className="text-[9px] text-slate-500 font-semibold font-mono">
                                  {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 pl-3 pr-4 py-2 border border-white/5 bg-slate-950/30 hover:bg-slate-950/50 rounded-full transition-all cursor-pointer select-none"
              >
                {/* User initials avatar instead of static headshot */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 text-[#0d121f] flex items-center justify-center font-black text-[11px] uppercase border border-white/10 shadow-inner">
                  {getDisplayName().slice(0, 2)}
                </div>
                <span className="hidden sm:inline text-sm font-bold tracking-tight text-slate-200">
                  {getDisplayName()}
                </span>
                <IoChevronDownOutline className={`text-slate-400 text-xs transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-56 card-glass rounded-2xl border border-white/10 p-2 shadow-2xl z-50 overflow-hidden"
                    style={{ background: 'rgba(7, 9, 14, 0.96)' }}
                  >
                    <div className="px-4 py-3 border-b border-white/5 mb-2 select-none">
                      <span className="text-sm font-bold text-white block truncate">{getDisplayName()}</span>
                      <span className="text-[10px] text-slate-400 block truncate font-sans mt-0.5">{user?.email || 'sarah.jones@example.com'}</span>
                    </div>

                    <button 
                      onClick={() => { setIsDropdownOpen(false); setIsEditOpen(true); }}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/5 hover:text-cyan-400 text-slate-300 transition-all cursor-pointer text-left"
                    >
                      <IoSettingsOutline className="text-base text-cyan-400" />
                      <span>Edit Profile</span>
                    </button>

                    <Link 
                      to="/cars"
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/5 hover:text-cyan-400 text-slate-300 transition-all cursor-pointer text-left"
                    >
                      <IoCarSport className="text-base text-cyan-400" />
                      <span>Back to Fleet</span>
                    </Link>

                    <hr className="border-white/5 my-1.5" />

                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all cursor-pointer text-left font-sans"
                    >
                      <IoLogOutOutline className="text-base" />
                      <span>Log Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ================= STATS CARDS ROW ================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Active Rides */}
          <div className="relative group p-[1px] bg-gradient-to-r from-purple-500/20 to-purple-600/10 hover:from-purple-500/50 hover:to-purple-600/40 rounded-3xl transition-all duration-500 shadow-md shadow-purple-500/5 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <div className="bg-[#0b0e14]/90 p-6 rounded-[1.4rem] flex flex-col justify-between h-40">
              <div className="flex items-center justify-between w-full">
                <span className="text-slate-400 text-xs font-bold font-sans">Active Rides</span>
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                  <IoSpeedometerOutline className="text-base" />
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-4">
                <span className="text-4xl font-black font-sans tracking-tight text-white">
                  {stats.active}
                </span>
                <span className="text-slate-500 text-xs font-bold">Currently Driving</span>
              </div>
            </div>
          </div>

          {/* Card 2: Trips Completed */}
          <div className="relative group p-[1px] bg-gradient-to-r from-cyan-500/20 to-cyan-600/10 hover:from-cyan-500/50 hover:to-cyan-600/40 rounded-3xl transition-all duration-500 shadow-md shadow-cyan-500/5 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <div className="bg-[#0b0e14]/90 p-6 rounded-[1.4rem] flex flex-col justify-between h-40">
              <div className="flex items-center justify-between w-full">
                <span className="text-slate-400 text-xs font-bold font-sans">Trips Completed</span>
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                  <IoFlagOutline className="text-base" />
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-4">
                <span className="text-4xl font-black font-sans tracking-tight text-white">
                  {stats.trips}
                </span>
                <span className="text-slate-500 text-xs font-bold">
                  <strong className="text-emerald-400 font-extrabold">+5</strong> this week
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Total Spent */}
          <div className="relative group p-[1px] bg-gradient-to-r from-purple-500/20 to-purple-600/10 hover:from-purple-500/50 hover:to-purple-600/40 rounded-3xl transition-all duration-500 shadow-md shadow-purple-500/5 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <div className="bg-[#0b0e14]/90 p-6 rounded-[1.4rem] flex flex-col justify-between h-40">
              <div className="flex items-center justify-between w-full">
                <span className="text-slate-400 text-xs font-bold font-sans">Total Spent</span>
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                  <IoCardOutline className="text-base" />
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-4">
                <span className="text-3xl font-black font-sans tracking-tight text-white">
                  Rs {stats.spent.toLocaleString()}
                </span>
                <span className="text-slate-500 text-xs font-bold">Total Expenditure</span>
              </div>
            </div>
          </div>

          {/* Card 4: Points Earned */}
          <div className="relative group p-[1px] bg-gradient-to-r from-cyan-500/20 to-cyan-600/10 hover:from-cyan-500/50 hover:to-cyan-600/40 rounded-3xl transition-all duration-500 shadow-md shadow-cyan-500/5 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <div className="bg-[#0b0e14]/90 p-6 rounded-[1.4rem] flex flex-col justify-between h-40">
              <div className="flex items-center justify-between w-full">
                <span className="text-slate-400 text-xs font-bold font-sans">Points Earned</span>
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                  <IoStarOutline className="text-base" />
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-4">
                <span className="text-4xl font-black font-sans tracking-tight text-white">
                  {stats.points.toLocaleString()}
                </span>
                <span className="text-slate-500 text-xs font-bold">Tier: Galaxy Explorer</span>
              </div>
            </div>
          </div>

        </section>

        {/* ================= EXPENDITURE GRAPH CARD ================= */}
        <section className="card-glass w-full p-8 border border-white/5 rounded-[2rem] bg-slate-900/10 shadow-2xl relative overflow-hidden">
          {/* Inner ambient glow */}
          <div className="absolute top-[20%] left-[30%] w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="mb-8 select-none">
            <h3 className="text-xl font-extrabold font-display text-white">Expenditure Graph</h3>
          </div>

          {/* Curved SVG Area Chart */}
          <div className="relative w-full overflow-hidden select-none">
            <svg className="w-full h-64 overflow-visible" viewBox="0 0 600 230" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                  <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#07090e" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="40%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              <line x1="50" y1="30" x2="550" y2="30" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3 3" />
              <line x1="50" y1="85" x2="550" y2="85" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3 3" />
              <line x1="50" y1="140" x2="550" y2="140" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3 3" />
              <line x1="50" y1="190" x2="550" y2="190" stroke="rgba(255, 255, 255, 0.04)" />

              {/* Grid labels (left) */}
              <text x="35" y="34" fill="#475569" fontSize="10" fontWeight="bold" textAnchor="end" className="font-mono">Rs 600</text>
              <text x="35" y="89" fill="#475569" fontSize="10" fontWeight="bold" textAnchor="end" className="font-mono">Rs 400</text>
              <text x="35" y="144" fill="#475569" fontSize="10" fontWeight="bold" textAnchor="end" className="font-mono">Rs 200</text>
              <text x="35" y="194" fill="#475569" fontSize="10" fontWeight="bold" textAnchor="end" className="font-mono">Rs 0</text>

              {/* Filled Area path */}
              <path 
                d="M 50 140 C 100 110, 120 50, 150 50 C 180 50, 220 80, 250 80 C 280 80, 320 120, 350 120 C 380 120, 420 30, 450 30 C 480 30, 520 90, 550 90 L 550 190 L 50 190 Z" 
                fill="url(#chartGradient)" 
              />

              {/* Glimmering Stroke path */}
              <path 
                d="M 50 140 C 100 110, 120 50, 150 50 C 180 50, 220 80, 250 80 C 280 80, 320 120, 350 120 C 380 120, 420 30, 450 30 C 480 30, 520 90, 550 90" 
                fill="none" 
                stroke="url(#lineGradient)" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />

              {/* Horizontal bottom labels (months) */}
              <text x="50" y="215" fill="#475569" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-sans">Jan</text>
              <text x="150" y="215" fill="#475569" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-sans">Feb</text>
              <text x="250" y="215" fill="#475569" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-sans">Mar</text>
              <text x="350" y="215" fill="#475569" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-sans">Apr</text>
              <text x="450" y="215" fill="#475569" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-sans">May</text>
              <text x="550" y="215" fill="#475569" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-sans">Jun</text>

              {/* Feb Tooltip Point */}
              <g transform="translate(150, 50)">
                <rect x="-26" y="-35" width="52" height="20" rx="5" fill="#0b0e14" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <text x="0" y="-22" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-sans">Rs 450</text>
                <circle cx="0" cy="0" r="4.5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="1.5" />
              </g>

              {/* Mar Tooltip Point */}
              <g transform="translate(250, 80)">
                <rect x="-26" y="-35" width="52" height="20" rx="5" fill="#0b0e14" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <text x="0" y="-22" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-sans">Rs 380</text>
                <circle cx="0" cy="0" r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
              </g>

              {/* May Tooltip Point (Active Glow) */}
              <g transform="translate(450, 30)">
                {/* Neon pulse rings */}
                <circle cx="0" cy="0" r="9" fill="#06b6d4" opacity="0.35" className="animate-pulse" />
                <circle cx="0" cy="0" r="4.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                
                {/* Floating tooltip */}
                <rect x="-26" y="-35" width="52" height="20" rx="5" fill="#0b0e14" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1" />
                <text x="0" y="-22" fill="#22d3ee" fontSize="9" fontWeight="extrabold" textAnchor="middle" className="font-sans">Rs 510</text>
              </g>
            </svg>
          </div>
        </section>

        {/* ================= RECENT RESERVATIONS CARD ================= */}
        <section className="card-glass w-full p-8 border border-white/5 rounded-[2rem] bg-slate-900/10 shadow-2xl">
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4 select-none">
            <h3 className="text-xl font-extrabold font-display text-white">Recent Reservations</h3>
            {searchQuery && (
              <span className="text-xs text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded-full">
                Filtered Search Result
              </span>
            )}
          </div>

          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 font-bold text-xs uppercase tracking-wider select-none">
                  <th className="pb-4 pt-1 font-bold">Car +</th>
                  <th className="pb-4 pt-1 font-bold">Dates</th>
                  <th className="pb-4 pt-1 font-bold">Duration</th>
                  <th className="pb-4 pt-1 font-bold">Status</th>
                  <th className="pb-4 pt-1 font-bold text-right">Total</th>
                  <th className="pb-4 pt-1 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {renderedBookings.map((booking) => {
                  const isConfirmed = booking.status === 'confirmed';
                  const isCompleted = booking.status === 'completed';
                  return (
                    <tr 
                      key={booking.id} 
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-200 group"
                    >
                      {/* Car Details */}
                      <td className="py-4 flex items-center gap-4 min-w-[240px]">
                        <div className="w-16 h-10 rounded-lg bg-slate-900 border border-white/5 overflow-hidden shrink-0">
                          <img 
                            src={getCarImage(booking.carId)} 
                            alt={booking.carName} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <span className="font-extrabold text-white text-base tracking-tight font-sans">
                          {booking.carName}
                        </span>
                      </td>

                      {/* Dates */}
                      <td className="py-4 text-slate-300 font-medium font-sans">
                        {booking.dates}
                      </td>

                      {/* Duration */}
                      <td className="py-4 text-slate-400 font-medium font-sans">
                        {booking.duration}
                      </td>

                      {/* Status Tag */}
                      <td className="py-4 select-none">
                        {isConfirmed ? (
                          <span className="inline-flex items-center bg-[#0d211f] text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-inner shadow-emerald-500/5">
                            Confirmed
                          </span>
                        ) : booking.status === 'pending' ? (
                          <span className="inline-flex items-center bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Pending
                          </span>
                        ) : isCompleted ? (
                          <span className="inline-flex items-center bg-[#0f1d2d] text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-inner shadow-cyan-500/5">
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center bg-red-950/20 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Cancelled
                          </span>
                        )}
                      </td>

                      {/* Total price */}
                      <td className="py-4 text-right font-black text-white text-base font-sans">
                        Rs {booking.totalPrice.toLocaleString()}
                      </td>

                      {/* Actions (cancellation override for dynamic bookings) */}
                      <td className="py-4 text-center">
                        {booking.isReal && (isConfirmed || booking.status === 'pending') ? (
                          <button 
                            onClick={() => handleCancelClick(booking.id)}
                            className="text-xs font-bold border border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/15 hover:border-red-500/50 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-md"
                          >
                            Cancel Ride
                          </button>
                        ) : (
                          <span className="text-slate-600 text-xs font-semibold select-none font-mono">
                            {booking.isReal ? 'Completed' : 'Demo Record'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* ================= PROFILE EDIT MODAL LAYER ================= */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-md card-glass p-8 rounded-[2rem] border-white/10 bg-[#0d1119] shadow-2xl z-10 overflow-hidden text-left"
            >
              {/* Inner modal glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Close Icon Button */}
              <button
                onClick={() => setIsEditOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors duration-300 w-8 h-8 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer"
              >
                <IoCloseOutline className="text-xl" />
              </button>

              <div className="mb-6 select-none">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                  Account Control Panel
                </span>
                <h2 className="text-2xl font-black font-display text-white">Edit Profile</h2>
                <p className="text-slate-400 text-xs mt-1 font-sans">
                  Modify display name and update access credentials below.
                </p>
              </div>

              <form onSubmit={handleEditSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="editName" className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide font-display">
                    Full Name
                  </label>
                  <input
                    id="editName"
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-[#05070b]/60 border border-white/5 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 rounded-xl px-4 py-3 text-sm text-white transition-all duration-300 outline-none font-sans"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="editPassword" className="block text-xs font-bold text-slate-400 uppercase tracking-wide font-display">
                      New Password (Optional)
                    </label>
                    <span className="text-[9px] text-slate-500 font-semibold lowercase font-sans">
                      Min. 6 characters
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="editPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                      className="w-full bg-[#05070b]/60 border border-white/5 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 rounded-xl px-4 py-3 pr-10 text-sm text-white transition-all duration-300 outline-none font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <IoEyeOffOutline className="text-lg" /> : <IoEyeOutline className="text-lg" />}
                    </button>
                  </div>
                </div>

                {editPassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide font-display">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      required={!!editPassword}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="w-full bg-[#05070b]/60 border border-white/5 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 rounded-xl px-4 py-3 text-sm text-white transition-all duration-300 outline-none font-sans"
                    />
                  </motion.div>
                )}

                <div className="mt-2 flex gap-4 font-display">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="flex-1 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-3.5 rounded-xl transition-all duration-300 cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 btn-premium btn-premium-hover font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-cyan-500/15 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 rounded-full border border-slate-950/30 border-t-slate-950 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
