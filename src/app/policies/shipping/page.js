import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 pt-36 pb-24 space-y-8 text-left">
        <h1 className="font-serif text-3xl font-light tracking-wide text-center">Shipping & Tailoring</h1>
        <div className="w-16 h-[1px] bg-champagne-gold mx-auto mb-10" />
        <div className="text-xs md:text-sm text-secondary-text leading-relaxed space-y-4 font-light">
          <p>
            All Abaya by Tabassum garments are handcrafted to order in our Dubai Atelier. Custom height measurements are confirmed before shipping.
          </p>
          <p>
            <strong>UAE Delivery:</strong> Completed within 2-3 business days. Complementary shipping is provided.
          </p>
          <p>
            <strong>GCC & Worldwide Express:</strong> Completed within 5-7 business days via DHL Express. Shipping rates are calculated at checkout.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
