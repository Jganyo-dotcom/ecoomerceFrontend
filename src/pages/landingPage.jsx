import React from "react";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/common/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import { CTA } from "../components/landing/CTA";
import { Footer } from "../components/common/Footer";

const LandingPage = () => {
  const { theme } = useTheme();

  return (
    <div className={`app-root ${theme}-mode`}>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
