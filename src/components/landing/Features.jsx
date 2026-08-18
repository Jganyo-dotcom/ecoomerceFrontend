import React from "react";

const features = [
  {
    title: "Instant Branch Routing",
    desc: "Dedicated store URLs like /:companyRef for quick customer access and isolated branch management.",
  },
  {
    title: "Secure Isolation",
    desc: "Strict Mongoose query scoping and JWT authorization keeping tenant databases 100% private.",
  },
  {
    title: "Mobile POS Ready",
    desc: "Optimized for fast stock lookup across mobile phones, desktop counters, and tablets.",
  },
];

const Features = () => {
  return (
    <section className="section-wrapper">
      <div className="three-column-grid">
        {features.map((item, idx) => (
          <div key={idx} className="feature-col">
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
