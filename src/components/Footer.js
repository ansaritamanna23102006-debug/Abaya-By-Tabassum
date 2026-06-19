"use client";

import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Facebook, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-bg-secondary text-primary-text pt-20 pb-10 border-t border-primary-gold/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Column 1: Brand Story & Logo */}
        <div className="flex flex-col space-y-6">
          <div className="flex justify-start">
            <Logo light={true} className="items-start" />
          </div>
          <p className="text-xs text-secondary-text leading-relaxed font-light">
            Timeless modesty crafted with the finest luxury fabrics and expert craftsmanship. Designed to bring grace, comfort, and distinction to the modern woman.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a
              href="https://www.instagram.com/abaya_by_tabassum03/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-primary-gold/20 rounded-full hover:bg-primary-gold hover:text-bg-deep transition-all duration-300 cursor-pointer"
              aria-label="Instagram Profile"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="p-2 border border-primary-gold/20 rounded-full hover:bg-primary-gold hover:text-bg-deep transition-all duration-300 cursor-pointer"
              aria-label="Facebook Page"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="p-2 border border-primary-gold/20 rounded-full hover:bg-primary-gold hover:text-bg-deep transition-all duration-300 cursor-pointer"
              aria-label="Pinterest Profile"
            >
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="font-serif text-sm font-semibold tracking-[0.2em] text-primary-gold uppercase mb-6">
            Collections
          </h3>
          <ul className="space-y-3 text-xs text-secondary-text font-light">
            <li>
              <Link href="#collections" className="hover:text-primary-gold transition-colors cursor-pointer">Everyday Abayas</Link>
            </li>
            <li>
              <Link href="#collections" className="hover:text-primary-gold transition-colors cursor-pointer">Premium Satins & Silks</Link>
            </li>
            <li>
              <Link href="#collections" className="hover:text-primary-gold transition-colors cursor-pointer">Occasion & Occurwear</Link>
            </li>
            <li>
              <Link href="#collections" className="hover:text-primary-gold transition-colors cursor-pointer">New Season Arrivals</Link>
            </li>
            <li>
              <Link href="#collections" className="hover:text-primary-gold transition-colors cursor-pointer">Signature Sheila Sets</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Information */}
        <div>
          <h3 className="font-serif text-sm font-semibold tracking-[0.2em] text-primary-gold uppercase mb-6">
            Bespoke Service
          </h3>
          <ul className="space-y-4 text-xs text-secondary-text font-light">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-primary-gold flex-shrink-0 mt-0.5" />
              <span>Jumeirah Fashion District, Villa 14, Dubai, UAE</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary-gold flex-shrink-0" />
              <span>+91 91676 00320</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary-gold flex-shrink-0" />
              <span>abayabytabassum03@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div id="contact">
          <h3 className="font-serif text-sm font-semibold tracking-[0.2em] text-primary-gold uppercase mb-6">
            The Atelier Newsletter
          </h3>
          <p className="text-xs text-secondary-text mb-4 leading-relaxed font-light">
            Subscribe to receive private previews, custom bespoke sizing events, and limited collections releases.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
            <div className="relative border-b border-primary-gold/30 pb-2">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="bg-transparent w-full text-xs focus:outline-none placeholder-primary-text/30 text-primary-text tracking-widest uppercase"
                required
              />
            </div>
            <button className="w-full py-2 bg-primary-gold text-bg-deep text-xs uppercase tracking-widest font-semibold border border-primary-gold hover:bg-transparent hover:text-primary-gold transition-all duration-300 cursor-pointer">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Sub-Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-border-custom flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-muted-text uppercase tracking-widest font-light">
        <p>© 2026 Abaya By Tabassum. All Rights Reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary-gold transition-colors cursor-pointer">Privacy Policy</a>
          <a href="#" className="hover:text-primary-gold transition-colors cursor-pointer">Terms of Service</a>
          <a href="#" className="hover:text-primary-gold transition-colors cursor-pointer">Size Guide</a>
        </div>
      </div>
    </footer>
  );
}
