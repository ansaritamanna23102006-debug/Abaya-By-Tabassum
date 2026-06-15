"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getDbProducts,
  saveDbProducts,
  deleteDbProduct,
  getDbOrders,
  saveDbOrders,
  updateDbOrderStatus,
  getDbCoupons,
  saveDbCoupons,
  getDbReviews,
} from "@/lib/db";
import { LayoutDashboard, ShoppingCart, Percent, Heart, MessageSquare, ClipboardList, Trash2, Plus } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [couponsList, setCouponsList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);

  // Add Product form state
  const [newProd, setNewProd] = useState({ 
    id: "", 
    name: "", 
    category: "Premium Abayas", 
    price: "", 
    fabric: "", 
    sizes: "S, M, L",
    image: "",
    hoverImage: "",
    video: ""
  });

  useEffect(() => {
    async function loadData() {
      const prods = await getDbProducts();
      const ords = await getDbOrders();
      const corps = await getDbCoupons();
      const revs = await getDbReviews();
      setProductsList(Array.isArray(prods) ? prods : []);
      setOrdersList(Array.isArray(ords) ? ords : []);
      setCouponsList(Array.isArray(corps) ? corps : []);
      setReviewsList(Array.isArray(revs) ? revs : []);
    }
    loadData();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProd.id || !newProd.name || !newProd.price) {
      alert("Please enter ID, Name, and Price.");
      return;
    }
    const productItem = {
      id: newProd.id,
      name: newProd.name,
      category: newProd.category,
      price: Number(newProd.price),
      fabric: newProd.fabric || "Luxury Crepe",
      sizes: newProd.sizes.split(",").map((s) => s.trim()),
      image: newProd.image || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
      hoverImage: newProd.hoverImage || "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?q=80&w=600&auto=format&fit=crop",
      video: newProd.video || "",
      rating: 5.0,
      reviewsCount: 0,
      description: `Bespoke tailored ${newProd.name} styled in premium ${newProd.fabric || "Luxury Crepe"}.`,
      details: ["Material: Luxury selection", "Included: Sheila set", "Care: Professional clean"]
    };

    try {
      const updated = [productItem, ...productsList];
      await saveDbProducts(updated, productItem);
      setProductsList(updated);
      setNewProd({ id: "", name: "", category: "Premium Abayas", price: "", fabric: "", sizes: "S, M, L", image: "", hoverImage: "", video: "" });
      alert("New product added to lookbook database successfully.");
    } catch (err) {
      alert(`Failed to add product: ${err.message || err}`);
    }
  };

  const handleImageFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProd(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm("Delete this product from lookbook?")) {
      try {
        await deleteDbProduct(id);
        const updated = productsList.filter((p) => p.id !== id);
        setProductsList(updated);
      } catch (err) {
        alert(err.message || "Failed to delete product. Please log out and sign in again to refresh your session.");
      }
    }
  };

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
          {/* Navigation links — horizontal scrollable on mobile, vertical sidebar on lg */}
          <div className="lg:col-span-3">
            <div className="flex lg:flex-col gap-1 overflow-x-auto scrollbar-none pb-1 lg:pb-0 bg-bg-card border border-border-custom shadow-xs lg:p-0 p-2">
              {[
                { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
                { id: "products", icon: ShoppingCart, label: `Inventory (${productsList.length})` },
                { id: "orders", icon: ClipboardList, label: `Orders (${ordersList.length})` },
                { id: "coupons", icon: Percent, label: `Promos (${couponsList.length})` },
                { id: "reviews", icon: MessageSquare, label: `Reviews (${reviewsList.length})` },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{ cursor: "pointer" }}
                  className={`flex items-center gap-2 lg:gap-3 p-2.5 lg:p-3 text-[10px] lg:text-xs uppercase tracking-wider font-semibold whitespace-nowrap flex-shrink-0 lg:flex-shrink text-left transition-colors border-b-2 lg:border-b-0 lg:border-l-2 ${
                    activeTab === id
                      ? "border-soft-gold text-primary-gold bg-bg-secondary/20"
                      : "border-transparent text-secondary-text hover:bg-bg-secondary/10"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" /> {label}
                </button>
              ))}
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
                    <span className="font-serif text-2xl font-semibold text-primary-gold">${totalRevenue}</span>
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

            {activeTab === "products" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center pb-3 border-b border-border-custom">
                  <h3 className="font-serif text-lg font-semibold tracking-wider">
                    Lookbook Inventory
                  </h3>
                </div>

                {/* Add Product Inline Form */}
                <form onSubmit={handleAddProduct} className="p-5 border border-border-custom bg-bg-secondary/25 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-bold">Product ID</label>
                    <input type="text" placeholder="e.g. malika-silk" value={newProd.id} onChange={(e) => setNewProd({ ...newProd, id: e.target.value })} className="w-full bg-bg-card border border-border-custom p-2 text-xs focus:outline-none focus:border-soft-gold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-bold">Product Name</label>
                    <input type="text" placeholder="e.g. Malika Silk Abaya" value={newProd.name} onChange={(e) => setNewProd({ ...newProd, name: e.target.value })} className="w-full bg-bg-card border border-border-custom p-2 text-xs focus:outline-none focus:border-soft-gold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-bold">Price ($)</label>
                    <input type="number" placeholder="e.g. 350" value={newProd.price} onChange={(e) => setNewProd({ ...newProd, price: e.target.value })} className="w-full bg-bg-card border border-border-custom p-2 text-xs focus:outline-none focus:border-soft-gold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-bold">Fabric Name</label>
                    <input type="text" placeholder="e.g. Premium Satin Silk" value={newProd.fabric} onChange={(e) => setNewProd({ ...newProd, fabric: e.target.value })} className="w-full bg-bg-card border border-border-custom p-2 text-xs focus:outline-none focus:border-soft-gold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-bold">Sizes (comma separated)</label>
                    <input type="text" placeholder="S, M, L" value={newProd.sizes} onChange={(e) => setNewProd({ ...newProd, sizes: e.target.value })} className="w-full bg-bg-card border border-border-custom p-2 text-xs focus:outline-none focus:border-soft-gold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-bold">Category</label>
                    <select value={newProd.category} onChange={(e) => setNewProd({ ...newProd, category: e.target.value })} className="w-full bg-bg-card border border-border-custom p-2.5 px-4 text-[10px] uppercase tracking-wider font-semibold focus:outline-none text-primary-text focus:border-soft-gold cursor-pointer">
                      <option value="Premium Abayas">Premium Abayas</option>
                      <option value="Satin Series">Satin Series</option>
                      <option value="Silk Collections">Silk Collections</option>
                      <option value="Modest Sets">Modest Sets</option>
                    </select>
                  </div>

                  {/* Image input/upload section */}
                  <div className="sm:col-span-2 border border-border-custom/60 p-4 bg-bg-card/40 space-y-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-primary-gold block">Product Imagery & Media</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text block">Upload Main Image File</label>
                        <input type="file" accept="image/*" onChange={(e) => handleImageFileChange(e, "image")} className="text-xs text-secondary-text file:mr-4 file:py-1 file:px-3 file:border file:border-border-custom file:bg-bg-secondary file:text-primary-gold file:text-[10px] file:uppercase file:tracking-wider file:font-semibold hover:file:bg-soft-gold/10 file:cursor-pointer" />
                        
                        <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text block pt-2">Or Paste Image URL</label>
                        <input type="text" placeholder="https://unsplash.com/..." value={newProd.image} onChange={(e) => setNewProd({ ...newProd, image: e.target.value })} className="w-full bg-bg-card border border-border-custom p-2 text-[11px] focus:outline-none focus:border-soft-gold" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text block">Upload Hover Image File</label>
                        <input type="file" accept="image/*" onChange={(e) => handleImageFileChange(e, "hoverImage")} className="text-xs text-secondary-text file:mr-4 file:py-1 file:px-3 file:border file:border-border-custom file:bg-bg-secondary file:text-primary-gold file:text-[10px] file:uppercase file:tracking-wider file:font-semibold hover:file:bg-soft-gold/10 file:cursor-pointer" />
                        
                        <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text block pt-2">Or Paste Hover URL</label>
                        <input type="text" placeholder="https://unsplash.com/..." value={newProd.hoverImage} onChange={(e) => setNewProd({ ...newProd, hoverImage: e.target.value })} className="w-full bg-bg-card border border-border-custom p-2 text-[11px] focus:outline-none focus:border-soft-gold" />
                      </div>

                      {/* Video input/upload section */}
                      <div className="space-y-2 md:col-span-2 border-t border-border-custom/30 pt-4">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text block">Upload Video File</label>
                        <input type="file" accept="video/*" onChange={(e) => handleImageFileChange(e, "video")} className="text-xs text-secondary-text file:mr-4 file:py-1 file:px-3 file:border file:border-border-custom file:bg-bg-secondary file:text-primary-gold file:text-[10px] file:uppercase file:tracking-wider file:font-semibold hover:file:bg-soft-gold/10 file:cursor-pointer" />
                        
                        <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text block pt-2">Or Paste Video URL</label>
                        <input type="text" placeholder="https://assets.mixkit.co/..." value={newProd.video} onChange={(e) => setNewProd({ ...newProd, video: e.target.value })} className="w-full bg-bg-card border border-border-custom p-2 text-[11px] focus:outline-none focus:border-soft-gold" />
                      </div>
                    </div>

                  {/* Media Previews */}
                  {(newProd.image || newProd.hoverImage || newProd.video) && (
                      <div className="flex flex-wrap gap-4 pt-4 border-t border-border-custom/40 justify-center sm:justify-start">
                        {newProd.image && (
                          <div className="space-y-1">
                            <span className="text-[8px] uppercase tracking-wider text-muted-text block text-center">Main Preview</span>
                            <img src={newProd.image} alt="Main preview" className="w-16 h-20 object-cover border border-border-custom" />
                          </div>
                        )}
                        {newProd.hoverImage && (
                          <div className="space-y-1">
                            <span className="text-[8px] uppercase tracking-wider text-muted-text block text-center">Hover Preview</span>
                            <img src={newProd.hoverImage} alt="Hover preview" className="w-16 h-20 object-cover border border-border-custom" />
                          </div>
                        )}
                        {newProd.video && (
                          <div className="space-y-1">
                            <span className="text-[8px] uppercase tracking-wider text-muted-text block text-center">Video Preview</span>
                            <video src={newProd.video} controls muted className="w-24 h-20 object-cover border border-border-custom bg-black" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button type="submit" style={{ cursor: "pointer" }} className="sm:col-span-2 py-2.5 bg-primary-gold text-bg-deep text-xs uppercase tracking-widest font-bold border border-secondary-gold hover:bg-champagne-gold hover:text-primary-text transition-colors flex items-center justify-center gap-1.5">
                    <Plus className="w-4 h-4" /> Add to Lookbook
                  </button>
                </form>

                {/* Inventory products list */}
                <div className="space-y-4">
                  {productsList.map((p) => (
                    <div key={p.id} className="flex justify-between items-center p-4 border border-border-custom/50 bg-bg-card/40">
                      <div>
                        <span className="font-serif text-sm font-semibold">{p.name}</span>
                        <span className="text-[10px] text-muted-text block">Category: {p.category} | Price: ${p.price}</span>
                      </div>
                      <button onClick={() => handleDeleteProduct(p.id)} className="text-red-700 hover:text-red-950 p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-6">
                <h3 className="font-serif text-lg font-semibold tracking-wider pb-3 border-b border-border-custom">
                  Incoming Orders
                </h3>
                {ordersList.map((ord) => (
                  <div key={ord.id} className="p-5 border border-border-custom bg-bg-card/50 space-y-4">
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
                      Client: {ord.shippingAddress.name} | Total paid: ${ord.total}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "coupons" && (
              <div className="space-y-6">
                <h3 className="font-serif text-lg font-semibold tracking-wider pb-3 border-b border-border-custom">
                  Coupon Management
                </h3>
                <div className="space-y-3">
                  {couponsList.map((cp) => (
                    <div key={cp.code} className="flex justify-between items-center p-3.5 border border-border-custom/50 bg-bg-card/40 text-xs">
                      <span className="font-bold text-primary-text uppercase tracking-wider">{cp.code}</span>
                      <span className="font-semibold text-primary-gold">{cp.discountPercent}% Off Coupon</span>
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
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="p-4 border border-border-custom/50 bg-bg-card/40 space-y-2 text-xs">
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
