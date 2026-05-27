import React, { useState } from 'react';
import { IoLockClosedOutline, IoMailOutline, IoLogInOutline, IoPersonAddOutline } from 'react-icons/io5';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full max-w-md card-glass p-8 rounded-2xl mx-auto my-12 relative overflow-hidden">
      {/* Accent gradients */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-purple/10 rounded-full blur-3xl"></div>

      <div className="text-center mb-8 relative">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-text-muted text-sm">
          {isLogin ? 'Log in to manage your active rentals' : 'Sign up to gain access to premium fleets'}
        </p>
      </div>

      <form className="flex flex-col gap-5 relative" onSubmit={(e) => e.preventDefault()}>
        {!isLogin && (
          <div className="relative">
            <IoLogInOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-bg-deep border border-border-light rounded-xl pl-12 pr-4 py-3 outline-none text-white focus:border-accent-cyan transition-colors"
            />
          </div>
        )}

        <div className="relative">
          <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full bg-bg-deep border border-border-light rounded-xl pl-12 pr-4 py-3 outline-none text-white focus:border-accent-cyan transition-colors"
          />
        </div>

        <div className="relative">
          <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-bg-deep border border-border-light rounded-xl pl-12 pr-4 py-3 outline-none text-white focus:border-accent-cyan transition-colors"
          />
        </div>

        <button className="btn-premium btn-premium-hover mt-2 flex items-center justify-center gap-2">
          {isLogin ? <IoLogInOutline className="text-xl" /> : <IoPersonAddOutline className="text-xl" />}
          <span>{isLogin ? 'Log In' : 'Register Now'}</span>
        </button>
      </form>

      <div className="text-center mt-6 text-sm text-text-muted relative">
        <span>{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-accent-cyan font-bold hover:underline bg-transparent border-none cursor-pointer"
        >
          {isLogin ? 'Sign Up' : 'Log In'}
        </button>
      </div>
    </div>
  );
}
