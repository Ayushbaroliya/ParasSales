import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { useCategories } from "../hooks/useCategories";
import { useLanguage } from "../contexts/LanguageContext";
import WishlistBar from "./WishlistBar";
import CTA from "./CTA";
import Footer from "./Footer";

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "916260942161";

const ProductSkeleton = () => (
  <div className="products-grid">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="product-card skeleton-card">
        <div className="skeleton skeleton-img" />
        <div className="product-info">
          <div className="skeleton skeleton-line" style={{ width: "70%", height: 14 }} />
          <div className="skeleton skeleton-line" style={{ width: "95%", height: 11, marginTop: 6 }} />
          <div className="skeleton skeleton-line" style={{ width: "40%", height: 16, marginTop: 8 }} />
          <div className="skeleton skeleton-line" style={{ width: "100%", height: 36, marginTop: 10, borderRadius: 8 }} />
        </div>
      </div>
    ))}
  </div>
);

const Category = () => {
  const { id } = useParams();
  const { data: allCategories, loading, error } = useCategories();
  const { language } = useLanguage();
  const category = allCategories?.find((cat) => cat.id === id) ?? null;

  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wishlist")) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Scroll to top when category changes
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [id]);

  const toggleWishlist = (item) => {
    setWishlist((prev) =>
      prev.find((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  const sendToWhatsApp = () => {
    if (wishlist.length === 0) return alert("Select items first to send enquiry 😊");
    const msg = wishlist
      .map((item, idx) => `${idx + 1}. ${item.title} — ${item.price}\n   Image: ${item.image}`)
      .join("\n\n");
    const text = encodeURIComponent(`Hi! I'd like to enquire about:\n\n${msg}`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank");
  };

  if (loading) return <div className="page"><ProductSkeleton /></div>;

  if (error || (!loading && !category))
    return (
      <div className="page">
        <p className="api-error" style={{ padding: "40px 28px" }}>
          {error ? `⚠️ ${error}` : "Category not found."}
        </p>
        <Link to="/" className="back-btn">← {language === "en" ? "Back to Home" : "घर पर वापस जाएं"}</Link>
      </div>
    );

  return (
    <div className="page">
      {/* BACK */}
      <Link to="/" className="back-btn">← {language === "en" ? "Home" : "घर"}</Link>

      {/* CATEGORY HERO */}
      <section className="category-hero">
        <h1>{category.icon} {language === "en" ? category.name : (category.nameHi || category.name)}</h1>
        <p>{category.description}</p>
      </section>

      {/* NOTE: Filters (CategoryNav) lives in App.jsx — outside this component */}

      {/* PRODUCTS GRID */}
      <section className="products-grid">
        {category.items.map((item) => {
          const added = wishlist.some((i) => i.id === item.id);
          return (
            <div key={item.id} className={`product-card ${item.isOutOfStock ? 'out-of-stock' : ''}`}>
              <Link to={item.isOutOfStock ? "#" : `/product/${item.id}`} style={{ pointerEvents: item.isOutOfStock ? 'none' : 'auto' }}>
                <div style={{ position: 'relative' }}>
                  <img src={item.image} className="product-image" alt={item.title} loading="lazy" />
                  {item.isOutOfStock && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10
                    }}>
                      <div style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px'
                      }}>
                        OUT OF STOCK
                      </div>
                    </div>
                  )}
                </div>
              </Link>
              <div className="product-info">
                <h3>{item.title}</h3>
                <p className="product-desc">{item.desc}</p>
                <p className="product-price">{item.price}</p>

                <div className="product-actions">
                  <button
                    className={`wishlist-btn ${added ? "added" : ""}`}
                    onClick={() => toggleWishlist(item)}
                    disabled={item.isOutOfStock}
                    style={{
                      opacity: item.isOutOfStock ? 0.5 : 1,
                      cursor: item.isOutOfStock ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {item.isOutOfStock ? (language === "en" ? "Out of Stock" : "स्टॉक में नहीं") : (added ? (language === "en" ? "❤️ Remove" : "❤️ हटाएं") : (language === "en" ? "🤍 Wishlist" : "🤍 विशलिस्ट"))}
                  </button>
                  <a
                    href={item.isOutOfStock ? "#" : `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi! I'm interested in: ${item.title} (${item.price})\nImage: ${item.image}`)}`}
                    target={item.isOutOfStock ? "_self" : "_blank"}
                    rel="noreferrer"
                    className="wa-btn wa-card-btn"
                    style={{
                      opacity: item.isOutOfStock ? 0.5 : 1,
                      pointerEvents: item.isOutOfStock ? 'none' : 'auto',
                      cursor: item.isOutOfStock ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <FaWhatsapp />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <CTA sendToWhatsApp={sendToWhatsApp} />
      <Footer />

      {/* FLOATING WISHLIST BAR */}
      <WishlistBar wishlist={wishlist} sendToWhatsApp={sendToWhatsApp} />
    </div>
  );
};

export default Category;