"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getDbOrders,
  updateDbOrderStatus,
  getDbCoupons,
  getDbReviews,
} from "@/lib/db";
import { LayoutDashboard, ShoppingCart, Percent, Heart, MessageSquare, ClipboardList, Trash2, Plus } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [ordersList, setOrdersList] = useState([]);
  const [couponsList, setCouponsList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

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

    async function loadData() {
      const ords = await getDbOrders();
      const corps = await getDbCoupons();
      const revs = await getDbReviews();
      setOrdersList(Array.isArray(ords) ? ords : []);
      setCouponsList(Array.isArray(corps) ? corps : []);
      setReviewsList(Array.isArray(revs) ? revs : []);
    }
    loadData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const updated = ordersList.map((ord) => {
      if (ord.id === orderId) {
        return { ...ord, status: newStatus };
      }
      return ord;
    });
    setOrdersList(updated);
    await updateDbOrderStatus(orderId, newStatus);
    alert(`Order status updated to ${newStatus}.`);
  };

  const handleDeleteCoupon = async (code) => {
    if (confirm(`Are you sure you want to delete coupon "${code}"?`)) {
      try {
        const { deleteDbCoupon } = await import("@/lib/db");
        await deleteDbCoupon(code);
        setCouponsList(prev => prev.filter(c => c.code !== code));
        alert("Coupon deleted successfully.");
      } catch (err) {
        alert(err.message || "Failed to delete coupon.");
      }
    }
  };

  const totalRevenue = ordersList.reduce((acc, ord) => acc + ord.total, 0);

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
              System Administration
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
              {[
                { id: "dashboard", icon: LayoutDashboard, label: "Overview", type: "tab" },
                { id: "orders", icon: ClipboardList, label: `Orders (${ordersList.length})`, type: "tab" },
                { id: "coupons", icon: Percent, label: `Promos (${couponsList.length})`, type: "tab" },
                { id: "reviews", icon: MessageSquare, label: `Reviews (${reviewsList.length})`, type: "tab" },
                { id: "inventory", icon: ShoppingCart, label: "Lookbook Inventory", type: "link", href: "/admin/products" },
                { id: "add-product", icon: Plus, label: "Add Product", type: "link", href: "/admin/products/add" },
              ].map((item) => {
                if (item.type === "link") {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="flex items-center gap-2 lg:gap-3 p-2.5 lg:p-3 text-[10px] lg:text-xs uppercase tracking-wider font-semibold whitespace-nowrap flex-shrink-0 lg:flex-shrink text-left transition-colors border-b-2 lg:border-b-0 lg:border-l-2 border-transparent text-secondary-text hover:bg-bg-secondary/10"
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" /> {item.label}
                    </Link>
                  );
                }
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    style={{ cursor: "pointer" }}
                    className={`flex items-center gap-2 lg:gap-3 p-2.5 lg:p-3 text-[10px] lg:text-xs uppercase tracking-wider font-semibold whitespace-nowrap flex-shrink-0 lg:flex-shrink text-left transition-colors border-b-2 lg:border-b-0 lg:border-l-2 ${
                      activeTab === item.id
                        ? "border-soft-gold text-primary-gold bg-bg-secondary/20"
                        : "border-transparent text-secondary-text hover:bg-bg-secondary/10"
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" /> {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Admin Panels content (Right Column) */}
          <div className="lg:col-span-9 bg-bg-card p-5 md:p-8 border border-border-custom shadow-xs min-h-[400px]">
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                <h3 className="font-serif text-lg font-semibold tracking-wider pb-3 border-b border-border-custom">
                  Performance Metrics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 border border-border-custom bg-bg-card space-y-1">
                    <span className="text-[10px] text-muted-text uppercase font-bold tracking-widest block">Total Revenue</span>
                    <span className="font-serif text-2xl font-semibold text-primary-gold">₹{totalRevenue}</span>
                  </div>
                  <div className="p-6 border border-border-custom bg-bg-card space-y-1">
                    <span className="text-[10px] text-muted-text uppercase font-bold tracking-widest block">Orders Placed</span>
                    <span className="font-serif text-2xl font-semibold text-primary-text">{ordersList.length}</span>
                  </div>
                  <div className="p-6 border border-border-custom bg-bg-card space-y-1">
                    <span className="text-[10px] text-muted-text uppercase font-bold tracking-widest block">Active Coupons</span>
                    <span className="font-serif text-2xl font-semibold text-primary-text">{couponsList.length}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-3 border-b border-border-custom">
                  <h3 className="font-serif text-lg font-semibold tracking-wider">
                    Incoming Orders
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-text uppercase font-bold tracking-widest">Filter by Status:</span>
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="bg-bg-card border border-border-custom p-1.5 px-3 text-[10px] uppercase tracking-wider font-semibold focus:outline-none text-primary-gold focus:border-soft-gold cursor-pointer"
                    >
                      <option value="All">All</option>
                      <option value="Processing">Processing</option>
                      <option value="In Stitching">In Stitching</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                {ordersList.filter(ord => orderStatusFilter === "All" || ord.status === orderStatusFilter).length === 0 ? (
                  <p className="text-xs italic text-muted-text font-light py-8">No orders found with status "{orderStatusFilter}".</p>
                ) : (
                  ordersList
                    .filter(ord => orderStatusFilter === "All" || ord.status === orderStatusFilter)
                    .map((ord, idx) => (
                      <div key={ord.id || ord._id || idx} className="p-5 border border-border-custom bg-bg-card/50 space-y-4">
                        <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold">
                          <span>ID: {ord.id}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-text">Status:</span>
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                              className="bg-bg-card border border-border-custom p-1.5 px-3 text-[9px] uppercase tracking-wider font-semibold focus:outline-none text-primary-gold focus:border-soft-gold cursor-pointer"
                            >
                              <option value="Processing">Processing</option>
                              <option value="In Stitching">In Stitching</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>
                        </div>
                        <div className="text-[11px] text-primary-text/65">
                          Client: {ord.shippingAddress?.name || "Guest"} | Total paid: ₹{ord.total}
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}

            {activeTab === "coupons" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-border-custom gap-4">
                  <h3 className="font-serif text-lg font-semibold tracking-wider">
                    Coupon Management
                  </h3>
                  <Link
                    href="/admin/coupons/add"
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-primary-gold bg-bg-card hover:bg-primary-gold hover:text-bg-deep text-primary-gold text-[10px] uppercase tracking-widest font-bold transition-all duration-300 rounded-none cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Coupon
                  </Link>
                </div>
                <div className="space-y-3">
                  {couponsList.map((cp, idx) => (
                    <div key={cp.code || cp._id || idx} className="flex justify-between items-center p-3.5 border border-border-custom/50 bg-bg-card/40 text-xs">
                      <div>
                        <span className="font-bold text-primary-text uppercase tracking-wider block">{cp.code}</span>
                        <span className="font-semibold text-primary-gold text-[10px]">{cp.discountPercent}% Off Coupon</span>
                      </div>
                      <button
                        onClick={() => handleDeleteCoupon(cp.code)}
                        className="text-red-700 hover:text-red-500 hover:bg-red-950/10 p-2.5 transition-colors border border-transparent hover:border-red-900/40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <h3 className="font-serif text-lg font-semibold tracking-wider pb-3 border-b border-border-custom">
                  Customer Feedback Review
                </h3>
                <div className="space-y-4">
                  {reviewsList.map((rev, idx) => (
                    <div key={rev.id || rev._id || idx} className="p-4 border border-border-custom/50 bg-bg-card/40 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="font-semibold">{rev.name}</span>
                        <span className="text-primary-gold">{rev.rating} / 5.0</span>
                      </div>
                      <p className="text-[11px] text-secondary-text leading-relaxed font-light italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
