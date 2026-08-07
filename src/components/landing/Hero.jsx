import React from "react";

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="badge">Multi-Tenant E-Commerce Infrastructure</div>
        <h1 className="hero-title">
          Run Your Entire Brand Network on One Engine
        </h1>
        <p className="hero-subtitle">
          Instantly deploy isolated company spaces, launch infinite branch
          storefronts with customized paths like
          <code> /:companyRef?store=:slug</code>, and control all inventory and
          users from one unified backend.
        </p>

        <div className="hero-cta">
          <button className="btn-primary btn-lg">Start Free Trial</button>
          <button className="btn-outline btn-lg">View Live Demo</button>
        </div>

        <div className="url-preview">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
          <span className="url-text">
            https://yourbrand.com/companyName/REF1002?store=hardware-main
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
