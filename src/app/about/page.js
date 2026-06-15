import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-36 pb-24 text-center space-y-12">
        <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary-gold block">
          Our Heritage
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide">
          The Story of Abaya By Tabassum
        </h1>
        <div className="w-16 h-[1px] bg-champagne-gold mx-auto" />
        
        <div className="text-xs md:text-sm text-secondary-text leading-relaxed space-y-6 text-left max-w-2xl mx-auto font-light">
          <p>
            Established in the heart of Dubai, Abaya By Tabassum represents the pinnacle of premium modest luxury. We believe that modest attire should speak of dignity, premium quality, and modern sophistication.
          </p>
          <p>
            Our founder, Tabassum, personally oversees the sourcing of all fabrics, selecting only the finest Japanese crepes, premium silk satins, and French Chantilly laces. Every fold, cuff, and lapel is designed to flow with absolute natural grace.
          </p>
          <p>
            Our Jumeirah Atelier crafts custom commissions for private clients across the Gulf and globally, maintaining an unwavering commitment to detailed artisanal finish.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
