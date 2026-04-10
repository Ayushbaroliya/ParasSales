import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import About from "./About";

const Footer = () => {
  const navigate = useNavigate();
  const [clicks, setClicks] = useState(0);
  const timerRef = useRef(null);

  const handleSecretClick = () => {
    setClicks((prev) => prev + 1);
    clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      setClicks(0);
    }, 2000);
  };

  useEffect(() => {
    if (clicks >= 5) {
      navigate("/admin/login");
      setClicks(0);
    }
  }, [clicks, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        navigate("/admin/login");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <>
      <About />
      <footer className="footer" style={{ padding: '2rem', textAlign: 'center', background: 'var(--header-bg)', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        
        {/* Contact Links */}
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          
          <a href={import.meta.env.VITE_PHONE_NUMBER ? `tel:+91${import.meta.env.VITE_PHONE_NUMBER}` : "tel:+918871351696"} style={{ color: 'var(--text)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span style={{ fontWeight: '500' }}>Call Us</span>
          </a>

          <a href={import.meta.env.VITE_INSTAGRAM_LINK || "https://www.instagram.com/singhai.harshjain"} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            <span style={{ fontWeight: '500' }}>Instagram</span>
          </a>

          <a href={import.meta.env.VITE_MAPS_LINK || "https://maps.app.goo.gl/sxkqiLwtcLCUuRrWA"} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span style={{ fontWeight: '500' }}>Locate Us</span>
          </a>

        </div>

        <p onClick={handleSecretClick} style={{ cursor: 'default', userSelect: 'none', opacity: 0.8, margin: 0 }}>
          © 2026 <strong>Paras Sales</strong> • All rights reserved • Made with ❤️ By Ayush
        </p>
      </footer>
    </>
  );
};

export default Footer;