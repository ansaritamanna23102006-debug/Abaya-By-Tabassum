import React from "react";

export default function Logo({ className = "h-8", light = false }) {
  // Use CSS variable-based colors for full theme compatibility
  // goldColor always uses --primary-gold which adapts per theme
  // textColor uses --primary-text which also adapts per theme
  return (
    <div
      className={`flex flex-col items-center justify-center cursor-pointer select-none tracking-widest ${className}`}
    >
      {/* Elegantly styled Vector Monogram */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 transition-transform duration-500 hover:scale-105"
        style={{ color: "var(--primary-gold)" }}
      >
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.5" />
        <circle
          cx="50"
          cy="50"
          r="41"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="4 2"
        />
        {/* Monogram T and A representation */}
        <path
          d="M38 35 H62 M50 35 V70 M42 70 H58"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35 65 L50 42 L65 65"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
      </svg>
      {/* Brand Text */}
      <span
        className="mt-1 text-[11px] sm:text-xs font-serif font-semibold tracking-[0.18em] text-center"
        style={{ color: "var(--primary-gold)" }}
      >
        ABAYA BY TABASSUM
      </span>
      <span
        className="text-[8px] tracking-[0.4em] font-light uppercase text-center"
        style={{ color: "var(--primary-text)" }}
      >
        Atelier
      </span>
    </div>
  );
}
