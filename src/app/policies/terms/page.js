import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 pt-36 pb-24 space-y-8 text-left">
        <h1 className="font-serif text-3xl font-light tracking-wide text-center">Terms of Service</h1>
        <div className="w-16 h-[1px] bg-champagne-gold mx-auto mb-10" />
        <div className="text-xs md:text-sm text-secondary-text leading-relaxed space-y-4 font-light">
          <p>
            By placing an order with Abaya by Tabassum, you acknowledge that all custom sizes are finalized on client specifications. Alteration requests are processed within Jumeirah Atelier conditions.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
