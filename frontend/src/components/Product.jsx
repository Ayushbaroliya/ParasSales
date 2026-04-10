import React from "react";
import { useParams, Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { fetchProductById } from "../services/api";
import { useState, useEffect } from "react";
import Footer from "./Footer";
import { useLanguage } from "../contexts/LanguageContext";

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "916260942161";

const Product = () => {
  const { id } = useParams();
  const [state, setState] = useState({ item: null, category: null, loading: true, error: null });
  const { language } = useLanguage();

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

  const waMsg = encodeURIComponent(`Hi! I'm interested in: ${item.title} (${item.price}). Please share details.\nImage: ${item.image}`);

  return (
    <div className="page">
      <Link to={`/category/${category.id}`} className="back-btn">
        ← {language === "en" ? category.name : (category.nameHi || category.name)}
      </Link>

      <div className="product-detail">
        <img src={item.image} alt={item.title} loading="lazy" />

        <div className="product-detail-info">
          <p className="detail-category-badge">{category.icon} {category.name}</p>
          <h1>{item.title}</h1>
          <p className="detail-price">{item.price}</p>
          <p className="detail-desc">{item.desc}</p>

          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
            target="_blank"
            rel="noreferrer"
            className="wa-btn wa-detail-btn"
          >
            <FaWhatsapp size={20} />
            {language === "en" ? "Enquire on WhatsApp" : "व्हाट्सएप पर पूछताछ करें"}
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Product;