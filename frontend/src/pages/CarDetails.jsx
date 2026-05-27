import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  IoArrowBackOutline, 
  IoSpeedometerOutline, 
  IoBuildOutline, 
  IoPeopleOutline,
  IoFlashOutline,
  IoInformationCircleOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5';
import { useCars } from '../hooks/useCars';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/cars/BookingModal';

export default function CarDetails() {
  const { id } = useParams();
  const { cars, loading: carsLoading } = useCars();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Find current active car
  const car = useMemo(() => {
    return cars.find(c => c.id === id);
  }, [cars, id]);

  // Dynamic specifications database based on fleet models
  const specs = useMemo(() => {
    if (!car) return { accel: '3.5s', hp: '450 hp', seats: '5 Seats', desc: 'Sleek luxury styling combined with high efficiency.' };
    
    const makeModel = `${car.make} ${car.model}`.toLowerCase();
    if (makeModel.includes('tesla')) {
      return {
        accel: '1.99s',
        hp: '1,020 hp',
        seats: '5 Seats',
        desc: 'Shatter travel expectations with the fastest accelerating production vehicle in existence. Tri-motor Plaid AWD propulsion delivers instantaneous torque.'
      };
    } else if (makeModel.includes('porsche')) {
      return {
        accel: '3.0s',
        hp: '518 hp',
        seats: '2 Seats',
        desc: 'Uncompromising track performance engineered for public avenues. Features active aerodynamic DRS and high-revving naturally aspirated flat-six mechanics.'
      };
    } else if (makeModel.includes('range rover')) {
      return {
        accel: '4.4s',
        hp: '523 hp',
        seats: '7 Seats',
        desc: 'The pinnacle of luxury SUV refined mobility. High-position commands, acoustic glass insulation, and executive twin-turbocharged V8 presence.'
      };
    } else if (makeModel.includes('audi')) {
      return {
        accel: '3.1s',
        hp: '637 hp',
        seats: '5 Seats',
        desc: 'Art in electric motion. Beautiful aerodynamic glass proportions, active e-torque vectoring, and high-fidelity sound synthesis engineering.'
      };
    } else if (makeModel.includes('bmw')) {
      return {
        accel: '3.4s',
        hp: '503 hp',
        seats: '4 Seats',
        desc: 'High-performance coupe precision. Turbocharged inline-six muscle and adaptive suspension bounds translate to extreme agility and high-speed posture.'
      };
    } else if (makeModel.includes('mercedes')) {
      return {
        accel: '4.5s',
        hp: '577 hp',
        seats: '5 Seats',
        desc: 'Monolithic styling combined with hand-crafted twin-turbo V8 speed. Command any topography with three differential lockers and high ground clearance.'
      };
    } else if (makeModel.includes('lucid')) {
      return {
        accel: '1.89s',
        hp: '1,234 hp',
        seats: '5 Seats',
        desc: 'Hyper-performance mega-watt electric sedan. Standard carbon-ceramic stopping arrays, carbon-fiber aerodynamic packages, and massive range benchmarks.'
      };
    } else if (makeModel.includes('ferrari')) {
      return {
        accel: '2.9s',
        hp: '710 hp',
        seats: '2 Seats',
        desc: 'Mid-engine Italian hyper-sports royalty. Beautiful aerodynamic tunnels, dynamic side-slip controls, and screaming twin-turbocharged V8 performance.'
      };
    }

    return {
      accel: '3.8s',
      hp: '480 hp',
      seats: `${car.seats || 5} Seats`,
      desc: `Premium vehicle configured with a high-efficiency ${car.fuelType} propulsion setup. Ready for short urban commands or long-range travel.`
    };
  }, [car]);

  const handleBookClick = () => {
    if (!user) {
      navigate('/auth', { state: { from: location } });
      return;
    }
    setIsModalOpen(true);
  };

  if (carsLoading) {
    return (
      <div className="py-32 px-6 text-center min-h-[80vh] flex flex-col justify-center items-center">
        <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-accent-cyan animate-spin mb-4"></div>
        <p className="text-text-muted text-sm font-semibold">Loading vehicle credentials...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="py-32 px-6 text-center min-h-[80vh] flex flex-col justify-center items-center max-w-md mx-auto">
        <IoInformationCircleOutline className="text-6xl text-red-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold mb-2">Vehicle Not Found</h2>
        <p className="text-text-muted text-sm mb-6">
          The requested car reference ID does not exist or has been retired from our catalog collection.
        </p>
        <Link to="/cars" className="btn-premium btn-premium-hover px-6 py-2.5 rounded-xl text-sm font-bold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isAvailable = car.status === 'available';

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto min-h-screen relative">
      {/* Decorative Glow */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <Link to="/cars" className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors duration-300 mb-8 group text-sm font-semibold">
        <IoArrowBackOutline className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to fleet catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Dynamic Image / Graphic Panel */}
        <div className="card-glass rounded-[2rem] p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden aspect-[4/3] group border-white/10 shadow-2xl bg-gradient-to-br from-slate-900 to-slate-950">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-950/50 to-slate-950 pointer-events-none"></div>
          
          {/* Subtle neon spotlight rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-accent-cyan/5 group-hover:border-accent-cyan/15 group-hover:scale-110 transition-all duration-700 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-accent-purple/5 group-hover:border-accent-purple/10 group-hover:scale-105 transition-all duration-700 pointer-events-none"></div>
          
          {/* Moving neon grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,242,254,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,242,254,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none group-hover:scale-[1.02] transition-transform duration-700"></div>
          
          {/* Status Badge */}
          <div className="absolute top-6 left-6 z-10">
            {isAvailable ? (
              <span className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider select-none shadow-md shadow-green-500/5">
                <IoCheckmarkCircleOutline className="text-xs" />
                <span>Available</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-text-muted px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider select-none">
                <span>Rented / Out of Office</span>
              </span>
            )}
          </div>

          <IoSpeedometerOutline className="text-[14rem] text-white/5 group-hover:text-accent-cyan/20 transition-all duration-700 group-hover:scale-105 filter drop-shadow-[0_0_20px_rgba(0,242,254,0.15)]" />
          
          <div className="absolute bottom-6 left-6 text-left">
            <span className="text-[10px] bg-slate-950/80 border border-white/15 px-3.5 py-1.5 rounded-full text-accent-cyan font-mono font-bold tracking-widest uppercase shadow-md select-none">
              {car.type}
            </span>
          </div>
        </div>

        {/* Content details */}
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10 border border-accent-cyan/25 text-accent-cyan px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase w-max mb-6 select-none">
            ✦ ANTIGRAVITY SPECIAL FLEET
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 font-display">
            {car.make} <span className="font-normal text-slate-300 font-sans">{car.model}</span>
          </h1>
          <p className="text-text-muted text-base leading-relaxed mb-8">
            {specs.desc}
          </p>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="card-glass p-4 rounded-xl text-center border-white/5 bg-slate-900/10 hover:border-accent-cyan/25 hover:shadow-lg transition-all duration-300 group">
              <IoSpeedometerOutline className="text-2xl text-accent-cyan mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-[9px] text-text-muted uppercase tracking-wider mb-1">0-60 Time</div>
              <div className="font-bold text-white font-sans text-xs sm:text-sm">{specs.accel}</div>
            </div>
            <div className="card-glass p-4 rounded-xl text-center border-white/5 bg-slate-900/10 hover:border-accent-purple/25 hover:shadow-lg transition-all duration-300 group">
              <IoBuildOutline className="text-2xl text-accent-purple mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-[9px] text-text-muted uppercase tracking-wider mb-1">Peak Power</div>
              <div className="font-bold text-white font-sans text-xs sm:text-sm">{specs.hp}</div>
            </div>
            <div className="card-glass p-4 rounded-xl text-center border-white/5 bg-slate-900/10 hover:border-accent-cyan/25 hover:shadow-lg transition-all duration-300 group">
              <IoPeopleOutline className="text-2xl text-accent-cyan mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-[9px] text-text-muted uppercase tracking-wider mb-1">Capacity</div>
              <div className="font-bold text-white font-sans text-xs sm:text-sm">{specs.seats}</div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-8 flex-wrap sm:flex-nowrap gap-4">
            <div>
              <div className="text-text-muted text-xs uppercase tracking-widest">Renting Daily Rate</div>
              <div className="text-3xl font-black text-white mt-1 font-sans">${car.pricePerDay} <span className="text-xs text-text-muted font-normal font-sans">/ day</span></div>
            </div>
            {isAvailable ? (
              <button 
                onClick={handleBookClick}
                className="btn-premium btn-premium-hover px-8 py-3.5 rounded-xl font-bold text-sm cursor-pointer shadow-lg shadow-accent-cyan/10"
              >
                Reserve Car Now
              </button>
            ) : (
              <button 
                disabled
                className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/5 text-text-muted/50 text-sm font-bold cursor-not-allowed select-none"
              >
                Unavailable
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Booking Modal Trigger */}
      <BookingModal 
        car={car} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

