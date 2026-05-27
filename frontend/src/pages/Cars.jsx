import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoSearchOutline, 
  IoCarSportOutline, 
  IoFilterOutline, 
  IoFunnelOutline,
  IoSwapVerticalOutline,
  IoCloudOfflineOutline,
  IoCloudDoneOutline
} from 'react-icons/io5';
import { useCars } from '../hooks/useCars';
import CarCard from '../components/cars/CarCard';

export default function Cars() {
  // Load dynamic data from custom Supabase hook
  const { cars, loading, isMock } = useCars();

  // Local state for search, filters, and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [sortBy, setSortBy] = useState('price-asc');

  // Filter Categories Lists
  const vehicleTypes = ['All', 'Electric', 'Sports', 'SUV'];
  const statusTypes = [
    { label: 'All Statuses', value: 'All' },
    { label: 'Available Only', value: 'available' },
    { label: 'Rented', value: 'rented' },
    { label: 'Maintenance', value: 'maintenance' },
  ];
  const fuelTypes = ['All', 'Electric', 'Gasoline', 'Hybrid'];

  // Advanced Filtering and Sorting Engine
  const filteredAndSortedCars = useMemo(() => {
    return cars.filter((car) => {
      // 1. Search Query Match
      const matchesSearch = 
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.type.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Category Type Filter
      const matchesType = selectedType === 'All' || car.type === selectedType;

      // 3. Status Badge Filter
      const matchesStatus = selectedStatus === 'All' || car.status === selectedStatus;

      // 4. Fuel Type Filter
      const matchesFuel = selectedFuel === 'All' || car.fuelType === selectedFuel;

      return matchesSearch && matchesType && matchesStatus && matchesFuel;
    }).sort((a, b) => {
      // Sorting Cases
      if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
      if (sortBy === 'name-asc') return `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`);
      return 0;
    });
  }, [cars, searchQuery, selectedType, selectedStatus, selectedFuel, sortBy]);

  // Reset helper
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedStatus('All');
    setSelectedFuel('All');
    setSortBy('price-asc');
  };

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto min-h-screen bg-slate-950 text-white relative">
      {/* Decorative Glow */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header Info */}
      <div className="text-center max-w-3xl mx-auto mb-12 relative">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
          <IoCarSportOutline className="text-sm" />
          <span>Active Premium Catalog</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight font-display">
          Command Your Journey
        </h1>
        <p className="text-text-muted text-lg leading-relaxed mb-6">
          Select from our curated list of engineering marvels. Filter by specification type, availability, or propulsion method instantly.
        </p>

        {/* Supabase Connection Status Bar */}
        <div className="inline-flex items-center justify-center">
          {isMock ? (
            <div className="inline-flex items-center gap-2 bg-yellow-500/5 border border-yellow-500/10 px-4 py-2 rounded-xl text-xs text-yellow-400">
              <IoCloudOfflineOutline className="text-sm animate-pulse" />
              <span>Offline Demo Mode active. Fallback mock database is loaded.</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-green-500/5 border border-green-500/10 px-4 py-2 rounded-xl text-xs text-green-400">
              <IoCloudDoneOutline className="text-sm animate-bounce" />
              <span>Live Database Connected. Syncing car entries via Supabase.</span>
            </div>
          )}
        </div>
      </div>

      {/* Search & Filtration Panels */}
      <div className="card-glass p-8 rounded-[2rem] border border-white/5 mb-16 relative z-10 flex flex-col gap-6">
        
        {/* Row 1: Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
          <div className="relative w-full flex-1">
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cars by make, model, category..."
              className="w-full bg-slate-950/60 border border-white/5 rounded-xl pl-12 pr-4 py-3.5 focus:border-blue-500 outline-none transition-all duration-300 text-white placeholder-text-muted/65 text-sm"
            />
          </div>

          <div className="relative w-full md:w-64">
            <IoSwapVerticalOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-lg pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-950/60 border border-white/5 rounded-xl pl-12 pr-4 py-3.5 focus:border-blue-500 outline-none transition-all duration-300 text-white appearance-none cursor-pointer text-sm"
            >
              <option value="price-asc" className="bg-slate-900">Price: Low to High</option>
              <option value="price-desc" className="bg-slate-900">Price: High to Low</option>
              <option value="name-asc" className="bg-slate-900">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        <hr className="border-white/5" />

        {/* Row 2: Categorization Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category Type Filter */}
          <div>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-3">Vehicle Class</span>
            <div className="flex flex-wrap gap-2">
              {vehicleTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`text-xs font-semibold px-4 py-2 rounded-lg border transition-all duration-300 ${
                    selectedType === type
                      ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                      : 'border-white/5 hover:border-white/10 text-text-muted hover:text-white bg-slate-900/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Fuel Type Filter */}
          <div>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-3">Propulsion System</span>
            <div className="flex flex-wrap gap-2">
              {fuelTypes.map((fuel) => (
                <button
                  key={fuel}
                  onClick={() => setSelectedFuel(fuel)}
                  className={`text-xs font-semibold px-4 py-2 rounded-lg border transition-all duration-300 ${
                    selectedFuel === fuel
                      ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                      : 'border-white/5 hover:border-white/10 text-text-muted hover:text-white bg-slate-900/20'
                  }`}
                >
                  {fuel}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Status Filter */}
          <div>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-3">Fleet Status</span>
            <div className="flex flex-wrap gap-2">
              {statusTypes.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className={`text-xs font-semibold px-4 py-2 rounded-lg border transition-all duration-300 ${
                    selectedStatus === status.value
                      ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                      : 'border-white/5 hover:border-white/10 text-text-muted hover:text-white bg-slate-900/20'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters Summary / Reset */}
        {(searchQuery || selectedType !== 'All' || selectedStatus !== 'All' || selectedFuel !== 'All') && (
          <div className="flex justify-between items-center bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl mt-2 text-xs">
            <span className="text-text-muted">
              Active filters showing <strong className="text-white">{filteredAndSortedCars.length}</strong> vehicles.
            </span>
            <button
              onClick={resetFilters}
              className="text-blue-400 font-bold hover:underline transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ================= INVENTORY GRID ================= */}
      <div className="relative z-10">
        {loading ? (
          /* Premium Shimmer Skeleton Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((skel) => (
              <div key={skel} className="card-glass rounded-3xl h-[420px] overflow-hidden flex flex-col justify-between p-6">
                <div className="h-44 rounded-2xl shimmer-placeholder mb-6"></div>
                <div className="flex-grow flex flex-col gap-4">
                  <div className="h-6 w-3/4 rounded-md shimmer-placeholder"></div>
                  <div className="h-4 w-1/2 rounded-md shimmer-placeholder"></div>
                </div>
                <div className="h-10 w-full rounded-xl shimmer-placeholder mt-6"></div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredAndSortedCars.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredAndSortedCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20 card-glass rounded-3xl border border-white/5"
              >
                <IoFunnelOutline className="text-7xl text-text-muted/20 mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold mb-2">No Vehicles Match Your Query</h3>
                <p className="text-text-muted text-sm mb-6 max-w-md mx-auto">
                  Try loosening your active filters or clear search characters to discover additional options.
                </p>
                <button
                  onClick={resetFilters}
                  className="btn-premium btn-premium-hover px-6 py-2.5 rounded-xl font-bold"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
