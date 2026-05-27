import React from 'react';
import { Link } from 'react-router-dom';
import { 
  IoPersonOutline, 
  IoReceiptOutline, 
  IoBookmarkOutline, 
  IoCashOutline,
  IoCalendarOutline,
  IoLocationOutline
} from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../hooks/useBookings';
import { useCars } from '../hooks/useCars';

export default function Dashboard() {
  const { user } = useAuth();
  const { bookings, loading: bookingsLoading, cancelBooking } = useBookings();
  const { cars, loading: carsLoading } = useCars();

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
    <div className="py-24 px-6 max-w-7xl mx-auto min-h-screen relative">
      {/* Decorative Glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Profile summary banner */}
      <div className="card-glass p-8 rounded-[2rem] mb-12 flex flex-col md:flex-row gap-6 items-center justify-between border-white/10 bg-slate-900/40 relative overflow-hidden">
        {/* Shiny background effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-6 z-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-accent-cyan to-accent-purple text-slate-950 rounded-full flex items-center justify-center font-bold text-2xl uppercase shadow-lg shadow-accent-cyan/15">
            {getDisplayName().slice(0, 2)}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold mb-1 font-display">{getDisplayName()}</h1>
            <p className="text-text-muted text-sm">Customer since {getJoinedDate()} • Premium Elite Tier</p>
          </div>
        </div>

        <div className="flex gap-4 z-10 w-full md:w-auto">
          <div className="card-glass px-6 py-3 rounded-2xl text-center flex-1 md:flex-none border-white/5 bg-slate-950/40 min-w-[100px]">
            <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1">Active Rides</div>
            <div className="text-2xl font-bold text-accent-cyan font-sans">{isLoading ? '...' : activeBookingsCount}</div>
          </div>
          <div className="card-glass px-6 py-3 rounded-2xl text-center flex-1 md:flex-none border-white/5 bg-slate-950/40 min-w-[100px]">
            <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1">Total Trips</div>
            <div className="text-2xl font-bold text-accent-purple font-sans">{isLoading ? '...' : totalTripsCount}</div>
          </div>
          <div className="card-glass px-6 py-3 rounded-2xl text-center flex-1 md:flex-none border-white/5 bg-slate-950/40 min-w-[120px]">
            <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1 flex items-center gap-1 justify-center">
              <IoCashOutline className="text-accent-coral" />
              <span>Total Spent</span>
            </div>
            <div className="text-2xl font-bold text-accent-coral font-sans">{isLoading ? '...' : `$${totalSpent.toFixed(0)}`}</div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center flex flex-col justify-center items-center">
          <div className="w-10 h-10 rounded-full border-2 border-white/5 border-t-accent-cyan animate-spin mb-4"></div>
          <p className="text-text-muted text-sm font-semibold">Synchronizing profile telemetry...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Pane: Active Bookings */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="card-glass p-6 md:p-8 rounded-[2rem] border-white/10 bg-slate-900/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black flex items-center gap-2 font-display">
                  <IoBookmarkOutline className="text-accent-cyan" />
                  <span>My Active Rentals</span>
                </h2>
                {activeBookingsCount > 0 && (
                  <Link to="/booking" className="text-xs font-bold text-accent-cyan hover:underline">
                    View All
                  </Link>
                )}
              </div>

              {activeBookingsCount === 0 ? (
                /* Empty state */
                <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-slate-950/20 max-w-md mx-auto">
                  <IoBookmarkOutline className="text-5xl text-accent-cyan/30 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-lg font-bold mb-2">No Active Reservations</h3>
                  <p className="text-text-muted text-xs mb-6 max-w-xs mx-auto leading-relaxed">
                    You do not have any premium vehicles locked in for rental yet. Explore our elite fleet selection.
                  </p>
                  <Link to="/cars" className="btn-premium btn-premium-hover px-6 py-2.5 rounded-xl text-xs font-bold">
                    Browse Fleet Catalog
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
                      <div>
                        <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                          Confirmed & Secured
                        </span>
                        <h3 className="text-xl font-black mt-3 mb-1">{getCarName(booking.carId)}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-text-muted mb-4">
                          <IoLocationOutline className="text-accent-cyan shrink-0" />
                          <span>Pick-up: Headquarters Terminal A</span>
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
                      
                      <div className="flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-none border-white/5 pt-4 md:pt-0">
                        <div>
                          <span className="text-[10px] text-text-muted block text-right md:block hidden uppercase">Receipt</span>
                          <span className="text-2xl font-black text-white font-sans">${Number(booking.totalPrice).toFixed(2)}</span>
                        </div>
                        <button 
                          onClick={() => handleCancelClick(booking.id)}
                          className="text-xs border border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Invoice logs sidebar */}
          <div className="card-glass p-6 md:p-8 rounded-[2rem] border-white/10 bg-slate-900/10 h-fit">
            <h2 className="text-xl font-black flex items-center gap-2 mb-6 font-display">
              <IoReceiptOutline className="text-accent-purple" />
              <span>Recent Invoices</span>
            </h2>
            <div className="flex flex-col gap-3">
              {invoices.length === 0 ? (
                <div className="text-center py-8 text-xs text-text-muted border border-dashed border-white/5 rounded-2xl bg-slate-950/20">
                  No billing history recorded
                </div>
              ) : (
                invoices.slice(0, 4).map((inv) => (
                  <div 
                    key={inv.id} 
                    className="flex justify-between items-center p-4 rounded-xl bg-slate-950/30 border border-white/5 text-sm hover:border-accent-cyan/35 transition-all duration-300"
                  >
                    <div>
                      <div className="font-bold text-white leading-tight">{getCarName(inv.carId)}</div>
                      <span className="text-[10px] text-text-muted font-mono block mt-1">Invoice INV-{inv.id}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-accent-cyan font-sans">${Number(inv.totalPrice).toFixed(2)}</div>
                      <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block">
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
    </div>
  );
}
