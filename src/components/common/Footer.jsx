// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Store, Phone, Mail, MapPin, Heart } from "lucide-react";
import "../../css/Footer.css";

// Brand Icon SVG Components
const GithubIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function Footer() {
  const linkStyle = { textDecoration: "none" };

  return (
    <footer className="app-footer">
      <div className="footer-container">
        {/* Top Section: Brand & Link Grid */}
        <div className="footer-grid">
          {/* Column 1: Brand Info */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo" style={linkStyle}>
              <div className="logo-icon">
                <Store size={22} />
              </div>
              <span className="brand-name">CloudPlaza</span>
            </Link>
            <p className="footer-tagline">
              Ghana’s premier online marketplace to shop quality goods or rent
              out your own storefront instantly.
            </p>
            <div className="social-links">
              <a
                href="https://github.com/Jganyo-dotcom"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <GithubIcon />
              </a>
              <a
                href="https://www.linkedin.com/in/james-ganyo-aa0593360?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedinIcon />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
              >
                <TwitterIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/Catalogue" style={linkStyle}>
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link to="/StoresPage" style={linkStyle}>
                  Rent a Store
                </Link>
              </li>
              <li>
                <a href="#featured" style={linkStyle}>
                  Trending Goods
                </a>
              </li>
              <li>
                <a href="about" style={linkStyle}>
                  About CloudPlaza
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Account & Support */}
          <div className="footer-col">
            <h4 className="footer-heading">Account & Support</h4>
            <ul className="footer-links">
              <li>
                <Link to="/login" style={linkStyle}>
                  Login to Portal
                </Link>
              </li>
              <li>
                <Link to="/register" style={linkStyle}>
                  Register Vendor Account
                </Link>
              </li>
              <li>
                <Link to="/settings" style={linkStyle}>
                  Settings
                </Link>
              </li>
              <li>
                <a href="#faq" style={linkStyle}>
                  Help Center & FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="footer-col contact-col">
            <h4 className="footer-heading">Get in Touch</h4>
            <ul className="contact-list">
              <li>
                <Phone size={16} className="contact-icon" />
                <a href="tel:0503841074" style={linkStyle}>
                  0503841074
                </a>
              </li>
              <li>
                <Mail size={16} className="contact-icon" />
                <a href="mailto:elikemejay@gmail.com" style={linkStyle}>
                  elikemejay@gmail.com
                </a>
              </li>
              <li>
                <MapPin size={16} className="contact-icon" />
                <span>Accra, Ghana</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="footer-divider" />

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright-text">
            © {new Date().getFullYear()} <strong>CloudPlaza</strong>{" "}
            Marketplace. All rights reserved.
          </p>
          <p className="developer-credit">
            Crafted with <Heart size={14} className="heart-icon" /> by{" "}
            <span className="dev-name">Elikem Ganyo</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
