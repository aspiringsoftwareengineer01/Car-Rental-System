import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IoFlashOutline, 
  IoSpeedometerOutline,
  IoChevronForwardOutline
} from 'react-icons/io5';
import { getCarImage } from '../../utils/carImages';

// High-fidelity dynamic spec mappings matching 2.png
const CAR_METRICS = {
  c_porsche_911: { color: 'Guards Red', accel: '3.2s', hp: '525 HP' },
  c_tesla_s: { color: 'Deep Blue Metallic', accel: '2.1s', hp: '1020 HP' },
  c_rangerover: { color: 'Santorini Black', accel: '5.4s', hp: '530 HP' },
  c_audietron: { color: 'Tactical Green Metallic', accel: '3.3s', hp: '637 HP' },
  c_bmwm4: { color: 'Alpine White', accel: '3.4s', hp: '503 HP' },
  c_mercedesg63: { color: 'Obsidian Black', accel: '4.5s', hp: '577 HP' },
  c_lucidair: { color: 'Infinite Black', accel: '1.89s', hp: '1234 HP' },
  c_ferrarif8: { color: 'Rosso Corsa', accel: '2.9s', hp: '710 HP' }
};

const getMetrics = (carId) => {
  return CAR_METRICS[carId] || { color: 'Custom Metallic', accel: '4.0s', hp: '450 HP' };
};

export default function CarCard({ car, onBook }) {
  const isAvailable = car.status === 'available';
  const metrics = getMetrics(car.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative group w-full"
    >
      {/* Neon Glow Background Shadow (Vivid purple/indigo glow effect from 2.png) */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-[2.1rem] blur-xl opacity-40 group-hover:opacity-85 transition duration-700 pointer-events-none"></div>

      {/* 1px Neon Gradient Border wrapper */}
      <div className="relative p-[1px] bg-gradient-to-r from-blue-500/40 via-indigo-500/40 to-purple-500/40 group-hover:from-blue-400 group-hover:via-indigo-500 group-hover:to-purple-500 rounded-[2rem] transition-all duration-300 h-full">
        {/* Inner Card Content */}
        <div className="relative bg-slate-950/95 backdrop-blur-xl p-5 rounded-[1.95rem] overflow-hidden flex flex-col justify-between h-full">
          
          {/* Card Thumbnail Image container */}
          <div className="h-56 bg-slate-900 relative rounded-2xl overflow-hidden shrink-0 mb-5">
            {/* Ambient gradients to blend image into Card UI */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/20 z-20 pointer-events-none" />
            
            {/* Status indicators (subtle top tags) */}
            <div className="absolute top-4 left-4 bg-slate-950/80 border border-white/10 px-3 py-1 rounded-full text-[9px] font-mono font-bold text-accent-cyan tracking-wider select-none z-30 uppercase">
              {car.type}
            </div>

            <img 
              src={getCarImage(car.id)} 
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover z-10 group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
            />
          </div>

          {/* Details Area */}
          <div className="flex flex-col flex-grow justify-between">
            <div>
              {/* Header Title Stack */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300 font-display leading-tight">
                  {car.make} <br />
                  <span className="text-lg font-extrabold">{car.model}</span>
                </h3>
                <span className="text-xs text-slate-400 block mt-1 font-sans">
                  {metrics.color}
                </span>
              </div>

              {/* Accel Specification Line */}
              <div className="flex items-center gap-2 text-xs text-slate-400 font-sans mt-4">
                <IoSpeedometerOutline className="text-purple-400 text-base" />
                <span>Accel: <strong className="text-white font-bold">{metrics.accel}</strong> (0-100)</span>
              </div>

              {/* HP Specification Line */}
              <div className="flex items-center justify-between w-full text-xs text-slate-400 font-sans mt-3 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <IoFlashOutline className="text-purple-400 text-base" />
                  <span>HP</span>
                </div>
                <strong className="text-purple-400 font-bold">{metrics.hp}</strong>
              </div>
            </div>

            {/* Price section */}
            <div className="flex items-center gap-3.5 my-6">
              {/* Rupee symbol styled indicator */}
              <div className="w-9 h-9 rounded-full bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold font-sans text-xs shadow-[0_0_15px_rgba(168,85,247,0.15)] shrink-0 select-none">
                Rs
              </div>
              <div>
                <span className="text-[10px] block uppercase tracking-wider text-slate-500 font-semibold">Daily Rate</span>
                <span className="font-black text-white text-lg font-display">
                  Rs {car.pricePerDay.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ day</span>
                </span>
              </div>
            </div>

            {/* Action Trigger Button */}
            {isAvailable ? (
              <button 
                onClick={() => onBook(car)}
                className="w-full py-3.5 rounded-full border border-purple-500 bg-purple-500/10 text-white hover:bg-purple-500/25 transition-all duration-300 font-bold tracking-widest text-xs uppercase shadow-[0_0_20px_rgba(168,85,247,0.25)] cursor-pointer"
              >
                Rent Now
              </button>
            ) : (
              <button 
                disabled 
                className="w-full py-3.5 rounded-full border border-white/5 bg-white/5 text-text-muted/40 font-bold text-xs tracking-widest uppercase cursor-not-allowed select-none"
              >
                Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
