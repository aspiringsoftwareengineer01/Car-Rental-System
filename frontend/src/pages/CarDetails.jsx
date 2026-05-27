import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { IoArrowBackOutline, IoSpeedometerOutline, IoBuildOutline, IoPeopleOutline } from 'react-icons/io5';

export default function CarDetails() {
  const { id } = useParams();

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto min-h-screen">
      <Link to="/cars" className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors duration-300 mb-8 group">
        <IoArrowBackOutline className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to fleet catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery Panel */}
        <div className="card-glass rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
          <IoSpeedometerOutline className="text-9xl text-text-muted/10 animate-pulse" />
        </div>

        {/* Content details */}
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold w-max mb-6">
            PREMIUM SPECIAL
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Vehicle Details</h1>
          <p className="text-text-muted text-lg mb-8">
            Experience unparalleled performance, safety features, and aerodynamic luxury. Book custom test drives or long-term rentals instantly.
          </p>

          {/* Key Specs */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="card-glass p-4 rounded-xl text-center">
              <IoSpeedometerOutline className="text-2xl text-accent-cyan mx-auto mb-2" />
              <div className="text-sm text-text-muted">Acceleration</div>
              <div className="font-bold">0-60 in 3.2s</div>
            </div>
            <div className="card-glass p-4 rounded-xl text-center">
              <IoBuildOutline className="text-2xl text-accent-purple mx-auto mb-2" />
              <div className="text-sm text-text-muted">Horsepower</div>
              <div className="font-bold">670 hp</div>
            </div>
            <div className="card-glass p-4 rounded-xl text-center">
              <IoPeopleOutline className="text-2xl text-accent-cyan mx-auto mb-2" />
              <div className="text-sm text-text-muted">Seats</div>
              <div className="font-bold">5 Seats</div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border-light pt-8">
            <div>
              <div className="text-text-muted text-sm">Renting Daily Rate</div>
              <div className="text-3xl font-extrabold text-white">$180 <span className="text-sm text-text-muted font-normal">/ day</span></div>
            </div>
            <Link to="/booking" className="btn-premium btn-premium-hover">
              Reserve Car Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
