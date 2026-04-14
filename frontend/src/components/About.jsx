import React from "react";
import { FaWhatsapp, FaInstagram, FaMapMarkerAlt, FaPhone, FaStore } from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageContext";

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "916260942161";
const PHONE    = import.meta.env.VITE_PHONE_NUMBER    || "8871351696";
const IG_LINK  = import.meta.env.VITE_INSTAGRAM_LINK  || "https://www.instagram.com/singhai.harshjain";
const MAP_LINK = import.meta.env.VITE_MAPS_LINK       || "https://maps.app.goo.gl/sxkqiLwtcLCUuRrWA";

const About = () => {
  const { language } = useLanguage();

  const openWhatsApp = () => {
    const msg = encodeURIComponent("Hi! I'd like to know more about Paras Sales.");
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <section className="about-page" id="about-section">
      {/* ── HEADER ── */}
      <div className="about-header">
        <div className="about-badge">🏪 {language === "en" ? "Our Story" : "हमारी कहानी"}</div>
        <h1>{language === "en" ? "About Paras Sales" : "पारस सेल्स के बारे में"}</h1>
        <p className="about-tagline">
          {language === "en"
            ? "Premium tiles & stones trusted by 500+ happy customers"
            : "500+ खुश ग्राहकों द्वारा भरोसेमंद प्रीमियम टाइल्स और पत्थर"}
        </p>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="about-body">

        {/* Image + Identity Card */}
        <div className="about-identity">
          <div className="about-image-wrapper">
            <div className="about-image-placeholder">
              <FaStore size={48} style={{ color: "var(--accent)", opacity: 0.5 }} />
              <span>Shop Photo</span>
              <p>Replace with your store image via admin or env config</p>
            </div>
            {/* Uncomment and set src when image is available */}
            {/* <img src="/store.jpg" alt="Paras Sales Store" className="about-store-img" /> */}
          </div>

          {/* Quick-contact socials card */}
          <div className="about-socials-card">
            <h3>{language === "en" ? "Connect With Us" : "हमसे जुड़ें"}</h3>
            <div className="about-social-links">
              <a href={`tel:+91${PHONE}`} className="about-social-item about-phone">
                <FaPhone size={18} />
                <span>+91 {PHONE}</span>
              </a>
              <button className="about-social-item about-wa" onClick={openWhatsApp}>
                <FaWhatsapp size={18} />
                <span>WhatsApp Us</span>
              </button>
              <a href={IG_LINK} target="_blank" rel="noopener noreferrer" className="about-social-item about-ig">
                <FaInstagram size={18} />
                <span>Instagram</span>
              </a>
              <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className="about-social-item about-map">
                <FaMapMarkerAlt size={18} />
                <span>Locate Our Shop</span>
              </a>
            </div>
          </div>
        </div>

        {/* About text */}
        <div className="about-text-block">
          <div className="about-highlight-bar">
            {[
              { icon: "🏆", label: language === "en" ? "15+ Years" : "15+ वर्ष", sub: language === "en" ? "Experience" : "अनुभव" },
              { icon: "😊", label: "500+",         sub: language === "en" ? "Happy Clients" : "खुश ग्राहक" },
              { icon: "🏗️", label: "20+",          sub: language === "en" ? "Contractors" : "ठेकेदार" },
              { icon: "💎", label: "₹55/sqft",     sub: language === "en" ? "Starting Price" : "शुरुआती कीमत" },
            ].map((s) => (
              <div key={s.label} className="about-stat">
                <span className="about-stat-icon">{s.icon}</span>
                <strong>{s.label}</strong>
                <span>{s.sub}</span>
              </div>
            ))}
          </div>

          <p>
            {language === "en"
              ? "With over 15 years of experience, Paras Sales is your trusted source for premium wall tiles, floor tiles, natural granite, Kadappa stone, marble, sanitary ware, and plumbing materials. We serve homeowners, builders, and designers across the region — delivering quality, durability, and elegance at every budget."
              : "15 से अधिक वर्षों के अनुभव के साथ, पारस सेल्स प्रीमियम वॉल टाइल्स, फ्लोर टाइल्स, नेचुरल ग्रेनाइट, कडप्पा स्टोन, मार्बल, सैनिटरी वेयर और प्लंबिंग सामग्री का आपका विश्वसनीय स्रोत है।"}
          </p>
          <p>
            {language === "en"
              ? "Our expert team helps you choose the perfect material to match your vision — whether it's a luxury home renovation or a large-scale commercial project. Visit our showroom and explore hundreds of curated designs."
              : "हमारी विशेषज्ञ टीम आपको आपकी दृष्टि के अनुरूप सही सामग्री चुनने में मदद करती है — चाहे वह एक शानदार घर का नवीनीकरण हो या एक बड़े पैमाने पर व्यावसायिक परियोजना।"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;