// src/components/landing/CTA.jsx
import React from "react";

export const CTA = () => (
  <section className="cta-section">
    <div className="cta-box">
      <h2>Ready to Build Your E-Commerce Empire?</h2>
      <p>
        Setup takes less than 5 minutes. Start organizing your tenants today.
      </p>
      <button className="btn-primary btn-lg">Deploy Your Platform Now</button>
    </div>
  </section>
);

// src/components/common/Footer.jsx
export const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <p>&copy; {new Date().getFullYear()} OmniStoreHQ. All rights reserved.</p>
    </div>
  </footer>
);
