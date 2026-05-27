import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IoFlashOutline, 
  IoPeopleOutline, 
  IoCheckmarkCircleOutline, 
  IoWarningOutline, 
  IoBuildOutline,
  IoChevronForwardOutline,
  IoCarSportOutline
} from 'react-icons/io5';

export default function CarCard({ car }) {
  // Determine availability styling
  const isAvailable = car.status === 'available';
  const isMaintenance = car.status === 'maintenance';

  const statusBadge = () => {
    if (isAvailable) {
      return (
        <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase">
          <IoCheckmarkCircleOutline className="text-sm" />
          <span>Available</span>
        </span>
      );
    } else if (isMaintenance) {
      return (
        <span className="inline-flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold uppercase">
          <IoBuildOutline className="text-sm animate-pulse" />
          <span>Maintenance</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase">
          <IoWarningOutline className="text-sm" />
          <span>Rented</span>
        </span>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group card-glass rounded-3xl overflow-hidden hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full"
    >
      {/* Visual Thumbnail */}
      <div className="h-52 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-white/5 relative flex items-center justify-center overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-slate-950/20 group-hover:scale-105 transition-transform duration-500"></div>
        <div className="absolute top-4 left-4 z-10">
          {statusBadge()}
        </div>
        <div className="absolute top-4 right-4 bg-slate-950/75 border border-white/10 px-3 py-1 rounded-full text-xs font-mono font-bold text-blue-400">
          {car.type}
        </div>
        <IoCarSportOutline className="text-9xl text-white/5 group-hover:text-blue-500/10 transition-colors duration-500 group-hover:scale-110" />
      </div>

      {/* Details Area */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{car.brand || 'Premium'}</span>
              <h3 className="text-xl font-bold text-white mt-1 group-hover:text-blue-400 transition-colors">
                {car.make} <span className="font-normal text-slate-300">{car.model}</span>
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white font-display">${car.pricePerDay}</span>
              <span className="text-[10px] text-text-muted block font-normal">/ day</span>
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4 my-6 text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <IoFlashOutline className="text-blue-400 text-lg" />
              <div>
                <span className="text-[9px] block uppercase tracking-wider">Fuel Type</span>
                <span className="font-semibold text-white">{car.fuelType}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IoPeopleOutline className="text-blue-400 text-lg" />
              <div>
                <span className="text-[9px] block uppercase tracking-wider">Capacity</span>
                <span className="font-semibold text-white">{car.seats} Seats</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {isAvailable ? (
          <Link 
            to="/booking" 
            className="w-full btn-premium btn-premium-hover py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-md shadow-blue-500/5 mt-auto"
          >
            <span>Reserve Vehicle</span>
            <IoChevronForwardOutline />
          </Link>
        ) : (
          <button 
            disabled 
            className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-text-muted text-sm font-bold mt-auto cursor-not-allowed"
          >
            Unavailable
          </button>
        )}
      </div>
    </motion.div>
  );
}
