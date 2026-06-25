"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("abaya_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart data", e);
      }
    }

    const savedWishlist = localStorage.getItem("abaya_wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Error parsing wishlist data", e);
      }
    }
  }, []);

  // Save cart to localStorage
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem("abaya_cart", JSON.stringify(items));
  };

  // Save wishlist to localStorage
  const saveWishlist = (items) => {
    setWishlist(items);
    localStorage.setItem("abaya_wishlist", JSON.stringify(items));
  };

  const addToCart = (product, size = "M", quantity = 1) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.id === product.id && item.selectedSize === size
    );

    let newCart = [...cartItems];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({
        ...product,
        selectedSize: size,
        quantity,
      });
    }
    saveCart(newCart);
    setIsCartOpen(true); // Auto-open cart drawer on addition
  };

  const removeFromCart = (productId, size) => {
    const newCart = cartItems.filter(
      (item) => !(item.id === productId && item.selectedSize === size)
    );
    saveCart(newCart);
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    const newCart = cartItems.map((item) => {
      if (item.id === productId && item.selectedSize === size) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCart(newCart);
  };

  const toggleWishlist = (productId) => {
    let newWishlist = [...wishlist];
    if (newWishlist.includes(productId)) {
      newWishlist = newWishlist.filter((id) => id !== productId);
    } else {
      newWishlist.push(productId);
    }
    saveWishlist(newWishlist);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
