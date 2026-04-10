import React from "react";

const Hero = ({ title = "Paaras Tiles", subtitle = "Design your dream space" }) => {
  return (
    <section className="hero">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </section>
  );
};

export default Hero;
