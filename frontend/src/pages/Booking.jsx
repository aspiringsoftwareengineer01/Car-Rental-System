import React from 'react';
import { IoCalendarOutline, IoCardOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

export default function Booking() {
  return (
    <div className="py-24 px-6 max-w-5xl mx-auto min-h-screen">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Complete Your Reservation</h1>
        <p className="text-text-muted">Fill out your preferred booking dates and credentials to finalize the transaction securely.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form Card */}
        <div className="card-glass p-8 rounded-2xl lg:col-span-2 flex flex-col gap-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <IoCalendarOutline className="text-accent-cyan" />
            <span>Select Rental Interval</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-text-muted text-sm font-semibold mb-2">PICK-UP DATE</label>
              <input type="date" className="w-full bg-bg-deep border border-border-light rounded-xl px-4 py-3 outline-none text-white focus:border-accent-cyan" />
            </div>
            <div>
              <label className="block text-text-muted text-sm font-semibold mb-2">DROP-OFF DATE</label>
              <input type="date" className="w-full bg-bg-deep border border-border-light rounded-xl px-4 py-3 outline-none text-white focus:border-accent-cyan" />
            </div>
          </div>

          <hr className="border-border-light my-2" />

          <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <IoCardOutline className="text-accent-purple" />
            <span>Payment Credentials</span>
          </h2>
          <div className="flex flex-col gap-4">
            <input type="text" placeholder="Cardholder Full Name" className="w-full bg-bg-deep border border-border-light rounded-xl px-4 py-3 outline-none text-white focus:border-accent-cyan" />
            <input type="text" placeholder="Card Number (0000 0000 0000 0000)" className="w-full bg-bg-deep border border-border-light rounded-xl px-4 py-3 outline-none text-white focus:border-accent-cyan" />
          </div>

          <button className="btn-premium btn-premium-hover mt-4 w-full">
            Confirm Rental Securely
          </button>
        </div>

        {/* Details Summary Sidebar */}
        <div className="card-glass p-6 rounded-2xl h-fit">
          <h3 className="text-xl font-bold mb-4">Invoice Summary</h3>
          <ul className="flex flex-col gap-3 text-sm border-b border-border-light pb-4 mb-4">
            <li className="flex justify-between">
              <span className="text-text-muted">Standard daily rate</span>
              <span className="font-bold">$180.00</span>
            </li>
            <li className="flex justify-between">
              <span className="text-text-muted">Rental duration</span>
              <span className="font-bold">3 days</span>
            </li>
            <li className="flex justify-between">
              <span className="text-text-muted">Subtotal fee</span>
              <span className="font-bold">$540.00</span>
            </li>
          </ul>
          <div className="flex justify-between items-center text-lg font-bold mb-6">
            <span>Total Bill</span>
            <span className="text-accent-cyan">$540.00</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted bg-bg-deep/45 p-3 rounded-lg border border-border-light">
            <IoCheckmarkCircleOutline className="text-xl text-green-400 shrink-0" />
            <span>Free cancellation available up to 24 hours prior to departure.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
