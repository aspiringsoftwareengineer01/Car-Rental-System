import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  IoSearchOutline, 
  IoCarSport, 
  IoOptionsOutline,
  IoClose,
  IoPersonOutline,
  IoCartOutline,
  IoCloudOfflineOutline,
  IoCloudDoneOutline,
  IoFunnelOutline
} from 'react-icons/io5';
import { useCars } from '../hooks/useCars';
import { useAuth } from '../context/AuthContext';
import CarCard from '../components/cars/CarCard';
import BookingModal from '../components/cars/BookingModal';

export default function Cars() {
  // Load dynamic data from custom Supabase hook
  const { cars, loading, isMock } = useCars();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Local state for search, filters, location, and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Mumbai');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(6000);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('price-asc');

  // Filter Categories Lists
  const vehicleTypes = ['Sedan', 'Sports', 'SUV', 'Electric'];
  const brandsList = ['All', 'Porsche', 'Tesla', 'Range Rover', 'Audi', 'BMW', 'Mercedes-AMG', 'Lucid', 'Ferrari'];

  const handleBook = (car) => {
    if (!user) {
      navigate('/auth', { state: { from: location } });
      return;
    }
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  // Toggle Type selection helper
  const handleTypeChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Advanced Filtering and Sorting Engine
  const filteredAndSortedCars = useMemo(() => {
    return cars.filter((car) => {
      // 1. Search Query Match
      const matchesSearch = 
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.type.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Multi-select Types
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(car.type);

      // 3. Price Filter (evaluates against original daily rate)
      const displayPrice = car.pricePerDay;
      const matchesPrice = displayPrice <= maxPrice;

      // 4. Brand Match
      const matchesBrand = selectedBrand === 'All' || car.make === selectedBrand;

      return matchesSearch && matchesType && matchesPrice && matchesBrand;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
      return 0;
    });
  }, [cars, searchQuery, selectedTypes, maxPrice, selectedBrand, sortBy]);

  // Reset helper
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setMaxPrice(6000);
    setSelectedBrand('All');
    setSelectedLocation('Mumbai');
    setSortBy('price-asc');
  };

  const handleCartClick = () => {
    toast.success("Checkout active! Rent vehicles directly from the fleet list.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-10 pb-24 px-8 lg:px-12 w-full max-w-none relative flex flex-col lg:flex-row gap-12">
      {/* Decorative Blur Spots */}
      <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* ================= LEFT SIDEBAR FILTER PANEL ================= */}
      <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-8 card-glass p-6 rounded-[2rem] border border-white/5 relative z-10">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-white/5">
          <div className="bg-gradient-to-tr from-accent-cyan to-accent-purple p-2.5 rounded-xl text-slate-950">
            <IoCarSport className="text-xl" />
          </div>
          <div>
            <h2 className="font-display font-black text-lg tracking-tight bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent uppercase">
              Car Rental System
            </h2>
            <span className="text-[9px] font-mono tracking-widest text-slate-500 font-bold block uppercase mt-0.5">
              Premium Vehicles
            </span>
          </div>
        </div>

        {/* Filter - Location */}
        <div className="flex flex-col gap-2 relative">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 select-none">
            <span>Location</span>
            <span className="text-[10px] text-purple-400">▼</span>
          </div>
          <div className="relative">
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white appearance-none outline-none focus:border-purple-500/50 cursor-pointer"
            >
              <option value="Mumbai" className="bg-slate-950 text-white">Mumbai</option>
              <option value="Bangalore" className="bg-slate-950 text-white">Bangalore</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</div>
          </div>
        </div>

        {/* Filter - Car Type Checkboxes */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
            <span>Car Type</span>
            <button 
              onClick={() => setSelectedTypes([])} 
              title="Clear type selection"
              className="text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              <IoClose className="text-sm" />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {vehicleTypes.map((type) => {
              const isChecked = selectedTypes.includes(type);
              return (
                <label key={type} className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-slate-300 hover:text-white select-none">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleTypeChange(type)}
                    className="hidden"
                  />
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    isChecked 
                      ? 'bg-purple-500 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' 
                      : 'border-white/10 bg-slate-900/40 hover:border-white/20'
                  }`}>
                    {isChecked && <span className="text-xs">✓</span>}
                  </div>
                  <span>{type}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Filter - Price Range Slider */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
            <span>Price Range</span>
            <IoOptionsOutline className="text-slate-500" />
          </div>
          <div className="flex flex-col gap-2">
            <input 
              type="range" 
              min={5000} 
              max={6000} 
              step={50} 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))} 
              className="w-full h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs font-mono text-slate-400 mt-2 select-none">
              <span>Rs 5,000</span>
              <span>-</span>
              <span>Rs {maxPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Filter - Brand Dropdown */}
        <div className="flex flex-col gap-2 relative">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 select-none">
            <span>Brand</span>
            <span className="text-[10px] text-purple-400">ⓘ</span>
          </div>
          <div className="relative">
            <select 
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white appearance-none outline-none focus:border-purple-500/50 cursor-pointer"
            >
              {brandsList.map((brand) => (
                <option key={brand} value={brand} className="bg-slate-950 text-white">
                  {brand}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</div>
          </div>
        </div>

      </aside>

      {/* ================= RIGHT MAIN CONTENT AREA ================= */}
      <div className="flex-grow flex flex-col gap-8 relative z-10 w-full">
        
        {/* Top Search Row */}
        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
          {/* Search Input Box */}
          <div className="relative w-full flex-grow">
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-slate-900/40 border border-white/10 rounded-full pl-12 pr-4 py-3 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 outline-none transition-all duration-300 text-white placeholder-slate-500 text-sm"
            />
          </div>
        </div>

        {/* Database Status Alert */}
        <div className="w-full">
          {isMock ? (
            <div className="inline-flex items-center gap-2 bg-yellow-500/5 border border-yellow-500/10 px-4 py-2.5 rounded-xl text-xs text-yellow-400 select-none">
              <IoCloudOfflineOutline className="text-sm animate-pulse" />
              <span>Offline sandbox mock data active.</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-green-500/5 border border-green-500/10 px-4 py-2.5 rounded-xl text-xs text-green-400 select-none">
              <IoCloudDoneOutline className="text-sm animate-bounce" />
              <span>Supabase cloud database synced.</span>
            </div>
          )}
        </div>

        {/* Results Counter / Reset triggers */}
        {(searchQuery || selectedTypes.length > 0 || maxPrice < 6000 || selectedBrand !== 'All' || selectedLocation !== 'Mumbai') && (
          <div className="flex justify-between items-center bg-purple-500/5 border border-purple-500/10 p-3.5 rounded-xl text-xs select-none">
            <span className="text-slate-400">
              Active filters displaying <strong className="text-white">{filteredAndSortedCars.length}</strong> vehicles.
            </span>
            <button
              onClick={resetFilters}
              className="text-purple-400 font-bold hover:underline transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Inventory Grid Section */}
        <div>
          {loading ? (
            /* Premium Shimmer Skeleton Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((skel) => (
                <div key={skel} className="card-glass rounded-3xl overflow-hidden flex flex-col h-full p-6 gap-6">
                  <div className="h-52 -mx-6 -mt-6 rounded-b-none bg-white/5 border-b border-white/5 shimmer-placeholder"></div>
                  <div className="flex flex-col gap-6 flex-grow justify-between">
                    <div className="flex flex-col gap-5">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-2.5 w-full">
                          <div className="h-3.5 w-16 rounded-md bg-white/5 shimmer-placeholder"></div>
                          <div className="h-6 w-3/4 rounded-md bg-white/5 shimmer-placeholder"></div>
                        </div>
                        <div className="h-6 w-16 rounded-md bg-white/5 shimmer-placeholder shrink-0"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4 my-1">
                        <div className="h-8 rounded-xl bg-white/5 shimmer-placeholder"></div>
                        <div className="h-8 rounded-xl bg-white/5 shimmer-placeholder"></div>
                      </div>
                    </div>
                    <div className="h-12 w-full rounded-xl bg-white/5 shimmer-placeholder mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredAndSortedCars.length > 0 ? (
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in"
                >
                  {filteredAndSortedCars.map((car) => (
                    <CarCard key={car.id} car={car} onBook={handleBook} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20 card-glass rounded-3xl border border-white/5"
                >
                  <IoFunnelOutline className="text-7xl text-slate-500/20 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-2xl font-bold mb-2">No Vehicles Found</h3>
                  <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                    Try clearing search characters or resetting filters to view the fleet list.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 rounded-full bg-purple-500/10 border border-purple-500/30 text-white font-bold hover:bg-purple-500/20 transition-all font-sans cursor-pointer shadow-md"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

      </div>

      {/* Interactive Booking Modal Layer */}
      <BookingModal 
        car={selectedCar} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
