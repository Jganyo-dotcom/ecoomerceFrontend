import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  Sun,
  Moon,
  Target,
  Rocket,
  ShieldCheck,
  Users,
  Award,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import Footer from "../components/common/Footer";
import "../css/AboutPage.css";

export default function AboutPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkStyle = { textDecoration: "none" };

  return (
    <div className={`about-container ${darkMode ? "dark" : "light"}`}>
      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-wrapper">
          <Link to="/" className="brand-logo" style={linkStyle}>
            <div className="logo-icon">
              <Store size={22} />
            </div>
            <span className="brand-name">CloudPlaza</span>
          </Link>

          <div className="nav-links desktop-only">
            <Link to="/" className="nav-link" style={linkStyle}>
              Home
            </Link>
            <Link to="/Catalogue" className="nav-link" style={linkStyle}>
              Goods
            </Link>
            <Link to="/StoresPage" className="nav-link" style={linkStyle}>
              Rent a Store
            </Link>
            <Link to="/about" className="nav-link active" style={linkStyle}>
              About Us
            </Link>
          </div>

          <div className="nav-actions">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="theme-toggle-btn"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="auth-buttons desktop-only">
              <Link to="/login" className="btn-secondary" style={linkStyle}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={linkStyle}>
                Sign Up
              </Link>
            </div>

            <button
              className="hamburger-btn mobile-only"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu mobile-only">
            <Link
              to="/"
              className="mobile-nav-link"
              style={linkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/Catalogue"
              className="mobile-nav-link"
              style={linkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Goods
            </Link>
            <Link
              to="/StoresPage"
              className="mobile-nav-link"
              style={linkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Rent a Store
            </Link>
            <Link
              to="/about"
              className="mobile-nav-link active"
              style={linkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>

            <div className="mobile-auth-container">
              <Link
                to="/login"
                className="btn-secondary full-width"
                style={linkStyle}
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-primary full-width"
                style={linkStyle}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="section-badge">Welcome to CloudPlaza</span>
          <h1 className="hero-title">
            Empowering Commerce Across Ghana & Beyond
          </h1>
          <p className="hero-subtitle">
            CloudPlaza is a modern multi-vendor marketplace designed to connect
            buyers, sellers, and store owners seamlessly. Whether you want to
            purchase quality items in GH₵ or rent out virtual store space, we
            provide the ultimate platform.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision-section">
        <div className="section-container">
          <div className="grid-2-col">
            <div className="info-card">
              <div className="card-icon-wrapper">
                <Target size={28} />
              </div>
              <h2>Our Mission</h2>
              <p>
                To eliminate barriers for local entrepreneurs by offering
                instant digital storefront rentals, enabling anyone to showcase
                products, manage rentals, and scale their business with zero
                overhead cost.
              </p>
            </div>

            <div className="info-card">
              <div className="card-icon-wrapper vision-icon">
                <Rocket size={28} />
              </div>
              <h2>Our Vision</h2>
              <p>
                To become the leading e-commerce ecosystem in Ghana, bridging
                the gap between hardware suppliers, tech vendors, everyday
                consumers, and store owners through reliable technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose CloudPlaza */}
      <section className="values-section">
        <div className="section-container">
          <div className="section-header-center">
            <h2 className="section-title">Why Choose CloudPlaza?</h2>
            <p className="section-subtitle">
              Built with speed, security, and simplicity at the core.
            </p>
          </div>

          <div className="values-grid">
            <div className="value-item">
              <ShieldCheck size={24} className="val-icon" />
              <h3>Verified Transactions</h3>
              <p>
                Secure ordering system with real-time updates for every GH₵
                spent or earned.
              </p>
            </div>
            <div className="value-item">
              <Store size={24} className="val-icon" />
              <h3>Instant Store Rental</h3>
              <p>
                Launch your virtual storefront in minutes without complicated
                server setups.
              </p>
            </div>
            <div className="value-item">
              <Users size={24} className="val-icon" />
              <h3>Community Driven</h3>
              <p>
                Connecting thousands of active shoppers and local business
                managers across Accra.
              </p>
            </div>
            <div className="value-item">
              <Award size={24} className="val-icon" />
              <h3>Top Quality Goods</h3>
              <p>
                Hand-curated hardware, electronics, mobility, and furniture
                rentals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder / Developer Spotlight */}
      <section className="founder-section">
        <div className="section-container">
          <div className="founder-card">
            <div className="founder-avatar">
              <span className="avatar-initials">EG</span>
            </div>
            <div className="founder-info">
              <span className="founder-role">Founder & Lead Engineer</span>
              <h2>Elikem Ganyo</h2>
              <p>
                CloudPlaza was engineered and built from the ground up by Elikem
                Ganyo. Driven by a passion for modern web technologies and
                full-stack architecture, Elikem designed CloudPlaza to
                streamline vendor management and deliver a smooth marketplace
                experience.
              </p>

              <ul className="founder-highlights">
                <li>
                  <CheckCircle2 size={16} className="check-icon" /> Full-Stack
                  Software Development
                </li>
                <li>
                  <CheckCircle2 size={16} className="check-icon" /> Dedicated to
                  Ghanaian Tech Innovation
                </li>
                <li>
                  <CheckCircle2 size={16} className="check-icon" /> Custom API &
                  Database Solutions
                </li>
              </ul>

              <div className="founder-contact">
                <a
                  href="tel:0503841074"
                  className="contact-chip"
                  style={linkStyle}
                >
                  <Phone size={14} /> 0503841074
                </a>
                <a
                  href="mailto:elikemejay@gmail.com"
                  className="contact-chip"
                  style={linkStyle}
                >
                  <Mail size={14} /> elikemejay@gmail.com
                </a>
                <span className="contact-chip">
                  <MapPin size={14} /> Accra, Ghana
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="cta-box">
          <h2>Ready to Start Shopping or Renting?</h2>
          <p>
            Explore hundreds of active items or launch your storefront today.
          </p>
          <div className="cta-actions">
            <Link
              to="/Catalogue"
              className="btn-hero-primary"
              style={linkStyle}
            >
              Browse Catalog <ArrowRight size={18} />
            </Link>
            <Link
              to="/StoresPage"
              className="btn-hero-secondary"
              style={linkStyle}
            >
              Rent a Store
            </Link>
          </div>
        </div>
      </section>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
