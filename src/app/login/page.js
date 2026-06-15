"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user just verified their email
    if (searchParams.get("verified") === "true") {
      setSuccessMessage("Email verified successfully. You can now sign in.");
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      // Store auth tokens and user data
      const { user, accessToken, refreshToken } = json.data;
      localStorage.setItem("abaya_logged_user", JSON.stringify(user));
      localStorage.setItem("abaya_access_token", accessToken);
      localStorage.setItem("abaya_refresh_token", refreshToken);

      // Redirect based on role
      if (user.role === "Admin" || user.role === "Super Admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {successMessage && (
        <div className="p-3 border border-green-600/40 bg-green-900/20 text-green-400 text-xs text-center tracking-wide">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6 bg-bg-card p-8 border border-border-custom shadow-xs">
        {error && (
          <div className="p-3 border border-red-600/40 bg-red-900/20 text-red-400 text-xs text-center tracking-wide">
            {error}
          </div>
        )}

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
          <div className="flex justify-between items-center">
            <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text">
              Password
            </label>
            <Link href="/forgot-password" className="text-[9px] uppercase tracking-widest font-bold text-primary-gold hover:underline">
              Forgot?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-border-custom p-3 text-xs focus:outline-none focus:border-soft-gold text-primary-text"
            disabled={loading}
          />
        </div>

        <button
          disabled={loading}
          className="w-full py-3 bg-primary-gold text-bg-deep text-xs uppercase tracking-widest font-bold border border-secondary-gold hover:bg-champagne-gold hover:text-primary-text transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Authenticating..." : "Sign In"}
        </button>

        <p className="text-[10px] text-center text-muted-text uppercase tracking-wider mt-4">
          New to the Atelier?{" "}
          <Link href="/register" className="text-primary-gold font-bold hover:underline">
            Create Account
          </Link>
        </p>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans flex items-center justify-center">
      <main className="max-w-md w-full px-6 py-12 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-gold block">
            Atelier Account
          </span>
          <h1 className="font-serif text-3xl font-light tracking-wide">
            Sign In
          </h1>
          <div className="w-16 h-[1px] bg-champagne-gold mx-auto" />
        </div>

        <Suspense fallback={
          <div className="bg-bg-card p-8 border border-border-custom shadow-xs text-center">
            <p className="text-xs text-muted-text tracking-widest uppercase">Loading...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
