"use client";

import React, { use, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-0000-AT";

  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans">
      <Navbar />
      <main className="max-w-md mx-auto px-6 pt-36 pb-24 text-center space-y-8">
        <CheckCircle2 className="w-16 h-16 text-green-700 mx-auto animate-pulse" />
        
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary-gold block">
            Payment Confirmed
          </span>
          <h1 className="font-serif text-3xl font-light tracking-wide">
            Atelier Order Placed
          </h1>
          <div className="w-16 h-[1px] bg-champagne-gold mx-auto" />
        </div>

        <p className="text-xs md:text-sm text-secondary-text leading-relaxed font-light">
          Your payment has been successfully verified via Razorpay. Our Atelier concierge will contact you shortly to verify sizing details.
        </p>

        <div className="bg-bg-card p-5 border border-border-custom shadow-xs text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-text uppercase font-semibold">Order Reference:</span>
            <span className="font-bold text-primary-text">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-text uppercase font-semibold">Stitching Status:</span>
            <span className="text-primary-gold font-bold">Awaiting Custom Check</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Link
            href="/account/dashboard"
            className="w-full py-3 bg-primary-gold text-bg-deep text-xs uppercase tracking-widest font-bold border border-secondary-gold hover:bg-champagne-gold hover:text-primary-text transition-all flex items-center justify-center gap-1.5"
          >
            Track Order status <ChevronRight className="w-4 h-4" />
          </Link>
          <Link href="/shop" className="text-xs uppercase tracking-wider font-semibold text-primary-gold hover:underline">
            Back to Boutique
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-deep flex items-center justify-center font-serif tracking-widest">LOADING ORDER INVOICE...</div>}>
      <CardContentWrap />
    </Suspense>
  );
}

function CardContentWrap() {
  return <SuccessContent />;
}
