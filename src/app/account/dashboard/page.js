"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDbOrders, logoutUser } from "@/lib/db";
import { User, ClipboardList, MapPin, Settings, LogOut, BellRing } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Read logged user state from auth tokens
    const logged = localStorage.getItem("abaya_logged_user");
    const token = localStorage.getItem("abaya_access_token");

    if (!logged || !token) {
      // Not authenticated — redirect to login
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(logged));
    } catch {
      router.push("/login");
      return;
    }

    async function fetchOrders() {
      try {
        const ords = await getDbOrders();
        setOrders(Array.isArray(ords) ? ords : []);
      } catch (e) {
        console.error("Failed to load orders:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [router]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-deep text-primary-text font-sans">
        <Navbar />
        <main className="max-w-md mx-auto px-6 pt-36 pb-24 text-center">
          <p className="text-xs text-muted-text uppercase tracking-widest">Loading your account...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 pt-36 pb-24">
        {/* Header summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border-custom pb-8 mb-12 gap-4">
          <div>
            <h1 className="font-serif text-3xl font-light tracking-wide">
              Welcome, {user.name}
            </h1>
            <p className="text-[10px] text-muted-text uppercase tracking-widest mt-1">
              Atelier Client Portal {user.role !== "Customer" && `• ${user.role}`}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-red-700 hover:text-red-900 border border-red-200 hover:border-red-900 p-2.5 px-4 bg-bg-card transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        {/* Dynamic tabs grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Navigation links — horizontal scrollable on mobile, vertical sidebar on lg */}
          <div className="lg:col-span-3">
            <div className="flex lg:flex-col gap-1 overflow-x-auto scrollbar-none pb-1 lg:pb-0 bg-bg-card border border-border-custom shadow-xs lg:p-0 p-2">
              {[
                { id: "orders", icon: ClipboardList, label: `My Orders (${orders.length})` },
                { id: "addresses", icon: MapPin, label: "Saved Addresses" },
                { id: "settings", icon: Settings, label: "Profile Details" },
                { id: "notifications", icon: BellRing, label: "Notifications" },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 lg:gap-3 p-2.5 lg:p-3 text-[10px] lg:text-xs uppercase tracking-wider font-semibold whitespace-nowrap flex-shrink-0 lg:flex-shrink text-left transition-colors border-b-2 lg:border-b-0 lg:border-l-2 ${
                    activeTab === id
                      ? "border-soft-gold text-primary-gold bg-bg-secondary/20"
                      : "border-transparent text-secondary-text hover:bg-bg-secondary/10"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Views content (Right Column) */}
          <div className="lg:col-span-9 bg-bg-card p-6 md:p-8 border border-border-custom shadow-xs min-h-[400px]">
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h3 className="font-serif text-lg font-semibold tracking-wider pb-3 border-b border-border-custom">
                  Order History
                </h3>
                {loading ? (
                  <p className="text-xs italic text-muted-text font-light py-8">
                    Loading your orders...
                  </p>
                ) : orders.length === 0 ? (
                  <p className="text-xs italic text-muted-text font-light py-8">
                    No orders placed yet.
                  </p>
                ) : (
                  orders.map((ord) => (
                    <div key={ord.id || ord._id} className="p-6 border border-border-custom bg-bg-card/40 space-y-4">
                      <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold">
                        <div>
                          <span className="text-muted-text">ID:</span> {ord.id}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`${
                            ord.paymentStatus === "Paid" ? "text-green-500" :
                            ord.paymentStatus === "Failed" ? "text-red-500" :
                            "text-yellow-500"
                          }`}>
                            {ord.paymentStatus || "Pending"}
                          </span>
                          <span className="text-primary-gold">{ord.status}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-secondary-text">
                        Date: {ord.date} | Total paid: ₹{ord.total}
                      </div>

                      <div className="border-t border-border-custom/50 pt-3 space-y-2">
                        {ord.items.map((item) => (
                          <div key={item.id || item.name} className="flex justify-between items-center text-xs">
                            <span className="font-medium text-primary-text">{item.name} ({item.selectedSize})</span>
                            <span className="text-muted-text">Qty: {item.quantity} | ₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="space-y-6">
                <h3 className="font-serif text-lg font-semibold tracking-wider pb-3 border-b border-border-custom">
                  Saved Delivery Addresses
                </h3>
                <div className="p-5 border border-border-custom bg-bg-card space-y-2 max-w-md">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-primary-gold">Home Primary</h4>
                  <p className="text-xs text-secondary-text leading-relaxed font-light">
                    {user.name}<br />
                    House no 506, Sangam Society,<br />
                    Near Housing Board Colony, Wollen Chawl,<br />
                    Ambernath West, 421501
                  </p>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <h3 className="font-serif text-lg font-semibold tracking-wider pb-3 border-b border-border-custom">
                  Profile Details
                </h3>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-muted-text font-bold block">Full Name</span>
                    <input type="text" readOnly value={user.name} className="w-full bg-bg-secondary/25 border border-border-custom p-2.5 text-xs text-secondary-text focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-muted-text font-bold block">Email Address</span>
                    <input type="text" readOnly value={user.email} className="w-full bg-bg-secondary/25 border border-border-custom p-2.5 text-xs text-secondary-text focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-muted-text font-bold block">Account Role</span>
                    <input type="text" readOnly value={user.role} className="w-full bg-bg-secondary/25 border border-border-custom p-2.5 text-xs text-secondary-text focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-muted-text font-bold block">Email Verified</span>
                    <input type="text" readOnly value={user.emailVerified ? "Verified ✓" : "Not Verified"} className="w-full bg-bg-secondary/25 border border-border-custom p-2.5 text-xs text-secondary-text focus:outline-none" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h3 className="font-serif text-lg font-semibold tracking-wider pb-3 border-b border-border-custom">
                  Notifications Preferences
                </h3>
                <div className="space-y-4 text-xs font-light text-secondary-text">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="accent-soft-gold cursor-pointer" />
                    <span>Send Order status adjustments via Email</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="accent-soft-gold cursor-pointer" />
                    <span>Send Atelier previews and collection lookbook events</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
