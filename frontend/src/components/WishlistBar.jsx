import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageContext";

const WishlistBar = ({ wishlist, sendToWhatsApp }) => {
  const { language } = useLanguage();
  if (!wishlist || wishlist.length === 0) return null;

  return (
    <div className="wishlist-bar" role="status" aria-live="polite">
      <span>{wishlist.length} item{wishlist.length > 1 ? "s" : ""} {language === "en" ? "selected" : "चयनित"}</span>
      <button className="wa-btn wishlist-wa-btn" onClick={sendToWhatsApp}>
        <FaWhatsapp size={17} />
        {language === "en" ? "Send Enquiry" : "पूछताछ भेजें"}
      </button>
    </div>
  );
};

export default WishlistBar;