"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone: phone || undefined }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // Store auth tokens and user data
      const { user, accessToken, refreshToken } = json.data;
      localStorage.setItem("abaya_logged_user", JSON.stringify(user));
      localStorage.setItem("abaya_access_token", accessToken);
      localStorage.setItem("abaya_refresh_token", refreshToken);

      // Redirect to homepage
      router.push("/");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans flex items-center justify-center">
      <main className="max-w-md w-full px-6 py-12 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-gold block">
            Atelier Registration
          </span>
          <h1 className="font-serif text-3xl font-light tracking-wide">
            Create Account
          </h1>
          <div className="w-16 h-[1px] bg-champagne-gold mx-auto" />
        </div>

        <form onSubmit={handleRegister} className="space-y-6 bg-bg-card p-8 border border-border-custom shadow-xs">
          {error && (
            <div className="p-3 border border-red-600/40 bg-red-900/20 text-red-400 text-xs text-center tracking-wide">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border border-border-custom p-3 text-xs focus:outline-none focus:border-soft-gold text-primary-text"
              disabled={loading}
            />
          </div>

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

          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+971 50 123 4567"
              className="w-full bg-transparent border border-border-custom p-3 text-xs focus:outline-none focus:border-soft-gold text-primary-text"
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-border-custom p-3 text-xs focus:outline-none focus:border-soft-gold text-primary-text"
              disabled={loading}
            />
            <p className="text-[8px] text-muted-text tracking-wide">Minimum 6 characters</p>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 bg-primary-gold text-bg-deep text-xs uppercase tracking-widest font-bold border border-secondary-gold hover:bg-champagne-gold hover:text-primary-text transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register Account"}
          </button>

          <p className="text-[10px] text-center text-muted-text uppercase tracking-wider mt-4">
            Already registered?{" "}
            <Link href="/login" className="text-primary-gold font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
