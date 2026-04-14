import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaMapMarkerAlt, FaPhone, FaHeart } from "react-icons/fa";

const PHONE    = import.meta.env.VITE_PHONE_NUMBER    || "8871351696";
const IG_LINK  = import.meta.env.VITE_INSTAGRAM_LINK  || "https://www.instagram.com/singhai.harshjain";
const MAP_LINK = import.meta.env.VITE_MAPS_LINK       || "https://maps.app.goo.gl/sxkqiLwtcLCUuRrWA";

const Footer = () => {
  const navigate = useNavigate();
  const [clicks, setClicks] = useState(0);
  const timerRef = useRef(null);

  const handleSecretClick = () => {
    setClicks((prev) => prev + 1);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setClicks(0), 2000);
  };

  useEffect(() => {
    if (clicks >= 5) {
      navigate("/admin/login");
      setClicks(0);
    }
  }, [clicks, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        navigate("/admin/login");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* Brand */}
        <div className="footer-brand">
          <span className="footer-logo">Paras Sales</span>
          <p className="footer-brand-desc">
            Premium tiles, natural stone & building materials.<br />
            Trusted by 500+ happy customers across the region.
          </p>
        </div>

        {/* Social / Contact links */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Connect</h4>
          <div className="footer-link-list">
            <a href={`tel:+91${PHONE}`} className="footer-link-item">
              <FaPhone size={14} />
              <span>+91 {PHONE}</span>
            </a>
            <a href={IG_LINK} target="_blank" rel="noopener noreferrer" className="footer-link-item footer-ig">
              <FaInstagram size={14} />
              <span>Instagram</span>
            </a>
            <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className="footer-link-item footer-map">
              <FaMapMarkerAlt size={14} />
              <span>Find Our Shop</span>
            </a>
          </div>
        </div>

        {/* Embedded map */}
        <div className="footer-map-col">
          <h4 className="footer-col-title">Location</h4>
          <a
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-map-thumb"
            title="Open in Google Maps"
          >
            <FaMapMarkerAlt size={28} style={{ color: "var(--accent)" }} />
            <span>View on Google Maps ↗</span>
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p
          className="footer-copy"
          onClick={handleSecretClick}
          style={{ cursor: "default", userSelect: "none" }}
        >
          © 2026 <strong>Paras Sales</strong> · All rights reserved
        </p>
        <p className="footer-credit">
          Made with <FaHeart className="footer-heart" size={12} /> by
          <span className="footer-dev-name"> Ayush Sharma</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;