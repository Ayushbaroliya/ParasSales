import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaWhatsapp, FaBars, FaTimes, FaHome, FaInfoCircle } from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageContext";

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "916260942161";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const openWhatsApp = () => {
    const msg = encodeURIComponent("Hi! I'd like to enquire about Paras Sales.");
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  };

  const handleLogoClick = () => {
    closeMenu();
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={handleLogoClick}>
        Paras Sales
      </div>

      <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
           <span className="mobile-logo">Paras Sales</span>
           <FaTimes className="mobile-close" onClick={closeMenu} size={24} />
        </div>

        <button  
          onClick={toggleLanguage} 
          className="lang-toggle-btn"
        >
          {language === "en" ? "अ Hindi" : "A English"}
        </button>

        <span className="nav-link-item" onClick={handleLogoClick}>
          <FaHome className="nav-icon-mobile" />
          {language === "en" ? "Home" : "घर"}
        </span>
        
        <span
          className="nav-link-item"
          onClick={() => { closeMenu(); navigate("/about"); }}
        >
          <FaInfoCircle className="nav-icon-mobile" />
          {language === "en" ? "About" : "हमारे बारे में"}
        </span>

        <button className="wa-btn nav-wa-btn" onClick={openWhatsApp}>
          <FaWhatsapp size={18} />
          <span>{language === "en" ? "Contact" : "संपर्क"}</span>
        </button>

        <div className="mobile-footer">
          <p>© 2024 Paras Sales. Premium Quality.</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;