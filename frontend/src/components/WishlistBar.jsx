import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageContext";

const WishlistBar = ({ wishlist, sendToWhatsApp }) => {
  const { language } = useLanguage();
  if (!wishlist || wishlist.length === 0) return null;

  return (
    <div className="wishlist-bar" role="status" aria-live="polite">
      <div className="item-count">{wishlist.length}</div>
      <button className="wa-btn wishlist-wa-btn" onClick={sendToWhatsApp} title={language === "en" ? "Send Enquiry" : "पूछताछ भेजें"}>
        <FaWhatsapp size={22} />
        <span>Enquiry</span>
      </button>
    </div>
  );
};

export default WishlistBar;