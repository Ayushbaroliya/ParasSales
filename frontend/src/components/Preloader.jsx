import React from "react";

const Preloader = ({ fadeOut }) => {
  return (
    <div className={`preloader ${fadeOut ? "preloader-fade" : ""}`}>
      <div className="preloader-content">
        <div className="loader-logo">Paras Sales</div>
        <div className="loader-bar">
          <div className="loader-progress" />
        </div>
        <p>Expertly picking the finest stones...</p>
      </div>
    </div>
  );
};

export default Preloader;
