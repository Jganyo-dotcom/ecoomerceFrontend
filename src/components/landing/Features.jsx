import React from "react";

const featuresList = [
  {
    icon: "🛡️",
    title: "Strict Tenant Data Isolation",
    description:
      "Every request is validated at the boundary using unique company keys and scoped Mongoose indexes. Zero data leaks.",
  },
  {
    icon: "🏪",
    title: "Multi-Store Branch Routing",
    description:
      "Structure custom URLs for every store location effortlessly. Map storefronts via URL parameters dynamically.",
  },
  {
    icon: "🔑",
    title: "Role-Based Authentication",
    description:
      "Stateless JWT tokens embedding tenant context and access levels for administrators, store managers, and staff.",
  },
  {
    icon: "⚡",
    title: "High-Performance API",
    description:
      "Powered by Node.js, Express, and optimized MongoDB index strategies designed for instant queries under heavy load.",
  },
];

const Features = () => {
  return (
    <section id="features" className="features-section">
      <div className="section-header">
        <h2>Built for High-Growth Companies</h2>
        <p>
          Everything you need to scale from one store to thousands of global
          locations.
        </p>
      </div>

      <div className="features-grid">
        {featuresList.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
