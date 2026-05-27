import React from 'react';
import { IoPersonOutline, IoReceiptOutline, IoBookmarkOutline } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  // Get user display name or email prefix
  const getDisplayName = () => {
    if (!user) return 'Premium Member';
    if (user.user_metadata?.name) return user.user_metadata.name;
    if (user.email) return user.email.split('@')[0];
    return 'Premium Member';
  };

  // Get user registration date or simulated date
  const getJoinedDate = () => {
    if (!user) return 'May 2026';
    if (user.created_at) {
      const date = new Date(user.created_at);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return 'May 2026';
  };

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Profile summary banner */}
      <div className="card-glass p-8 rounded-2xl mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-accent-cyan to-accent-purple text-slate-950 rounded-full flex items-center justify-center font-bold text-2xl uppercase shadow-lg shadow-accent-cyan/15">
            {getDisplayName().slice(0, 2)}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold mb-1">{getDisplayName()}</h1>
            <p className="text-text-muted">Customer since {getJoinedDate()} • Premium Elite Tier</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="card-glass px-6 py-3 rounded-xl text-center">
            <div className="text-xs text-text-muted uppercase">Active Bookings</div>
            <div className="text-2xl font-bold text-accent-cyan">1</div>
          </div>
          <div className="card-glass px-6 py-3 rounded-xl text-center">
            <div className="text-xs text-text-muted uppercase">Total Trips</div>
            <div className="text-2xl font-bold text-accent-purple">12</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Pane */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="card-glass p-6 rounded-2xl">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
              <IoBookmarkOutline className="text-accent-cyan" />
              <span>Current Reservation Details</span>
            </h2>

            {/* Simulated Booking Card */}
            <div className="bg-bg-deep/45 p-6 rounded-xl border border-border-light flex flex-col md:flex-row justify-between gap-6">
              <div>
                <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full font-bold">CONFIRMED</span>
                <h3 className="text-xl font-bold mt-3 mb-1">Tesla Model S</h3>
                <p className="text-text-muted text-sm mb-4">Pick-up Location: Headquarters Terminal A</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-muted block text-xs">START DATE</span>
                    <span className="font-semibold">June 01, 2026</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-xs">END DATE</span>
                    <span className="font-semibold">June 05, 2026</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
                <span className="text-2xl font-black text-white">$480.00</span>
                <button className="text-sm border border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors">
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice logs sidebar */}
        <div className="card-glass p-6 rounded-2xl h-fit">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <IoReceiptOutline className="text-accent-purple" />
            <span>Recent Invoices</span>
          </h2>
          <div className="flex flex-col gap-3">
            {[1, 2].map((inv) => (
              <div key={inv} className="flex justify-between items-center p-3 rounded-lg bg-bg-deep/30 border border-border-light text-sm hover:border-accent-cyan/35 transition-colors">
                <div>
                  <div className="font-bold">Tesla Model S</div>
                  <div className="text-xs text-text-muted">Invoice INV-2026-0{inv}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-accent-cyan">$360.00</div>
                  <span className="text-[10px] text-green-400">Paid</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
