import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IoFlashOutline, 
  IoPeopleOutline, 
  IoCheckmarkCircleOutline, 
  IoWarningOutline, 
  IoBuildOutline,
  IoChevronForwardOutline
} from 'react-icons/io5';
import { getCarImage } from '../../utils/carImages';

export default function CarCard({ car, onBook }) {
  // Determine availability styling
  const isAvailable = car.status === 'available';
  const isMaintenance = car.status === 'maintenance';

  const statusBadge = () => {
    if (isAvailable) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm select-none">
          <IoCheckmarkCircleOutline className="text-xs" />
          <span>Available</span>
        </span>
      );
    } else if (isMaintenance) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm select-none">
          <IoBuildOutline className="text-xs animate-pulse" />
          <span>Maintenance</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm select-none">
          <IoWarningOutline className="text-xs" />
          <span>Rented</span>
        </span>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group card-glass rounded-3xl overflow-hidden hover:border-accent-cyan/40 hover:shadow-2xl hover:shadow-accent-cyan/5 flex flex-col h-full relative"
    >
      {/* Visual Thumbnail (True Full-Bleed Studio Integration) */}
      <div className="h-56 bg-slate-950 relative overflow-hidden shrink-0">
        {/* Soft Multi-Directional Vignette Gradients to blend image into Card UI */}
        {/* Bottom soft edge blend */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-20 pointer-events-none" />

        {/* Top soft edge blend */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-950 via-slate-950/40 to-transparent z-20 pointer-events-none" />

        {/* Left soft edge blend */}
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-slate-950/50 to-transparent z-20 pointer-events-none" />

        {/* Right soft edge blend */}
        <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-slate-950/50 to-transparent z-20 pointer-events-none" />

        {/* Status Badge overlay */}
        <div className="absolute top-4 left-4 z-30">
          {statusBadge()}
        </div>

        {/* Car Type badge overlay */}
        <div className="absolute top-4 right-4 bg-slate-950/80 border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-accent-cyan tracking-wider select-none z-30">
          {car.type}
        </div>

        {/* Car Image - True Full-Bleed Edge-to-Edge */}
        <img 
          src={getCarImage(car.id)} 
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover z-10 group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
        />
      </div>

      {/* Details Area */}
      <div className="p-6 flex flex-col flex-grow justify-between gap-5">
        <div>
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[10px] text-accent-cyan font-extrabold uppercase tracking-widest block mb-0.5">{car.make}</span>
              <h3 className="text-xl font-bold text-white group-hover:text-accent-cyan transition-colors duration-300 font-display">
                {car.make} <span className="font-normal text-slate-300">{car.model}</span>
              </h3>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-black text-white font-display tracking-tight">${car.pricePerDay}</span>
              <span className="text-[10px] text-text-muted block font-normal mt-0.5 font-sans">/ day</span>
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4 my-1 text-xs text-text-muted">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-accent-cyan group-hover:bg-accent-cyan/10 transition-colors duration-300 shrink-0">
                <IoFlashOutline className="text-base" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[9px] block uppercase tracking-wider text-text-muted/80">Propulsion</span>
                <span className="font-semibold text-white block truncate">{car.fuelType}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-accent-cyan group-hover:bg-accent-cyan/10 transition-colors duration-300 shrink-0">
                <IoPeopleOutline className="text-base" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[9px] block uppercase tracking-wider text-text-muted/80">Capacity</span>
                <span className="font-semibold text-white block truncate">{car.seats} Seats</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {isAvailable ? (
          <button 
            onClick={() => onBook(car)}
            className="w-full btn-premium btn-premium-hover py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-md shadow-accent-cyan/5 mt-auto cursor-pointer"
          >
            <span>Reserve Vehicle</span>
            <IoChevronForwardOutline className="text-xs group-hover:translate-x-0.5 transition-transform" />
          </button>
        ) : (
          <button 
            disabled 
            className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-text-muted/50 text-sm font-bold mt-auto cursor-not-allowed select-none"
          >
            Unavailable
          </button>
        )}
      </div>
    </motion.div>
  );
}
