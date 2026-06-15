"use client";

import React, { useState, useMemo, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDbProducts } from "@/lib/db";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDbProducts();
        setProductsList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Search failed to fetch DB products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const results = useMemo(() => {
    if (!query) return [];
    return productsList.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(query.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(query.toLowerCase())
    );
  }, [query, productsList]);

  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-36 pb-24 text-center space-y-12">
        <h1 className="font-serif text-3xl font-light tracking-wide">
          Search Results for "{query}"
        </h1>
        <div className="w-16 h-[1px] bg-champagne-gold mx-auto" />

        {results.length === 0 ? (
          <p className="text-xs italic text-muted-text font-light">
            No products matched your search. Try searching for "Silk" or "Velvet".
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            {results.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="group border border-border-custom p-4 bg-bg-card"
              >
                <div className="h-80 overflow-hidden bg-bg-secondary">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-base font-semibold mt-4 text-primary-text group-hover:text-primary-gold transition-colors">
                  {p.name}
                </h3>
                <p className="text-sm font-bold text-primary-gold mt-2">₹{p.price}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-deep flex items-center justify-center font-serif tracking-widest">LOADING SEARCH...</div>}>
      <SearchContent />
    </Suspense>
  );
}
