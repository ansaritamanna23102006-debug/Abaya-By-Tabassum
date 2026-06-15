"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", msg: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Concierge message sent. We will contact you within 24 hours.");
    setFormData({ name: "", email: "", msg: "" });
  };

  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans">
      <Navbar />
      <main className="max-w-xl mx-auto px-6 pt-36 pb-24 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary-gold block">
            Atelier Booking
          </span>
          <h1 className="font-serif text-3xl font-light tracking-wide">
            Concierge Consultation
          </h1>
          <div className="w-16 h-[1px] bg-champagne-gold mx-auto" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-bg-card p-8 border border-border-custom shadow-xs">
          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-transparent border border-border-custom p-3 text-xs focus:outline-none focus:border-soft-gold text-primary-text"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-transparent border border-border-custom p-3 text-xs focus:outline-none focus:border-soft-gold text-primary-text"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text">
              Atelier Request Notes
            </label>
            <textarea
              required
              rows={4}
              value={formData.msg}
              onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
              placeholder="Sizing queries, fabric alterations, or appointment bookings..."
              className="w-full bg-transparent border border-border-custom p-3 text-xs focus:outline-none focus:border-soft-gold text-primary-text"
            />
          </div>

          <button className="w-full py-3 bg-primary-gold text-bg-deep text-xs uppercase tracking-widest font-bold border border-secondary-gold hover:bg-champagne-gold hover:text-primary-text transition-all">
            Send Inquiry
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
