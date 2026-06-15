"use client";

import React, { useState, useMemo, Suspense, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/context/CartContext";
import { getDbProducts } from "@/lib/db";
import { Star, Eye, ShoppingBag, Heart, ArrowRight, X, SlidersHorizontal, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Sub-component that reads search parameters
function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [productsList, setProductsList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedFabric, setSelectedFabric] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [priceRange, setPriceRange] = useState(600); // Max price limit
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      const data = await getDbProducts();
      setProductsList(Array.isArray(data) ? data : []);
    }
    loadProducts();
  }, []);

  // Quick View selected sizes state
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewSize, setQuickViewSize] = useState("M");

  const categories = ["All", "Everyday Abayas", "Premium Abayas", "Occasion Wear", "New Arrivals"];
  const fabrics = ["All", "Premium Silk Satin", "Royal Velvet", "Textured Organza & Cotton-Linen", "Premium Japanese Georgette", "Belgian Flax Linen", "Premium Crepe & French Lace"];
  const sizes = ["All", "XS", "S", "M", "L", "XL", "XXL"];

  // Filter and sort products
  const processedProducts = useMemo(() => {
    let result = [...productsList];

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Fabric
    if (selectedFabric !== "All") {
      result = result.filter((p) => p.fabric === selectedFabric);
    }

    // Filter by Size
    if (selectedSize !== "All") {
      result = result.filter((p) => p.sizes.includes(selectedSize));
    }

    // Filter by Price Limit
    result = result.filter((p) => {
      const price = p.discountPrice || p.price;
      return price <= priceRange;
    });

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sort products
    if (sortBy === "price-low") {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [productsList, selectedCategory, selectedFabric, selectedSize, priceRange, sortBy, searchQuery]);

  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans selection:bg-champagne-gold selection:text-primary-text">
      <Navbar />
      <CartDrawer />

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-24">
        {/* Boutique Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary-gold block mb-3">
            The Atelier
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-primary-text">
            The Boutique Lookbook
          </h1>
          <div className="w-16 h-[1px] bg-champagne-gold mx-auto mt-6" />
        </div>

        {/* Toolbar (Search & Sort) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-custom pb-6 mb-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold hover:text-primary-gold transition-colors lg:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          {/* Search bar */}
          <div className="relative w-full sm:max-w-sm border border-border-custom bg-bg-card">
            <input
              type="text"
              placeholder="SEARCH COLLECTION..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-[10px] p-3.5 pr-10 tracking-widest focus:outline-none placeholder-muted-text/70 text-primary-text"
            />
            <Search className="w-4 h-4 text-primary-gold absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-text hidden sm:block">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-bg-card border border-border-custom p-2 px-3 text-[10px] uppercase tracking-wider font-semibold focus:outline-none text-primary-text w-full sm:w-auto"
            >
              <option value="featured">Atelier Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-1 space-y-8 sticky top-32">
            {/* Category Filter */}
            <div className="space-y-3 pb-6 border-b border-border-custom">
              <h4 className="font-serif text-sm font-semibold tracking-wider text-primary-text">
                Categories
              </h4>
              <div className="flex flex-col gap-2 text-[11px] uppercase tracking-wider font-medium text-secondary-text">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left hover:text-primary-gold transition-colors ${
                      selectedCategory === cat ? "text-primary-gold font-bold" : ""
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-4 pb-6 border-b border-border-custom">
              <h4 className="font-serif text-sm font-semibold tracking-wider text-primary-text">
                Max Price Limit
              </h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="150"
                  max="600"
                  step="10"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-soft-gold cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-semibold text-secondary-text">
                  <span>$150</span>
                  <span className="text-primary-gold">${priceRange}</span>
                </div>
              </div>
            </div>

            {/* Fabric Filter */}
            <div className="space-y-3 pb-6 border-b border-border-custom">
              <h4 className="font-serif text-sm font-semibold tracking-wider text-primary-text">
                Fabrics
              </h4>
              <div className="flex flex-col gap-2 text-[11px] uppercase tracking-wider font-medium text-secondary-text">
                {fabrics.map((fab) => (
                  <button
                    key={fab}
                    onClick={() => setSelectedFabric(fab)}
                    className={`text-left hover:text-primary-gold transition-colors ${
                      selectedFabric === fab ? "text-primary-gold font-bold" : ""
                    }`}
                  >
                    {fab}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-3">
              <h4 className="font-serif text-sm font-semibold tracking-wider text-primary-text">
                Sizes Available
              </h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`p-2 border text-[10px] font-bold min-w-[36px] text-center transition-all ${
                      selectedSize === sz
                        ? "border-soft-gold bg-primary-gold text-champagne-gold"
                        : "border-border-custom bg-bg-card text-primary-text hover:border-secondary-gold/50"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {processedProducts.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border-custom p-8 bg-bg-card/40">
                <p className="font-serif text-lg text-secondary-text italic">
                  No designs match your filter query.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedFabric("All");
                    setSelectedSize("All");
                    setPriceRange(600);
                    setSearchQuery("");
                  }}
                  className="mt-4 px-6 py-2 bg-primary-gold text-bg-deep text-xs uppercase tracking-widest font-semibold border border-secondary-gold hover:bg-champagne-gold hover:text-primary-text transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {processedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="group relative bg-bg-card border border-border-custom p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(10,10,10,0.01)] hover:shadow-[0_8px_24px_rgba(10,10,10,0.04)] transition-all duration-500"
                  >
                    {/* Image box */}
                    <div className="relative h-[280px] sm:h-[360px] lg:h-[420px] bg-bg-secondary overflow-hidden border border-border-custom/50">
                      {prod.badge && (
                        <div className="absolute top-4 left-4 z-10 bg-primary-gold text-champagne-gold text-[8px] uppercase tracking-[0.2em] px-3.5 py-1 font-semibold border border-border-custom">
                          {prod.badge}
                        </div>
                      )}

                      <Link href={`/product/${prod.id}`} className="absolute inset-0">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                        />
                        <img
                          src={prod.hoverImage}
                          alt={`${prod.name} Alternate`}
                          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 opacity-0 group-hover:opacity-100"
                        />
                      </Link>

                      {/* Quick action triggers */}
                      <div className="absolute inset-0 bg-primary-gold/35 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4">
                        <button
                          onClick={() => setQuickViewProduct(prod)}
                          className="p-3 bg-bg-deep text-primary-text hover:bg-champagne-gold hover:text-primary-text transition-colors rounded-full"
                          title="Quick View"
                        >
                          <Eye className="w-4.5 h-4.5 stroke-[1.8]" />
                        </button>
                        <button
                          onClick={() => addToCart(prod, "M", 1)}
                          className="p-3 bg-bg-deep text-primary-text hover:bg-champagne-gold hover:text-primary-text transition-colors rounded-full"
                          title="Add to Cart"
                        >
                          <ShoppingBag className="w-4.5 h-4.5 stroke-[1.8]" />
                        </button>
                        <button
                          onClick={() => toggleWishlist(prod.id)}
                          className="p-3 bg-bg-deep text-primary-text hover:bg-champagne-gold hover:text-primary-text transition-colors rounded-full"
                          title="Wishlist"
                        >
                          <Heart
                            className={`w-4.5 h-4.5 stroke-[1.8] ${
                              wishlist.includes(prod.id) ? "fill-soft-gold text-primary-gold" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Copy details */}
                    <div className="pt-6">
                      <span className="text-[8px] uppercase tracking-[0.25em] text-muted-text font-bold block mb-1">
                        {prod.category}
                      </span>
                      <Link href={`/product/${prod.id}`}>
                        <h3 className="font-serif text-base font-semibold tracking-wide text-primary-text group-hover:text-primary-gold transition-colors">
                          {prod.name}
                        </h3>
                      </Link>

                      {/* Ratings */}
                      <div className="flex items-center gap-1 mt-2.5 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(prod.rating)
                                ? "fill-soft-gold text-primary-gold"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-[9px] text-muted-text ml-1">
                          ({prod.reviewsCount})
                        </span>
                      </div>

                      {/* Price and Cart Call to Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-border-custom">
                        <span className="font-serif text-base font-bold text-primary-text">
                          ${prod.discountPrice || prod.price}
                        </span>

                        <button
                          onClick={() => addToCart(prod, "M", 1)}
                          className="text-[9px] uppercase tracking-[0.3em] font-bold text-primary-text hover:text-primary-gold transition-colors flex items-center gap-1.5"
                        >
                          Quick Add <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Drawer Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <div
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 cursor-pointer"
            />
            <div className="fixed left-0 top-0 bottom-0 w-4/5 max-w-sm bg-bg-deep z-50 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-serif text-lg font-semibold tracking-wider">
                    Filters Lookbook
                  </h3>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Categories */}
                <div className="mb-6 space-y-2">
                  <h4 className="font-serif text-sm font-bold">Categories</h4>
                  <div className="flex flex-col gap-1.5 text-xs text-secondary-text">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsSidebarOpen(false);
                        }}
                        className={`text-left ${selectedCategory === cat ? "text-primary-gold font-bold" : ""}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Fabrics */}
                <div className="mb-6 space-y-2">
                  <h4 className="font-serif text-sm font-bold">Fabrics</h4>
                  <div className="flex flex-col gap-1.5 text-xs text-secondary-text">
                    {fabrics.map((fab) => (
                      <button
                        key={fab}
                        onClick={() => {
                          setSelectedFabric(fab);
                          setIsSidebarOpen(false);
                        }}
                        className={`text-left ${selectedFabric === fab ? "text-primary-gold font-bold" : ""}`}
                      >
                        {fab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Sizes */}
                <div>
                  <h4 className="font-serif text-sm font-bold mb-3">Sizes</h4>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => {
                          setSelectedSize(sz);
                          setIsSidebarOpen(false);
                        }}
                        className={`p-2 border text-[10px] font-bold min-w-[36px] text-center ${
                          selectedSize === sz
                            ? "border-soft-gold bg-primary-gold text-champagne-gold"
                            : "border-border-custom bg-bg-card"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <>
            <div
              onClick={() => setQuickViewProduct(null)}
              className="fixed inset-0 bg-black/70 z-40 cursor-pointer"
            />
            <div className="fixed inset-x-4 bottom-4 top-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-[#161616] z-50 w-full max-w-4xl p-6 md:p-10 shadow-2xl flex flex-col md:flex-row gap-8 overflow-y-auto max-h-[90vh] border border-secondary-gold text-[#F8F5EE]">
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 p-2"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="md:w-1/2 relative bg-bg-secondary overflow-hidden">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:w-1/2 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-primary-gold font-bold">
                    {quickViewProduct.category}
                  </span>
                  <h2 className="font-serif text-2xl font-light mt-2">{quickViewProduct.name}</h2>
                  <p className="text-xl font-bold mt-2 text-primary-gold">
                    ${quickViewProduct.price}
                  </p>
                  <p className="text-xs text-[#D9D2C4] mt-4 leading-relaxed font-light">
                    {quickViewProduct.description}
                  </p>

                  <div className="mt-6">
                    <span className="text-[10px] uppercase font-bold text-[#F8F5EE] block mb-2">
                      Select Size
                    </span>
                    <div className="flex gap-2">
                      {quickViewProduct.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setQuickViewSize(sz)}
                          className={`w-9 h-9 border text-xs font-bold flex items-center justify-center ${
                            quickViewSize === sz
                              ? "border-secondary-gold bg-primary-gold text-[#050505]"
                              : "border-[#262626] bg-[#161616] text-[#F8F5EE]"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToCart(quickViewProduct, quickViewSize, 1);
                    setQuickViewProduct(null);
                  }}
                  className="w-full py-3 bg-primary-gold text-bg-deep text-xs uppercase tracking-widest font-bold border border-secondary-gold hover:bg-champagne-gold hover:text-primary-text transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-deep flex items-center justify-center font-serif tracking-widest">LOADING ATELIER...</div>}>
      <ShopContent />
    </Suspense>
  );
}
