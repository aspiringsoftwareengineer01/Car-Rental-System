import React from 'react';
import { Link } from 'react-router-dom';
import { IoCarSport, IoLogoGithub, IoLogoTwitter, IoLogoDiscord, IoMailOutline } from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { isAdmin } = useAuth();

  if (isAdmin) {
    return (
      <footer className="w-full bg-bg-surface border-t border-border-light pt-16 pb-10 px-6 relative z-10">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo and About */}
          <div className="flex flex-col gap-5">
            <Link to="/admin" className="flex items-center gap-2 group w-max">
              <div className="bg-gradient-to-tr from-accent-cyan to-accent-purple p-2 rounded-xl text-bg-deep group-hover:scale-105 transition-transform duration-300">
                <IoCarSport className="text-2xl" />
              </div>
              <span className="font-display font-black text-2xl tracking-tight text-white">
                Admin Console
              </span>
            </Link>
            <p className="text-text-muted text-xs leading-relaxed">
              Administrative Control Terminal. Oversee elite fleets, active reservation logs, and client billing telemetry.
            </p>
          </div>

          {/* Quick Admin Actions */}
          <div>
            <h4 className="font-display font-bold text-white mb-5 uppercase text-[10px] tracking-widest text-accent-cyan">Console Sections</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-text-muted">
              <li><Link to="/admin" className="hover:text-accent-cyan transition-colors">Dashboard Overview</Link></li>
              <li><Link to="/admin" className="hover:text-accent-cyan transition-colors">Fleet Inventory</Link></li>
              <li><Link to="/admin" className="hover:text-accent-cyan transition-colors">Booking Orders</Link></li>
              <li><Link to="/dashboard" className="hover:text-accent-cyan transition-colors">Admin Profile</Link></li>
            </ul>
          </div>

          {/* Security & Scope */}
          <div>
            <h4 className="font-display font-bold text-white mb-5 uppercase text-[10px] tracking-widest text-accent-purple">Security Protocols</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-text-muted">
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> <span>SSL E2EE Secured</span></li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> <span>Scope: Global Admin</span></li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> <span>Auth: Supabase JWT</span></li>
            </ul>
          </div>

          {/* System Terminal Specs */}
          <div>
            <h4 className="font-display font-bold text-white mb-5 uppercase text-[10px] tracking-widest text-accent-coral">System Health</h4>
            <div className="card-glass p-4 rounded-xl border-white/5 bg-slate-950/45 text-[10px] font-mono text-text-muted leading-relaxed flex flex-col gap-1.5">
              <div className="flex justify-between"><span>Status:</span> <span className="text-green-400 font-bold">Operational</span></div>
              <div className="flex justify-between"><span>API Version:</span> <span className="text-white">v1.2.0</span></div>
              <div className="flex justify-between"><span>Uptime:</span> <span className="text-white">99.99%</span></div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl border-t border-border-light pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-text-muted">
          <span>© {new Date().getFullYear()} Admin Console • Car Rental System. All rights reserved.</span>
          <div className="flex gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Security Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Audit Logs</span>
            <span className="hover:text-white transition-colors cursor-pointer">Sys Terminal</span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-bg-surface border-t border-border-light pt-20 pb-10 px-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Logo and About */}
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-2 group w-max">
            <div className="bg-gradient-to-tr from-accent-cyan to-accent-purple p-2 rounded-xl text-bg-deep group-hover:scale-105 transition-transform duration-300">
              <IoCarSport className="text-2xl" />
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-white">
              Car Rental System
            </span>
          </Link>
          <p className="text-text-muted text-sm leading-relaxed">
            Experience premium mobility with our curated collections of sports cars, luxury SUVs, and long-range electric fleets.
          </p>
          <div className="flex items-center gap-4 text-xl text-text-muted">
            <a href="https://github.com" className="hover:text-accent-cyan transition-colors"><IoLogoGithub /></a>
            <a href="https://twitter.com" className="hover:text-accent-cyan transition-colors"><IoLogoTwitter /></a>
            <a href="https://discord.com" className="hover:text-accent-cyan transition-colors"><IoLogoDiscord /></a>
          </div>
        </div>

        {/* Fleet links */}
        <div>
          <h4 className="font-display font-bold text-white mb-6 uppercase text-sm tracking-wider">Fleet Categories</h4>
          <ul className="flex flex-col gap-3 text-sm text-text-muted">
            <li><Link to="/cars" className="hover:text-accent-cyan transition-colors">Electric Luxury</Link></li>
            <li><Link to="/cars" className="hover:text-accent-cyan transition-colors">Hypercars & Sports</Link></li>
            <li><Link to="/cars" className="hover:text-accent-cyan transition-colors">Premium SUVs</Link></li>
            <li><Link to="/cars" className="hover:text-accent-cyan transition-colors">Business Sedans</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="font-display font-bold text-white mb-6 uppercase text-sm tracking-wider">Help & Support</h4>
          <ul className="flex flex-col gap-3 text-sm text-text-muted">
            <li><Link to="/booking" className="hover:text-accent-cyan transition-colors">Booking Guidelines</Link></li>
            <li><Link to="/" className="hover:text-accent-cyan transition-colors">Privacy Terms</Link></li>
            <li><Link to="/" className="hover:text-accent-cyan transition-colors">FAQ & Solutions</Link></li>
            <li><Link to="/" className="hover:text-accent-cyan transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Newsletter Box */}
        <div>
          <h4 className="font-display font-bold text-white mb-6 uppercase text-sm tracking-wider">Newsletter</h4>
          <p className="text-text-muted text-sm mb-4">Subscribe to receive exclusive rates and seasonal updates.</p>
          <div className="relative">
            <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
            <input
              type="email"
              placeholder="Your email address"
              className="w-full bg-bg-deep border border-border-light rounded-xl pl-12 pr-4 py-3 outline-none text-white focus:border-accent-cyan text-sm"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-border-light pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted">
        <span>© {new Date().getFullYear()} Car Rental System. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
