"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getDbCoupons, saveDbCoupons } from "@/lib/db";
import { LayoutDashboard, ShoppingCart, Percent, Plus, ArrowLeft } from "lucide-react";

export default function AdminAddCoupon() {
  const [couponsList, setCouponsList] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountPercent: "",
    usageLimit: "1000",
    expiryDate: ""
  });

  useEffect(() => {
    const loggedUserStr = typeof window !== "undefined" ? localStorage.getItem("abaya_logged_user") : null;
    if (!loggedUserStr) {
      window.location.href = "/login";
      return;
    }
    try {
      const loggedUser = JSON.parse(loggedUserStr);
      if (loggedUser.role !== "Admin" && loggedUser.role !== "Super Admin") {
        window.location.href = "/login";
        return;
      }
    } catch (e) {
      window.location.href = "/login";
      return;
    }

    async function loadCoupons() {
      const corps = await getDbCoupons();
      setCouponsList(Array.isArray(corps) ? corps : []);
    }
    loadCoupons();
  }, []);

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discountPercent) {
      alert("Please enter Coupon Code and Discount Percentage.");
      return;
    }

    const discountNum = Number(newCoupon.discountPercent);
    if (isNaN(discountNum) || discountNum < 1 || discountNum > 100) {
      alert("Discount Percentage must be between 1 and 100.");
      return;
    }

    const couponItem = {
      code: newCoupon.code.trim().toUpperCase(),
      discountPercent: discountNum,
      type: "percentage",
      usageLimit: newCoupon.usageLimit ? Number(newCoupon.usageLimit) : 1000,
      expiryDate: newCoupon.expiryDate || undefined
    };

    try {
      const updated = [couponItem, ...couponsList];
      await saveDbCoupons(updated, couponItem);
      setCouponsList(updated);
      setNewCoupon({ code: "", discountPercent: "", usageLimit: "1000", expiryDate: "" });
      alert("Promo coupon created successfully.");
      // Redirect back to dashboard coupons view
      window.location.href = "/admin/dashboard";
    } catch (err) {
      alert(`Failed to add coupon: ${err.message || err}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans">
      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24">
        {/* Admin Header */}
        <div className="border-b border-border-custom pb-6 mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-light tracking-wide">
              Atelier Management Console
            </h1>
            <p className="text-[10px] text-muted-text uppercase tracking-widest mt-1">
              System Administration / Create Coupon
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 border border-border-custom bg-bg-card hover:bg-bg-secondary/20 text-secondary-text hover:text-primary-text text-[10px] uppercase tracking-widest font-semibold transition-colors rounded-none"
            >
              Storefront
            </Link>
            <button
              onClick={async () => {
                const { logoutUser } = await import("@/lib/db");
                await logoutUser();
                window.location.href = "/login";
              }}
              style={{ cursor: "pointer" }}
              className="px-4 py-2 border border-red-700/50 bg-red-950/10 hover:bg-red-900/20 text-red-500 hover:text-red-400 text-[10px] uppercase tracking-widest font-semibold transition-colors rounded-none"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3">
            <div className="flex lg:flex-col gap-1 overflow-x-auto scrollbar-none pb-1 lg:pb-0 bg-bg-card border border-border-custom shadow-xs lg:p-0 p-2">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 lg:gap-3 p-2.5 lg:p-3 text-[10px] lg:text-xs uppercase tracking-wider font-semibold whitespace-nowrap text-secondary-text hover:bg-bg-secondary/10 border-b-2 lg:border-b-0 lg:border-l-2 border-transparent"
              >
                <LayoutDashboard className="w-4 h-4 flex-shrink-0" /> Overview & Orders
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center gap-2 lg:gap-3 p-2.5 lg:p-3 text-[10px] lg:text-xs uppercase tracking-wider font-semibold whitespace-nowrap text-secondary-text hover:bg-bg-secondary/10 border-b-2 lg:border-b-0 lg:border-l-2 border-transparent"
              >
                <ShoppingCart className="w-4 h-4 flex-shrink-0" /> Lookbook Inventory
              </Link>
              <Link
                href="/admin/products/add"
                className="flex items-center gap-2 lg:gap-3 p-2.5 lg:p-3 text-[10px] lg:text-xs uppercase tracking-wider font-semibold whitespace-nowrap text-secondary-text hover:bg-bg-secondary/10 border-b-2 lg:border-b-0 lg:border-l-2 border-transparent"
              >
                <Plus className="w-4 h-4 flex-shrink-0" /> Add Product
              </Link>
              <Link
                href="/admin/coupons/add"
                className="flex items-center gap-2 lg:gap-3 p-2.5 lg:p-3 text-[10px] lg:text-xs uppercase tracking-wider font-semibold whitespace-nowrap border-b-2 lg:border-b-0 lg:border-l-2 border-soft-gold text-primary-gold bg-bg-secondary/20"
              >
                <Percent className="w-4 h-4 flex-shrink-0" /> Add Coupon
              </Link>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 bg-bg-card p-5 md:p-8 border border-border-custom shadow-xs min-h-[400px]">
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-border-custom">
                <Link href="/admin/dashboard" className="text-secondary-text hover:text-primary-text transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <h3 className="font-serif text-lg font-semibold tracking-wider">
                  Create Promo Coupon
                </h3>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleAddCoupon} className="p-5 border border-border-custom bg-bg-secondary/25 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-bold">Coupon Code</label>
                  <input type="text" placeholder="e.g. SUMMER25" value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })} className="w-full bg-bg-card border border-border-custom p-2 text-xs focus:outline-none focus:border-soft-gold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-bold">Discount Percentage (%)</label>
                  <input type="number" min="1" max="100" placeholder="e.g. 20" value={newCoupon.discountPercent} onChange={(e) => setNewCoupon({ ...newCoupon, discountPercent: e.target.value })} className="w-full bg-bg-card border border-border-custom p-2 text-xs focus:outline-none focus:border-soft-gold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-bold">Max Usage Limit</label>
                  <input type="number" placeholder="e.g. 1000" value={newCoupon.usageLimit} onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })} className="w-full bg-bg-card border border-border-custom p-2 text-xs focus:outline-none focus:border-soft-gold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-bold">Expiry Date</label>
                  <input type="date" value={newCoupon.expiryDate} onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })} className="w-full bg-bg-card border border-border-custom p-2 text-xs focus:outline-none focus:border-soft-gold" />
                </div>

                <button type="submit" style={{ cursor: "pointer" }} className="sm:col-span-2 py-2.5 bg-primary-gold text-bg-deep text-xs uppercase tracking-widest font-bold border border-secondary-gold hover:bg-champagne-gold hover:text-primary-text transition-colors flex items-center justify-center gap-1.5">
                  <Plus className="w-4 h-4" /> Create Promo Coupon
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
