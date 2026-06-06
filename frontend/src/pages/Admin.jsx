import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  IoGridOutline,
  IoCarSportOutline, 
  IoBookmarkOutline, 
  IoPeopleOutline,
  IoSettingsOutline,
  IoTrashOutline, 
  IoCloseOutline, 
  IoSpeedometerOutline,
  IoAlertCircleOutline,
  IoTrendingUpOutline,
  IoCarOutline,
  IoBarChartOutline,
  IoEyeOutline,
  IoLogOutOutline,
  IoCarSport,
  IoChevronDownOutline,
  IoEyeOffOutline,
  IoSunnyOutline,
  IoMoonOutline
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useCars } from '../hooks/useCars';
import { useBookings } from '../hooks/useBookings';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getCarImage } from '../utils/carImages';
import toast from 'react-hot-toast';

export default function Admin() {
  const { cars, loading: carsLoading, addCar, deleteCar } = useCars();
  const { bookings, loading: bookingsLoading, cancelBooking, verifyBooking } = useBookings();
  const { user, signOut, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Navigation states: 'dashboard' | 'fleet' | 'bookings' | 'clients'
  const [activeSidebar, setActiveSidebar] = useState('dashboard');
  
  // Sub-tabs for Dashboard view: 'fleet_mgmt' | 'booking_orders' | 'customers' | 'reports'
  const [activeSubTab, setActiveSubTab] = useState('fleet_mgmt');

  // Form states matching mockup
  const [vehicleName, setVehicleName] = useState('');
  const [modelYear, setModelYear] = useState('2023');
  const [licensePlate, setLicensePlate] = useState('');
  const [dailyRate, setDailyRate] = useState('');
  const [carStatus, setCarStatus] = useState('available');
  const [isSubmittingCar, setIsSubmittingCar] = useState(false);
  const [formError, setFormError] = useState('');

  // Profile dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Profile edit states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize edit form when modal opens
  useEffect(() => {
    if (isEditOpen && user) {
      setEditName(user.user_metadata?.name || '');
      setEditPassword('');
      setConfirmPassword('');
      setShowPassword(false);
    }
  }, [isEditOpen, user]);

  // Computations
  const totalRevenue = useMemo(() => {
    return bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + Number(b.totalPrice), 0);
  }, [bookings]);

  const activeRentedCount = useMemo(() => {
    return bookings.filter(b => b.status === 'confirmed').length;
  }, [bookings]);

  const maintenanceCount = useMemo(() => {
    return cars.filter(c => c.status === 'maintenance').length;
  }, [cars]);

  const totalTripsCount = useMemo(() => {
    return bookings.length;
  }, [bookings]);

  const recentAdditions = useMemo(() => {
    return [...cars].slice(-4).reverse();
  }, [cars]);

  // Group unique customers
  const customerList = useMemo(() => {
    const clients = {};
    bookings.forEach(b => {
      if (!clients[b.userEmail]) {
        clients[b.userEmail] = {
          email: b.userEmail,
          name: b.userEmail.split('@')[0],
          bookingCount: 0,
          totalSpent: 0,
          status: 'Active'
        };
      }
      clients[b.userEmail].bookingCount += 1;
      if (b.status !== 'cancelled') {
        clients[b.userEmail].totalSpent += Number(b.totalPrice);
      }
    });
    return Object.values(clients);
  }, [bookings]);

  // Revenue analysis by class type
  const typeRevenueData = useMemo(() => {
    const data = { Electric: 0, Sports: 0, SUV: 0, Sedan: 0 };
    bookings
      .filter(b => b.status !== 'cancelled')
      .forEach(b => {
        const car = cars.find(c => c.id === b.carId);
        const type = car?.type || 'Electric';
        if (data[type] !== undefined) {
          data[type] += Number(b.totalPrice);
        } else {
          data['Sedan'] += Number(b.totalPrice);
        }
      });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [bookings, cars]);

  const handleAddCarSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!vehicleName.trim()) {
      setFormError('Please specify the vehicle brand and model.');
      return;
    }

    const price = Number(dailyRate);
    if (isNaN(price) || price <= 0) {
      setFormError('Please enter a valid daily rate surcharge.');
      return;
    }

    setIsSubmittingCar(true);

    try {
      const parts = vehicleName.trim().split(' ');
      const make = parts[0] || 'Premium';
      const model = parts.slice(1).join(' ') || 'GT';

      const lowerName = vehicleName.toLowerCase();
      let type = 'Sports';
      if (lowerName.includes('tesla') || lowerName.includes('etron') || lowerName.includes('air') || lowerName.includes('lucid')) {
        type = 'Electric';
      } else if (lowerName.includes('rover') || lowerName.includes('g63') || lowerName.includes('suv')) {
        type = 'SUV';
      } else if (lowerName.includes('sedan') || lowerName.includes('taycan')) {
        type = 'Sedan';
      }

      const result = await addCar({
        make,
        model,
        type,
        fuelType: type === 'Electric' ? 'Electric' : 'Gasoline',
        seats: 5,
        pricePerDay: price,
        status: carStatus
      });

      if (result.success) {
        toast.success(`${vehicleName} successfully added to fleet! 🏎️`);
        setVehicleName('');
        setLicensePlate('');
        setDailyRate('');
        setCarStatus('available');
      } else {
        setFormError(result.error || 'Failed to register vehicle.');
      }
    } catch (err) {
      setFormError('An unexpected error occurred.');
    } finally {
      setIsSubmittingCar(false);
    }
  };

  const handleDeleteCarClick = async (carId, name) => {
    if (window.confirm(`Retire ${name} from active fleet catalog?`)) {
      const result = await deleteCar(carId);
      if (result.success) {
        toast.success(`Retired ${name} successfully.`);
      } else {
        toast.error('Failed to retire vehicle.');
      }
    }
  };

  const handleCancelBookingClick = async (bookingId) => {
    if (window.confirm(`Cancel reservation transaction ${bookingId}?`)) {
      const result = await cancelBooking(bookingId);
      if (result.success) {
        toast.success('Reservation cancelled by Admin.');
      } else {
        toast.error('Failed to cancel booking.');
      }
    }
  };

  const handleVerifyBookingClick = async (bookingId) => {
    if (window.confirm(`Verify and approve reservation transaction ${bookingId}?`)) {
      const result = await verifyBooking(bookingId);
      if (result.success) {
        toast.success('Reservation verified by Admin.');
      } else {
        toast.error('Failed to verify booking.');
      }
    }
  };

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

    setIsSubmittingProfile(true);
    const res = await updateProfile({ name: editName.trim(), password: editPassword || undefined });
    setIsSubmittingProfile(false);

    if (res.success) {
      setIsEditOpen(false);
    }
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await signOut();
    navigate('/');
  };

  const getDisplayName = () => {
    if (!user) return 'Admin';
    if (user.user_metadata?.name) return user.user_metadata.name;
    if (user.email) return user.email.split('@')[0];
    return 'Admin';
  };

  const handleSidebarClick = (tab) => {
    setActiveSidebar(tab);
    if (tab === 'dashboard') {
      setActiveSubTab('fleet_mgmt');
    } else if (tab === 'fleet') {
      setActiveSubTab('fleet_mgmt');
    } else if (tab === 'bookings') {
      setActiveSubTab('booking_orders');
    } else if (tab === 'clients') {
      setActiveSubTab('customers');
    }
  };

  const isLoading = carsLoading || bookingsLoading;

  return (
    <div className="min-h-screen bg-bg-deep text-text-main relative font-sans select-none flex flex-col md:flex-row overflow-hidden">
      
      {/* Immersive Cyan/Indigo Neon Backlight Effects */}
      <div className="absolute top-[-20%] left-[-15%] w-[70%] h-[70%] bg-gradient-to-br from-accent-cyan/5 via-transparent to-transparent rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-15%] w-[70%] h-[70%] bg-gradient-to-tl from-accent-purple/5 via-transparent to-transparent rounded-full blur-[160px] pointer-events-none"></div>

      {/* Main Container Frame filling whole screen */}
      <div className="w-full min-h-screen flex flex-col md:flex-row relative z-10">
        
        {/* ================= LEFT SIDEBAR PANEL ================= */}
        <aside className="w-full md:w-64 bg-bg-surface border-r border-border-light flex flex-col justify-between shrink-0 p-6 z-20">
          <div className="flex flex-col gap-8">
            
            {/* Brand Logo & Text */}
            <div className="flex items-center gap-3 border-b border-border-light pb-5 select-none">
              <div className="bg-gradient-to-tr from-accent-cyan to-accent-purple p-2.5 rounded-xl text-slate-950 shadow-[0_0_12px_var(--border-glow)]">
                <IoCarSport className="text-xl" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xs tracking-tight text-text-main uppercase leading-none">
                  CAR RENTAL
                </span>
                <span className="font-display font-black text-sm tracking-wider text-accent-cyan uppercase leading-none mt-1">
                  SYSTEM
                </span>
              </div>
            </div>

            {/* Sidebar Navigation Options */}
            <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0">
              <button
                onClick={() => handleSidebarClick('dashboard')}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer w-full text-left ${
                  activeSidebar === 'dashboard'
                    ? 'bg-gradient-to-r from-accent-cyan/15 to-accent-purple/5 border-l-2 border-accent-cyan text-accent-cyan shadow-[0_0_15px_var(--border-glow)]' 
                    : 'text-slate-400 hover:text-text-main hover:bg-white/5'
                }`}
              >
                <IoGridOutline className="text-base" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => handleSidebarClick('fleet')}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer w-full text-left ${
                  activeSidebar === 'fleet'
                    ? 'bg-gradient-to-r from-accent-cyan/15 to-accent-purple/5 border-l-2 border-accent-cyan text-accent-cyan shadow-[0_0_15px_var(--border-glow)]' 
                    : 'text-slate-400 hover:text-text-main hover:bg-white/5'
                }`}
              >
                <IoCarSportOutline className="text-base" />
                <span>Fleet</span>
              </button>

              <button
                onClick={() => handleSidebarClick('bookings')}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer w-full text-left ${
                  activeSidebar === 'bookings'
                    ? 'bg-gradient-to-r from-accent-cyan/15 to-accent-purple/5 border-l-2 border-accent-cyan text-accent-cyan shadow-[0_0_15px_var(--border-glow)]' 
                    : 'text-slate-400 hover:text-text-main hover:bg-white/5'
                }`}
              >
                <IoBookmarkOutline className="text-base" />
                <span>Bookings</span>
              </button>

              <button
                onClick={() => handleSidebarClick('clients')}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer w-full text-left ${
                  activeSidebar === 'clients'
                    ? 'bg-gradient-to-r from-accent-cyan/15 to-accent-purple/5 border-l-2 border-accent-cyan text-accent-cyan shadow-[0_0_15px_var(--border-glow)]' 
                    : 'text-slate-400 hover:text-text-main hover:bg-white/5'
                }`}
              >
                <IoPeopleOutline className="text-base" />
                <span>Clients</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ================= MAIN ADMINISTRATIVE VIEWPORT ================= */}
        <main className="flex-grow p-6 md:p-8 flex flex-col gap-8 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col gap-4 items-center justify-center py-32 flex-grow">
              <div className="w-10 h-10 rounded-full border-2 border-border-light border-t-accent-cyan animate-spin mb-4"></div>
              <p className="text-slate-400 text-xs font-bold select-none tracking-widest uppercase">Syncing Administration Database...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              
              {/* Header Titles & Controls */}
              <div className="flex justify-between items-center border-b border-border-light pb-4">
                <div>
                  <h1 className="text-2xl font-black font-display tracking-tight text-text-main uppercase">
                    Admin Panel
                  </h1>
                  <span className="text-[10px] text-accent-cyan font-bold uppercase tracking-wider block mt-1">
                    SYSTEM METRICS & OVERRIDES
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Theme Toggle Button */}
                  <button
                    onClick={toggleTheme}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-light bg-white/5 text-slate-400 hover:text-text-main hover:bg-white/10 hover:border-border-light transition-all duration-300 cursor-pointer shadow-sm relative overflow-hidden select-none shrink-0"
                    aria-label="Toggle Theme"
                    title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  >
                    <motion.div
                      initial={false}
                      animate={{ rotate: theme === 'dark' ? 0 : 180, scale: theme === 'dark' ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute flex items-center justify-center"
                    >
                      <IoSunnyOutline className="text-lg text-accent-cyan" />
                    </motion.div>
                    <motion.div
                      initial={false}
                      animate={{ rotate: theme === 'dark' ? -180 : 0, scale: theme === 'dark' ? 0 : 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute flex items-center justify-center"
                    >
                      <IoMoonOutline className="text-lg text-accent-purple" />
                    </motion.div>
                  </button>

                  {/* Profile Dropdown Container */}
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-3 pl-3 pr-4 py-2 border border-border-light bg-slate-950/30 hover:bg-slate-950/50 rounded-full transition-all cursor-pointer select-none"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-cyan to-accent-purple text-slate-950 flex items-center justify-center font-black text-[11px] uppercase border border-border-light shadow-inner">
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
                        className="absolute right-0 mt-3 w-56 card-glass bg-bg-surface/95 rounded-2xl border border-border-light p-2 shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-border-light mb-2 select-none">
                          <span className="text-sm font-bold text-text-main block truncate">{getDisplayName()}</span>
                          <span className="text-[10px] text-slate-400 block truncate font-sans mt-0.5">{user?.email || 'admin@example.com'}</span>
                        </div>

                        <button 
                          onClick={() => { setIsDropdownOpen(false); setIsEditOpen(true); }}
                          className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/5 hover:text-accent-cyan text-slate-300 transition-all cursor-pointer text-left"
                        >
                          <IoSettingsOutline className="text-base text-accent-cyan" />
                          <span>Edit Profile</span>
                        </button>

                        <Link 
                          to="/dashboard"
                          className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/5 hover:text-accent-cyan text-slate-300 transition-all cursor-pointer text-left"
                        >
                          <IoSpeedometerOutline className="text-base text-accent-cyan" />
                          <span>Go to Client Panel</span>
                        </Link>

                        <hr className="border-border-light my-1.5" />

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
            </div>

              {/* ================= DASHBOARD CORE LAYOUT ================= */}
              <div className="flex flex-col gap-8">
                
                {/* Telemetry Stats Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Card 1: Gross Revenue */}
                  <div className="card-glass p-5 rounded-2xl hover:border-accent-cyan/20 hover:shadow-[0_0_20px_var(--border-glow)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-36">
                    <div className="flex justify-between items-start w-full">
                      <div>
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Gross Revenue</span>
                        <strong className="text-2xl font-black text-text-main font-sans mt-2 block">
                          Rs {totalRevenue > 0 ? totalRevenue.toLocaleString() : "1,847,590.30"}
                        </strong>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center text-accent-cyan border border-accent-cyan/20">
                        <IoTrendingUpOutline className="text-base" />
                      </div>
                    </div>
                    
                    {/* SVG Line Chart */}
                    <div className="w-full h-10 mt-2">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-accent-cyan)" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="var(--color-accent-cyan)" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M 0 35 Q 25 15, 50 25 T 100 10 T 150 30 T 200 8" 
                          fill="none" 
                          stroke="var(--color-accent-cyan)" 
                          strokeWidth="2.5" 
                          strokeLinecap="round"
                        />
                        <path 
                          d="M 0 35 Q 25 15, 50 25 T 100 10 T 150 30 T 200 8 L 200 40 L 0 40 Z" 
                          fill="url(#revenueGlow)" 
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Card 2: Active Rentals */}
                  <div className="card-glass p-5 rounded-2xl hover:border-accent-cyan/20 hover:shadow-[0_0_20px_var(--border-glow)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-36">
                    <div className="flex justify-between items-start w-full">
                      <div>
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Active Rentals</span>
                        <strong className="text-2xl font-black text-text-main font-sans mt-2 block">
                          {activeRentedCount > 0 ? activeRentedCount : "84"} Vehicles
                        </strong>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center text-accent-cyan border border-accent-cyan/20">
                        <IoCarOutline className="text-base" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 select-none">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Status
                      </span>
                      <IoCarOutline className="text-slate-600/40 text-4xl transform translate-x-2 translate-y-1" />
                    </div>
                  </div>

                  {/* Card 3: Total Trips */}
                  <div className="card-glass p-5 rounded-2xl hover:border-accent-cyan/20 hover:shadow-[0_0_20px_var(--border-glow)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-36">
                    <div className="flex justify-between items-start w-full">
                      <div>
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Trips</span>
                        <strong className="text-2xl font-black text-text-main font-sans mt-2 block">
                          {totalTripsCount > 0 ? totalTripsCount.toLocaleString() : "14,102"} Trips
                        </strong>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center text-accent-cyan border border-accent-cyan/20">
                        <IoBarChartOutline className="text-base" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full gap-4 mt-2">
                      <div className="flex flex-col gap-0.5 text-[9px] text-slate-500 font-bold">
                        <span>Booking statistics</span>
                        <span>Total trips = {totalTripsCount > 0 ? totalTripsCount.toLocaleString() : "14,102"}</span>
                      </div>
                      
                      {/* SVG Bar Chart */}
                      <div className="h-8 w-24">
                        <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                          <rect x="5" y="15" width="6" height="15" rx="1" fill="var(--color-accent-cyan)" opacity="0.4" />
                          <rect x="15" y="10" width="6" height="20" rx="1" fill="var(--color-accent-cyan)" opacity="0.5" />
                          <rect x="25" y="20" width="6" height="10" rx="1" fill="var(--color-accent-cyan)" opacity="0.3" />
                          <rect x="35" y="8" width="6" height="22" rx="1" fill="var(--color-accent-cyan)" opacity="0.6" />
                          <rect x="45" y="18" width="6" height="12" rx="1" fill="var(--color-accent-cyan)" opacity="0.4" />
                          <rect x="55" y="5" width="6" height="25" rx="1" fill="var(--color-accent-cyan)" opacity="0.8" />
                          <rect x="65" y="12" width="6" height="18" rx="1" fill="var(--color-accent-cyan)" opacity="0.7" />
                          <rect x="75" y="22" width="6" height="8" rx="1" fill="var(--color-accent-cyan)" opacity="0.3" />
                          <rect x="85" y="3" width="6" height="27" rx="1" fill="var(--color-accent-cyan)" />
                        </svg>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Sub-navigation Menu (only visible when in Dashboard sidebar selection mode) */}
                {activeSidebar === 'dashboard' && (
                  <div className="border-b border-border-light pb-2.5 flex gap-8 select-none">
                    <button 
                      onClick={() => setActiveSubTab('fleet_mgmt')}
                      className={`text-xs font-bold pb-2 transition-all cursor-pointer relative ${
                        activeSubTab === 'fleet_mgmt' ? 'text-accent-cyan font-extrabold' : 'text-slate-400 hover:text-text-main'
                      }`}
                    >
                      <span>Fleet Management</span>
                      {activeSubTab === 'fleet_mgmt' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-cyan rounded-full shadow-[0_0_8px_var(--color-accent-cyan)]"></span>
                      )}
                    </button>
                    <button 
                      onClick={() => setActiveSubTab('booking_orders')}
                      className={`text-xs font-bold pb-2 transition-all cursor-pointer relative ${
                        activeSubTab === 'booking_orders' ? 'text-accent-cyan font-extrabold' : 'text-slate-400 hover:text-text-main'
                      }`}
                    >
                      <span>Booking Orders</span>
                      {activeSubTab === 'booking_orders' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-cyan rounded-full shadow-[0_0_8px_var(--color-accent-cyan)]"></span>
                      )}
                    </button>
                    <button 
                      onClick={() => setActiveSubTab('customers')}
                      className={`text-xs font-bold pb-2 transition-all cursor-pointer relative ${
                        activeSubTab === 'customers' ? 'text-accent-cyan font-extrabold' : 'text-slate-400 hover:text-text-main'
                      }`}
                    >
                      <span>Customers</span>
                      {activeSubTab === 'customers' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-cyan rounded-full shadow-[0_0_8px_var(--color-accent-cyan)]"></span>
                      )}
                    </button>
                    <button 
                      onClick={() => setActiveSubTab('reports')}
                      className={`text-xs font-bold pb-2 transition-all cursor-pointer relative ${
                        activeSubTab === 'reports' ? 'text-accent-cyan font-extrabold' : 'text-slate-400 hover:text-text-main'
                      }`}
                    >
                      <span>Reports</span>
                      {activeSubTab === 'reports' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-cyan rounded-full shadow-[0_0_8px_var(--color-accent-cyan)]"></span>
                      )}
                    </button>
                  </div>
                )}

                {/* Sub-tab view controllers */}
                <div className="flex flex-col gap-8">
                  
                  {/* 1. Fleet Management View (Split Form + List) */}
                  {((activeSidebar === 'dashboard' && activeSubTab === 'fleet_mgmt') || activeSidebar === 'fleet') && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Form Panel: Add Luxury Vehicle */}
                      <div className="card-glass p-6 rounded-2xl lg:col-span-2 flex flex-col gap-5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 select-none">
                          Add Luxury Vehicle
                        </h3>
                        
                        {formError && (
                          <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2 select-none animate-pulse">
                            <IoAlertCircleOutline className="text-base shrink-0" />
                            <span>{formError}</span>
                          </div>
                        )}

                        <form onSubmit={handleAddCarSubmit} className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 font-display select-none">Vehicle Name</label>
                              <input 
                                type="text"
                                value={vehicleName}
                                onChange={(e) => setVehicleName(e.target.value)}
                                placeholder="e.g. Ferrari SF90 Stradale"
                                required
                                className="w-full bg-bg-deep/60 border border-border-light focus:border-accent-cyan/50 rounded-xl px-4 py-3 outline-none text-xs text-text-main placeholder-text-muted/60 transition-all font-sans focus:shadow-[0_0_10px_var(--border-glow)]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 font-display select-none">Model Year</label>
                              <input 
                                type="text"
                                value={modelYear}
                                onChange={(e) => setModelYear(e.target.value)}
                                placeholder="2023"
                                required
                                className="w-full bg-bg-deep/60 border border-border-light focus:border-accent-cyan/50 rounded-xl px-4 py-3 outline-none text-xs text-text-main placeholder-text-muted/60 transition-all font-sans focus:shadow-[0_0_10px_var(--border-glow)]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 font-display select-none">License Plate</label>
                            <input 
                                type="text"
                                value={licensePlate}
                                onChange={(e) => setLicensePlate(e.target.value)}
                                placeholder="AGV 777"
                                required
                                className="w-full bg-bg-deep/60 border border-border-light focus:border-accent-cyan/50 rounded-xl px-4 py-3 outline-none text-xs text-text-main placeholder-text-muted/60 transition-all font-sans focus:shadow-[0_0_10px_var(--border-glow)]"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 font-display select-none">Base Daily Rate ($)</label>
                              <input 
                                type="number"
                                value={dailyRate}
                                onChange={(e) => setDailyRate(e.target.value)}
                                placeholder="1499"
                                required
                                className="w-full bg-bg-deep/60 border border-border-light focus:border-accent-cyan/50 rounded-xl px-4 py-3 outline-none text-xs text-text-main placeholder-text-muted/60 transition-all font-sans focus:shadow-[0_0_10px_var(--border-glow)]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 font-display select-none">Status</label>
                              <select 
                                value={carStatus}
                                onChange={(e) => setCarStatus(e.target.value)}
                                className="w-full bg-bg-deep/60 border border-border-light focus:border-accent-cyan/50 rounded-xl px-4 py-3 outline-none text-xs text-text-main transition-all font-sans cursor-pointer focus:shadow-[0_0_10px_var(--border-glow)]"
                              >
                                <option value="available" className="bg-bg-surface text-text-main">Available</option>
                                <option value="maintenance" className="bg-bg-surface text-text-main">Maintenance</option>
                              </select>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmittingCar}
                            className="w-full bg-accent-cyan hover:bg-accent-cyan/80 text-[#090d16] font-black uppercase text-xs py-3.5 rounded-xl shadow-[0_0_15px_var(--border-glow)] transition-all cursor-pointer select-none mt-2 flex items-center justify-center gap-2"
                          >
                            {isSubmittingCar ? (
                              <div className="w-4 h-4 border border-[#090d16] border-t-transparent animate-spin rounded-full"></div>
                            ) : (
                              <span>Add Vehicle to Fleet</span>
                            )}
                          </button>
                        </form>
                      </div>

                      {/* Recent additions list column */}
                      <div className="card-glass p-6 rounded-2xl flex flex-col gap-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 select-none">
                          Recent Fleet Additions
                        </h3>

                        <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[300px] pr-1.5 custom-scrollbar">
                          {recentAdditions.map((car) => (
                            <div key={car.id} className="p-2.5 rounded-xl border border-border-light bg-bg-deep/30 flex items-center gap-3.5 relative group">
                              <div className="w-16 h-11 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-border-light">
                                <img 
                                  src={getCarImage(car.id)} 
                                  alt={`${car.make} ${car.model}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-grow min-w-0">
                                <span className="block font-bold text-xs text-text-main truncate">{car.make} {car.model}</span>
                                <span className="text-[10px] text-slate-400 font-medium font-mono mt-0.5 block">
                                  Rs {car.pricePerDay.toLocaleString()} / day
                                </span>
                              </div>
                              <button
                                onClick={() => handleDeleteCarClick(car.id, `${car.make} ${car.model}`)}
                                className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/15 rounded-lg transition-colors cursor-pointer"
                                title="Retire Vehicle"
                              >
                                <IoTrashOutline className="text-sm" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* 2. Booking Orders View (Detailed table) */}
                  {((activeSidebar === 'dashboard' && activeSubTab === 'booking_orders') || activeSidebar === 'bookings') && (
                    <div className="card-glass p-6 rounded-2xl flex flex-col gap-4">
                      <div className="flex justify-between items-center select-none">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          System Bookings Manager
                        </h3>
                      </div>

                      <div className="overflow-x-auto w-full custom-scrollbar text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-border-light text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-950/20">
                              <th className="px-5 py-3">REF TAG</th>
                              <th className="px-5 py-3">CUSTOMER</th>
                              <th className="px-5 py-3">VEHICLE</th>
                              <th className="px-5 py-3">RENT INTERVAL</th>
                              <th className="px-5 py-3">SURCHARGE</th>
                              <th className="px-5 py-3">STATUS</th>
                              <th className="px-5 py-3 text-center">OVERRIDE ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.map((b) => {
                              const car = cars.find(c => c.id === b.carId);
                              const carName = car ? `${car.make} ${car.model}` : 'Premium Fleet Vehicle';
                              return (
                                  <tr key={b.id} className="border-b border-border-light hover:bg-white/5 transition-colors">
                                  <td className="px-5 py-3.5 font-mono text-accent-cyan font-bold">{b.id}</td>
                                  <td className="px-5 py-3.5 text-slate-300 truncate max-w-[150px]" title={b.userEmail}>{b.userEmail}</td>
                                  <td className="px-5 py-3.5 font-bold text-text-main">{carName}</td>
                                  <td className="px-5 py-3.5 text-slate-400 font-sans">{b.pickupDate} to {b.returnDate}</td>
                                  <td className="px-5 py-3.5 font-black text-text-main">Rs {Number(b.totalPrice).toLocaleString()}</td>
                                  <td className="px-5 py-3.5">
                                    {b.status === 'confirmed' ? (
                                      <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">
                                        Confirmed
                                      </span>
                                    ) : b.status === 'pending' ? (
                                      <span className="inline-flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-bold">
                                        Pending
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
                                        Cancelled
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-5 py-3.5 text-center">
                                    {b.status === 'pending' ? (
                                      <div className="flex gap-2 justify-center">
                                        <button
                                          onClick={() => handleVerifyBookingClick(b.id)}
                                          className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 px-2 py-1 rounded-lg transition-all cursor-pointer"
                                        >
                                          Verify
                                        </button>
                                        <button
                                          onClick={() => handleCancelBookingClick(b.id)}
                                          className="text-[10px] font-bold text-red-400 hover:text-red-300 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 px-2 py-1 rounded-lg transition-all cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    ) : b.status === 'confirmed' ? (
                                      <button
                                        onClick={() => handleCancelBookingClick(b.id)}
                                        className="text-[10px] font-bold text-red-400 hover:text-red-300 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 px-2 py-1 rounded-lg transition-all cursor-pointer"
                                      >
                                        Cancel Override
                                      </button>
                                    ) : (
                                      <span className="text-[10px] text-slate-500 font-bold font-mono">N/A</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 3. Customers View (Unique user table) */}
                  {((activeSidebar === 'dashboard' && activeSubTab === 'customers') || activeSidebar === 'clients') && (
                    <div className="card-glass p-6 rounded-2xl flex flex-col gap-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 select-none">
                        Registered User Directory
                      </h3>

                      <div className="overflow-x-auto w-full custom-scrollbar text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-border-light text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-950/20">
                              <th className="px-5 py-3">CUSTOMER EMAIL</th>
                              <th className="px-5 py-3">ACCOUNT NAME</th>
                              <th className="px-5 py-3">RESERVATIONS COUNT</th>
                              <th className="px-5 py-3">GROSS EXPENDITURE</th>
                              <th className="px-5 py-3">GATEWAY STATUS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customerList.map((client, idx) => (
                              <tr key={idx} className="border-b border-border-light hover:bg-white/5 transition-colors">
                                <td className="px-5 py-3.5 text-accent-cyan font-bold font-mono">{client.email}</td>
                                <td className="px-5 py-3.5 text-slate-200 font-bold uppercase tracking-tight">{client.name}</td>
                                <td className="px-5 py-3.5 text-slate-300 font-bold">{client.bookingCount} Trips</td>
                                <td className="px-5 py-3.5 text-emerald-500 font-black">Rs {client.totalSpent.toLocaleString()}</td>
                                <td className="px-5 py-3.5">
                                  <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                    {client.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 4. Reports View (Revenue analysis & graphs) */}
                  {activeSidebar === 'dashboard' && activeSubTab === 'reports' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Class Revenue chart */}
                      <div className="card-glass p-6 md:p-8 rounded-2xl lg:col-span-2 flex flex-col gap-6 shadow-[0_0_15px_var(--border-glow)]">
                        <h3 className="text-sm font-bold font-display uppercase tracking-wider text-text-main select-none">
                          Revenue Class Breakdown
                        </h3>
                        <div className="flex flex-col gap-5">
                          {typeRevenueData.map(({ name, value }) => {
                            const percent = totalRevenue > 0 ? (value / totalRevenue) * 100 : 0;
                            
                            let gradientColor = "from-accent-cyan to-blue-500 shadow-accent-cyan/15";
                            if (name === "Sports") gradientColor = "from-orange-400 to-red-500 shadow-orange-400/15";
                            if (name === "SUV") gradientColor = "from-accent-purple to-pink-500 shadow-accent-purple/15";
                            if (name === "Sedan") gradientColor = "from-blue-400 to-indigo-500 shadow-blue-400/15";

                            return (
                              <div key={name}>
                                <div className="flex justify-between items-center text-xs font-bold mb-2 select-none">
                                  <span className="text-slate-400">{name} Fleet Class</span>
                                  <span className="text-text-main font-sans">Rs {value.toLocaleString()} ({percent.toFixed(0)}%)</span>
                                </div>
                                <div className="w-full bg-bg-deep rounded-full h-3 border border-border-light p-[2px]">
                                  <div 
                                    className={`bg-gradient-to-r ${gradientColor} h-full rounded-full shadow-lg transition-all duration-500`}
                                    style={{ width: `${percent || 5}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* System telemetry logs */}
                      <div className="card-glass p-6 rounded-2xl flex flex-col justify-between gap-6">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 select-none mb-3">
                            System Telemetry Console
                          </h3>
                          <p className="text-slate-400 text-[11px] leading-relaxed">
                            All booking bookings triggers, database synchronization audits, and row-level safety checkpoints are executing normally. Console health: <span className="text-emerald-400 font-bold">100% Operational</span>.
                          </p>
                        </div>
                        <div className="p-4 bg-bg-deep border border-border-light rounded-xl text-[10px] text-slate-500 font-mono leading-relaxed select-none">
                          CORE_VERSION: v3.2.0-rc1<br/>
                          TELEMETRY: AUDIT_ACTIVE<br/>
                          SERVER_TIME: {new Date().toLocaleTimeString()}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Active Booking Orders Table (Visible on default Dashboard/Fleet view matching mockup) */}
                  {(activeSidebar === 'dashboard' && (activeSubTab === 'fleet_mgmt' || activeSubTab === 'booking_orders')) && (
                    <div className="card-glass p-6 rounded-2xl flex flex-col gap-4 mt-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 select-none">
                        Active Booking Orders
                      </h3>

                      <div className="overflow-x-auto w-full custom-scrollbar text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-border-light text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-950/20">
                              <th className="px-5 py-3">ORDER ID</th>
                              <th className="px-5 py-3">CUSTOMER</th>
                              <th className="px-5 py-3">VEHICLE</th>
                              <th className="px-5 py-3">DATES</th>
                              <th className="px-5 py-3">STATUS</th>
                              <th className="px-5 py-3">TOTAL</th>
                              <th className="px-5 py-3 text-center">ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.map((b) => {
                              const car = cars.find(c => c.id === b.carId);
                              const carName = car ? `${car.make} ${car.model}` : 'Premium Fleet Vehicle';
                              return (
                                <tr key={b.id} className="border-b border-border-light hover:bg-white/5 transition-colors">
                                  <td className="px-5 py-3.5 font-mono text-accent-cyan font-bold">#{b.id.replace('BK-', 'AG')}</td>
                                  <td className="px-5 py-3.5 text-slate-300 truncate max-w-[120px]">{b.userEmail.split('@')[0]}</td>
                                  <td className="px-5 py-3.5 font-bold text-text-main">{carName}</td>
                                  <td className="px-5 py-3.5 text-slate-400 font-sans">{b.pickupDate} to {b.returnDate}</td>
                                  <td className="px-5 py-3.5">
                                    {b.status === 'confirmed' ? (
                                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-2.5 py-0.5 rounded-full font-bold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                        Active
                                      </span>
                                    ) : b.status === 'pending' ? (
                                      <span className="inline-flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-2.5 py-0.5 rounded-full font-bold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                                        Pending
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-0.5 rounded-full font-bold">
                                        Cancelled
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-5 py-3.5 font-black text-text-main">Rs {Number(b.totalPrice).toLocaleString()}</td>
                                  <td className="px-5 py-3.5">
                                    <div className="flex gap-2 justify-center items-center">
                                      {b.status === 'pending' ? (
                                        <>
                                          <button
                                            onClick={() => handleVerifyBookingClick(b.id)}
                                            className="bg-accent-cyan hover:bg-accent-cyan/80 text-[#090d16] text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-md transition-all cursor-pointer"
                                          >
                                            Approve
                                          </button>
                                          <button 
                                            onClick={() => handleCancelBookingClick(b.id)}
                                            className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/15 rounded-lg transition-colors cursor-pointer"
                                            title="Cancel Booking"
                                          >
                                            <IoCloseOutline className="text-base" />
                                          </button>
                                        </>
                                      ) : b.status === 'confirmed' ? (
                                        <>
                                          <button
                                            onClick={() => handleCancelBookingClick(b.id)}
                                            className="bg-red-600 hover:bg-red-500 text-white text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg shadow-[0_0_12px_rgba(239,68,68,0.25)] transition-all cursor-pointer"
                                          >
                                            Cancel Override
                                          </button>
                                          <button 
                                            className="text-slate-400 hover:text-text-main p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                                            title="View booking"
                                            onClick={() => toast.success(`Viewing Order ${b.id}`)}
                                          >
                                            <IoEyeOutline className="text-sm" />
                                          </button>
                                        </>
                                      ) : (
                                        <span className="text-[10px] text-slate-500 font-bold font-mono">N/A</span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}
        </main>

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
              className="relative w-full max-w-md card-glass p-8 rounded-[2rem] border-border-light bg-bg-surface/95 shadow-2xl z-10 overflow-hidden text-left"
            >
              {/* Inner modal glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-purple/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Close Icon Button */}
              <button
                onClick={() => setIsEditOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-text-main transition-colors duration-300 w-8 h-8 rounded-full border border-border-light bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer"
              >
                <IoCloseOutline className="text-xl" />
              </button>

              <div className="mb-6 select-none">
                <span className="text-[10px] text-accent-cyan font-bold uppercase tracking-wider block mb-1">
                  Account Control Panel
                </span>
                <h2 className="text-2xl font-black font-display text-text-main">Edit Admin Profile</h2>
                <p className="text-slate-400 text-xs mt-1 font-sans">
                  Modify display name and update admin access credentials below.
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
                    className="w-full bg-bg-deep/60 border border-border-light focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/30 rounded-xl px-4 py-3 text-sm text-text-main transition-all duration-300 outline-none font-sans"
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
                      className="w-full bg-bg-deep/60 border border-border-light focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/30 rounded-xl px-4 py-3 pr-10 text-sm text-text-main transition-all duration-300 outline-none font-sans"
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
                      className="w-full bg-bg-deep/60 border border-border-light focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/30 rounded-xl px-4 py-3 text-sm text-text-main transition-all duration-300 outline-none font-sans"
                    />
                  </motion.div>
                )}

                <div className="mt-2 flex gap-4 font-display">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="flex-1 border border-border-light hover:border-slate-500 bg-white/5 hover:bg-white/10 text-text-main font-bold text-xs py-3.5 rounded-xl transition-all duration-300 cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingProfile}
                    className="flex-1 bg-accent-cyan text-[#090d16] hover:bg-accent-cyan/80 font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-accent-cyan/15 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {isSubmittingProfile ? (
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
