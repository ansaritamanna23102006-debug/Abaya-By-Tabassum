"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getDbProducts, deleteDbProduct } from "@/lib/db";
import { LayoutDashboard, ShoppingCart, Percent, MessageSquare, ClipboardList, Trash2, Plus } from "lucide-react";

export default function AdminInventory() {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

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

    async function loadProducts() {
      try {
        const prods = await getDbProducts();
        setProductsList(Array.isArray(prods) ? prods : []);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (confirm("Are you sure you want to delete this product from the lookbook?")) {
      try {
        await deleteDbProduct(id);
        setProductsList(prev => prev.filter(p => p.id !== id));
        alert("Product deleted successfully.");
      } catch (err) {
        alert(err.message || "Failed to delete product.");
      }
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
              System Administration / Inventory
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
                className="flex items-center gap-2 lg:gap-3 p-2.5 lg:p-3 text-[10px] lg:text-xs uppercase tracking-wider font-semibold whitespace-nowrap border-b-2 lg:border-b-0 lg:border-l-2 border-soft-gold text-primary-gold bg-bg-secondary/20"
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
                className="flex items-center gap-2 lg:gap-3 p-2.5 lg:p-3 text-[10px] lg:text-xs uppercase tracking-wider font-semibold whitespace-nowrap text-secondary-text hover:bg-bg-secondary/10 border-b-2 lg:border-b-0 lg:border-l-2 border-transparent"
              >
                <Percent className="w-4 h-4 flex-shrink-0" /> Add Coupon
              </Link>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 bg-bg-card p-5 md:p-8 border border-border-custom shadow-xs min-h-[400px]">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-border-custom">
                <h3 className="font-serif text-lg font-semibold tracking-wider">
                  Lookbook Inventory ({productsList.length})
                </h3>
                <Link
                  href="/admin/products/add"
                  className="flex items-center gap-1 bg-primary-gold text-bg-deep px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-champagne-gold hover:text-primary-text transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New
                </Link>
              </div>

              {loading ? (
                <p className="text-xs italic text-muted-text font-light py-8">Loading inventory...</p>
              ) : productsList.length === 0 ? (
                <p className="text-xs italic text-muted-text font-light py-8">No products found in database lookbook.</p>
              ) : (
                <div className="space-y-4">
                  {productsList.map((p, idx) => (
                    <div key={p.id || p._id || idx} className="flex justify-between items-center p-4 border border-border-custom/50 bg-bg-card/40 hover:bg-bg-secondary/5 transition-colors">
                      <div className="flex gap-4 items-center">
                        {p.image && (
                          <img src={p.image} alt={p.name} className="w-10 h-12 object-cover border border-border-custom" />
                        )}
                        <div>
                          <span className="font-serif text-sm font-semibold block">{p.name}</span>
                          <span className="text-[10px] text-muted-text">
                            ID: <span className="text-secondary-text">{p.id || p._id}</span> | Category: <span className="text-secondary-text">{p.category}</span> | Price: <span className="text-primary-gold">₹{p.price}</span>
                          </span>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteProduct(p.id)} className="text-red-700 hover:text-red-500 hover:bg-red-950/10 p-2.5 transition-colors border border-transparent hover:border-red-900/40">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
