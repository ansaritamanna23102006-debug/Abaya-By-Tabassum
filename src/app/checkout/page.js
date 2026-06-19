"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { saveDbOrders } from "@/lib/db";
import { getAuthHeaders } from "@/lib/db";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const [address, setAddress] = useState({ name: "", street: "", city: "", phone: "" });
  const [totals, setTotals] = useState({ subtotal: 0, discount: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedTotals = localStorage.getItem("abaya_checkout_totals");
    if (savedTotals) {
      setTotals(JSON.parse(savedTotals));
    }
  }, []);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Build order payload matching the OrderCreateSchema
      const orderPayload = {
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          selectedSize: item.selectedSize,
          image: item.image || "",
        })),
        total: Number(totals.total),
        shippingAddress: {
          name: address.name,
          address: address.street,
          city: address.city,
          country: "UAE",
          phone: address.phone,
        },
        paymentMethod: "Razorpay",
      };

      // Send order to real backend API
      const authHeaders = getAuthHeaders();
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(orderPayload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "Failed to place order. Please try again.");
        setLoading(false);
        return;
      }

      const { order, razorpayOrderId } = json.data;

      // In production with real Razorpay keys, this would open the Razorpay checkout modal.
      // For now with mock mode, simulate payment verification.
      if (razorpayOrderId) {
        const verifyRes = await fetch(`/api/orders/${order.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify({
            razorpayOrderId: razorpayOrderId,
            razorpayPaymentId: `pay_mock_${Date.now()}`,
            razorpaySignature: `sig_mock_${Date.now()}`,
          }),
        });

        const verifyJson = await verifyRes.json();
        if (!verifyRes.ok || !verifyJson.success) {
          setError("Payment verification failed. Please contact support.");
          setLoading(false);
          return;
        }
      }

      // Clear cart and redirect to success
      clearCart();
      localStorage.removeItem("abaya_checkout_totals");
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-36 pb-24 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Column: Address inputs */}
        <div className="md:col-span-7 space-y-8">
          <h2 className="font-serif text-2xl font-light tracking-wide pb-3 border-b border-border-custom">
            Delivery Details
          </h2>

          <form onSubmit={handlePlaceOrder} className="space-y-4 bg-bg-card p-6 border border-border-custom shadow-xs">
            {error && (
              <div className="p-3 border border-red-600/40 bg-red-900/20 text-red-400 text-xs text-center tracking-wide">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text">
                Client Name
              </label>
              <input
                type="text"
                required
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                className="w-full bg-transparent border border-border-custom p-2.5 text-xs focus:outline-none focus:border-soft-gold text-primary-text"
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text">
                Street Address / Villa Number
              </label>
              <input
                type="text"
                required
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full bg-transparent border border-border-custom p-2.5 text-xs focus:outline-none focus:border-soft-gold text-primary-text"
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text">
                City / Region
              </label>
              <input
                type="text"
                required
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full bg-transparent border border-border-custom p-2.5 text-xs focus:outline-none focus:border-soft-gold text-primary-text"
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text">
                Mobile Number
              </label>
              <input
                type="text"
                required
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="w-full bg-transparent border border-border-custom p-2.5 text-xs focus:outline-none focus:border-soft-gold text-primary-text"
                disabled={loading}
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-4 bg-primary-gold text-bg-deep text-xs uppercase tracking-widest font-bold border border-secondary-gold hover:bg-champagne-gold hover:text-primary-text transition-all mt-6 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing Order..." : "Pay via Razorpay"}
            </button>
          </form>
        </div>

        {/* Right Column: Cart recap */}
        <div className="md:col-span-5 bg-bg-card p-6 border border-border-custom shadow-xs h-fit space-y-6">
          <h3 className="font-serif text-lg font-semibold tracking-wider pb-2 border-b border-border-custom/50">
            Checkout Summary
          </h3>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold block">{item.name}</span>
                  <span className="text-[10px] text-muted-text">Size: {item.selectedSize} | Qty: {item.quantity}</span>
                </div>
                <span className="font-medium text-primary-gold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border-custom/50 pt-4 text-xs space-y-2 font-light text-secondary-text">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totals.subtotal}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Discount ({totals.discount}%)</span>
                <span>-₹{(totals.subtotal * totals.discount) / 100}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold text-primary-text border-t border-border-custom/50 pt-3">
              <span>Payable Total</span>
              <span className="text-primary-gold font-bold">₹{totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
