"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    { q: "How do I specify custom height adjustments?", a: "After ordering, our Atelier concierge will reach out to you via WhatsApp or Email to verify your custom length requests before cutting fabric. This service is complimentary." },
    { q: "What is the delivery timeline?", a: "Dubai/UAE orders are delivered in 2-3 business days. International express shipping takes 5-7 business days." },
    { q: "Can I return a customized abaya?", a: "Because custom length items are tailored to your specifications, they are generally non-refundable unless a stitching defect exists." },
    { q: "How should I clean my luxury abaya?", a: "We strongly recommend professional dry cleaning only for all premium silks, velvets, and lace-appliqued pieces." }
  ];

  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans">
      <Navbar />
      <main className="max-w-xl mx-auto px-6 pt-36 pb-24 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary-gold block">
            Client Care
          </span>
          <h1 className="font-serif text-3xl font-light tracking-wide">
            Frequently Asked Queries
          </h1>
          <div className="w-16 h-[1px] bg-champagne-gold mx-auto" />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-border-custom pb-4">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full text-left font-serif text-sm font-medium hover:text-primary-gold transition-colors py-2 flex justify-between items-center"
              >
                <span>{faq.q}</span>
                <span className="font-light">{openIdx === i ? "—" : "+"}</span>
              </button>
              {openIdx === i && (
                <p className="text-xs text-secondary-text mt-2 leading-relaxed font-light pl-2">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
