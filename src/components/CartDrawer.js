"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-bg-secondary shadow-2xl z-50 flex flex-col border-l border-border-custom"
          >
            {/* Header */}
            <div className="p-6 border-b border-border-custom flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary-gold" />
                <h2 className="font-serif text-xl font-semibold tracking-wider text-primary-text">
                  YOUR BAG
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-primary-text hover:text-primary-gold transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag className="w-12 h-12 text-primary-gold/40 stroke-[1.5]" />
                  <p className="font-serif text-lg text-secondary-text italic">
                    Your luxury bag is currently empty
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 px-6 py-2 bg-primary-gold text-bg-deep text-xs uppercase tracking-widest font-semibold border border-primary-gold hover:bg-transparent hover:text-primary-gold transition-all duration-300 cursor-pointer"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.selectedSize}`}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 pb-6 border-b border-border-custom/50 items-stretch"
                  >
                    {/* Image */}
                    <div className="w-20 h-28 bg-bg-deep relative overflow-hidden flex-shrink-0 border border-border-custom">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-sm font-medium tracking-wide text-primary-text">
                            {item.name}
                          </h3>
                          <span className="font-medium text-sm text-primary-gold ml-2">
                            ${item.price}
                          </span>
                        </div>
                        <p className="text-xs text-muted-text mt-1 font-light">
                          Size: <span className="font-medium text-primary-text">{item.selectedSize}</span>
                        </p>
                      </div>

                      {/* Quantity Selector & Remove */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-border-custom rounded-none bg-bg-card">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                            className="p-1 px-2 text-secondary-text hover:text-primary-gold transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-medium w-8 text-center select-none text-primary-text">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                            className="p-1 px-2 text-secondary-text hover:text-primary-gold transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id, item.selectedSize)}
                          className="text-muted-text hover:text-red-500 transition-colors p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-border-custom bg-bg-deep">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs uppercase tracking-widest font-semibold text-muted-text">
                    Estimated Subtotal
                  </span>
                  <span className="font-serif text-xl font-bold text-primary-gold">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-muted-text mb-6 uppercase tracking-wider">
                  Shipping, duties, and taxes calculated at checkout.
                </p>

                <div className="space-y-3">
                  <button className="w-full py-3 bg-primary-gold text-bg-deep text-xs uppercase tracking-widest font-semibold border border-primary-gold hover:bg-transparent hover:text-primary-gold transition-all duration-300 rounded-none shadow-md cursor-pointer">
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-2 bg-transparent text-primary-text text-xs uppercase tracking-widest font-medium border border-transparent hover:border-border-custom hover:bg-bg-card transition-all duration-300 rounded-none cursor-pointer"
                  >
                    Or Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
