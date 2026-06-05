import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  IoCarSportOutline,
  IoSpeedometerOutline,
  IoShieldCheckmarkOutline,
  IoFlashOutline,
  IoSparklesOutline,
  IoStar,
  IoChevronForwardOutline,
  IoFingerPrintOutline,
  IoPersonOutline
} from 'react-icons/io5';
import { getCarImage } from '../utils/carImages';

// Mock data for featured fleet
const FEATURED_CARS = [
  {
    id: 'c_tesla_s',
    make: 'Tesla',
    model: 'Model S Plaid',
    type: 'Electric Luxury',
    price: 5180,
    acceleration: '1.99s',
    range: '396 mi',
    imageText: '⚡ Plaid',
    glowColor: 'group-hover:shadow-blue-500/20'
  },
  {
    id: 'c_porsche_911',
    make: 'Porsche',
    model: '911 GT3 RS',
    type: 'Hyper Sports',
    price: 5280,
    acceleration: '3.0s',
    range: '518 hp',
    imageText: '🏁 GT3 RS',
    glowColor: 'group-hover:shadow-purple-500/20'
  },
  {
    id: 'c_rangerover',
    make: 'Range Rover',
    model: 'Autobiography',
    type: 'Luxury SUV',
    price: 5220,
    acceleration: '4.4s',
    range: 'V8 Turbo',
    imageText: '👑 Elite SUV',
    glowColor: 'group-hover:shadow-cyan-500/20'
  }
];

export default function Home() {
  const triggerWelcomeToast = () => {
    toast.success('Welcome to Car Rental System  Premium Rentals! 🚗💨');
  };

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 text-white">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Laser neon light graphics in the background (visual matches from reference image) */}
      <div className="absolute top-[-10%] right-[-10%] w-[1px] h-[140%] bg-gradient-to-b from-transparent via-cyan-400 to-transparent rotate-[35deg] blur-[2px] opacity-40 pointer-events-none"></div>
      <div className="absolute top-[20%] left-[-5%] w-[2px] h-[120%] bg-gradient-to-t from-transparent via-purple-500 to-transparent rotate-[-40deg] blur-[3px] opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[20%] w-[1px] h-[100%] bg-gradient-to-t from-transparent via-blue-400 to-transparent rotate-[55deg] blur-[1px] opacity-35 pointer-events-none"></div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-20 pb-32 px-6 max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-16 min-h-[90vh]">
        {/* Left Column: Featured Showcase Card */}
        <div className="flex-1 w-full relative z-10 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-md relative group"
          >
            {/* The Neon Glow Background Shadow (Vivid Neon Lighting Effect) */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-[2.1rem] blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 pointer-events-none"></div>

            {/* The Card Container with a 1px Neon Gradient Border */}
            <div className="relative p-[1px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-[2rem]">
              {/* Inner Card Content */}
              <div className="relative bg-slate-950/95 backdrop-blur-xl p-6 rounded-[1.95rem] flex flex-col justify-between h-full overflow-hidden">
                {/* Visual ambient shine inside the card */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Graphic Silhouette (Seamless Showcase Card Image) */}
                <div className="relative w-full h-56 md:h-64 rounded-2xl overflow-hidden bg-slate-900/60 mb-6">
                  {/* Soft Vignette Overlay to blend the image seamlessly */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/20 z-20 pointer-events-none" />
                  <img
                    src="/images/porsche_911.png"
                    alt="Porsche 911"
                    className="w-full h-full object-cover z-10 filter drop-shadow-[0_15px_30px_rgba(0,180,255,0.25)] select-none pointer-events-none group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Title & Carrera Subtitle */}
                <div className="text-center mb-6 z-10">
                  <h3 className="text-3xl font-black tracking-tight text-white font-display">PORSCHE 911</h3>
                  <p className="text-xs text-cyan-400 font-mono tracking-[0.25em] font-bold mt-1.5 uppercase">CARRERA 4S</p>
                </div>

                {/* Performance specs row */}
                <div className="grid grid-cols-3 border-t border-white/5 pt-4 pb-6 text-center text-sm font-sans gap-2 z-10">
                  <div className="flex flex-col items-center">
                    <IoFlashOutline className="text-cyan-400 text-lg mb-1" />
                    <span className="text-[10px] text-text-muted block uppercase mb-0.5">Power</span>
                    <span className="text-xs font-bold text-white">379 HP</span>
                  </div>
                  <div className="flex flex-col items-center border-x border-white/5">
                    <IoSpeedometerOutline className="text-cyan-400 text-lg mb-1" />
                    <span className="text-[10px] text-text-muted block uppercase mb-0.5">Acceleration</span>
                    <span className="text-xs font-bold text-white">0-60 in 3.8s</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <IoPersonOutline className="text-cyan-400 text-lg mb-1" />
                    <span className="text-[10px] text-text-muted block uppercase mb-0.5">Capacity</span>
                    <span className="text-xs font-bold text-white">2 Seats</span>
                  </div>
                </div>

                {/* Quick booking link action */}
                <Link
                  to="/cars/c_porsche_911"
                  className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-center text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] block hover:scale-[1.02] z-10"
                >
                  Book This Car
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Hero Text & Actions */}
        <div className="flex-1 flex flex-col items-start text-left z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-6"
            onClick={triggerWelcomeToast}
            style={{ cursor: 'pointer' }}
          >
            <IoSparklesOutline className="text-sm animate-pulse" />
            <span>Introducing The Future of Car Rental</span>
          </motion.div>

          {/* Heading + Side Bullets Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col lg:flex-row lg:items-center justify-between w-full gap-8 mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] font-display flex-grow">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-purple-600 bg-clip-text text-transparent block">
                EVOLVE
              </span>
              <span className="text-white block">
                YOUR TRAVEL
              </span>
              <span className="text-white block">
                STANDARD
              </span>
            </h1>

            <div className="hidden lg:flex items-stretch border-l border-white/20 pl-6 py-2 select-none shrink-0">
              <div className="flex flex-col justify-between text-[11px] font-mono tracking-widest text-slate-400 space-y-3 uppercase">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full inline-block"></span>
                  <span>Rental Without Boundaries</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full inline-block"></span>
                  <span>Premium Service</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full inline-block"></span>
                  <span>Exclusive Access</span>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm md:text-base font-semibold tracking-wider text-slate-400 max-w-xl mb-10 leading-relaxed font-sans uppercase"
          >
            Experience unmatched luxury & performance. Discover our elite fleet of exotic vehicles.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <Link
              to="/cars"
              className="inline-block px-8 py-4 rounded-full border border-purple-500/80 bg-purple-500/10 text-white hover:bg-purple-500/25 transition-all duration-300 font-bold tracking-widest text-xs uppercase shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:-translate-y-0.5"
            >
              Explore Fleet
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURED CARS SECTION ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-blue-500 font-bold uppercase text-xs tracking-widest mb-3">CURATED SELECTION</div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display">The Elite Performance Fleet</h2>
          </div>
          <Link to="/cars" className="text-sm text-blue-400 font-semibold hover:text-blue-300 transition-colors flex items-center gap-2 group shrink-0">
            <span>Explore full catalog</span>
            <IoChevronForwardOutline className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_CARS.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group w-full"
            >
              {/* Neon Glow Background Shadow (Vivid Neon Lighting Effect) */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-[2.1rem] blur-xl opacity-40 group-hover:opacity-85 transition duration-700 pointer-events-none"></div>

              {/* 1px Neon Gradient Border wrapper */}
              <div className="relative p-[1px] bg-gradient-to-r from-blue-500/50 via-indigo-500/50 to-purple-500/50 group-hover:from-blue-400 group-hover:via-indigo-500 group-hover:to-purple-500 rounded-[2rem] transition-all duration-300 h-full">
                {/* Inner Card Content */}
                <div className="relative bg-slate-950/95 backdrop-blur-xl rounded-[1.95rem] overflow-hidden flex flex-col justify-between h-full">
                  {/* Image box (True Full-Bleed Studio Integration) */}
                  <div className="h-56 bg-slate-950 relative overflow-hidden">
                    {/* Soft Multi-Directional Vignette Gradients to blend image into Card UI */}
                    {/* Bottom soft edge blend */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-20 pointer-events-none" />

                    {/* Top soft edge blend */}
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-950 via-slate-950/40 to-transparent z-20 pointer-events-none" />

                    {/* Left soft edge blend */}
                    <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-slate-950/50 to-transparent z-20 pointer-events-none" />

                    {/* Right soft edge blend */}
                    <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-slate-950/50 to-transparent z-20 pointer-events-none" />

                    <div className="absolute top-4 left-4 bg-slate-950/85 border border-white/10 px-3 py-1 rounded-full text-xs font-mono font-bold z-30 select-none">
                      {car.imageText}
                    </div>
                    <img
                      src={getCarImage(car.id)}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover z-10 group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
                    />
                  </div>

                  {/* Specs and names */}
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] text-blue-400 font-semibold uppercase">{car.type}</span>
                        <h3 className="text-2xl font-bold text-white mt-1">{car.make} <span className="font-normal text-slate-300">{car.model}</span></h3>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-white">Rs {car.price}</span>
                        <span className="text-[10px] text-text-muted block font-normal">/ day</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4 my-6 text-sm">
                      <div className="flex items-center gap-2">
                        <IoFlashOutline className="text-blue-400 text-lg" />
                        <div>
                          <span className="text-[10px] text-text-muted block uppercase">Accel</span>
                          <span className="font-semibold text-white">{car.acceleration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <IoSpeedometerOutline className="text-blue-400 text-lg" />
                        <div>
                          <span className="text-[10px] text-text-muted block uppercase">Rating / Hp</span>
                          <span className="font-semibold text-white">{car.range}</span>
                        </div>
                      </div>
                    </div>

                    <Link to={`/cars/${car.id}`} className="w-full btn-premium btn-premium-hover py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-md">
                      <span>Car Detail</span>
                      <IoChevronForwardOutline />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-blue-500 font-bold uppercase text-xs tracking-widest mb-3 block">UNCOMPROMISING SERVICE</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display mb-6">Designed For Discriminating Drivers</h2>
          <p className="text-text-muted text-lg leading-relaxed">
            We've stripped away the antiquated friction of car renting to offer an premium, entirely digital vehicle checkout system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-glass card-glass-hover p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
              <IoShieldCheckmarkOutline className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Premium Insurance Included</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Drive with total confidence. All our vehicle rentals include standard comprehensive damage coverage with transparent claims support.
            </p>
          </div>

          <div className="card-glass card-glass-hover p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
              <IoFingerPrintOutline className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">100% Contactless Keyless App</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              No paper forms or kiosks. Authenticate your profile identity in the cloud, unlock your vehicle directly via Bluetooth, and start commanding.
            </p>
          </div>

          <div className="card-glass card-glass-hover p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
              <IoSparklesOutline className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Showroom Car Preparation</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Every fleet vehicle undergoes a deep detail, full charge/tank fueling, and a mechanical inspection before pulling up to your location.
            </p>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-blue-500 font-bold uppercase text-xs tracking-widest mb-3 block">TESTIMONIALS</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display mb-6">The Client Impression</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Alexander Mercer',
              role: 'Tech Venture Partner',
              review: 'The Plaid checkout was flawless. I unlocked the car with my mobile web app and drove directly out of the express lane. Outstanding UX design.',
              stars: 5
            },
            {
              name: 'Elena Rostova',
              role: 'Elite Lifestyle Consultant',
              review: 'Finally, a rental system that treats premium cars with correct prestige. The vehicle was detailed to showroom standards and mechanicals were crisp.',
              stars: 5
            },
            {
              name: 'Marcus Vance',
              role: 'Architect & Designer',
              review: 'Impeccable color standards, typography details, and glass cards layout. The interface alone won me over. Booking took less than 40 seconds.',
              stars: 5
            }
          ].map((client, idx) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="card-glass p-8 rounded-3xl relative border border-white/5"
            >
              <div className="flex items-center gap-1 mb-4 text-blue-400">
                {[...Array(client.stars)].map((_, i) => (
                  <IoStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-6 font-sans italic">
                "{client.review}"
              </p>
              <div className="border-t border-white/5 pt-4">
                <h5 className="font-bold text-white text-base">{client.name}</h5>
                <span className="text-[10px] text-blue-400 uppercase font-semibold">{client.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section className="py-24 px-6 max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full relative card-glass p-12 md:p-16 rounded-[2.5rem] border border-blue-500/25 overflow-hidden text-center flex flex-col items-center gap-6"
        >
          {/* Neon background circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

          <span className="text-blue-400 font-bold uppercase text-xs tracking-widest">DRIVE WITH INTEGRITY</span>
          <h2 className="text-4xl md:text-6xl font-extrabold font-display leading-tight max-w-2xl">
            Command the Road <br />
            With Ultimate Style.
          </h2>
          <p className="text-text-muted max-w-lg mb-4 text-sm md:text-base leading-relaxed">
            Reserve your high-performance elite vehicle today. 100% digital billing, immediate contactless pickup, and comprehensive premium coverage standard.
          </p>

          <Link to="/cars" className="btn-premium btn-premium-hover flex items-center gap-2 group text-base font-bold shadow-xl shadow-blue-500/15">
            <span>Browse Full Elite Catalog</span>
            <IoChevronForwardOutline className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
