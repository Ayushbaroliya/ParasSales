import React from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { useCategories } from "../hooks/useCategories";
import { useLanguage } from "../contexts/LanguageContext";
import Footer from "./Footer";

const FEATURED = new Set(["marble", "granite", "wall-tiles"]);
const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "916260942161";

const Skeleton = () => (
  <div className="categories-grid">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="category-card skeleton-card">
        <div className="skeleton skeleton-img" />
        <div className="category-label">
          <div className="skeleton skeleton-line" style={{ width: "60%", height: 14 }} />
          <div className="skeleton skeleton-line" style={{ width: "90%", height: 11, marginTop: 6 }} />
        </div>
      </div>
    ))}
  </div>
);

const Home = () => {
  const { data: categories, loading, error } = useCategories();
  const { language } = useLanguage();

  const openWhatsApp = () => {
    const msg = encodeURIComponent("Hi! I'd like to enquire about your tiles & stone products.");
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  };

  const scrollToCategories = () => {
    document.getElementById("categories-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-badge">🏆 Trusted by 500+ Customers</div>
        <h1>
          {language === "en" ? "Premium Tiles &" : "प्रीमियम टाइल्स और"}<br />
          <span>{language === "en" ? "Natural Stone" : "प्राकृतिक पत्थर"}</span>
        </h1>
        <p>
          From Italian marble to Kadappa black stone — transform your home
          with India's finest tiles and building materials.
        </p>
        <div className="hero-actions">
          <button className="wa-btn hero-wa-btn" onClick={openWhatsApp}>
            <FaWhatsapp size={20} />
            {language === "en" ? "WhatsApp Us" : "व्हाट्सएप करें"}
          </button>
          <button className="hero-browse-btn" onClick={scrollToCategories}>
            {language === "en" ? "Browse Categories ↓" : "श्रेणियां देखें ↓"}
          </button>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="stats-bar">
        {[
          { num: "9+",   label: "Categories" },
          { num: "500+", label: "Happy Clients" },
          { num: "20+",  label: "contractors" },
          { num: "₹55",  label: "Starting / sqft" },
        ].map((s) => (
          <div key={s.label} className="stat-item">
            <span className="stat-number">{s.num}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── CATEGORIES ── */}
      <div id="categories-section" className="section-header">
        <h2 className="section-title">{language === "en" ? "Our Categories" : "हमारी श्रेणियां"}</h2>
        {categories && (
          <span className="section-sub">{categories.length} collections</span>
        )}
      </div>

      {error && (
        <p className="api-error">⚠️ Could not load categories. Please refresh.</p>
      )}

      {loading ? (
        <Skeleton />
      ) : (
        <div className="categories-grid">
          {categories?.map((cat) => (
            <Link
              to={`/category/${cat.id}`}
              key={cat.id}
              className={`category-card ${FEATURED.has(cat.id) ? "featured" : ""}`}
            >
              <img src={cat.cover} className="category-image" alt={cat.name} loading="lazy" />
              <div className="category-label">
                <span className="category-icon">{cat.icon}</span>
                <h3>{language === "en" ? cat.name : (cat.nameHi || cat.name)}</h3>
                <p>{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;