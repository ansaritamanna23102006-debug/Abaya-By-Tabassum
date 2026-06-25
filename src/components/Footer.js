"use client";

import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-bg-secondary text-primary-text pt-20 pb-10 border-t border-primary-gold/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Column 1: Brand Story & Logo */}
        <div className="flex flex-col space-y-6">
          <div className="flex justify-start">
            <Logo light={true} className="items-start" />
          </div>
          <p className="text-xs text-secondary-text leading-relaxed font-normal">
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
              href="https://wa.me/919167600320"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-primary-gold/20 rounded-full hover:bg-primary-gold hover:text-bg-deep transition-all duration-300 cursor-pointer"
              aria-label="WhatsApp Contact"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.637-1.03-5.114-2.905-6.99C16.554 1.875 14.09 .843 11.473.843c-5.437 0-9.863 4.42-9.866 9.865-.001 2.029.535 4.019 1.554 5.792L2.128 21.8l5.519-1.446z" />
                <path d="M17.437 14.372c-.3-.149-1.77-.874-2.043-.974-.274-.1-.473-.149-.672.15-.2.298-.77.974-.944 1.173-.174.198-.348.223-.648.075-.3-.15-1.263-.465-2.403-1.482-.888-.793-1.488-1.77-1.662-2.069-.174-.298-.018-.46.131-.607.135-.133.3-.348.45-.522.15-.174.2-.298.3-.497.1-.2.05-.373-.025-.522-.075-.149-.672-1.62-.922-2.224-.244-.588-.49-.508-.672-.518-.174-.01-.373-.012-.573-.012-.2 0-.523.075-.797.373-.274.298-1.045 1.02-1.045 2.487 0 1.467 1.07 2.885 1.22 3.083.15.199 2.102 3.21 5.093 4.5 1.706.737 2.656.924 3.593.774.937-.15 1.77-.72 2.019-1.393.25-.672.25-1.243.175-1.393-.075-.15-.274-.249-.573-.398z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="font-serif text-sm font-semibold tracking-[0.2em] text-primary-gold uppercase mb-6">
            Collections
          </h3>
          <ul className="space-y-3 text-xs text-secondary-text font-normal">
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
          <ul className="space-y-4 text-xs text-secondary-text font-normal">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-primary-gold flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">House no 506, Sangam Society, Near Housing Board Colony, Wollen Chawl, Ambernath West, 421501</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary-gold flex-shrink-0" />
              <a
                href="https://wa.me/919167600320"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-gold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>+91 91676 00320</span>
                <span className="text-[10px] text-muted-text font-normal">(WhatsApp)</span>
              </a>
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
          <p className="text-xs text-secondary-text mb-4 leading-relaxed font-normal">
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
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-border-custom flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-muted-text uppercase tracking-widest font-normal">
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
