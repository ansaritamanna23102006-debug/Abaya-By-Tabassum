"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { getDbProducts } from "@/lib/db";
import { ArrowRight, Sparkles, BookOpen, Compass, Layers } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Lookbook() {
  const [productsList, setProductsList] = useState([]);
  const [activeCampaign, setActiveCampaign] = useState("desert");

  useEffect(() => {
    async function loadProducts() {
      const data = await getDbProducts();
      setProductsList(Array.isArray(data) ? data : []);
    }
    loadProducts();
  }, []);

  const campaigns = {
    desert: {
      title: "Desert Winds Campaign",
      year: "2026 Edition",
      description: "A sensory exploration of structure and weightlessness against the golden sands of Dubai. Featuring raw Belgian flax-linens and flowing georgette textiles.",
      looks: [
        {
          id: "soraya-linen",
          name: "Soraya Sand Linen Abaya",
          fabric: "Belgian Flax Linen",
          image: "/a9.png",
          quote: "A testament to simple luxury, mirroring the shifting desert dunes."
        },
        {
          id: "layla-classic",
          name: "Layla Pleated Georgette Abaya",
          fabric: "Japanese Double Georgette",
          image: "/a7.png",
          quote: "Tailored to move naturally with wind, presenting an ever-changing silhouette."
        }
      ]
    },
    atelier: {
      title: "Jumeirah Studio Spreads",
      year: "Autumn Couture",
      description: "Inside the private Jumeirah Atelier, where our master artisans hand-apply Chantilly lace and metallic gold embroidery on heavy Royal Velvets.",
      looks: [
        {
          id: "noor-velvet",
          name: "Noor Midnight Velvet Abaya",
          fabric: "Royal Velvet",
          image: "/a3.png",
          quote: "Crafted for grand entrances under chandeliers, heavy with royal sophistication."
        },
        {
          id: "yasmin-lace",
          name: "Yasmin Chantilly Lace Abaya",
          fabric: "Premium Crepe & French Lace",
          image: "/a11.png",
          quote: "A delicate juxtaposition of architectural crepe and hand-aligned Chantilly lace."
        }
      ]
    },
    silk: {
      title: "Satin & Silk Reflections",
      year: "Evening Capsule",
      description: "Celebrating fluid grace with liquid-silk satin abayas that shine elegantly under evening lights, designed for the modern woman who values quiet luxury.",
      looks: [
        {
          id: "aria-silk",
          name: "Aria Emerald Silk Abaya",
          fabric: "Premium Silk Satin",
          image: "/a1.png",
          quote: "An ethereal drape of emerald silk that floats gracefully with every motion."
        },
        {
          id: "seraphina-organza",
          name: "Seraphina Ivory Organza Abaya",
          fabric: "Textured Organza & Cotton-Linen",
          image: "/a5.png",
          quote: "A layered composition of light and shadow, featuring balloon sleeves."
        }
      ]
    }
  };

  const activeData = campaigns[activeCampaign];

  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans selection:bg-champagne-gold selection:text-primary-text">
      <Navbar />
      <CartDrawer />

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-24 space-y-24">
        {/* Editorial Header */}
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary-gold block">
            Atelier Campaigns
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-primary-text">
            The Dedicated Lookbook
          </h1>
          <div className="w-16 h-[1px] bg-champagne-gold mx-auto" />
          <p className="max-w-xl mx-auto text-xs text-secondary-text uppercase tracking-widest leading-relaxed pt-2">
            An aesthetic showcase of luxury modesty, captured in bespoke campaigns and architectural styling spreads.
          </p>
        </div>

        {/* Campaign Toggle Tabs */}
        <div className="flex justify-center border-b border-border-custom pb-6">
          <div className="flex gap-8 overflow-x-auto scrollbar-none text-[10px] uppercase tracking-[0.35em] font-bold">
            {Object.keys(campaigns).map((key) => (
              <button
                key={key}
                onClick={() => setActiveCampaign(key)}
                className={`pb-2 transition-all relative ${
                  activeCampaign === key
                    ? "text-primary-gold font-bold"
                    : "text-muted-text hover:text-primary-text"
                }`}
              >
                {campaigns[key].title}
                {activeCampaign === key && (
                  <motion.div
                    layoutId="activeLookbookTab"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary-gold"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Editorial Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary-gold font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> {activeData.year}
            </span>
            <h2 className="font-serif text-2xl md:text-4xl font-light tracking-wide text-primary-text leading-tight">
              {activeData.title}
            </h2>
            <p className="text-xs text-secondary-text leading-relaxed font-light">
              {activeData.description}
            </p>
            <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest text-muted-text pt-4 border-t border-border-custom/50">
              <span className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5" /> Dubai</span>
              <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Handmade</span>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeData.looks.map((look) => {
              // Try to find product match in state to ensure ID/slug compatibility
              const match = productsList.find((p) => p.slug === look.id || p.id === look.id);
              const targetLink = match ? `/product/${match.id}` : `/shop`;

              return (
                <div
                  key={look.id}
                  className="group relative bg-bg-card border border-border-custom p-4 flex flex-col justify-between hover:border-secondary-gold/30 transition-all duration-500 shadow-sm"
                >
                  <div className="relative aspect-[3/4] bg-bg-secondary overflow-hidden border border-border-custom/50">
                    <img
                      src={look.image}
                      alt={look.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <Link
                        href={targetLink}
                        className="px-6 py-2.5 bg-bg-deep border border-secondary-gold text-primary-gold hover:bg-primary-gold hover:text-bg-deep text-[9px] uppercase tracking-widest font-bold transition-colors"
                      >
                        Shop Look
                      </Link>
                    </div>
                  </div>
                  <div className="pt-4 space-y-2">
                    <span className="text-[8px] uppercase tracking-widest text-muted-text font-bold block">
                      {look.fabric}
                    </span>
                    <h3 className="font-serif text-base font-semibold text-primary-text">
                      {look.name}
                    </h3>
                    <p className="text-[10px] text-secondary-text font-light italic leading-relaxed pt-1">
                      "{look.quote}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Editorial Spread Banner */}
        <div className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden border border-border-custom">
          <img
            src="/hero-bg.jpg"
            alt="Haute Couture Editorial Banner"
            className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.4]"
          />
          <div className="relative z-10 text-center text-white space-y-4 max-w-xl px-6">
            <span className="text-[9px] uppercase tracking-[0.4em] text-champagne-gold font-bold block">
              Private Atelier Customization
            </span>
            <h3 className="font-serif text-xl md:text-3xl font-light tracking-wide">
              Handcrafted to Your Exact Profile
            </h3>
            <p className="text-[10px] text-white/75 uppercase tracking-wider leading-relaxed">
              We offer bespoke hem length and size adjustments for all premium silk and velvet selections in our lookbooks.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-champagne-gold hover:text-white transition-colors"
              >
                Inquire With Concierge <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
