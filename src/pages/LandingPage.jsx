// src/pages/LandingPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sun,
  Moon,
  ShoppingBag,
  Store,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Users,
  ArrowRight,
  Star,
  Menu,
  X,
} from "lucide-react";
import "../css/LandingPage.css";
import Footer from "../components/common/Footer";

const SAMPLE_GOODS = [
  {
    id: 1,
    title: "Sony Alpha A7 III Camera",
    category: "Electronics",
    buyPrice: "GH₵ 1,299",
    rentPrice: "GH₵ 45/day",
    rating: 4.9,
    image: "📷",
    badge: "Popular",
  },
  {
    id: 2,
    title: "Herman Miller Aeron Chair",
    category: "Furniture",
    buyPrice: null,
    rentPrice: "GH₵ 25/day",
    rating: 4.8,
    image: "🪑",
    badge: "Rent Choice",
  },
  {
    id: 3,
    title: "Segway Ninebot Max Scooter",
    category: "Mobility",
    buyPrice: "GH₵ 649",
    rentPrice: null,
    rating: 4.7,
    image: "🛴",
    badge: "Hot Deal",
  },
  {
    id: 4,
    title: "DJI Mini 3 Pro Drone",
    category: "Drones",
    buyPrice: "GH₵ 750",
    rentPrice: "GH₵ 35/day",
    rating: 4.9,
    image: "🚁",
    badge: "Featured",
  },
];

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredGoods = SAMPLE_GOODS.filter((item) => {
    if (activeFilter === "buy") return item.buyPrice !== null;
    if (activeFilter === "rent") return item.rentPrice !== null;
    return true;
  });

  const linkStyle = { textDecoration: "none" };

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-wrapper">
          {/* Logo */}
          <Link to="/" className="brand-logo" style={linkStyle}>
            <div className="logo-icon">
              <Store size={22} />
            </div>
            <span className="brand-name">CloudPlaza</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="nav-links desktop-only">
            <Link to="/CatalogPage" className="nav-link" style={linkStyle}>
              Goods
            </Link>
            <Link to="/StoresPage" className="nav-link" style={linkStyle}>
              Rent a Store
            </Link>
            <a href="about" className="nav-link" style={linkStyle}>
              Why Us
            </a>
          </div>

          {/* Navbar Right Actions */}
          <div className="nav-actions">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="theme-toggle-btn"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Desktop Auth Buttons */}
            <div className="auth-buttons desktop-only">
              <Link to="/login" className="btn-secondary" style={linkStyle}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={linkStyle}>
                Sign Up
              </Link>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              className="hamburger-btn mobile-only"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu mobile-only">
            <Link
              to="/CatalogPage"
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
            <a
              href="#about"
              className="mobile-nav-link"
              style={linkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Why Us
            </a>

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
      <header className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Buy, Sell, or Rent Storefronts</span>
          </div>

          <h1 className="hero-title">
            Shop Trending Goods. <br />
            <span className="gradient-text">Or Rent Your Own Store.</span>
          </h1>

          <p className="hero-subtitle">
            The all-in-one marketplace where shoppers buy goods, and
            entrepreneurs launch storefronts with zero hassle.
          </p>

          <div className="hero-buttons">
            <Link
              to="/CatalogPage"
              className="btn-hero-primary"
              style={linkStyle}
            >
              <ShoppingBag size={18} />
              Shop Now
            </Link>
            <Link
              to="/StoresPage"
              className="btn-hero-secondary"
              style={linkStyle}
            >
              <Store size={18} />
              Rent a Store
            </Link>
          </div>

          <div className="trust-stats">
            <span>
              <ShieldCheck size={16} /> Verified Vendors
            </span>
            <span>
              <TrendingUp size={16} /> Instant Store Rental
            </span>
            <span>
              <Users size={16} /> 50k+ Active Users
            </span>
          </div>
        </div>
      </header>

      {/* Featured Goods Grid */}
      <section id="featured" className="goods-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Explore Trending Goods</h2>
            <p className="section-subtitle">
              Choose to buy outright or rent by the day
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button
              className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All Items
            </button>
            <button
              className={`filter-btn ${activeFilter === "buy" ? "active" : ""}`}
              onClick={() => setActiveFilter("buy")}
            >
              Buy Only
            </button>
            <button
              className={`filter-btn ${activeFilter === "rent" ? "active" : ""}`}
              onClick={() => setActiveFilter("rent")}
            >
              Rent Only
            </button>
          </div>
        </div>

        {/* Product Cards */}
        <div className="goods-grid">
          {filteredGoods.map((item) => (
            <div key={item.id} className="product-card">
              <div className="card-image-box">
                <span className="card-emoji">{item.image}</span>
                <span className="card-badge">{item.badge}</span>
              </div>

              <div className="card-body">
                <div className="card-meta">
                  <span className="card-category">{item.category}</span>
                  <span className="card-rating">
                    <Star size={14} className="star-icon" /> {item.rating}
                  </span>
                </div>

                <h3 className="product-title">{item.title}</h3>

                <div className="price-container">
                  {item.buyPrice && (
                    <div className="price-tag">
                      <span className="price-label">Buy</span>
                      <span className="price-value">{item.buyPrice}</span>
                    </div>
                  )}
                  {item.rentPrice && (
                    <div className="price-tag rent">
                      <span className="price-label">Rent</span>
                      <span className="price-value">{item.rentPrice}</span>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <Link
                    to="/CatalogPage"
                    className="card-btn-primary"
                    style={linkStyle}
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rent Store CTA Banner */}
      <section id="rent-store" className="store-cta-section">
        <div className="store-cta-card">
          <div className="store-cta-content">
            <h2 className="cta-title">Want to sell or rent out your items?</h2>
            <p className="cta-subtitle">
              Rent your own virtual shop space on CloudPlaza. Post your items,
              and start earning instantly.
            </p>
            <Link to="/StoresPage" className="btn-cta-action" style={linkStyle}>
              Rent a Store Space Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
