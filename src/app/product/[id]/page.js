"use client";

import React, { useState, use, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/context/CartContext";
import { getDbProducts, getDbReviews } from "@/lib/db";
import { Star, ShieldCheck, Heart, ShoppingBag, ArrowLeft, CheckCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [selectedSize, setSelectedSize] = useState("M");
  const [customLength, setCustomLength] = useState("56");
  const [activeTab, setActiveTab] = useState("description");
  
  const [productsList, setProductsList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const prods = await getDbProducts();
        const revs = await getDbReviews();
        setProductsList(Array.isArray(prods) ? prods : []);
        setReviewsList(Array.isArray(revs) ? revs : []);
      } catch (err) {
        console.error("Failed to load product details from DB:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Find the current product
  const product = productsList.find((p) => p.id === productId);

  // Active gallery image
  const [activeImage, setActiveImage] = useState(null);

  // Update active image when product changes
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  // Image zoom magnification state
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });

  const handleMouseMove = (e) => {
    if (!activeImage) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "220%",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-deep text-primary-text font-sans flex items-center justify-center">
        <p className="font-serif text-sm tracking-widest text-primary-gold animate-pulse uppercase">Loading Atelier Silhouettes...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-bg-deep text-primary-text font-sans flex flex-col items-center justify-center gap-4">
        <p className="font-serif text-lg text-secondary-text">Silhouette not found</p>
        <Link href="/shop" className="text-xs uppercase tracking-widest text-primary-gold hover:underline">Back to Boutique</Link>
      </div>
    );
  }

  // Find related products (same category, excluding current product)
  const relatedProducts = productsList
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Filter reviews matching current product
  const productReviews = reviewsList.filter((r) => r.product === product.name);

  return (
    <div className="relative min-h-screen bg-bg-deep text-primary-text font-sans selection:bg-champagne-gold selection:text-primary-text">
      <Navbar />
      <CartDrawer />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-24">
        {/* Back navigation */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold hover:text-primary-gold transition-colors mb-12 text-secondary-text"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Boutique
        </Link>

        {/* Product Details Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-24">
          {/* Gallery Images Container (Left) */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
            {/* Thumbnails list */}
            <div className="flex md:flex-col gap-4 order-2 md:order-1">
              {[product.image, product.hoverImage].filter(img => img && img !== "").map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-16 h-24 bg-bg-secondary overflow-hidden border transition-all ${
                    activeImage === imgUrl ? "border-soft-gold scale-105" : "border-border-custom hover:border-secondary-gold/50"
                  }`}
                >
                  <img src={imgUrl} alt="Lookbook thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Magnified active preview image */}
            <div
              className="flex-1 h-[350px] sm:h-[500px] lg:h-[600px] bg-bg-secondary relative overflow-hidden border border-border-custom order-1 md:order-2 cursor-zoom-in shadow-xs"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={activeImage || product.image || null}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {/* Zoom overlay lens */}
              <div
                style={zoomStyle}
                className="absolute inset-0 pointer-events-none bg-no-repeat bg-cover hidden md:block"
              />

              {product.badge && (
                <div className="absolute top-4 left-4 bg-primary-gold text-champagne-gold text-[8px] uppercase tracking-widest px-3.5 py-1 font-semibold border border-border-custom">
                  {product.badge}
                </div>
              )}
            </div>
          </div>

          {/* Copy details and purchases (Right) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Breadcrumb / Category */}
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary-gold font-bold block">
                {product.category}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-primary-text leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3">
                {product.discountPrice ? (
                  <>
                    <span className="font-serif text-3xl font-semibold text-primary-gold">
                      ₹{product.discountPrice}
                    </span>
                    <span className="text-sm text-muted-text line-through">
                      ₹{product.price}
                    </span>
                  </>
                ) : (
                  <span className="font-serif text-3xl font-semibold text-primary-text">
                    ₹{product.price}
                  </span>
                )}
              </div>

              {/* Verified Ratings */}
              <div className="flex items-center gap-1.5 pb-6 border-b border-border-custom">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating) ? "fill-soft-gold text-primary-gold" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-muted-text uppercase tracking-wider font-semibold">
                  {product.rating} / 5.0 ({product.reviewsCount} reviews)
                </span>
              </div>

              {/* Description summary */}
              <p className="text-[13px] text-secondary-text leading-relaxed font-light">
                {product.description}
              </p>

              {/* Premium Size Selector & Custom Length */}
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-primary-text">
                      Select Size
                    </span>
                  </div>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-bg-card border border-border-custom p-3 text-xs focus:outline-none focus:border-soft-gold text-primary-text cursor-pointer"
                  >
                    {product.sizes && product.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-primary-text block">
                    Abaya Length (inches)
                  </span>
                  <input
                    type="number"
                    min="48"
                    max="62"
                    placeholder="e.g. 56"
                    value={customLength}
                    onChange={(e) => setCustomLength(e.target.value)}
                    className="w-full bg-bg-card border border-border-custom p-2.5 text-xs focus:outline-none focus:border-soft-gold text-primary-text"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons (Add to cart & Wishlist) */}
            <div className="space-y-4 pt-6 border-t border-border-custom">
              <div className="flex gap-4">
                <button
                  onClick={() => addToCart(product, `${selectedSize} / ${customLength}" Length`, 1)}
                  className="flex-1 py-4 bg-primary-gold text-bg-deep text-xs uppercase tracking-[0.3em] font-bold border border-secondary-gold/40 hover:bg-champagne-gold hover:text-primary-text transition-all duration-500 shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="p-4 border border-border-custom bg-bg-card text-primary-text hover:border-secondary-gold/40 transition-colors flex items-center justify-center"
                  title="Add to Wishlist"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      wishlist.includes(product.id) ? "fill-soft-gold text-primary-gold" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Luxury features badge list */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-6 text-[9px] text-secondary-text font-light uppercase tracking-widest text-center">
                <div className="flex flex-col items-center gap-1.5 p-3.5 bg-bg-secondary/35 border border-border-custom/50">
                  <CheckCircle className="w-4 h-4 text-primary-gold" />
                  <span>Complementary Sheila</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-3.5 bg-bg-secondary/35 border border-border-custom/50">
                  <ShieldCheck className="w-4 h-4 text-primary-gold" />
                  <span>Bespoke Fit Checks</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-3.5 bg-bg-secondary/35 border border-border-custom/50">
                  <RefreshCcw className="w-4 h-4 text-primary-gold" />
                  <span>Easy Alterations</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs (Description, Fabric, Care, Shipping) */}
        <div className="border-t border-b border-border-custom py-16 mb-24">
          <div className="max-w-3xl">
            <div className="flex gap-4 sm:gap-8 border-b border-border-custom/50 pb-3 text-[10px] uppercase tracking-widest font-semibold overflow-x-auto">
              {["description", "fabric-care", "shipping"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2.5 transition-all relative ${
                    activeTab === tab ? "text-primary-gold font-bold" : "text-muted-text hover:text-primary-text"
                  }`}
                >
                  {tab.replace("-", " & ")}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary-gold" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 text-xs leading-relaxed font-light text-secondary-text space-y-4">
              {activeTab === "description" && (
                <>
                  <p>{product.description}</p>
                  <ul className="list-disc pl-5 space-y-2 mt-4 text-primary-text/85">
                    {product.details && product.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </>
              )}

              {activeTab === "fabric-care" && (
                <div className="space-y-4 text-[13px]">
                  <p>
                    <strong>Fabric Profile:</strong> {product.fabric || "Premium Crepe / Silk satin"}
                  </p>
                  <p>
                    <strong>Fit Type:</strong> {product.fit || "Standard Flowing Silhouette"}
                  </p>
                  <p>
                    To maintain the immaculate drape and detailing of your custom Abaya, we strongly recommend professional dry cleaning. Avoid harsh mechanical spinning or heated drying. Keep stored inside the garment cover provided.
                  </p>
                </div>
              )}

              {activeTab === "shipping" && (
                <p className="text-[13px]">
                  All our garments are customized and finished to order in our Dubai Jumeirah Atelier. Local orders inside the UAE are completed and delivered within 2-3 business days. International express shipping is handled via FedEx/DHL and takes 5-7 business days depending on customs processing in your destination region.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mb-24">
          <h3 className="font-serif text-2xl font-light tracking-wide text-primary-text mb-10">
            Verified Customer Reviews ({productReviews.length})
          </h3>

          {productReviews.length === 0 ? (
            <p className="text-xs italic text-muted-text font-light">
              No reviews yet for this limited edition design. Be the first to share your experience.
            </p>
          ) : (
            <div className="space-y-8">
              {productReviews.map((rev) => (
                <div key={rev.id} className="pb-6 border-b border-border-custom">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-primary-text">{rev.name}</h4>
                      <p className="text-[10px] text-muted-text font-light mt-0.5">{rev.date}</p>
                    </div>
                    <div className="flex">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-soft-gold text-primary-gold" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-secondary-text leading-relaxed font-light mt-3">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 className="font-serif text-2xl font-light tracking-wide text-primary-text mb-10 text-center">
              You May Also Appreciate
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group relative bg-bg-card border border-border-custom p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="relative h-[260px] sm:h-[320px] lg:h-[380px] bg-bg-secondary overflow-hidden border border-border-custom/50">
                    <img
                      src={p.image || null}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="pt-4 flex justify-between items-start">
                    <div>
                      <span className="text-[8px] uppercase tracking-[0.2em] text-muted-text font-bold block mb-1">
                        {p.category}
                      </span>
                      <h4 className="font-serif text-sm font-medium text-primary-text group-hover:text-primary-gold transition-colors">
                        {p.name}
                      </h4>
                    </div>
                    <span className="font-serif text-sm font-semibold text-primary-gold ml-2">₹{p.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
