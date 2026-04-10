import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaWhatsapp, FaBars, FaTimes } from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageContext";

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "916260942161";

const Navbar = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const openWhatsApp = () => {
    const msg = encodeURIComponent("Hi! I'd like to enquire about Paaras Tiles.");
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => { closeMenu(); navigate("/"); }}>
        Paaras Tiles
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <button  
          onClick={toggleLanguage} 
          style={{
            background: 'var(--card)', color: 'var(--text-h)', border: '1px solid var(--border)',
            padding: '5px 10px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          {language === "en" ? "अ Hindi" : "A English"}
        </button>
        <span onClick={() => { closeMenu(); navigate("/"); }}>{language === "en" ? "Home" : "घर"}</span>
        <span
          onClick={() => {
            closeMenu();
            document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {language === "en" ? "About" : "हमारे बारे में"}
        </span>
        <button className="wa-btn nav-wa-btn" onClick={openWhatsApp}>
          <FaWhatsapp size={16} />
          <span>{language === "en" ? "Contact" : "संपर्क"}</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;