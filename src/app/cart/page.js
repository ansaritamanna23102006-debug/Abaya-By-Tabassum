"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const router = useRouter();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (coupon.toUpperCase() === "ATELIER10") {
      setDiscountPercent(10);
      alert("ATELIER10 coupon applied. 10% discount subtracted.");
    } else if (coupon.toUpperCase() === "MODESTY") {
      setDiscountPercent(15);
      alert("MODESTY coupon applied. 15% discount subtracted.");
    } else {
      alert("Invalid coupon code.");
    }
  };

  const calculatedTotal = cartTotal - (cartTotal * discountPercent) / 100;

  const handleCheckoutClick = () => {
    localStorage.setItem("abaya_checkout_totals", JSON.stringify({ subtotal: cartTotal, discount: discountPercent, total: calculatedTotal }));
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 pt-36 pb-24">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary-gold block mb-2">
            Order Review
          </span>
          <h1 className="font-serif text-3xl font-light tracking-wide">
            Your Shopping Bag
          </h1>
          <div className="w-16 h-[1px] bg-champagne-gold mx-auto mt-4" />
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-bg-card border border-border-custom p-8 space-y-6">
            <ShoppingBag className="w-12 h-12 text-primary-gold/40 mx-auto" />
            <p className="font-serif text-lg italic text-secondary-text">
              Your bag is currently empty
            </p>
            <Link
              href="/shop"
              className="inline-block px-10 py-3.5 bg-primary-gold text-bg-deep text-xs uppercase tracking-widest font-semibold border border-secondary-gold hover:bg-champagne-gold hover:text-primary-text transition-all"
            >
              Continue Browsing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Items list */}
            <div className="lg:col-span-8 bg-bg-card p-8 border border-border-custom shadow-xs space-y-6">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex flex-col xs:flex-row gap-4 sm:gap-6 pb-6 border-b border-border-custom/50">
                  <div className="w-full xs:w-20 h-48 xs:h-28 bg-bg-secondary overflow-hidden border border-border-custom/50 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-serif text-base font-semibold leading-tight">{item.name}</h3>
                      <span className="font-bold text-primary-gold whitespace-nowrap flex-shrink-0">${item.price}</span>
                    </div>
                    <p className="text-xs text-muted-text">Size: {item.selectedSize}</p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-border-custom bg-bg-card">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                          className="p-1 px-2 text-secondary-text hover:text-primary-gold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                          className="p-1 px-2 text-secondary-text hover:text-primary-gold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                        className="text-muted-text hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Order Summary & Checkout */}
            <div className="lg:col-span-4 bg-bg-card p-6 border border-border-custom shadow-xs space-y-6">
              <h3 className="font-serif text-lg font-semibold tracking-wider pb-3 border-b border-border-custom">
                Summary
              </h3>

              {/* Coupon inputs */}
              <form onSubmit={handleApplyCoupon} className="space-y-3">
                <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text">
                  Promo Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="ENTER CODE"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 bg-transparent border border-border-custom p-2 text-xs focus:outline-none focus:border-soft-gold text-primary-text uppercase tracking-wider"
                  />
                  <button className="bg-primary-gold text-bg-deep text-xs px-4 uppercase tracking-widest font-bold border border-luxury-black hover:bg-champagne-gold hover:text-primary-text transition-colors">
                    Apply
                  </button>
                </div>
              </form>

              {/* Pricing metrics */}
              <div className="space-y-3 text-xs pt-4 border-t border-border-custom/50 font-light text-secondary-text">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span>${cartTotal}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-750">
                    <span>Discount Applied ({discountPercent}%)</span>
                    <span>-${(cartTotal * discountPercent) / 100}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-semibold border-t border-border-custom/50 pt-3 text-primary-text">
                  <span>Order Total</span>
                  <span className="text-primary-gold font-bold">${calculatedTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 bg-primary-gold text-bg-deep text-xs uppercase tracking-widest font-bold border border-secondary-gold hover:bg-champagne-gold hover:text-primary-text transition-all flex items-center justify-center gap-2"
              >
                Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
