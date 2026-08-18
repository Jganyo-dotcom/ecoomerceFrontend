import React from "react";

const Showcase = () => {
  const navigate = (path) => (window.location.href = path);

  return (
    <section className="section-wrapper">
      <div className="dual-grid">
        <div className="clean-card">
          <h3>For Customers</h3>
          <p>
            Explore live stock, compare prices across categories, and place
            direct online orders with zero friction.
          </p>
          <button className="btn-outline" onClick={() => navigate("/catalog")}>
            Explore Store Catalog →
          </button>
        </div>

        <div className="clean-card">
          <h3>For Store Owners</h3>
          <p>
            Deploy multi-tenant branches in under 5 minutes with isolated tenant
            security and automated URL routing.
          </p>
          <button className="btn-main" onClick={() => navigate("/register")}>
            Set Up Your Store →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
