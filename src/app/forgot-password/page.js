"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();

      if (!res.ok && !json.success) {
        setError(json.message || "Failed to send reset link.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans">
      <Navbar />
      <main className="max-w-md mx-auto px-6 pt-36 pb-24 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-gold block">
            Atelier Account Recovery
          </span>
          <h1 className="font-serif text-3xl font-light tracking-wide">
            Reset Password
          </h1>
          <div className="w-16 h-[1px] bg-champagne-gold mx-auto" />
        </div>

        <form onSubmit={handleResetRequest} className="space-y-6 bg-bg-card p-8 border border-border-custom shadow-xs">
          {error && (
            <div className="p-3 border border-red-600/40 bg-red-900/20 text-red-400 text-xs text-center tracking-wide">
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-4 text-center">
              <div className="p-4 border border-green-600/40 bg-green-900/20 text-green-400 text-xs tracking-wide leading-relaxed">
                If the email is registered, a password reset link has been sent to your inbox. Please check your email and follow the instructions.
              </div>
              <Link
                href="/login"
                className="inline-block text-[10px] text-primary-gold uppercase tracking-widest font-bold hover:underline mt-2"
              >
                ← Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <p className="text-[11px] text-secondary-text leading-relaxed font-light text-center">
                Enter your email address below, and we will send you instructions to reset your password.
              </p>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border border-border-custom p-3 text-xs focus:outline-none focus:border-soft-gold text-primary-text"
                  disabled={loading}
                />
              </div>

              <button
                disabled={loading}
                className="w-full py-3 bg-primary-gold text-bg-deep text-xs uppercase tracking-widest font-bold border border-secondary-gold hover:bg-champagne-gold hover:text-primary-text transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <p className="text-[10px] text-center text-muted-text uppercase tracking-wider mt-2">
                <Link href="/login" className="text-primary-gold font-bold hover:underline">
                  ← Back to Sign In
                </Link>
              </p>
            </>
          )}
        </form>
      </main>
      <Footer />
    </div>
  );
}
