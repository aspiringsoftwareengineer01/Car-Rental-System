import React, { useState, useMemo } from 'react';
import { 
  IoStatsChartOutline, 
  IoCarSportOutline, 
  IoBookmarkOutline, 
  IoAddOutline, 
  IoTrashOutline, 
  IoCloseOutline, 
  IoCashOutline, 
  IoSpeedometerOutline,
  IoAlertCircleOutline,
  IoSettingsOutline,
  IoWarningOutline,
  IoBuildOutline
} from 'react-icons/io5';
import { useCars } from '../hooks/useCars';
import { useBookings } from '../hooks/useBookings';
import toast from 'react-hot-toast';

export default function Admin() {
  const { cars, loading: carsLoading, addCar, deleteCar } = useCars();
  const { bookings, loading: bookingsLoading, cancelBooking, verifyBooking } = useBookings();

  // Selected administrative view tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'cars' | 'bookings'

  // "Add Car" modal toggle state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Car form validation state
  const [newCarMake, setNewCarMake] = useState('');
  const [newCarModel, setNewCarModel] = useState('');
  const [newCarType, setNewCarType] = useState('Electric');
  const [newCarFuel, setNewCarFuel] = useState('Electric');
  const [newCarSeats, setNewCarSeats] = useState(5);
  const [newCarPrice, setNewCarPrice] = useState(5000);
  const [isSubmittingCar, setIsSubmittingCar] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Computations
  const totalRevenue = useMemo(() => {
    return bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + Number(b.totalPrice), 0);
  }, [bookings]);

  const activeRentedCount = useMemo(() => {
    return bookings.filter(b => b.status === 'confirmed').length;
  }, [bookings]);

  const maintenanceCount = useMemo(() => {
    return cars.filter(c => c.status === 'maintenance').length;
  }, [cars]);

  // Pricing analysis for styled graphical logs
  const typeRevenueData = useMemo(() => {
    const data = { Electric: 0, Sports: 0, SUV: 0, Sedan: 0 };
    bookings
      .filter(b => b.status !== 'cancelled')
      .forEach(b => {
        const car = cars.find(c => c.id === b.carId);
        const type = car?.type || 'Electric';
        if (data[type] !== undefined) {
          data[type] += Number(b.totalPrice);
        } else {
          data['Sedan'] += Number(b.totalPrice);
        }
      });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [bookings, cars]);

  const handleAddCarSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!newCarMake.trim() || !newCarModel.trim()) {
      setValidationError('Please specify both make and model parameters.');
      return;
    }

    if (Number(newCarPrice) < 5000 || Number(newCarPrice) > 50000) {
      setValidationError('Price daily rate must be configured between Rs 5,000 and Rs 50,000.');
      return;
    }

    if (Number(newCarSeats) < 2 || Number(newCarSeats) > 7) {
      setValidationError('Vehicle passenger configuration must be between 2 and 7 seats.');
      return;
    }

    setIsSubmittingCar(true);

    try {
      const result = await addCar({
        make: newCarMake.trim(),
        model: newCarModel.trim(),
        type: newCarType,
        fuelType: newCarFuel,
        seats: Number(newCarSeats),
        pricePerDay: Number(newCarPrice),
        status: 'available'
      });

      if (result.success) {
        toast.success(`Elite ${newCarMake} added successfully! 🏎️`);
        setIsAddModalOpen(false);
        // Reset state
        setNewCarMake('');
        setNewCarModel('');
        setNewCarType('Electric');
        setNewCarFuel('Electric');
        setNewCarSeats(5);
        setNewCarPrice(5000);
      } else {
        setValidationError(result.error || 'Failed to insert car credentials.');
      }
    } catch (err) {
      setValidationError('An unexpected error occurred during database insert.');
    } finally {
      setIsSubmittingCar(false);
    }
  };

  const handleDeleteClick = async (carId, name) => {
    if (window.confirm(`Are you absolutely sure you want to retire ${name} from active fleet catalog?`)) {
      const result = await deleteCar(carId);
      if (result.success) {
        toast.success(`Retired ${name} successfully.`);
      } else {
        toast.error('Failed to retire vehicle.');
      }
    }
  };

  const handleCancelBookingClick = async (bookingId) => {
    if (window.confirm(`Cancel reservation transaction ${bookingId}?`)) {
      const result = await cancelBooking(bookingId);
      if (result.success) {
        toast.success('Reservation cancelled by Admin.');
      } else {
        toast.error('Failed to cancel booking.');
      }
    }
  };

  const handleVerifyBookingClick = async (bookingId) => {
    if (window.confirm(`Verify and approve reservation transaction ${bookingId}?`)) {
      const result = await verifyBooking(bookingId);
      if (result.success) {
        toast.success('Reservation verified by Admin.');
      } else {
        toast.error('Failed to verify booking.');
      }
    }
  };

  const isLoading = carsLoading || bookingsLoading;

  return (
    <div className="min-h-screen bg-bg-deep flex flex-col md:flex-row relative">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 card-glass border-t-0 border-l-0 border-b-0 shrink-0 md:sticky md:top-20 md:h-[calc(100vh-80px)] flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
          <div className="bg-gradient-to-tr from-accent-coral to-accent-purple p-2 rounded-xl text-bg-deep animate-pulse">
            <IoSettingsOutline className="text-xl" />
          </div>
          <div>
            <h4 className="text-base font-black text-white font-display uppercase tracking-wider">Admin Console</h4>
            <span className="text-[10px] text-accent-coral font-bold tracking-widest uppercase">Premium Authority</span>
          </div>
        </div>

        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer w-full text-left ${
              activeTab === 'overview' 
                ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-slate-950 font-black shadow-md shadow-accent-cyan/10' 
                : 'text-text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <IoStatsChartOutline className="text-base" />
            <span>Dashboard Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('cars')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer w-full text-left ${
              activeTab === 'cars' 
                ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-slate-950 font-black shadow-md shadow-accent-cyan/10' 
                : 'text-text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <IoCarSportOutline className="text-base" />
            <span>Fleet Inventory ({cars.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer w-full text-left ${
              activeTab === 'bookings' 
                ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-slate-950 font-black shadow-md shadow-accent-cyan/10' 
                : 'text-text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <IoBookmarkOutline className="text-base" />
            <span>Booking Orders ({bookings.length})</span>
          </button>
        </nav>
      </aside>

      {/* Main Administrative viewport */}
      <main className="flex-grow p-6 md:p-10 z-10 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col gap-6 items-center justify-center py-32">
            <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-accent-cyan animate-spin mb-4"></div>
            <p className="text-text-muted text-sm font-semibold">Synchronizing admin logs...</p>
          </div>
        ) : (
          <div>
            {/* ================= OVERVIEW TAB ================= */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-10">
                <div>
                  <h1 className="text-3xl font-black mb-2 font-display">System Overview</h1>
                  <p className="text-text-muted text-sm">Real-time telemetry and revenue records metrics.</p>
                </div>

                {/* Dashboard Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="card-glass p-6 rounded-2xl border-white/5 bg-slate-900/20 hover:border-accent-cyan/35 hover:shadow-[0_0_15px_rgba(0,242,254,0.05)] transition-all duration-300">
                    <IoCarSportOutline className="text-3xl text-accent-cyan mb-3" />
                    <span className="text-[9px] text-text-muted font-bold block uppercase tracking-wider">Total Active Fleet</span>
                    <strong className="text-2xl font-black text-white font-sans mt-1 block">{cars.length}</strong>
                  </div>
                  <div className="card-glass p-6 rounded-2xl border-white/5 bg-slate-900/20 hover:border-accent-purple/35 hover:shadow-[0_0_15px_rgba(168,85,247,0.05)] transition-all duration-300">
                    <IoBookmarkOutline className="text-3xl text-accent-purple mb-3" />
                    <span className="text-[9px] text-text-muted font-bold block uppercase tracking-wider">Active Rented</span>
                    <strong className="text-2xl font-black text-white font-sans mt-1 block">{activeRentedCount}</strong>
                  </div>
                  <div className="card-glass p-6 rounded-2xl border-white/5 bg-slate-900/20 hover:border-accent-coral/35 hover:shadow-[0_0_15px_rgba(249,115,22,0.05)] transition-all duration-300">
                    <IoBuildOutline className="text-3xl text-accent-coral mb-3" />
                    <span className="text-[9px] text-text-muted font-bold block uppercase tracking-wider">In Maintenance</span>
                    <strong className="text-2xl font-black text-white font-sans mt-1 block">{maintenanceCount}</strong>
                  </div>
                  <div className="card-glass p-6 rounded-2xl border-white/5 bg-slate-900/20 hover:border-green-400/35 hover:shadow-[0_0_15px_rgba(74,222,128,0.05)] transition-all duration-300">
                    <IoCashOutline className="text-3xl text-green-400 mb-3" />
                    <span className="text-[9px] text-text-muted font-bold block uppercase tracking-wider">Gross Income</span>
                    <strong className="text-2xl font-black text-green-400 font-sans mt-1 block">Rs {totalRevenue.toFixed(2)}</strong>
                  </div>
                </div>

                {/* Styled Custom Revenue Graphical Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Revenue by Class */}
                  <div className="card-glass p-6 md:p-8 rounded-[2rem] lg:col-span-2 border-white/5 bg-slate-900/10">
                    <h3 className="text-xl font-bold mb-6 font-display">Revenue Surcharge Analysis</h3>
                    <div className="flex flex-col gap-6">
                      {typeRevenueData.map(({ name, value }) => {
                        const percent = totalRevenue > 0 ? (value / totalRevenue) * 100 : 0;
                        
                        // Dynamic styling colors based on class category
                        let gradientColor = "from-accent-cyan to-blue-500 shadow-accent-cyan/15";
                        if (name === "Sports") gradientColor = "from-accent-coral to-red-500 shadow-accent-coral/15";
                        if (name === "SUV") gradientColor = "from-accent-purple to-pink-500 shadow-accent-purple/15";
                        if (name === "Sedan") gradientColor = "from-blue-400 to-indigo-500 shadow-blue-400/15";

                        return (
                          <div key={name}>
                            <div className="flex justify-between items-center text-xs font-bold mb-2">
                              <span className="text-text-muted">{name} Fleet Class</span>
                              <span className="text-white font-sans">Rs {value.toFixed(2)} ({percent.toFixed(0)}%)</span>
                            </div>
                            <div className="w-full bg-slate-950/60 rounded-full h-3.5 overflow-hidden border border-white/5 p-[2px]">
                              <div 
                                className={`bg-gradient-to-r ${gradientColor} h-full rounded-full shadow-lg transition-all duration-500`}
                                style={{ width: `${percent || 5}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* System Health / Note */}
                  <div className="card-glass p-6 md:p-8 rounded-[2rem] border-white/5 bg-slate-900/10 flex flex-col justify-between gap-6">
                    <div>
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-accent-coral font-display">
                        <IoWarningOutline className="text-xl shrink-0" />
                        <span>System Terminal</span>
                      </h3>
                      <p className="text-text-muted text-xs leading-relaxed">
                        All transaction data layers are secured using End-To-End SSL architecture. Fleet status defaults to available upon deletion. Override overrides active reservation limits.
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-[10px] text-text-muted font-mono leading-relaxed select-none">
                      ROLE_SCOPE: GLOBAL_ADMIN<br/>
                      ENCRYPTION: SH-256 AES<br/>
                      CLIENT_IP: Sandbox localhost
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= INVENTORY TAB ================= */}
            {activeTab === 'cars' && (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-black font-display">Fleet Catalog</h1>
                    <p className="text-text-muted text-sm">Add or retire luxury fleet credentials.</p>
                  </div>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-premium btn-premium-hover px-5 py-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-accent-cyan/15 cursor-pointer w-max"
                  >
                    <IoAddOutline className="text-base" />
                    <span>Deploy Elite Vehicle</span>
                  </button>
                </div>

                {/* Responsive Viewport Grid/Table */}
                <div className="card-glass rounded-[2rem] overflow-hidden border-white/5 bg-slate-900/10">
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 bg-slate-950/45 text-[10px] text-text-muted uppercase font-bold tracking-widest">
                          <th className="px-6 py-4">Vehicle Model</th>
                          <th className="px-6 py-4">Classification</th>
                          <th className="px-6 py-4">Passenger / Fuel</th>
                          <th className="px-6 py-4">Daily Rate</th>
                          <th className="px-6 py-4">Current Status</th>
                          <th className="px-6 py-4 text-center">Admin Controls</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cars.map((car) => (
                          <tr key={car.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <strong className="text-white font-bold block">{car.make}</strong>
                              <span className="text-xs text-text-muted">{car.model}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                {car.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs font-mono text-text-muted">
                              {car.seats} Seats / {car.fuelType}
                            </td>
                            <td className="px-6 py-4 font-bold text-white font-sans">
                              Rs {car.pricePerDay}
                            </td>
                            <td className="px-6 py-4">
                              {car.status === 'available' && (
                                <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                  Available
                                </span>
                              )}
                              {car.status === 'rented' && (
                                <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                  Rented
                                </span>
                              )}
                              {car.status === 'maintenance' && (
                                <span className="inline-flex items-center gap-1 bg-accent-coral/10 border border-accent-coral/20 text-accent-coral px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                  Maintenance
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleDeleteClick(car.id, `${car.make} ${car.model}`)}
                                className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer inline-flex items-center"
                                title="Retire Vehicle"
                              >
                                <IoTrashOutline className="text-lg" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card List View */}
                  <div className="lg:hidden flex flex-col gap-4 p-4">
                    {cars.map((car) => (
                      <div key={car.id} className="bg-slate-950/40 p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-white font-bold text-base block font-display">{car.make}</strong>
                            <span className="text-xs text-text-muted">{car.model}</span>
                          </div>
                          <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider select-none">
                            {car.type}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs border-y border-white/5 py-3 text-text-muted">
                          <div>
                            <span className="block text-[9px] uppercase tracking-wider text-text-muted/70 mb-0.5">Seats & Propulsion</span>
                            <span className="font-semibold text-white font-sans">{car.seats} Seats / {car.fuelType}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] uppercase tracking-wider text-text-muted/70 mb-0.5">Daily Rate</span>
                            <span className="font-semibold text-white font-sans">Rs {car.pricePerDay}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            {car.status === 'available' && (
                              <span className="inline-flex items-center bg-green-500/10 border border-green-500/20 text-green-400 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">Available</span>
                            )}
                            {car.status === 'rented' && (
                              <span className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">Rented</span>
                            )}
                            {car.status === 'maintenance' && (
                              <span className="inline-flex items-center bg-accent-coral/10 border border-accent-coral/20 text-accent-coral px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">Maintenance</span>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteClick(car.id, `${car.make} ${car.model}`)}
                            className="text-red-400 hover:text-red-300 p-2.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                            title="Retire Vehicle"
                          >
                            <IoTrashOutline className="text-sm" />
                            <span>Retire</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= BOOKINGS TAB ================= */}
            {activeTab === 'bookings' && (
              <div className="flex flex-col gap-8">
                <div>
                  <h1 className="text-3xl font-black font-display">Client Reservations</h1>
                  <p className="text-text-muted text-sm">Monitor and override global customer transaction records.</p>
                </div>

                <div className="card-glass rounded-[2rem] overflow-hidden border-white/5 bg-slate-900/10">
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 bg-slate-950/45 text-[10px] text-text-muted uppercase font-bold tracking-widest">
                          <th className="px-6 py-4">Reference Tag</th>
                          <th className="px-6 py-4">Customer Email</th>
                          <th className="px-6 py-4">Selected Class</th>
                          <th className="px-6 py-4">Rent Interval</th>
                          <th className="px-6 py-4">Surcharge</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-center">Override Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => {
                          const car = cars.find(c => c.id === b.carId);
                          const carName = car ? `${car.make} ${car.model}` : 'Premium Fleet Vehicle';
                          return (
                            <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 font-mono text-xs text-white">
                                {b.id}
                              </td>
                              <td className="px-6 py-4 text-xs font-semibold text-text-muted">
                                {b.userEmail}
                              </td>
                              <td className="px-6 py-4">
                                <strong className="text-white text-xs">{carName}</strong>
                              </td>
                              <td className="px-6 py-4 text-xs font-sans text-text-muted">
                                {b.pickupDate} to {b.returnDate}
                              </td>
                              <td className="px-6 py-4 font-bold text-white font-sans">
                                Rs {Number(b.totalPrice).toFixed(2)}
                              </td>
                              <td className="px-6 py-4">
                                {b.status === 'confirmed' ? (
                                  <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    Confirmed
                                  </span>
                                ) : b.status === 'pending' ? (
                                  <span className="inline-flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    Pending
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    Cancelled
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-center">
                                {b.status === 'pending' ? (
                                  <div className="flex gap-2 justify-center">
                                    <button
                                      onClick={() => handleVerifyBookingClick(b.id)}
                                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                                    >
                                      Verify
                                    </button>
                                    <button
                                      onClick={() => handleCancelBookingClick(b.id)}
                                      className="text-xs font-semibold text-red-400 hover:text-red-300 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : b.status === 'confirmed' ? (
                                  <button
                                    onClick={() => handleCancelBookingClick(b.id)}
                                    className="text-xs font-semibold text-red-400 hover:text-red-300 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                                  >
                                    Override Cancel
                                  </button>
                                ) : (
                                  <span className="text-xs text-text-muted font-bold font-mono">N/A</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card List View */}
                  <div className="lg:hidden flex flex-col gap-4 p-4">
                    {bookings.map((b) => {
                      const car = cars.find(c => c.id === b.carId);
                      const carName = car ? `${car.make} ${car.model}` : 'Premium Fleet Vehicle';
                      return (
                        <div key={b.id} className="bg-slate-950/40 p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="font-mono text-[10px] text-text-muted block">REF: {b.id}</span>
                              <span className="text-xs text-white font-semibold truncate block max-w-[200px] mt-1">{b.userEmail}</span>
                            </div>
                            <div>
                              {b.status === 'confirmed' ? (
                                <span className="inline-flex items-center bg-green-500/10 border border-green-500/20 text-green-400 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">Confirmed</span>
                              ) : b.status === 'pending' ? (
                                <span className="inline-flex items-center bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">Pending</span>
                              ) : (
                                <span className="inline-flex items-center bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">Cancelled</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-xs border-y border-white/5 py-3 text-text-muted">
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-text-muted/70 mb-0.5">Vehicle Class</span>
                              <strong className="text-white font-display text-xs truncate block max-w-[120px]">{carName}</strong>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-text-muted/70 mb-0.5">Surcharge</span>
                              <strong className="text-white font-sans">Rs {Number(b.totalPrice).toFixed(2)}</strong>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-[10px] text-text-muted font-mono">{b.pickupDate} to {b.returnDate}</span>
                            {b.status === 'pending' ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleVerifyBookingClick(b.id)}
                                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                                >
                                  Verify
                                </button>
                                <button
                                  onClick={() => handleCancelBookingClick(b.id)}
                                  className="text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : b.status === 'confirmed' ? (
                              <button
                                onClick={() => handleCancelBookingClick(b.id)}
                                className="text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
                              >
                                Override Cancel
                              </button>
                            ) : (
                              <span className="text-xs text-text-muted font-bold font-mono">Cancelled</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= ADD VEHICLE MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          {/* Backdrop Close Click */}
          <div className="absolute inset-0 cursor-default" onClick={() => setIsAddModalOpen(false)} />

          {/* Modal Container */}
          <div className="relative w-full max-w-xl card-glass rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-tr from-accent-cyan to-accent-purple p-2 rounded-xl text-bg-deep">
                  <IoCarSportOutline className="text-xl animate-bounce" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Deploy Fleet Vehicle</h3>
                  <span className="text-xs text-text-muted">Insert High-Performance Credentials</span>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-2xl text-text-muted hover:text-white transition-all cursor-pointer p-1 hover:bg-white/5 rounded-full"
              >
                <IoCloseOutline />
              </button>
            </div>

            {/* Form Scroll Body */}
            <form onSubmit={handleAddCarSubmit} className="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
              {validationError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2 animate-pulse">
                  <IoAlertCircleOutline className="text-lg shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Make & Model row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2">Manufacturer Brand</label>
                  <input 
                    type="text"
                    value={newCarMake}
                    onChange={(e) => setNewCarMake(e.target.value)}
                    placeholder="e.g. Lamborghini"
                    disabled={isSubmittingCar}
                    required
                    className="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-3 outline-none text-white focus:border-accent-cyan transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2">Model Designation</label>
                  <input 
                    type="text"
                    value={newCarModel}
                    onChange={(e) => setNewCarModel(e.target.value)}
                    placeholder="e.g. Revuelto Plaid"
                    disabled={isSubmittingCar}
                    required
                    className="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-3 outline-none text-white focus:border-accent-cyan transition-all text-sm"
                  />
                </div>
              </div>

              {/* Type & Fuel Select */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2">Vehicle Class Type</label>
                  <select 
                    value={newCarType}
                    onChange={(e) => setNewCarType(e.target.value)}
                    disabled={isSubmittingCar}
                    className="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-3 outline-none text-white focus:border-accent-cyan transition-all text-sm"
                  >
                    <option value="Electric" className="bg-slate-950">Electric</option>
                    <option value="Sports" className="bg-slate-950">Sports</option>
                    <option value="SUV" className="bg-slate-950">SUV</option>
                    <option value="Sedan" className="bg-slate-950">Sedan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2">Propulsion Setup</label>
                  <select 
                    value={newCarFuel}
                    onChange={(e) => setNewCarFuel(e.target.value)}
                    disabled={isSubmittingCar}
                    className="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-3 outline-none text-white focus:border-accent-cyan transition-all text-sm"
                  >
                    <option value="Electric" className="bg-slate-950">Electric</option>
                    <option value="Gasoline" className="bg-slate-950">Gasoline</option>
                    <option value="Hybrid" className="bg-slate-950">Hybrid</option>
                  </select>
                </div>
              </div>

              {/* Seats & Price row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2">Passenger Capacity</label>
                  <input 
                    type="number"
                    value={newCarSeats}
                    onChange={(e) => setNewCarSeats(e.target.value)}
                    min={2}
                    max={7}
                    disabled={isSubmittingCar}
                    required
                    className="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-3 outline-none text-white focus:border-accent-cyan transition-all text-sm font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2">Daily Price Surcharge (Rs)</label>
                  <input 
                    type="number"
                    value={newCarPrice}
                    onChange={(e) => setNewCarPrice(e.target.value)}
                    min={5000}
                    max={50000}
                    disabled={isSubmittingCar}
                    required
                    className="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-3 outline-none text-white focus:border-accent-cyan transition-all text-sm font-sans"
                  />
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mt-2">
                <button
                  type="submit"
                  disabled={isSubmittingCar}
                  className="w-full btn-premium btn-premium-hover py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-accent-cyan/15 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmittingCar ? (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></div>
                  ) : (
                    <>
                      <IoAddOutline className="text-base" />
                      <span>Deploy to Live Catalog</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
