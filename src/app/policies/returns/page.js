import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ReturnsPolicy() {
  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 pt-36 pb-24 space-y-8 text-left">
        <h1 className="font-serif text-3xl font-light tracking-wide text-center">Returns & Alterations</h1>
        <div className="w-16 h-[1px] bg-champagne-gold mx-auto mb-10" />
        <div className="text-xs md:text-sm text-secondary-text leading-relaxed space-y-4 font-light">
          <p>
            Due to the tailored specifications of our modesty wear designs, items customized with specific lengths are non-refundable unless there is a stitching defect.
          </p>
          <p>
            Standard size (unaltered) garments can be returned or exchanged within 7 days of delivery in their original unworn condition.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
