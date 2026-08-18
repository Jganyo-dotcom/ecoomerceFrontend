import React from "react";

export const CTA = () => {
  const navigate = (path) => {
    window.location.href = path;
  };

  return (
    <section className="cta-wrapper">
      <div className="cta-card">
        <div className="cta-content">
          <span className="title-kicker">FOR SELLERS</span>

          <h2>
            Have something
            <br />
            <span>worth selling?</span>
          </h2>

          <p>
            Create your own store, list your products and start reaching
            customers.
          </p>

          <button
            className="btn-cta-green"
            onClick={() => navigate("/register")}
          >
            Create Your Store →
          </button>
        </div>

        <div className="cta-visual">
          <div className="store-card">
            <div className="store-icon">🏪</div>

            <div>
              <strong>Your Store</strong>
              <span>Ready to grow</span>
            </div>

            <div className="store-status">● Live</div>
          </div>

          <div className="floating-product product-one">📦</div>

          <div className="floating-product product-two">🛍️</div>
        </div>
      </div>
    </section>
  );
};
