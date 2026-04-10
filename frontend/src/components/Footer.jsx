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
      <footer className="footer">
        <p onClick={handleSecretClick} style={{ cursor: 'default', userSelect: 'none' }}>
          © 2026 <strong>Paaras Tiles</strong> • All rights reserved • Made with ❤️ By Ayush
        </p>
      </footer>
    </>
  );
};

export default Footer;