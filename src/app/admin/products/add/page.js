"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getDbProducts, saveDbProducts } from "@/lib/db";
import { LayoutDashboard, ShoppingCart, Percent, Plus, ArrowLeft } from "lucide-react";

export default function AdminAddProduct() {
  const [productsList, setProductsList] = useState([]);
  const [newProd, setNewProd] = useState({ 
    id: "", 
    name: "", 
    category: "Premium Abayas", 
    price: "", 
    fabric: "", 
    image: "",
    hoverImage: "",
    video: ""
  });
  const [selectedSizes, setSelectedSizes] = useState(["S", "M", "L", "XL"]);
  const [defaultLength, setDefaultLength] = useState("56");
  const [isSizesDropdownOpen, setIsSizesDropdownOpen] = useState(false);
  const sizeOptions = ["S", "M", "L", "XL", "XXL", "XXXL", "Free Size"];

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
      const prods = await getDbProducts();
      setProductsList(Array.isArray(prods) ? prods : []);
    }
    loadProducts();
  }, []);

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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProd.id || !newProd.name || !newProd.price) {
      alert("Please enter ID, Name, and Price.");
      return;
    }
    if (selectedSizes.length === 0) {
      alert("Please select at least one size.");
      return;
    }
    const sortedSizes = [...selectedSizes].sort((a, b) => sizeOptions.indexOf(a) - sizeOptions.indexOf(b));
    const productItem = {
      id: newProd.id.trim(),
      name: newProd.name.trim(),
      category: newProd.category,
      price: Number(newProd.price),
      fabric: newProd.fabric.trim() || "Luxury Crepe",
      sizes: sortedSizes,
      image: newProd.image || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
      hoverImage: newProd.hoverImage || "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?q=80&w=600&auto=format&fit=crop",
      video: newProd.video || "",
      rating: 5.0,
      reviewsCount: 0,
      description: `Bespoke tailored ${newProd.name} styled in premium ${newProd.fabric || "Luxury Crepe"}.`,
      details: ["Material: Luxury selection", "Included: Sheila set", "Care: Professional clean", `Length: ${defaultLength} inches`]
    };

    try {
      const updated = [productItem, ...productsList];
      await saveDbProducts(updated, productItem);
      setProductsList(updated);
      setNewProd({ id: "", name: "", category: "Premium Abayas", price: "", fabric: "", image: "", hoverImage: "", video: "" });
      setSelectedSizes(["S", "M", "L", "XL"]);
      setDefaultLength("56");
      alert("New product added to lookbook database successfully.");
      // Redirect back to inventory to see it
      window.location.href = "/admin/products";
    } catch (err) {
      alert(`Failed to add product: ${err.message || err}`);
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
              System Administration / Add Product
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
                className="flex items-center gap-2 lg:gap-3 p-2.5 lg:p-3 text-[10px] lg:text-xs uppercase tracking-wider font-semibold whitespace-nowrap border-b-2 lg:border-b-0 lg:border-l-2 border-soft-gold text-primary-gold bg-bg-secondary/20"
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
              <div className="flex items-center gap-2 pb-3 border-b border-border-custom">
                <Link href="/admin/products" className="text-secondary-text hover:text-primary-text transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <h3 className="font-serif text-lg font-semibold tracking-wider">
                  Add Lookbook Product
                </h3>
              </div>

              {/* Add Product Form */}
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
                  <label className="text-[9px] uppercase tracking-widest font-bold">Price (₹)</label>
                  <input type="number" placeholder="e.g. 350" value={newProd.price} onChange={(e) => setNewProd({ ...newProd, price: e.target.value })} className="w-full bg-bg-card border border-border-custom p-2 text-xs focus:outline-none focus:border-soft-gold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-bold">Fabric Name</label>
                  <input type="text" placeholder="e.g. Premium Satin Silk" value={newProd.fabric} onChange={(e) => setNewProd({ ...newProd, fabric: e.target.value })} className="w-full bg-bg-card border border-border-custom p-2 text-xs focus:outline-none focus:border-soft-gold" />
                </div>
                
                {/* Sizes Dropdown */}
                <div className="space-y-1 relative">
                  <label className="text-[9px] uppercase tracking-widest font-bold block">Sizes Available</label>
                  <div
                    onClick={() => setIsSizesDropdownOpen(!isSizesDropdownOpen)}
                    className="w-full bg-bg-card border border-border-custom p-2 text-xs focus:outline-none focus:border-soft-gold cursor-pointer flex justify-between items-center"
                  >
                    <span>{selectedSizes.length > 0 ? [...selectedSizes].sort((a, b) => sizeOptions.indexOf(a) - sizeOptions.indexOf(b)).join(", ") : "Select Sizes..."}</span>
                    <span className="text-[9px] text-muted-text">▼</span>
                  </div>
                  {isSizesDropdownOpen && (
                    <div className="absolute left-0 right-0 z-30 mt-1 bg-bg-card border border-border-custom shadow-lg p-2.5 space-y-2">
                      {sizeOptions.map((size) => {
                        const isChecked = selectedSizes.includes(size);
                        return (
                          <label key={size} className="flex items-center gap-2 text-xs cursor-pointer hover:text-primary-gold transition-colors text-primary-text">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedSizes(selectedSizes.filter((s) => s !== size));
                                } else {
                                  setSelectedSizes([...selectedSizes, size]);
                                }
                              }}
                              className="accent-soft-gold cursor-pointer"
                            />
                            <span>{size}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Length Input */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-bold">Default Length (inches)</label>
                  <input
                    type="number"
                    min="40"
                    max="70"
                    placeholder="e.g. 56"
                    value={defaultLength}
                    onChange={(e) => setDefaultLength(e.target.value)}
                    className="w-full bg-bg-card border border-border-custom p-2 text-xs focus:outline-none focus:border-soft-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-bold">Category</label>
                  <select value={newProd.category} onChange={(e) => setNewProd({ ...newProd, category: e.target.value })} className="w-full bg-bg-card border border-border-custom p-2.5 px-4 text-[10px] uppercase tracking-wider font-semibold focus:outline-none text-primary-text focus:border-soft-gold cursor-pointer">
                    <option value="Everyday Abayas">Everyday Abayas</option>
                    <option value="Premium Abayas">Premium Abayas</option>
                    <option value="Occasion Wear">Occasion Wear</option>
                    <option value="New Arrivals">New Arrivals</option>
                  </select>
                </div>

                {/* Imagery section */}
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

                    {/* Video Upload */}
                    <div className="space-y-2 md:col-span-2 border-t border-border-custom/30 pt-4">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text block">Upload Video File</label>
                      <input type="file" accept="video/*" onChange={(e) => handleImageFileChange(e, "video")} className="text-xs text-secondary-text file:mr-4 file:py-1 file:px-3 file:border file:border-border-custom file:bg-bg-secondary file:text-primary-gold file:text-[10px] file:uppercase file:tracking-wider file:font-semibold hover:file:bg-soft-gold/10 file:cursor-pointer" />
                      
                      <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text block pt-2">Or Paste Video URL</label>
                      <input type="text" placeholder="https://assets.mixkit.co/..." value={newProd.video} onChange={(e) => setNewProd({ ...newProd, video: e.target.value })} className="w-full bg-bg-card border border-border-custom p-2 text-[11px] focus:outline-none focus:border-soft-gold" />
                    </div>
                  </div>

                  {/* Previews */}
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
