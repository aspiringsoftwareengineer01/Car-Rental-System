import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  IoPersonOutline, 
  IoReceiptOutline, 
  IoBookmarkOutline, 
  IoCashOutline,
  IoCalendarOutline,
  IoLocationOutline,
  IoSettingsOutline,
  IoCloseOutline,
  IoEyeOutline,
  IoEyeOffOutline
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../hooks/useBookings';
import { useCars } from '../hooks/useCars';

export default function Dashboard() {
  const { user, isAdmin, updateProfile } = useAuth();
  const { bookings, loading: bookingsLoading, cancelBooking } = useBookings();
  const { cars, loading: carsLoading } = useCars();

  // Profile edit states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Get user display name or email prefix
  const getDisplayName = () => {
    if (!user) return 'Premium Member';
    if (user.user_metadata?.name) return user.user_metadata.name;
    if (user.email) return user.email.split('@')[0];
    return 'Premium Member';
  };

  // Get user registration date or simulated date
  const getJoinedDate = () => {
    if (!user) return 'May 2026';
    if (user.created_at) {
      const date = new Date(user.created_at);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return 'May 2026';
  };

  const getCarName = (carId) => {
    const car = cars.find(c => c.id === carId);
    return car ? `${car.make} ${car.model}` : 'Premium Fleet Vehicle';
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
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

  // Invoices list: confirmed bookings
  const invoices = bookings.filter(b => b.status !== 'cancelled');

  const isLoading = bookingsLoading || carsLoading;

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto min-h-screen relative text-white">
      {/* Decorative Glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Profile summary banner */}
      <div className="card-glass p-8 rounded-[2rem] mb-12 flex flex-col lg:flex-row gap-6 items-center justify-between border-white/10 bg-slate-900/40 relative overflow-hidden shadow-2xl">
        {/* Shiny background effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 z-10 w-full lg:w-auto text-center sm:text-left">
          <div className="w-20 h-20 bg-gradient-to-tr from-accent-cyan to-accent-purple text-slate-950 rounded-full flex items-center justify-center font-bold text-2xl uppercase shadow-lg shadow-accent-cyan/15 shrink-0 border border-white/10 select-none">
            {getDisplayName().slice(0, 2)}
          </div>
          <div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <h1 className="text-3xl font-extrabold font-display leading-tight">{getDisplayName()}</h1>
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 border border-red-500/30 text-accent-coral text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider animate-pulse shadow-sm select-none shrink-0">
                    ✦ Global Administrator
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 border border-yellow-500/30 text-yellow-400 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider animate-pulse shadow-sm select-none shrink-0">
                    ✦ Premium Elite Member
                  </span>
                )}
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="inline-flex items-center justify-center py-1 px-2.5 rounded-full border border-white/10 bg-white/5 text-text-muted hover:text-accent-cyan hover:border-accent-cyan/35 hover:bg-white/10 transition-all cursor-pointer shadow-sm ml-1"
                  title="Edit Profile Settings"
                >
                  <IoSettingsOutline className="text-xs mr-1" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Edit Profile</span>
                </button>
              </div>
            </div>
            <p className="text-text-muted text-xs mt-2 font-sans">
              Active Profile since {getJoinedDate()} • {isAdmin ? 'Security Console Terminal OK' : 'Verification Terminal OK'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-4 z-10 w-full lg:w-auto mt-4 lg:mt-0">
          <div className="card-glass px-6 py-3 rounded-2xl text-center flex-1 lg:flex-none border-white/5 bg-slate-950/40 min-w-[110px]">
            <div className="text-[9px] text-text-muted uppercase font-extrabold tracking-wider mb-1">
              {isAdmin ? 'Active System Rentals' : 'Active Rides'}
            </div>
            <div className="text-2xl font-black text-accent-cyan font-sans">{isLoading ? '...' : activeBookingsCount}</div>
          </div>
          <div className="card-glass px-6 py-3 rounded-2xl text-center flex-1 lg:flex-none border-white/5 bg-slate-950/40 min-w-[110px]">
            <div className="text-[9px] text-text-muted uppercase font-extrabold tracking-wider mb-1">
              {isAdmin ? 'Total System Trips' : 'Total Trips'}
            </div>
            <div className="text-2xl font-black text-accent-purple font-sans">{isLoading ? '...' : totalTripsCount}</div>
          </div>
          <div className="card-glass px-6 py-3 rounded-2xl text-center flex-1 lg:flex-none border-white/5 bg-slate-950/40 min-w-[130px]">
            <div className="text-[9px] text-text-muted uppercase font-extrabold tracking-wider mb-1 flex items-center gap-1 justify-center">
              <IoCashOutline className="text-accent-coral" />
              <span>{isAdmin ? 'Gross Revenue' : 'Total Spent'}</span>
            </div>
            <div className="text-2xl font-black text-accent-coral font-sans">{isLoading ? '...' : `Rs ${totalSpent.toFixed(0)}`}</div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center flex flex-col justify-center items-center">
          <div className="w-10 h-10 rounded-full border-2 border-white/5 border-t-accent-cyan animate-spin mb-4"></div>
          <p className="text-text-muted text-sm font-semibold">Synchronizing profile telemetry...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Pane: Active Bookings */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="card-glass p-6 md:p-8 rounded-[2rem] border-white/10 bg-slate-900/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black flex items-center gap-2 font-display">
                  <IoBookmarkOutline className="text-accent-cyan" />
                  <span>{isAdmin ? 'System Active Rentals' : 'My Active Rentals'}</span>
                </h2>
                {activeBookingsCount > 0 && (
                  <Link to={isAdmin ? "/admin" : "/booking"} className="text-xs font-bold text-accent-cyan hover:underline">
                    View All
                  </Link>
                )}
              </div>

              {activeBookingsCount === 0 ? (
                /* Empty state */
                <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-slate-950/20 max-w-md mx-auto">
                  <IoBookmarkOutline className="text-5xl text-accent-cyan/30 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-lg font-bold mb-2">
                    {isAdmin ? 'No Active System Reservations' : 'No Active Reservations'}
                  </h3>
                  <p className="text-text-muted text-xs mb-6 max-w-xs mx-auto leading-relaxed">
                    {isAdmin 
                      ? 'There are currently no active reservations recorded in the database.' 
                      : 'You do not have any premium vehicles locked in for rental yet. Explore our elite fleet selection.'}
                  </p>
                  <Link to={isAdmin ? "/admin" : "/cars"} className="btn-premium btn-premium-hover px-6 py-2.5 rounded-xl text-xs font-bold">
                    {isAdmin ? 'Manage Admin Console' : 'Browse Fleet Catalog'}
                  </Link>
                </div>
              ) : (
                /* Dynamic Booking List */
                <div className="flex flex-col gap-6">
                  {activeBookings.slice(0, 2).map((booking) => (
                    <div 
                      key={booking.id}
                      className="bg-slate-950/45 p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between gap-6 hover:border-accent-cyan/20 transition-all duration-300"
                    >
                      <div className="flex-1">
                        <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
                          Confirmed & Secured
                        </span>
                        <h3 className="text-xl font-black mt-3 mb-1 font-display">{getCarName(booking.carId)}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-text-muted mb-4">
                          {isAdmin ? (
                            <>
                              <IoPersonOutline className="text-accent-cyan shrink-0" />
                              <span className="truncate">Customer: {booking.userEmail}</span>
                            </>
                          ) : (
                            <>
                              <IoLocationOutline className="text-accent-cyan shrink-0" />
                              <span>Pick-up: Headquarters Terminal A</span>
                            </>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-xs">
                          <div>
                            <span className="text-text-muted font-bold block text-[10px] uppercase mb-1">Start Date</span>
                            <span className="font-semibold text-white flex items-center gap-1 font-sans">
                              <IoCalendarOutline className="text-accent-cyan" />
                              {formatDate(booking.pickupDate)}
                            </span>
                          </div>
                          <div>
                            <span className="text-text-muted font-bold block text-[10px] uppercase mb-1">End Date</span>
                            <span className="font-semibold text-white flex items-center gap-1 font-sans">
                              <IoCalendarOutline className="text-accent-purple" />
                              {formatDate(booking.returnDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-none border-white/5 pt-4 md:pt-0 shrink-0">
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-text-muted block uppercase">Total Invoice</span>
                          <span className="text-2xl font-black text-white font-sans">Rs {Number(booking.totalPrice).toFixed(2)}</span>
                        </div>
                        <button 
                          onClick={() => handleCancelClick(booking.id)}
                          className="text-xs border border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer"
                        >
                          {isAdmin ? 'Override Cancel' : 'Cancel Booking'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom SVG Telemetry Chart */}
            <div className="card-glass p-6 md:p-8 rounded-[2rem] border-white/10 bg-slate-900/10 flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-bold font-display flex items-center gap-2">
                  <IoCashOutline className="text-accent-cyan" />
                  <span>{isAdmin ? 'System Revenue History' : 'Expenditure History'}</span>
                </h3>
                <p className="text-text-muted text-xs mt-1">
                  {isAdmin ? 'Income metrics of recent system-wide transactions.' : 'Cost breakdown of your recent elite commands.'}
                </p>
              </div>
              
              <div className="h-48 w-full flex items-end justify-between gap-4 pt-4 px-2 relative border-b border-white/5">
                {/* Ambient chart glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-accent-cyan/5 to-transparent blur-md"></div>
                
                {invoices.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-text-muted">
                    No travel metrics recorded
                  </div>
                ) : (
                  invoices.slice(0, 5).reverse().map((inv) => {
                    const maxPrice = Math.max(...invoices.slice(0, 5).map(i => Number(i.totalPrice)), 100);
                    const percentHeight = (Number(inv.totalPrice) / maxPrice) * 100;
                    return (
                      <div key={inv.id} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-default relative">
                        {/* Value tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] text-accent-cyan font-bold absolute -top-2 select-none shadow-xl pointer-events-none z-10 font-sans">
                          Rs {Number(inv.totalPrice).toFixed(0)}
                        </div>
                        
                        {/* Bar */}
                        <div 
                          className="w-full max-w-[44px] rounded-t-lg bg-gradient-to-t from-accent-purple/60 to-accent-cyan/80 relative overflow-hidden group-hover:from-accent-purple group-hover:to-accent-cyan group-hover:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all duration-300 shadow-inner" 
                          style={{ height: `${percentHeight * 0.75 || 10}%` }}
                        >
                          <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
                        </div>
                        
                        {/* Label */}
                        <span className="text-[9px] text-text-muted font-mono truncate max-w-[65px]">{getCarName(inv.carId).split(' ').slice(0, 2).join(' ')}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* Invoice logs sidebar */}
          <div className="card-glass p-6 md:p-8 rounded-[2rem] border-white/10 bg-slate-900/10 h-fit flex flex-col gap-6">
            <h2 className="text-xl font-black flex items-center gap-2 font-display border-b border-white/5 pb-4">
              <IoReceiptOutline className="text-accent-purple" />
              <span>{isAdmin ? 'Recent System Invoices' : 'Recent Invoices'}</span>
            </h2>
            <div className="flex flex-col gap-3">
              {invoices.length === 0 ? (
                <div className="text-center py-10 text-xs text-text-muted border border-dashed border-white/5 rounded-2xl bg-slate-950/20">
                  No billing history recorded
                </div>
              ) : (
                invoices.slice(0, 5).map((inv) => (
                  <div 
                    key={inv.id} 
                    className="flex justify-between items-center p-4 rounded-xl bg-slate-950/30 border border-white/5 text-sm hover:border-accent-cyan/35 transition-all duration-300 group"
                  >
                    <div className="overflow-hidden pr-2">
                      <div className="font-bold text-white leading-tight truncate group-hover:text-accent-cyan transition-colors">{getCarName(inv.carId)}</div>
                      <span className="text-[9px] text-text-muted font-mono block mt-1">INV-{inv.id}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-accent-cyan font-sans">Rs {Number(inv.totalPrice).toFixed(2)}</div>
                      <span className="text-[8px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block select-none">
                        Paid
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* Profile Edit Modal */}
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
              className="relative w-full max-w-md card-glass p-8 rounded-[2rem] border-white/10 bg-slate-900/90 shadow-2xl z-10 overflow-hidden text-left"
            >
              {/* Top ambient glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-purple/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Close Button */}
              <button
                onClick={() => setIsEditOpen(false)}
                className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors duration-300 w-8 h-8 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer"
              >
                <IoCloseOutline className="text-xl" />
              </button>

              <div className="mb-6">
                <span className="text-[10px] text-accent-cyan font-bold uppercase tracking-wider block mb-1">
                  Account Control Panel
                </span>
                <h2 className="text-2xl font-black font-display text-white">Edit Profile</h2>
                <p className="text-text-muted text-xs mt-1 font-sans">
                  Modify display name and update access credentials below.
                </p>
              </div>

              <form onSubmit={handleEditSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="editName" className="block text-xs font-bold text-text-muted uppercase mb-2 tracking-wide font-display">
                    Full Name
                  </label>
                  <input
                    id="editName"
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-slate-950/50 border border-white/5 focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/30 rounded-xl px-4 py-3 text-sm text-white transition-all duration-300 outline-none font-sans"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="editPassword" className="block text-xs font-bold text-text-muted uppercase tracking-wide font-display">
                      New Password (Optional)
                    </label>
                    <span className="text-[9px] text-text-muted font-semibold lowercase font-sans">
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
                      className="w-full bg-slate-950/50 border border-white/5 focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/30 rounded-xl px-4 py-3 pr-10 text-sm text-white transition-all duration-300 outline-none font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-white transition-colors cursor-pointer"
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
                    <label htmlFor="confirmPassword" className="block text-xs font-bold text-text-muted uppercase mb-2 tracking-wide font-display">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      required={!!editPassword}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="w-full bg-slate-950/50 border border-white/5 focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/30 rounded-xl px-4 py-3 text-sm text-white transition-all duration-300 outline-none font-sans"
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
                    className="flex-1 btn-premium btn-premium-hover font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-accent-cyan/15 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
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
