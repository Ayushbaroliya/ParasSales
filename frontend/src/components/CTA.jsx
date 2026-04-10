import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageContext";

const CTA = ({ sendToWhatsApp }) => {
  const { language } = useLanguage();
  return (
    <section className="cta">
      <h2>{language === "en" ? "Need Help Choosing?" : "क्या चुनने में मदद चाहिए?"}</h2>
      <p>Talk to our tile experts directly on WhatsApp — fast, friendly, free.</p>
      <button className="wa-btn cta-wa-btn" onClick={sendToWhatsApp}>
        <FaWhatsapp size={20} />
        {language === "en" ? "Chat on WhatsApp" : "व्हाट्सएप पर चैट करें"}
      </button>
    </section>
  );
};

export default CTA;