import React from "react";

const Hero = () => {
  const navigate = (path) => (window.location.href = path);

  return (
    <section className="hero-section">
      <span className="pill-badge">Multi-Tenant E-Commerce Platform</span>

      <h1 className="hero-headline">
        Shop directly or <br />
        <span>manage your branch.</span>
      </h1>

      <p className="hero-description">
        Access product catalogs across hardware, groceries, and tech—or log in
        as a store owner to manage inventory and multi-branch URLs instantly.
      </p>

      <div className="hero-ctas">
        <button className="btn-main" onClick={() => navigate("/catalog")}>
          Browse Goods
        </button>
        <button className="btn-outline" onClick={() => navigate("/login")}>
          Store Admin Portal →
        </button>
      </div>
    </section>
  );
};

export default Hero;
