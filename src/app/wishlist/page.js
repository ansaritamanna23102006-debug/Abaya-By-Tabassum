"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/context/CartContext";
import { getDbProducts } from "@/lib/db";
import { Star, ShoppingBag, Trash2, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDbProducts();
        setProductsList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Wishlist failed to fetch DB products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter products that are in the user's wishlist
  const wishlistProducts = productsList.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans selection:bg-champagne-gold selection:text-primary-text">
      <Navbar />
      <CartDrawer />

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-24">
        {/* Page Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary-gold block mb-3">
            Your Desires
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-primary-text">
            The Atelier Wishlist
          </h1>
          <div className="w-16 h-[1px] bg-champagne-gold mx-auto mt-6" />
        </div>

        {wishlistProducts.length === 0 ? (
          /* Empty State */
          <div className="max-w-md mx-auto text-center py-20 border border-dashed border-border-custom p-8 bg-bg-card/40">
            <Heart className="w-12 h-12 text-champagne-gold/60 mx-auto mb-6 stroke-[1]" />
            <p className="font-serif text-lg text-secondary-text italic mb-2">
              Your wishlist is currently empty.
            </p>
            <p className="text-xs text-muted-text uppercase tracking-widest leading-relaxed mb-8">
              Explore our boutique collection and save your favorite silhouettes.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-gold text-bg-deep text-[10px] uppercase tracking-[0.25em] font-semibold border border-secondary-gold hover:bg-champagne-gold hover:text-primary-text transition-all duration-300"
            >
              Explore Boutique <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Grid of Wishlist Items */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistProducts.map((prod) => (
              <div
                key={prod.id}
                className="group relative bg-bg-card border border-border-custom p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(10,10,10,0.01)] hover:shadow-[0_8px_24px_rgba(10,10,10,0.04)] transition-all duration-500"
              >
                {/* Image Container */}
                <div className="relative h-[400px] bg-bg-secondary overflow-hidden border border-border-custom/50">
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
                  </Link>

                  {/* Quick Remove Trigger (Top Right overlay) */}
                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    className="absolute top-4 right-4 z-10 p-2.5 bg-bg-card/90 hover:bg-primary-gold text-primary-text hover:text-champagne-gold transition-colors shadow-xs rounded-full cursor-pointer"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
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

                  {/* Price and Cart Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-border-custom">
                    <span className="font-serif text-base font-bold text-primary-text">
                      ${prod.discountPrice || prod.price}
                    </span>

                    <button
                      onClick={() => {
                        addToCart(prod, "M", 1);
                        toggleWishlist(prod.id); // Option to clear from wishlist on purchase
                      }}
                      className="text-[9px] uppercase tracking-[0.3em] font-bold text-primary-text hover:text-primary-gold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      Buy Now <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
