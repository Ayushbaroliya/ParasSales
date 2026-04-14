import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaWhatsapp, FaHeart, FaRegHeart } from "react-icons/fa";
import { fetchProductById } from "../services/api";
import Footer from "./Footer";
import { useLanguage } from "../contexts/LanguageContext";
import { useWishlist } from "../contexts/WishlistContext";

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "916260942161";

const Product = () => {
  const { id } = useParams();
  const [state, setState] = useState({ item: null, category: null, loading: true, error: null });
  const { language } = useLanguage();
  const { toggleWishlist, isWishlisted } = useWishlist();

  useEffect(() => {
    setState({ item: null, category: null, loading: true, error: null });
    fetchProductById(id)
      .then(({ item, category }) => setState({ item, category, loading: false, error: null }))
      .catch((e) => setState({ item: null, category: null, loading: false, error: e.message }));
  }, [id]);

  const { item, category, loading, error } = state;

  if (loading)
    return (
      <div className="page product-detail-skeleton">
        <div className="skeleton" style={{ width: 120, height: 36, borderRadius: 10, margin: "28px" }} />
        <div className="product-detail">
          <div className="skeleton skeleton-img" style={{ height: 340, borderRadius: 16 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="skeleton skeleton-line" style={{ width: "80%", height: 28 }} />
            <div className="skeleton skeleton-line" style={{ width: "35%", height: 22 }} />
            <div className="skeleton skeleton-line" style={{ width: "95%", height: 13 }} />
            <div className="skeleton skeleton-line" style={{ width: "85%", height: 13 }} />
            <div className="skeleton skeleton-line" style={{ width: "50%", height: 44, borderRadius: 30, marginTop: 12 }} />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="page">
        <p className="api-error" style={{ padding: "40px 28px" }}>⚠️ {error}</p>
        <Link to="/" className="back-btn">← Home</Link>
      </div>
    );

  const added = isWishlisted(item.id);
  const waMsg = encodeURIComponent(
    `Hi! I'm interested in: ${item.title} (${item.price}). Please share details.\nImage: ${item.image}`
  );

  return (
    <div className="page">
      <Link to={`/category/${category.id}`} className="back-btn">
        ← {language === "en" ? category.name : (category.nameHi || category.name)}
      </Link>

      <div className={`product-detail ${item.isOutOfStock ? "out-of-stock" : ""}`}>
        <div style={{ position: "relative", overflow: "hidden", borderRadius: "var(--radius-lg)" }}>
          <img
            src={item.image || "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=800&auto=format&fit=crop"}
            alt={item.title}
            fetchPriority="high"
            decoding="async"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=800&auto=format&fit=crop"; }}
          />
          {item.isOutOfStock && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: "24px", fontWeight: "900",
              transform: "rotate(-10deg)", letterSpacing: "2px",
              textShadow: "0 4px 10px rgba(0,0,0,0.5)"
            }}>
              OUT OF STOCK
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <p className="detail-category-badge">{category.icon} {category.name}</p>
          <h1>{item.title}</h1>
          <p className="detail-price">{item.price}</p>
          {item.isOutOfStock && (
            <p style={{ color: "#ef4444", fontWeight: "bold", marginBottom: "10px" }}>⚠️ Currently unavailable</p>
          )}
          <p className="detail-desc">{item.desc}</p>

          {/* Action buttons row */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
            {/* Wishlist toggle */}
            <button
              className={`wishlist-btn ${added ? "added" : ""}`}
              onClick={() => !item.isOutOfStock && toggleWishlist(item)}
              disabled={item.isOutOfStock}
              style={{
                flex: "0 0 auto",
                padding: "12px 20px",
                fontSize: 14,
                borderRadius: "var(--radius)",
                display: "flex", alignItems: "center", gap: 7,
              }}
              aria-label={added ? "Remove from wishlist" : "Add to wishlist"}
            >
              {added
                ? <><FaHeart size={14} /> {language === "en" ? "Wishlisted" : "हटाएं"}</>
                : <><FaRegHeart size={14} /> {language === "en" ? "Add to Wishlist" : "विशलिस्ट में जोड़ें"}</>
              }
            </button>

            {/* WhatsApp enquiry */}
            <a
              href={item.isOutOfStock ? "#" : `https://wa.me/${WA_NUMBER}?text=${waMsg}`}
              target={item.isOutOfStock ? "_self" : "_blank"}
              rel="noreferrer"
              className="wa-btn wa-detail-btn"
              style={{
                opacity: item.isOutOfStock ? 0.5 : 1,
                pointerEvents: item.isOutOfStock ? "none" : "auto",
                backgroundColor: item.isOutOfStock ? "#64748b" : "var(--wa)",
              }}
            >
              <FaWhatsapp size={20} />
              {item.isOutOfStock
                ? (language === "en" ? "Out of Stock" : "स्टॉक में नहीं")
                : (language === "en" ? "Enquire on WhatsApp" : "व्हाट्सएप पर पूछताछ करें")
              }
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Product;