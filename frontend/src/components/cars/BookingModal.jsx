import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoCloseOutline, 
  IoCalendarOutline, 
  IoCardOutline, 
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
  IoInformationCircleOutline,
  IoCarSportOutline
} from 'react-icons/io5';
import { useBookings } from '../../hooks/useBookings';

export default function BookingModal({ car, isOpen, onClose }) {
  const { createBooking } = useBookings();
  const navigate = useNavigate();

  // Booking states
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null); // stores success booking details

  // Min date is today
  const todayStr = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Sync return date minimum constraint
  useEffect(() => {
    if (pickupDate && returnDate && returnDate < pickupDate) {
      setReturnDate('');
    }
  }, [pickupDate, returnDate]);

  // Compute total duration in days
  const rentalDays = useMemo(() => {
    if (!pickupDate || !returnDate) return 0;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
    return diffDays || 0;
  }, [pickupDate, returnDate]);

  // Compute invoice total pricing
  const invoice = useMemo(() => {
    if (!car || rentalDays <= 0) return { subtotal: 0, total: 0 };
    const subtotal = car.pricePerDay * rentalDays;
    const tax = Math.round(subtotal * 0.08); // 8% standard service surcharge
    return {
      subtotal,
      tax,
      total: subtotal + tax
    };
  }, [car, rentalDays]);

  if (!isOpen || !car) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!pickupDate || !returnDate) {
      setErrorMsg('Please select both pick-up and return dates.');
      return;
    }

    if (!cardName.trim() || !cardNumber.trim()) {
      setErrorMsg('Please provide payment details to secure the booking.');
      return;
    }

    // Card number length check (simulated)
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setErrorMsg('Please enter a valid 16-digit credit card number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createBooking({
        carId: car.id,
        pickupDate,
        returnDate,
        totalPrice: invoice.total
      });

      if (result?.success) {
        setBookingSuccess({
          ...result.data,
          carName: `${car.make} ${car.model}`,
          dailyRate: car.pricePerDay,
          days: rentalDays
        });
      } else {
        setErrorMsg(result?.error || 'Failed to complete booking.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToDashboard = () => {
    onClose();
    navigate('/dashboard');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
        
        {/* Backdrop Close Click */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 cursor-default" 
          onClick={bookingSuccess ? undefined : onClose}
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl card-glass rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header Banner */}
          <div className="flex justify-between items-center p-6 border-b border-white/5 shrink-0 bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-accent-cyan to-accent-purple p-2 rounded-xl text-bg-deep">
                <IoCarSportOutline className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Secure Fleet Booking</h3>
                <span className="text-xs text-text-muted">Premium On-Demand Mobility Hub</span>
              </div>
            </div>
            {!bookingSuccess && (
              <button 
                onClick={onClose}
                className="text-2xl text-text-muted hover:text-white transition-colors duration-300 cursor-pointer p-1 hover:bg-white/5 rounded-full"
              >
                <IoCloseOutline />
              </button>
            )}
          </div>

          <div className="flex-grow overflow-y-auto p-6 md:p-8">
            <AnimatePresence mode="wait">
              {bookingSuccess ? (
                /* ================= SUCCESS CONFIRMATION SLIDE ================= */
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center text-center py-8 gap-6 max-w-xl mx-auto"
                >
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center shadow-lg shadow-green-500/10"
                  >
                    <IoCheckmarkCircleOutline className="text-5xl" />
                  </motion.div>

                  <div>
                    <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-white via-white to-green-400 bg-clip-text text-transparent">
                      Booking Confirmed!
                    </h2>
                    <p className="text-text-muted text-sm">
                      Your high-performance vehicle has been locked in. Welcome to the elite travel circle.
                    </p>
                  </div>

                  {/* Summary Invoice Details */}
                  <div className="w-full card-glass p-6 rounded-2xl border border-white/5 bg-slate-900/30 flex flex-col gap-4 text-sm text-left">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-text-muted text-xs">VEHICLE CLASS</span>
                      <strong className="text-white text-base">{bookingSuccess.carName}</strong>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-text-muted text-xs block uppercase">Pick-Up Date</span>
                        <strong className="text-white font-sans">{bookingSuccess.pickupDate}</strong>
                      </div>
                      <div>
                        <span className="text-text-muted text-xs block uppercase">Return Date</span>
                        <strong className="text-white font-sans">{bookingSuccess.returnDate}</strong>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
                      <div>
                        <span className="text-text-muted text-xs block uppercase">Total Period</span>
                        <strong className="text-white">{bookingSuccess.days} Days</strong>
                      </div>
                      <div>
                        <span className="text-text-muted text-xs block uppercase font-bold text-accent-cyan">Secured Receipt</span>
                        <strong className="text-accent-cyan text-base font-sans">Rs {bookingSuccess.totalPrice.toFixed(2)}</strong>
                      </div>
                    </div>
                    <div className="border-t border-white/5 pt-3 text-[10px] text-text-muted flex justify-between">
                      <span>REFERENCE TAG</span>
                      <span className="font-mono font-bold text-white">{bookingSuccess.id}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full justify-center">
                    <button 
                      onClick={handleGoToDashboard}
                      className="btn-premium btn-premium-hover px-6 py-3 rounded-xl font-bold flex-1 max-w-[200px]"
                    >
                      Go to Dashboard
                    </button>
                    <button 
                      onClick={onClose}
                      className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-semibold text-sm flex-1 max-w-[200px]"
                    >
                      Close Window
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ================= SECURE BOOKING FORM SLIDE ================= */
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  
                  {/* Left Side: Vehicle Overview & Pricing Calculator */}
                  <div className="lg:col-span-3 flex flex-col gap-6">
                    {/* Error Box */}
                    {errorMsg && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2 animate-pulse">
                        <IoAlertCircleOutline className="text-lg shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Date select row */}
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-accent-cyan mb-4 flex items-center gap-2">
                        <IoCalendarOutline />
                        <span>Select Rental Interval</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2">Pick-up Date</label>
                          <input 
                            type="date"
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                            min={todayStr}
                            disabled={isSubmitting}
                            required
                            className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3.5 outline-none text-white focus:border-accent-cyan focus:ring-4 focus:ring-accent-cyan/10 transition-all duration-300 text-sm font-sans cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2">Drop-off Date</label>
                          <input 
                            type="date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            min={pickupDate || todayStr}
                            disabled={isSubmitting || !pickupDate}
                            required
                            className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3.5 outline-none text-white focus:border-accent-cyan focus:ring-4 focus:ring-accent-cyan/10 transition-all duration-300 text-sm font-sans cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    <hr className="border-white/5" />

                    {/* Payment details */}
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-accent-purple mb-4 flex items-center gap-2">
                        <IoCardOutline className="text-base text-accent-purple" />
                        <span>Payment Security</span>
                      </h4>
                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="block text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2">Cardholder Name</label>
                          <input 
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Full Name as displayed on card"
                            disabled={isSubmitting}
                            required
                            className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3.5 outline-none text-white focus:border-accent-cyan focus:ring-4 focus:ring-accent-cyan/10 transition-all duration-300 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2">Credit Card Number</label>
                          <input 
                            type="text"
                            value={cardNumber}
                            onChange={(e) => {
                              // Auto format input with spaces every 4 characters
                              const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                              setCardNumber(val.slice(0, 19)); // limit to 16 digits + 3 spaces
                            }}
                            placeholder="0000 0000 0000 0000"
                            disabled={isSubmitting}
                            required
                            className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3.5 outline-none text-white focus:border-accent-cyan focus:ring-4 focus:ring-accent-cyan/10 transition-all duration-300 text-sm font-sans"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Invoice Calculator Summary Panel */}
                  <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="card-glass p-6 rounded-2xl border border-white/5 bg-slate-900/30 flex flex-col justify-between h-full">
                      <div>
                        {/* Selected Car Details */}
                        <div className="border-b border-white/5 pb-4 mb-4">
                          <span className="text-[10px] text-accent-cyan font-bold uppercase tracking-wider">{car.type}</span>
                          <h4 className="text-xl font-bold text-white mt-1">{car.make} <span className="font-normal text-slate-300">{car.model}</span></h4>
                          <div className="flex justify-between items-center mt-3 text-xs">
                            <span className="text-text-muted">Daily Rate</span>
                            <span className="text-white font-bold font-sans">Rs {car.pricePerDay} / day</span>
                          </div>
                        </div>

                        {/* Calculations summary */}
                        <h5 className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-3">Calculated Invoice</h5>
                        
                        {rentalDays > 0 ? (
                          <ul className="flex flex-col gap-3 text-xs border-b border-white/5 pb-4 mb-4">
                            <li className="flex justify-between">
                              <span className="text-text-muted">Rental duration</span>
                              <span className="font-semibold text-white">{rentalDays} Days</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-text-muted">Subtotal fee</span>
                              <span className="font-semibold text-white font-sans">Rs {invoice.subtotal.toFixed(2)}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-text-muted">Surcharge (VAT / Insurance 8%)</span>
                              <span className="font-semibold text-white font-sans">Rs {invoice.tax.toFixed(2)}</span>
                            </li>
                          </ul>
                        ) : (
                          <div className="text-center py-6 border border-dashed border-white/10 rounded-xl mb-4 bg-slate-950/20 text-xs text-text-muted">
                            <IoInformationCircleOutline className="text-2xl mx-auto mb-2 text-accent-cyan animate-pulse" />
                            <span>Select rental dates to calculate real-time invoice pricing</span>
                          </div>
                        )}
                      </div>

                      {/* Total */}
                      {rentalDays > 0 && (
                        <div className="flex justify-between items-center text-base font-bold mb-6 pt-2">
                          <span>Secured Bill</span>
                          <span className="text-accent-cyan text-xl font-sans">Rs {invoice.total.toFixed(2)}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting || rentalDays <= 0}
                        className="w-full btn-premium btn-premium-hover py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-md shadow-blue-500/15 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></div>
                        ) : (
                          <>
                            <IoCardOutline className="text-lg" />
                            <span>Confirm Booking Securely</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
