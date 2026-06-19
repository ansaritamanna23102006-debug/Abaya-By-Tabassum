"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/context/CartContext";
import { getDbProducts } from "@/lib/db";
import {
  Heart,
  ShoppingBag,
  Star,
  Eye,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// Register ScrollTrigger client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [productsList, setProductsList] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeCollectionTab, setActiveCollectionTab] = useState("All");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");

  useEffect(() => {
    async function loadProducts() {
      const data = await getDbProducts();
      setProductsList(Array.isArray(data) ? data : []);
    }
    loadProducts();
  }, []);

  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const collectionsRef = useRef(null);
  const aboutRef = useRef(null);

  // GSAP scroll trigger reveals on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero image parallax & scale
      gsap.fromTo(
        ".hero-img-container",
        { scale: 1.1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" },
        { scale: 1, duration: 2.2, ease: "power4.out" }
      );

      // Hero text lines reveal
      gsap.fromTo(
        ".hero-reveal-text",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.6, ease: "power3.out", stagger: 0.15 }
      );

      // Scroll reveals for sections
      gsap.fromTo(
        ".reveal-section-title",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: ".reveal-section-title",
            start: "top 85%",
          },
        }
      );

      // Asymmetrical collection card shifts
      gsap.fromTo(
        ".collection-stagger-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: "#collections",
            start: "top 75%",
          },
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const filteredProducts =
    activeCollectionTab === "All"
      ? productsList
      : productsList.filter((p) => p.category === activeCollectionTab);

  const collections = [
    {
      name: "Everyday Abayas",
      image: "/a1.png",
      tagline: "Uncompromising daily comfort",
      offsetClass: "md:mt-0",
    },
    {
      name: "Premium Abayas",
      image: "/a2.png",
      tagline: "Luminous silk satins and elegant layers",
      offsetClass: "md:mt-16",
    },
    {
      name: "Occasion Wear",
      image: "/a3.png",
      tagline: "Hand-finished metallic gold velvet threadwork",
      offsetClass: "md:-mt-8",
    },
    {
      name: "New Arrivals",
      image: "/a4.png",
      tagline: "Ethereal organza couture statement layers",
      offsetClass: "md:mt-8",
    },
  ];

  const testimonials = [
    {
      name: "Fatima Al-Suwaidi",
      role: "Verified Atelier Client",
      quote: "The drape and craftsmanship are absolute couture level. Opening the custom champagne packaging felt like receiving an haute-couture gown. The velvet details are so rich and fine.",
      rating: 5,
    },
    {
      name: "Reem Al-Mansoori",
      role: "Bespoke Collector",
      quote: "Abaya by Tabassum sets a new standard for luxury modesty. The customized sizing fit me perfectly, and the French Chantilly lace is incredibly soft and premium.",
      rating: 5,
    },
    {
      name: "Zainab Chaudhry",
      role: "Atelier Editor",
      quote: "Every fold shows meticulous attention to detail. The silk weight is perfect for both Gulf summers and elegant evening wear. Truly outstanding designs.",
      rating: 5,
    },
  ];

  const instagramPosts = [
    { id: 1, image: "/a5.png", link: "https://www.instagram.com/abaya_by_tabassum03/" },
    { id: 2, image: "/a6.png", link: "https://www.instagram.com/abaya_by_tabassum03/" },
    { id: 3, image: "/a7.png", link: "https://www.instagram.com/abaya_by_tabassum03/" },
    { id: 4, image: "/a8.png", link: "https://www.instagram.com/abaya_by_tabassum03/" },
    { id: 5, image: "/a9.png", link: "https://www.instagram.com/abaya_by_tabassum03/" },
    { id: 6, image: "/a10.png", link: "https://www.instagram.com/abaya_by_tabassum03/" },
  ];

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen bg-bg-deep text-primary-text overflow-hidden font-sans selection:bg-champagne-gold selection:text-primary-text"
    >
      <Navbar />
      <CartDrawer />

      {/* 1. Premium Editorial Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center pt-24 px-6 overflow-hidden bg-primary-gold"
      >
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0 opacity-55 hero-img-container">
          <img
            src="/a11.png"
            alt="Luxury Editorial Abaya Portrait"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/70" />
        </div>

        {/* Content Container (Asymmetrical alignment) */}
        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-white">
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 text-left">
            <div className="inline-flex items-center gap-2 border border-secondary-gold/30 px-4 py-1 bg-primary-gold/30 backdrop-blur-xs rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-champagne-gold" />
              <span className="text-[9px] uppercase tracking-[0.4em] font-semibold text-champagne-gold">
                The Haute Couture Atelier
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-7xl font-extralight tracking-wide leading-none hero-reveal-text">
              Timeless Elegance <br />
              <span className="font-serif italic font-light text-champagne-gold">
                in Every Fold
              </span>
            </h1>

            <p className="text-xs md:text-sm text-white/80 max-w-md uppercase tracking-[0.25em] leading-relaxed font-light hero-reveal-text">
              Premium Abayas Crafted for Grace, Comfort & Modesty
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 hero-reveal-text">
              <Link
                href="/shop"
                className="w-full sm:w-auto text-center px-8 sm:px-10 py-4 bg-primary-gold text-bg-deep text-xs uppercase tracking-[0.3em] font-bold border border-secondary-gold hover:bg-transparent hover:text-primary-gold transition-all duration-500 shadow-md cursor-pointer"
              >
                Shop Collection
              </Link>
              <a
                href="#about"
                className="w-full sm:w-auto text-center px-8 sm:px-10 py-4 bg-transparent text-primary-gold text-xs uppercase tracking-[0.3em] font-semibold border border-secondary-gold/30 hover:border-secondary-gold hover:text-primary-gold transition-all duration-500 cursor-pointer"
              >
                Explore Designs
              </a>
            </div>
          </div>

          {/* Right column: Offset secondary editorial box */}
          <div className="hidden lg:col-span-5 lg:flex justify-end">
            <div className="relative border border-border-custom p-3 bg-primary-gold/30 backdrop-blur-xs max-w-[320px]">
              <div className="h-[420px] w-full bg-bg-secondary overflow-hidden">
                <img
                  src="/a12.png"
                  alt="Atelier Campaign Lookbook"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-champagne-gold text-primary-text p-4 border border-luxury-black flex items-center gap-3">
                <Compass className="w-5 h-5 text-primary-text" />
                <span className="text-[9px] uppercase tracking-widest font-bold">
                  Bespoke Atelier Dubai
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-[8px] uppercase tracking-[0.3em] text-white/50 font-light">
            Scroll To Explore
          </span>
          <div className="w-[1px] h-12 bg-champagne-gold/40" />
        </div>
      </section>

      {/* 2. Asymmetrical Collections Lookbook Section */}
      <section id="collections" ref={collectionsRef} className="py-16 md:py-32 bg-bg-secondary/30 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20 reveal-section-title">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary-gold block mb-3">
              Curated Lookbook
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-primary-text">
              Featured Collections
            </h2>
            <div className="w-16 h-[1.5px] bg-champagne-gold mx-auto mt-6" />
          </div>

          {/* Asymmetrical Offset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            {collections.map((coll, idx) => (
              <Link
                key={coll.name}
                href={`/shop?category=${encodeURIComponent(coll.name)}`}
                className={`collection-stagger-card group relative overflow-hidden bg-primary-gold border border-border-custom shadow-[0_8px_32px_rgba(10,10,10,0.04)] cursor-pointer ${coll.offsetClass}`}
              >
                {/* Image panel with slow zoom */}
                <div className="h-[300px] md:h-[380px] lg:h-[480px] w-full relative">
                  <img
                    src={coll.image}
                    alt={coll.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Info display content overlay */}
                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-champagne-gold font-light mb-1">
                    Atelier 0{idx + 1}
                  </span>
                  <h3 className="font-serif text-xl font-medium tracking-wide text-white">
                    {coll.name}
                  </h3>
                  <p className="text-[10px] text-white/70 font-light tracking-wide italic mt-1.5 leading-relaxed">
                    {coll.tagline}
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-champagne-gold text-[9px] uppercase tracking-[0.3em] font-semibold opacity-0 transform translate-y-3 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                    Explore Look <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Story / About Brand Section (Refined Split Layout) */}
      <section id="about" ref={aboutRef} className="py-16 md:py-32 bg-bg-deep relative border-t border-b border-border-custom">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Split Left: On mobile show simple stacked image, on desktop show offset frames */}
            <div className="lg:col-span-6 relative">
              {/* Mobile: simple single image */}
              <div className="lg:hidden w-full aspect-[4/3] border border-border-custom p-2 bg-bg-card shadow-sm">
                <img
                  src="/a13.png"
                  alt="Fine stitching details"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Desktop: Dual Overlapping Image Frames */}
              <div className="hidden lg:flex items-center justify-center min-h-[500px] relative">
                {/* Back Image Frame */}
                <div className="absolute top-0 left-0 w-3/4 aspect-[3/4] border border-border-custom p-3 bg-bg-card shadow-sm transform -rotate-2">
                  <img
                    src="/a13.png"
                    alt="Fine stitching details"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Front Overlapping Image Frame */}
                <div className="relative z-10 w-2/3 ml-auto mt-24 aspect-[3/4] border border-border-custom p-3 bg-bg-card shadow-md transform rotate-1">
                  <img
                    src="/a15.png"
                    alt="Tabassum Design Studio Portrait"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Split Right: Story copy */}
            <div className="lg:col-span-6 space-y-6 md:space-y-8">
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary-gold">
                Atelier Heritage
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-light tracking-wide text-primary-text leading-tight">
                Designed for Grace, <br />
                <span className="font-serif italic font-light text-primary-gold">
                  Tailored for Distinction.
                </span>
              </h2>
              <p className="text-xs md:text-sm text-secondary-text leading-relaxed font-light">
                At Abaya By Tabassum, we believe an abaya is more than modest attire — it is an expression of identity, elegance, and inner strength. Each piece is sketched, sourced, and carefully tailored under personal supervision in our Jumeirah Atelier, utilizing the world's most premium silks, Japanese crepes, and Italian velvets.
              </p>
              <p className="text-xs md:text-sm text-secondary-text leading-relaxed font-light">
                Our design ethos is anchored in clean architectural lines, sophisticated modern shapes, and subtle haute couture accents. We prioritize comfort and modesty, ensuring every seam flows naturally and flatters with incomparable dignity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-6 border-t border-border-custom">
                <div>
                  <h4 className="font-serif text-sm font-semibold tracking-wider text-primary-gold">
                    Unmatched Quality
                  </h4>
                  <p className="text-[11px] text-secondary-text mt-2 font-light leading-relaxed">
                    Every design is subject to extensive checks to guarantee perfection.
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold tracking-wider text-primary-gold">
                    Personalized Attention
                  </h4>
                  <p className="text-[11px] text-secondary-text mt-2 font-light leading-relaxed">
                    Bespoke customization options to match your exact height and body profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Best Sellers Section (Refined Layout with Premium Cards) */}
      <section id="best-sellers" className="py-16 md:py-32 bg-bg-secondary/10 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header & Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 border-b border-border-custom pb-6">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary-gold block mb-3">
                Curated Favorites
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-primary-text">
                The Best Sellers
              </h2>
            </div>

            {/* Filter Tabs — horizontally scrollable on mobile */}
            <div className="flex items-center gap-5 mt-8 md:mt-0 text-[9px] uppercase tracking-[0.3em] font-bold overflow-x-auto pb-1 md:pb-0 scrollbar-none flex-nowrap md:flex-wrap">
              {["All", "Everyday Abayas", "Premium Abayas", "Occasion Wear", "New Arrivals"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCollectionTab(tab)}
                  className={`pb-2.5 transition-all duration-300 relative whitespace-nowrap flex-shrink-0 ${
                    activeCollectionTab === tab
                      ? "text-primary-gold font-bold"
                      : "text-muted-text hover:text-primary-text"
                  }`}
                >
                  {tab}
                  {activeCollectionTab === tab && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary-gold"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((prod) => (
                <motion.div
                  key={prod.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.6 }}
                  className="group relative bg-bg-card border border-border-custom p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(10,10,10,0.02)] hover:shadow-[0_12px_32px_rgba(10,10,10,0.06)] hover:border-secondary-gold/30 transition-all duration-500"
                >
                {/* Image Gallery Box */}
                  <div className="relative h-[300px] sm:h-[400px] lg:h-[480px] bg-bg-secondary overflow-hidden border border-border-custom/50">
                    {/* Badge Overlay */}
                    {prod.badge && (
                      <div className="absolute top-4 left-4 z-10 bg-primary-gold text-champagne-gold text-[8px] uppercase tracking-[0.2em] px-3.5 py-1 font-semibold border border-border-custom">
                        {prod.badge}
                      </div>
                    )}

                    {/* Standard & Hover Image Links */}
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

                    {/* Premium action buttons overlay */}
                    <div className="absolute inset-0 bg-primary-gold/30 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4">
                      <button
                        onClick={() => setQuickViewProduct(prod)}
                        className="p-3 bg-bg-deep text-primary-text hover:bg-champagne-gold hover:text-primary-text transition-colors rounded-full shadow-md"
                        title="Quick View"
                      >
                        <Eye className="w-4.5 h-4.5 stroke-[1.8]" />
                      </button>
                      <button
                        onClick={() => addToCart(prod, "M", 1)}
                        className="p-3 bg-bg-deep text-primary-text hover:bg-champagne-gold hover:text-primary-text transition-colors rounded-full shadow-md"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-4.5 h-4.5 stroke-[1.8]" />
                      </button>
                      <button
                        onClick={() => toggleWishlist(prod.id)}
                        className="p-3 bg-bg-deep text-primary-text hover:bg-champagne-gold hover:text-primary-text transition-colors rounded-full shadow-md"
                        title="Add to Wishlist"
                      >
                        <Heart
                          className={`w-4.5 h-4.5 stroke-[1.8] ${
                            wishlist.includes(prod.id) ? "fill-soft-gold text-primary-gold" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Copy content block */}
                  <div className="pt-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] uppercase tracking-[0.3em] text-muted-text font-bold block mb-1">
                        {prod.category}
                      </span>
                      <Link href={`/product/${prod.id}`}>
                        <h3 className="font-serif text-lg font-medium tracking-wide text-primary-text group-hover:text-primary-gold transition-colors">
                          {prod.name}
                        </h3>
                      </Link>

                      {/* Ratings stars */}
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
                          ({prod.reviewsCount} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Price and Cart Call to Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-border-custom">
                      <div>
                        {prod.discountPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-lg font-bold text-primary-gold">
                              ₹{prod.discountPrice}
                            </span>
                            <span className="text-[11px] text-primary-text/35 line-through">
                              ₹{prod.price}
                            </span>
                          </div>
                        ) : (
                          <span className="font-serif text-lg font-bold text-primary-text">
                            ₹{prod.price}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(prod, "M", 1)}
                        className="text-[9px] uppercase tracking-[0.3em] font-bold text-primary-text hover:text-primary-gold transition-colors flex items-center gap-1.5"
                      >
                        Quick Add <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section className="py-16 md:py-28 bg-primary-gold text-bg-deep border-t border-border-custom">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-10 md:mb-20">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-champagne-gold block mb-3">
              THE TABASSUM ATELIER
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-bg-deep">
              Atelier Craftsmanship & Values
            </h2>
            <div className="w-16 h-[1px] bg-champagne-gold mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
            {[
              {
                title: "Premium Fabric",
                desc: "Satin-silks, double georgettes, and heavy velvet sourced globally.",
              },
              {
                title: "Elegant Designs",
                desc: "Asymmetrical structures blending modern luxury with modest shapes.",
              },
              {
                title: "Quality Stitching",
                desc: "Hand-finished hems, durable lock-stitching, and bespoke sizing checks.",
              },
              {
                title: "Priority Delivery",
                desc: "Tracked worldwide shipping. Complementary courier delivery inside the UAE.",
              },
              {
                title: "Conceirge Care",
                desc: "24/7 client assistant for sizing modifications or custom lookbook inquiries.",
              },
            ].map((item, idx) => (
              <div
                key={item.title}
                className="flex flex-col items-center space-y-4 p-8 border border-border-custom/50 hover:border-secondary-gold/30 transition-all duration-300 bg-bg-card/[0.02]"
              >
                <div className="w-10 h-10 border border-border-custom flex items-center justify-center rounded-full text-champagne-gold text-xs font-semibold">
                  0{idx + 1}
                </div>
                <h3 className="font-serif text-sm font-semibold tracking-wider text-champagne-gold">
                  {item.title}
                </h3>
                <p className="text-[11px] text-bg-deep/60 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Instagram Section */}
      <section className="py-16 md:py-28 bg-bg-deep relative border-b border-border-custom">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary-gold block mb-3">
              EDITORIAL INSIGHTS
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-primary-text">
              Shared on Instagram
            </h2>
            <p className="text-xs text-muted-text mt-4 uppercase tracking-[0.2em] font-medium">
              Join the conversation at{" "}
              <a
                href="https://www.instagram.com/abaya_by_tabassum03/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-gold hover:underline font-bold"
              >
                @abaya_by_tabassum03
              </a>
            </p>
            <div className="w-16 h-[1.5px] bg-champagne-gold mx-auto mt-6" />
          </div>

          {/* Asymmetrical Grid layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-5">
            {instagramPosts.map((post, index) => (
              <a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative h-40 sm:h-48 bg-bg-secondary overflow-hidden border border-border-custom ${
                  index % 2 === 1 ? "md:translate-y-4" : ""
                }`}
              >
                <img
                  src={post.image}
                  alt="Instagram Lookbook Item"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-bg-deep text-[9px] uppercase tracking-widest font-semibold border border-secondary-gold px-3.5 py-1 bg-black/10">
                    View Look
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Testimonials (Luxury Reviews Cards) */}
      <section className="py-16 md:py-28 bg-bg-secondary/20 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary-gold block mb-3">
            Atelier Diaries
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-primary-text mb-16">
            Private Client Testimonials
          </h2>

          <div className="relative min-h-[220px] flex flex-col justify-center items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 bg-bg-card p-8 md:p-12 border border-border-custom shadow-sm relative"
              >
                {/* Gold border decorations */}
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t border-l border-soft-gold" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b border-r border-soft-gold" />

                <div className="flex justify-center gap-1.5">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 fill-soft-gold text-primary-gold" />
                  ))}
                </div>

                <p className="font-serif text-lg md:text-2xl text-primary-text/85 italic leading-relaxed font-light px-4 md:px-8">
                  "{testimonials[activeTestimonial].quote}"
                </p>

                <div className="pt-4">
                  <h4 className="font-serif text-sm font-semibold tracking-wider text-primary-text">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-[9px] text-primary-gold uppercase tracking-[0.3em] font-bold mt-1">
                    {testimonials[activeTestimonial].role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls */}
            <div className="flex justify-center items-center gap-8 mt-12">
              <button
                onClick={() =>
                  setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                }
                className="p-2.5 border border-secondary-gold/30 rounded-full hover:bg-champagne-gold hover:text-primary-text transition-colors"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-text">
                Atelier 0{activeTestimonial + 1} / 0{testimonials.length}
              </span>
              <button
                onClick={() =>
                  setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
                }
                className="p-2.5 border border-secondary-gold/30 rounded-full hover:bg-champagne-gold hover:text-primary-text transition-colors"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Newsletter Section */}
      <section className="py-16 md:py-32 bg-primary-gold text-bg-deep relative overflow-hidden border-t border-b border-border-custom">
        <div className="absolute inset-0 opacity-15">
          <img
            src="/a.png"
            alt="Fine Silk texture"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-champagne-gold">
            Atelier Newsletter
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-extralight tracking-wide text-bg-deep leading-tight">
            Stay Apprised of <br />
            <span className="font-serif italic font-light text-champagne-gold">
              Atelier Releases
            </span>
          </h2>
          <p className="text-[10px] md:text-xs text-bg-deep/65 max-w-lg mx-auto leading-relaxed font-light uppercase tracking-[0.2em]">
            Subscribe to receive private previews, custom bespoke sizing events, and limited collection releases.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Your subscription has been registered with our private atelier.");
            }}
            className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-4 pt-4"
          >
            <input
              type="email"
              placeholder="ENTER ATELIER EMAIL"
              className="bg-transparent border border-border-custom w-full text-[10px] p-4 focus:outline-none focus:border-secondary-gold text-bg-deep tracking-[0.3em] uppercase rounded-none text-center sm:text-left"
              required
            />
            <button className="px-8 py-4 bg-champagne-gold text-primary-text text-xs uppercase tracking-[0.25em] font-bold border border-secondary-gold hover:bg-transparent hover:text-primary-gold transition-all duration-300 whitespace-nowrap rounded-none w-full sm:w-auto">
              Join Atelier
            </button>
          </form>
        </div>
      </section>

      <Footer />

      {/* Quick View Modal Overlay */}
      <AnimatePresence>
        {quickViewProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              className="fixed inset-0 bg-black z-40 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 150 }}
              className="fixed inset-x-4 bottom-4 top-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-[#161616] z-50 w-full max-w-4xl p-6 md:p-10 shadow-2xl flex flex-col md:flex-row gap-8 overflow-y-auto max-h-[90vh] border border-secondary-gold text-[#F8F5EE]"
            >
              {/* Close Button */}
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 p-2 text-[#F8F5EE] hover:text-primary-gold transition-colors z-20"
                aria-label="Close details"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Left Column: Product gallery image */}
              <div className="md:w-1/2 relative bg-bg-secondary min-h-[300px] md:min-h-0 overflow-hidden border border-border-custom/50">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Right Column: Copy Details */}
              <div className="md:w-1/2 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-semibold block mb-2">
                    {quickViewProduct.category}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-wide text-[#F8F5EE]">
                    {quickViewProduct.name}
                  </h2>

                  {/* Price */}
                  <div className="flex items-center gap-3 mt-3">
                    {quickViewProduct.discountPrice ? (
                      <>
                        <span className="font-serif text-2xl font-bold text-primary-gold">
                          ${quickViewProduct.discountPrice}
                        </span>
                        <span className="text-sm text-muted-text line-through">
                          ${quickViewProduct.price}
                        </span>
                      </>
                    ) : (
                      <span className="font-serif text-2xl font-bold text-[#F8F5EE]">
                        ${quickViewProduct.price}
                      </span>
                    )}
                  </div>

                  {/* Rating summary */}
                  <div className="flex items-center gap-1.5 mt-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(quickViewProduct.rating)
                              ? "fill-soft-gold text-primary-gold"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[#D9D2C4] font-medium">
                      {quickViewProduct.rating} / 5.0 ({quickViewProduct.reviewsCount} verified reviews)
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#D9D2C4] leading-relaxed font-light mt-6">
                    {quickViewProduct.description}
                  </p>

                  {/* Size Options */}
                  <div className="mt-6">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-[#F8F5EE] block mb-3">
                      Select Size
                    </span>
                    <div className="flex gap-3">
                      {quickViewProduct.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-10 h-10 border text-xs font-semibold flex items-center justify-center transition-all ${
                            selectedSize === size
                              ? "border-secondary-gold bg-primary-gold text-[#050505] font-bold shadow-sm"
                              : "border-[#262626] bg-[#161616] text-[#F8F5EE] hover:border-secondary-gold/50"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Checkout trigger */}
                <div className="pt-6 border-t border-border-custom flex flex-col gap-3">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, selectedSize, 1);
                      setQuickViewProduct(null);
                    }}
                    className="w-full py-3 bg-primary-gold text-bg-deep text-xs uppercase tracking-widest font-semibold border border-secondary-gold hover:bg-primary-gold hover:text-primary-text transition-all duration-300"
                  >
                    Add to Cart
                  </button>
                  <p className="text-[9px] text-center text-muted-text uppercase tracking-widest">
                    Complimentary custom sizing options included on request.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
