import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const About = () => {
  const { language } = useLanguage();
  return (
    <section className="about" id="about-section">
      <h2>{language === "en" ? "About Paaras Tiles" : "पारस टाइल्स के बारे में"}</h2>
      <p>
        With over 15 years of experience, Paaras Tiles is your trusted source for premium
        wall tiles, floor tiles, natural granite, Kadappa stone, marble, sanitary ware,
        and plumbing materials. We serve homeowners, builders, and designers across the region
        — delivering quality, durability, and elegance at every budget.
      </p>
    </section>
  );
};

export default About;