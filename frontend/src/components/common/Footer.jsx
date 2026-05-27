import React from 'react';
import { Link } from 'react-router-dom';
import { IoCarSport, IoLogoGithub, IoLogoTwitter, IoLogoDiscord, IoMailOutline } from 'react-icons/io5';

export default function Footer() {
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
              ANTIGRAVITY
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
        <span>© {new Date().getFullYear()} Antigravity Rentals. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
