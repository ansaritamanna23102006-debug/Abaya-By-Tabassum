"use client";

import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";
import { Search, ShoppingBag, Heart, Menu, X, Sun, Moon, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { setIsCartOpen, cartCount, wishlist, theme, toggleTheme } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("abaya_logged_user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Error parsing logged user", e);
        }
      }
    }
  }, []);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Lookbook", href: "/lookbook" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
          isScrolled ? "pt-3 px-4 md:px-8" : "pt-6 px-6"
        }`}
      >
        {/* Navbar Container Capsule */}
        <div
          className={`max-w-6xl mx-auto w-full transition-all duration-700 glass-panel rounded-full border flex items-center justify-between relative ${
            isScrolled
              ? "shadow-[0_8px_32px_0_rgba(5,5,5,0.3)] py-3 px-8 border-primary-gold/25"
              : "shadow-[0_4px_24px_0_rgba(5,5,5,0.15)] py-4 px-8 border-primary-gold/15"
          }`}
        >
          {/* Left: Menu Links (Desktop) or Menu Button (Mobile) */}
          <div className="flex items-center md:w-[38%]">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-primary-text hover:text-primary-gold transition-colors p-2 -ml-2 cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>

            <nav className="hidden md:flex items-center gap-6 text-[10px] uppercase tracking-[0.3em] font-semibold text-secondary-text">
              {menuItems.slice(0, 3).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="hover:text-primary-gold transition-colors duration-300 relative group cursor-pointer"
                >
                  {item.label}
                  <span className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-0 h-[1px] bg-primary-gold transition-all duration-300 group-hover:w-1/2" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Brand Centerpiece Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-shrink-0">
            <Link href="/" className="transform transition-transform duration-500 hover:scale-105 cursor-pointer">
              <Logo className="h-9" />
            </Link>
          </div>

          {/* Right: Menu Links + Action Icons */}
          <div className="flex items-center justify-end gap-6 md:w-[38%]">
            <nav className="hidden md:flex items-center gap-6 text-[10px] uppercase tracking-[0.3em] font-semibold text-secondary-text mr-4">
              {menuItems.slice(3).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="hover:text-primary-gold transition-colors duration-300 relative group cursor-pointer"
                >
                  {item.label}
                  <span className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-0 h-[1px] bg-primary-gold transition-all duration-300 group-hover:w-1/2" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3 border-l border-border-custom pl-3 sm:pl-4 md:pl-6">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="hover:text-primary-gold transition-colors p-1.5 text-secondary-text cursor-pointer"
                aria-label="Toggle Theme"
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4 stroke-[1.8]" />
                ) : (
                  <Sun className="w-4 h-4 stroke-[1.8]" />
                )}
              </button>

              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hover:text-primary-gold transition-colors p-1.5 text-secondary-text cursor-pointer"
                aria-label="Search Collection"
              >
                <Search className="w-4 h-4 stroke-[1.8]" />
              </button>

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="relative p-1.5 hover:text-primary-gold transition-colors text-secondary-text cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 stroke-[1.8] ${
                    wishlist.length > 0 ? "fill-primary-gold text-primary-gold" : ""
                  }`}
                />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 bg-primary-gold text-bg-deep text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 hover:text-primary-gold transition-colors text-secondary-text cursor-pointer"
                aria-label="Open Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary-gold text-bg-deep text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile / Dashboard Link */}
              {user ? (
                <div className="relative group">
                  <Link
                    href={user.role === "Admin" || user.role === "Super Admin" ? "/admin/dashboard" : "/account/dashboard"}
                    className="p-1.5 hover:text-primary-gold transition-colors text-secondary-text flex items-center gap-1 cursor-pointer"
                    aria-label="Dashboard"
                  >
                    <User className="w-4 h-4 stroke-[1.8]" />
                  </Link>
                  <div className="absolute right-0 mt-2 w-48 bg-bg-card border border-border-custom shadow-lg py-2 rounded-md hidden group-hover:block z-50">
                    <span className="block px-4 py-2 text-[9px] text-muted-text uppercase tracking-wider border-b border-border-custom/50 font-bold">
                      Hello, {user.name}
                    </span>
                    <Link
                      href={user.role === "Admin" || user.role === "Super Admin" ? "/admin/dashboard" : "/account/dashboard"}
                      className="block px-4 py-2.5 text-[9px] text-primary-text hover:bg-bg-secondary/35 hover:text-primary-gold uppercase tracking-widest font-semibold transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={async () => {
                        const { logoutUser } = await import("@/lib/db");
                        await logoutUser();
                        window.location.href = "/login";
                      }}
                      className="w-full text-left block px-4 py-2.5 text-[9px] text-red-500 hover:bg-bg-secondary/35 uppercase tracking-widest font-semibold transition-colors border-t border-border-custom/50 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="p-1.5 hover:text-primary-gold transition-colors text-secondary-text cursor-pointer"
                  aria-label="Sign In"
                >
                  <User className="w-4 h-4 stroke-[1.8]" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-bg-deep z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-0 top-0 bottom-0 w-4/5 max-w-sm bg-bg-secondary z-50 flex flex-col p-8 shadow-2xl border-r border-border-custom"
            >
              <div className="flex justify-between items-center mb-12">
                <Logo className="h-8" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:text-primary-gold transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-5 text-[11px] uppercase tracking-[0.3em] font-semibold text-primary-text">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="hover:text-primary-gold transition-colors py-3 border-b border-border-custom cursor-pointer"
                  >
                    {item.label}
                  </Link>
                ))}
                {user && (
                  <Link
                    href={user.role === "Admin" || user.role === "Super Admin" ? "/admin/dashboard" : "/account/dashboard"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="hover:text-primary-gold transition-colors py-3 border-b border-border-custom cursor-pointer"
                  >
                    Dashboard
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={async () => {
                      const { logoutUser } = await import("@/lib/db");
                      await logoutUser();
                      window.location.href = "/login";
                    }}
                    className="text-left hover:text-red-500 transition-colors py-3 border-b border-border-custom cursor-pointer text-red-400 uppercase font-semibold"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="hover:text-primary-gold transition-colors py-3 border-b border-border-custom cursor-pointer"
                  >
                    Sign In
                  </Link>
                )}
              </nav>

              <div className="mt-auto pt-8 border-t border-border-custom text-[9px] text-muted-text space-y-4">
                <p className="uppercase tracking-[0.3em] font-bold text-primary-gold">
                  Abaya By Tabassum
                </p>
                <p>Concierge: abayabytabassum03@gmail.com</p>
                <p>© 2026. Custom Atelier Design.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Fullscreen Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bg-deep/95 backdrop-blur-md z-50 flex flex-col justify-center px-6 md:px-24"
          >
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 p-3 hover:text-primary-gold transition-colors text-primary-text cursor-pointer"
              aria-label="Close search"
            >
              <X className="w-7 h-7" />
            </button>

            <div className="max-w-2xl mx-auto w-full text-center">
              <h3 className="font-serif text-2xl md:text-4xl font-light tracking-wide text-primary-text mb-10">
                Search Lookbooks
              </h3>
              <form onSubmit={handleSearchSubmit} className="relative border-b border-primary-gold/30 pb-3 flex items-center">
                <input
                  type="text"
                  placeholder="WHAT ARE YOU SEEKING?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-lg md:text-2xl font-light focus:outline-none placeholder-primary-text/30 text-primary-text tracking-widest uppercase text-center"
                  autoFocus
                />
                <button type="submit" className="hover:text-primary-gold transition-colors text-primary-gold ml-2 flex-shrink-0 cursor-pointer" aria-label="Submit Search">
                  <Search className="w-5 h-5" />
                </button>
              </form>
              <p className="mt-4 text-[9px] text-muted-text uppercase tracking-[0.2em]">
                Explore premium silk abayas, velvet occasionwear, and everyday designs
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
