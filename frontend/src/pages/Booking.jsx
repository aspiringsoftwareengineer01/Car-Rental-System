import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  IoCalendarOutline, 
  IoCheckmarkCircleOutline, 
  IoCloseCircleOutline, 
  IoCarSportOutline, 
  IoReceiptOutline, 
  IoHourglassOutline,
  IoLocationOutline
} from 'react-icons/io5';
import { useBookings } from '../hooks/useBookings';
import { useCars } from '../hooks/useCars';

export default function Booking() {
  const { bookings, loading: bookingsLoading, cancelBooking } = useBookings();
  const { cars, loading: carsLoading } = useCars();
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'

  const getDisplayName = (carId) => {
    const car = cars.find(c => c.id === carId);
    return car ? `${car.make} ${car.model}` : 'Premium Fleet Vehicle';
  };

  const getCarSpecs = (carId) => {
    const car = cars.find(c => c.id === carId);
    return car ? car : null;
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handleCancelClick = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this high-fidelity reservation?')) {
      await cancelBooking(bookingId);
    }
  };

  const activeReservations = bookings.filter(b => b.status === 'confirmed');
  const pastReservations = bookings.filter(b => b.status === 'cancelled');

  const isLoading = bookingsLoading || carsLoading;

  return (
    <div className="py-24 px-6 max-w-6xl mx-auto min-h-screen relative">
      {/* Dynamic Background Glows */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-accent-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full font-bold uppercase tracking-wider">
          On-Demand Mobility Hub
        </span>
        <h1 className="text-4xl md:text-5xl font-black mt-4 mb-4 tracking-tight font-display">
          My Reserved <span className="text-accent-cyan">Fleets</span>
        </h1>
        <p className="text-text-muted text-sm md:text-base">
          Track and manage your upcoming executive journeys or review your catalog history of historical active drives.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex justify-center mb-10">
        <div className="bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 flex gap-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'active' 
                ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-slate-950 shadow-md shadow-accent-cyan/10' 
                : 'text-text-muted hover:text-white'
            }`}
          >
            Active Rides ({activeReservations.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history' 
                ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-slate-950 shadow-md shadow-accent-cyan/10' 
                : 'text-text-muted hover:text-white'
            }`}
          >
            History / Cancelled ({pastReservations.length})
          </button>
        </div>
      </div>

      {isLoading ? (
        /* Premium Shimmer Skeleton Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {[1, 2].map((skel) => (
            <div key={skel} className="card-glass rounded-[2rem] overflow-hidden flex flex-col justify-between p-6 md:p-8 gap-6 h-[340px]">
              <div className="flex flex-col gap-4 flex-grow">
                <div className="flex justify-between items-start gap-4">
                  <div className="h-5 w-24 rounded-full bg-white/5 shimmer-placeholder"></div>
                  <div className="h-6 w-16 rounded-lg bg-white/5 shimmer-placeholder shrink-0"></div>
                </div>
                <div className="h-7 w-2/3 rounded-md bg-white/5 shimmer-placeholder"></div>
                <div className="h-16 w-full rounded-xl bg-white/5 shimmer-placeholder mt-2"></div>
              </div>
              <div className="h-12 w-full rounded-xl bg-white/5 shimmer-placeholder"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative z-10">
          {activeTab === 'active' ? (
            /* ================= ACTIVE BOOKINGS TAB ================= */
            activeReservations.length === 0 ? (
              <div className="card-glass p-12 text-center rounded-[2rem] max-w-lg mx-auto border-white/5 bg-slate-900/10 shadow-xl">
                <IoCarSportOutline className="text-6xl text-accent-cyan/30 mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-bold mb-2">No Active Drive Scheduled</h3>
                <p className="text-text-muted text-xs mb-6 leading-relaxed">
                  Your luxury hangar is empty. Select from our ultra-performance collections and secure your date today.
                </p>
                <Link to="/cars" className="btn-premium btn-premium-hover px-6 py-3 rounded-xl text-xs font-bold inline-block">
                  Browse Active Fleet
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activeReservations.map((booking) => {
                  const spec = getCarSpecs(booking.carId);
                  return (
                    <div 
                      key={booking.id} 
                      className="card-glass rounded-[2rem] border-white/10 overflow-hidden bg-slate-900/20 hover:border-accent-cyan/30 hover:shadow-2xl hover:shadow-accent-cyan/5 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="p-6 md:p-8 flex-grow">
                        {/* Header Details */}
                        <div className="flex justify-between items-start gap-4 mb-6 border-b border-white/5 pb-4">
                          <div>
                            <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider select-none">
                              Active Drive
                            </span>
                            <h3 className="text-xl font-black mt-2 font-display">{getDisplayName(booking.carId)}</h3>
                            {spec && (
                              <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mt-1.5">
                                {spec.type} • {spec.fuelType} • {spec.seats} Seats
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[10px] text-text-muted bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">
                            {booking.id}
                          </span>
                        </div>

                        {/* Dates grid */}
                        <div className="grid grid-cols-2 gap-4 bg-slate-950/45 p-4 rounded-2xl border border-white/5 mb-6">
                          <div>
                            <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wider mb-1">Pick-Up Date</span>
                            <strong className="text-white text-xs sm:text-sm font-sans flex items-center gap-1.5">
                              <IoCalendarOutline className="text-accent-cyan shrink-0" />
                              <span className="truncate">{formatDate(booking.pickupDate)}</span>
                            </strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wider mb-1">Return Date</span>
                            <strong className="text-white text-xs sm:text-sm font-sans flex items-center gap-1.5">
                              <IoCalendarOutline className="text-accent-purple shrink-0" />
                              <span className="truncate">{formatDate(booking.returnDate)}</span>
                            </strong>
                          </div>
                        </div>

                        {/* Location / Instructions */}
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <IoLocationOutline className="text-accent-cyan shrink-0 text-sm" />
                          <span>Headquarters Terminal A (contactless)</span>
                        </div>
                      </div>

                      {/* Footer billing & cancellation */}
                      <div className="px-6 py-4 md:px-8 bg-slate-950/30 border-t border-white/5 flex items-center justify-between gap-4">
                        <div>
                          <span className="text-[9px] text-text-muted uppercase tracking-wider block">Total bill</span>
                          <strong className="text-accent-cyan text-lg font-sans">${Number(booking.totalPrice).toFixed(2)}</strong>
                        </div>
                        <button
                          onClick={() => handleCancelClick(booking.id)}
                          className="text-xs font-bold px-4 py-2.5 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* ================= HISTORY & CANCELLED TAB ================= */
            pastReservations.length === 0 ? (
              <div className="card-glass p-12 text-center rounded-[2rem] max-w-lg mx-auto border-white/5 bg-slate-900/10 shadow-xl">
                <IoHourglassOutline className="text-6xl text-text-muted/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Past Log Archive</h3>
                <p className="text-text-muted text-xs leading-relaxed">
                  There are no historical orders or cancelled collections recorded under this authenticated profile.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 max-w-3xl mx-auto">
                {pastReservations.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="card-glass p-5 rounded-2xl border-white/5 bg-slate-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 opacity-75 hover:opacity-100 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl">
                        <IoCloseCircleOutline className="text-2xl" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white leading-tight font-display">{getDisplayName(booking.carId)}</h4>
                        <span className="text-xs text-text-muted block mt-1 font-sans">
                          {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}
                        </span>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-end justify-between sm:justify-center w-full sm:w-auto border-t sm:border-none border-white/5 pt-3 sm:pt-0">
                      <span className="text-text-muted text-[10px] font-mono tracking-wider">{booking.id}</span>
                      <strong className="text-white text-sm font-sans mt-0.5">${Number(booking.totalPrice).toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
