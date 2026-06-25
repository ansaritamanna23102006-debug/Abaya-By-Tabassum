"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Send,
  ExternalLink
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "fitting", // fitting, custom_sizing, design_consultation, general
    preferredDate: "",
    msg: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate premium backend delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      inquiryType: "fitting",
      preferredDate: "",
      msg: ""
    });
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-bg-deep text-primary-text font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-24">
        {/* Page Hero Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto reveal-up mb-16">
          <span className="text-[10px] uppercase tracking-[0.4em] font-semibold text-primary-gold block">
            Atelier Concierge
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-primary-text">
            Bespoke Consultation & Booking
          </h1>
          <div className="w-16 h-[1.5px] bg-primary-gold mx-auto" />
          <p className="text-xs text-muted-text leading-relaxed font-normal pt-2">
            Experience the ultimate in premium modest fashion. Schedule a private viewing, request bespoke custom-tailored sizing, or consult with our master artisans.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Cards & Info */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* WhatsApp Premium Hook */}
            <div className="bg-bg-secondary/45 border border-primary-gold/15 p-6 space-y-4 transition-all hover:border-primary-gold/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#25D366]/10 text-[#25D366] rounded-full">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold tracking-wide text-primary-text">
                    Instant Concierge
                  </h3>
                  <p className="text-[11px] text-muted-text leading-relaxed mt-1">
                    Need immediate assistance with sizing, color matching, or placing a bespoke order? Chat directly with our stylists on WhatsApp.
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/919167600320?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20a%20custom%20abaya."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 shadow-sm"
              >
                <span>Start WhatsApp Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Atelier details card */}
            <div className="bg-bg-card border border-border-custom p-8 space-y-6">
              <h3 className="font-serif text-sm font-semibold tracking-[0.2em] text-primary-gold uppercase border-b border-border-custom/50 pb-3">
                Atelier Directory
              </h3>
              
              <ul className="space-y-5 text-xs text-secondary-text font-normal">
                <li className="flex items-start gap-3.5">
                  <MapPin className="w-4.5 h-4.5 text-primary-gold flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-primary-text">Headquarters & Showroom</p>
                    <p className="leading-relaxed text-[11px] text-muted-text">
                      House no 506, Sangam Society, Near Housing Board Colony, Wollen Chawl, Ambernath West, 421501
                    </p>
                    <a 
                      href="https://maps.google.com/?q=House+no+506+Sangam+Society+Ambernath+West" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-primary-gold font-semibold hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      <span>Get Directions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <Phone className="w-4.5 h-4.5 text-primary-gold flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-primary-text">Direct Contact</p>
                    <a href="tel:+919167600320" className="hover:text-primary-gold transition-colors block text-[11px] text-muted-text">
                      +91 91676 00320 (Call / SMS)
                    </a>
                    <a href="https://wa.me/919167600320" className="hover:text-primary-gold transition-colors block text-[10px] text-primary-gold font-medium">
                      +91 91676 00320 (WhatsApp Concierge)
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <Mail className="w-4.5 h-4.5 text-primary-gold flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-primary-text select-none">Mail</p>
                    <a href="mailto:abayabytabassum03@gmail.com" className="hover:text-primary-gold transition-colors text-[11px] text-muted-text">
                      abayabytabassum03@gmail.com
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <Clock className="w-4.5 h-4.5 text-primary-gold flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-primary-text">Atelier Hours</p>
                    <p className="text-[11px] text-muted-text">Monday – Saturday: 11:00 AM – 8:00 PM</p>
                    <p className="text-[11px] text-red-500 font-medium">Sunday: By Special Appointment Only</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Custom sizing policy highlight */}
            <div className="bg-bg-secondary/20 border border-border-custom p-6 rounded-none text-left">
              <div className="flex gap-2 text-primary-gold mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Bespoke Fitting Note</span>
              </div>
              <p className="text-[11px] text-muted-text leading-relaxed font-normal">
                Our custom-made pieces are tailormade to your exact measurements. Virtual video consults and in-person private fittings are available to ensure the perfect drape and length for your abaya or sheila set.
              </p>
            </div>

          </div>

          {/* Right Column: Dynamic Inquiry Form */}
          <div className="lg:col-span-7 bg-bg-card border border-border-custom p-8 md:p-10 shadow-xs relative">
            
            {/* Form State: Success Screen */}
            {isSubmitted ? (
              <div className="py-12 px-4 text-center space-y-6 flex flex-col items-center">
                <div className="p-4 bg-primary-gold/10 text-primary-gold rounded-full animate-bounce">
                  <CheckCircle2 className="w-12 h-12 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-2xl font-light tracking-wide text-primary-text">
                  Inquiry Received Successfully
                </h3>
                <p className="text-xs text-muted-text leading-relaxed max-w-md mx-auto">
                  Thank you for contacting the Atelier. Our concierge team has received your request. We will review your details and connect with you via email or WhatsApp within the next **12 to 24 hours** to complete your request.
                </p>
                <div className="pt-6">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-primary-gold text-bg-deep hover:bg-transparent hover:text-primary-gold text-[10px] uppercase tracking-widest font-bold border border-primary-gold transition-all duration-300"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              /* Form State: Interactive Input fields */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-border-custom/50 pb-4 mb-4">
                  <h2 className="font-serif text-lg font-medium text-primary-text">
                    Atelier Booking & Inquiries
                  </h2>
                  <p className="text-[11px] text-muted-text">
                    Fill out the form below, and our designers will prepare for your consultation.
                  </p>
                </div>

                {/* Inquiry Category Select */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text flex items-center gap-1">
                    <span>What can we help you with?</span>
                    <span className="text-primary-gold font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full bg-transparent border border-border-custom p-3.5 text-xs focus:outline-none focus:border-primary-gold text-primary-text rounded-none appearance-none cursor-pointer"
                      required
                    >
                      <option value="fitting" className="bg-bg-card">Schedule a Private Atelier Fitting</option>
                      <option value="custom_sizing" className="bg-bg-card">Request Bespoke Custom-Sizing Info</option>
                      <option value="design_consultation" className="bg-bg-card">Request Haute Couture Design Consultation</option>
                      <option value="general" className="bg-bg-card">General Sales & Product Inquiries</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-text text-[10px]">
                      ▼
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text">
                      Full Name <span className="text-primary-gold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ayesha Khan"
                      className="w-full bg-transparent border border-border-custom p-3.5 text-xs focus:outline-none focus:border-primary-gold text-primary-text rounded-none placeholder-muted-text/50"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text">
                      Email Address <span className="text-primary-gold">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full bg-transparent border border-border-custom p-3.5 text-xs focus:outline-none focus:border-primary-gold text-primary-text rounded-none placeholder-muted-text/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone / Whatsapp field */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text">
                      Contact Phone Number <span className="text-primary-gold">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-transparent border border-border-custom p-3.5 text-xs focus:outline-none focus:border-primary-gold text-primary-text rounded-none placeholder-muted-text/50"
                    />
                  </div>

                  {/* Conditional Datepicker Field for Fitting/Consultation */}
                  {(formData.inquiryType === "fitting" || formData.inquiryType === "design_consultation") && (
                    <div className="space-y-1.5 animate-fadeIn">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary-gold" />
                        <span>Preferred Appointment Date</span>
                        <span className="text-primary-gold">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full bg-transparent border border-border-custom p-3 text-xs focus:outline-none focus:border-primary-gold text-primary-text rounded-none appearance-none"
                      />
                    </div>
                  )}
                </div>

                {/* Message notes field */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-muted-text">
                    Inquiry Notes & Details <span className="text-primary-gold">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.msg}
                    onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                    placeholder={
                      formData.inquiryType === "fitting"
                        ? "Please list your preferred time slot, style interests, or group size if visiting with family..."
                        : formData.inquiryType === "custom_sizing"
                        ? "Please provide your height, bust size, sleeve length, and the specific design name you are ordering..."
                        : "Please describe your request, custom ideas, sizing specs, or design queries in detail..."
                    }
                    className="w-full bg-transparent border border-border-custom p-3.5 text-xs focus:outline-none focus:border-primary-gold text-primary-text rounded-none placeholder-muted-text/50 leading-relaxed"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-primary-gold text-bg-deep text-xs uppercase tracking-widest font-bold border border-primary-gold hover:bg-transparent hover:text-primary-gold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-bg-deep border-t-transparent rounded-full animate-spin" />
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
