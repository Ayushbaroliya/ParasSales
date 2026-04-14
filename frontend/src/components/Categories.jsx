import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaWhatsapp, FaHeart, FaRegHeart } from "react-icons/fa";
import { useCategories } from "../hooks/useCategories";
import { useLanguage } from "../contexts/LanguageContext";
import { useWishlist } from "../contexts/WishlistContext";
import CTA from "./CTA";
import Footer from "./Footer";

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "916260942161";

const ProductSkeleton = () => (
  <div className="products-grid">
    {Array.from({ length: 6 }).map((_, i) => (
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
  const { toggleWishlist, isWishlisted } = useWishlist();

  const category = allCategories?.find((cat) => cat.id === id) ?? null;

  // Scroll to top when category changes
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [id]);

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

  const sendToWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi! I'd like to enquire about tiles from the ${category.name} category.`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <div className="page">
      {/* BACK */}
      <Link to="/" className="back-btn">← {language === "en" ? "Home" : "घर"}</Link>

      {/* CATEGORY HERO */}
      <section className="category-hero">
        <h1>{category.icon} {language === "en" ? category.name : (category.nameHi || category.name)}</h1>
        <p>{category.description}</p>
      </section>

      {/* PRODUCTS GRID */}
      <section className="products-grid">
        {category.items.map((item) => {
          const added = isWishlisted(item.id);
          return (
            <div key={item.id} className={`product-card ${item.isOutOfStock ? "out-of-stock" : ""}`}>
              <Link
                to={item.isOutOfStock ? "#" : `/product/${item.id}`}
                style={{ pointerEvents: item.isOutOfStock ? "none" : "auto" }}
              >
                <img
                  src={item.image || "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=800&auto=format&fit=crop"}
                  className="product-image"
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=800&auto=format&fit=crop"; }}
                />
              </Link>
              <div className="product-info">
                <h3>{item.title}</h3>
                <p className="product-desc">{item.desc}</p>
                <p className="product-price">{item.price}</p>

                <div className="product-actions">
                  <button
                    className={`wishlist-btn ${added ? "added" : ""}`}
                    onClick={() => !item.isOutOfStock && toggleWishlist(item)}
                    disabled={item.isOutOfStock}
                    aria-label={added ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {item.isOutOfStock ? (
                      language === "en" ? "Out of Stock" : "स्टॉक में नहीं"
                    ) : added ? (
                      <><FaHeart size={12} /> {language === "en" ? "Wishlisted" : "हटाएं"}</>
                    ) : (
                      <><FaRegHeart size={12} /> {language === "en" ? "Wishlist" : "विशलिस्ट"}</>
                    )}
                  </button>
                  <a
                    href={
                      item.isOutOfStock
                        ? "#"
                        : `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                            `Hi! I'm interested in: ${item.title} (${item.price})\nImage: ${item.image}`
                          )}`
                    }
                    target={item.isOutOfStock ? "_self" : "_blank"}
                    rel="noreferrer"
                    className="wa-btn wa-card-btn"
                    style={{
                      opacity: item.isOutOfStock ? 0.5 : 1,
                      pointerEvents: item.isOutOfStock ? "none" : "auto",
                      cursor: item.isOutOfStock ? "not-allowed" : "pointer",
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
    </div>
  );
};

export default Category;