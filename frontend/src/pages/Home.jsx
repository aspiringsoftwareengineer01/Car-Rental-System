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
  IoFingerPrintOutline
} from 'react-icons/io5';

// Mock data for featured fleet
const FEATURED_CARS = [
  {
    id: 'c_tesla_s',
    make: 'Tesla',
    model: 'Model S Plaid',
    type: 'Electric Luxury',
    price: 180,
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
    price: 280,
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
    price: 220,
    acceleration: '4.4s',
    range: 'V8 Turbo',
    imageText: '👑 Elite SUV',
    glowColor: 'group-hover:shadow-cyan-500/20'
  }
];

export default function Home() {
  const triggerWelcomeToast = () => {
    toast.success('Welcome to Antigravity Premium Rentals! 🚗💨');
  };

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 text-white">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-20 pb-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 min-h-[90vh]">
        <div className="flex-1 flex flex-col items-start text-left z-10">
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

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-8 font-display"
          >
            Evolve Your <br />
            <span className="bg-gradient-to-r from-blue-400 via-white to-blue-600 bg-clip-text text-transparent">
              Travel Standard.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-text-muted max-w-xl mb-10 leading-relaxed font-sans"
          >
            Gain instant access to a curated digital garage of high-performance electrics, hyper sports, and executive SUVs. Experience 100% contactless pickup.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link to="/cars" className="btn-premium btn-premium-hover flex items-center justify-center gap-2 group text-base font-bold shadow-2xl shadow-blue-500/20">
              <span>Command the Road</span>
              <IoChevronForwardOutline className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/booking" className="px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 font-semibold text-center text-sm">
              Quick Reserve
            </Link>
          </motion.div>
        </div>

        {/* Hero Visual Spotlight */}
        <div className="flex-1 w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full relative card-glass p-6 rounded-3xl overflow-hidden aspect-[4/3] flex flex-col justify-between"
          >
            {/* Visual ambient shine */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/20 rounded-full blur-3xl"></div>
            
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-white/10 border border-white/20 px-3 py-1 rounded-full text-white font-mono uppercase tracking-widest">
                  Featured Showcase
                </span>
                <h3 className="text-3xl font-black mt-3 mb-1">Porsche 911</h3>
                <p className="text-text-muted text-xs">Model Year 2026 • Paint Acid Green</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-text-muted block">RATES START FROM</span>
                <span className="text-2xl font-extrabold text-blue-400 font-display">$280 <span className="text-xs text-text-muted font-normal">/ day</span></span>
              </div>
            </div>

            {/* Graphic Silhouette */}
            <div className="my-8 flex justify-center items-center relative py-6">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent blur-md rounded-full"></div>
              <IoCarSportOutline className="text-[13rem] text-slate-100/5 drop-shadow-[0_15px_35px_rgba(0,180,255,0.15)] animate-pulse" />
            </div>

            <div className="grid grid-cols-3 border-t border-white/5 pt-4 text-center">
              <div>
                <span className="text-[10px] text-text-muted block uppercase">Max Speed</span>
                <span className="text-sm font-extrabold text-white">197 mph</span>
              </div>
              <div className="border-x border-white/5">
                <span className="text-[10px] text-text-muted block uppercase">Acceleration</span>
                <span className="text-sm font-extrabold text-white">3.0s</span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted block uppercase">Transmission</span>
                <span className="text-sm font-extrabold text-white">PDK Auto</span>
              </div>
            </div>
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
              className={`group card-glass rounded-3xl overflow-hidden hover:border-blue-500/40 hover:shadow-2xl ${car.glowColor} transition-all duration-300`}
            >
              {/* Image box */}
              <div className="h-56 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-white/5 relative flex items-center justify-center overflow-hidden">
                {/* Image Placeholder Styling */}
                <div className="absolute inset-0 bg-slate-950/20 group-hover:scale-105 transition-transform duration-500"></div>
                <div className="absolute top-4 left-4 bg-slate-950/75 border border-white/10 px-3 py-1 rounded-full text-xs font-mono font-bold">
                  {car.imageText}
                </div>
                <IoCarSportOutline className="text-9xl text-white/5 group-hover:text-blue-500/10 transition-colors duration-500 group-hover:scale-110" />
              </div>

              {/* Specs and names */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] text-blue-400 font-semibold uppercase">{car.type}</span>
                    <h3 className="text-2xl font-bold text-white mt-1">{car.make} <span className="font-normal text-slate-300">{car.model}</span></h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white">${car.price}</span>
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
                  <span>Reserve Vehicle</span>
                  <IoChevronForwardOutline />
                </Link>
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
