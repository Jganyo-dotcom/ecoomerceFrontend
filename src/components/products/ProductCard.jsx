// src/components/products/ProductCard.jsx
import React from "react";
import "../../css/ProductCard.css";

// Clean neutral SVG Data URI fallback (works offline, zero network latency)
const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300' fill='%23f1f5f9'><rect width='300' height='300' fill='%23f1f5f9'/><path d='M120 110C111.716 110 105 116.716 105 125C105 133.284 111.716 140 120 140C128.284 140 135 133.284 135 125C135 116.716 128.284 110 120 110Z' fill='%2394a3b8'/><path d='M75 210L120 150L165 195L195 165L240 210H75Z' fill='%2394a3b8'/></svg>";

const ProductCard = ({ product, onEditClick }) => {
  // 🖼️ 1. Flexible Image Resolution (supports images array, single imageUrl, or fallback)
  const imageSrc =
    (Array.isArray(product?.images) && product.images[0]) ||
    product?.imageUrl ||
    product?.image ||
    DEFAULT_PLACEHOLDER;

  // 🛡️ 2. Safe Fallbacks for Numbers & Text
  const formattedPrice = Number(product?.price || 0).toFixed(2);
  const currency = product.currency;
  const stockCount = Number(product?.stock || 0);

  return (
    <div className="product-card">
      <div className="card-image-wrapper">
        <img
          src={imageSrc}
          alt={product?.name || "Product image"}
          // Auto-swap with placeholder if image link breaks or 404s
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_PLACEHOLDER;
          }}
        />
        <span className={`stock-badge ${stockCount < 10 ? "low-stock" : ""}`}>
          {stockCount} in stock
        </span>
      </div>

      <div className="card-content">
        <h4 className="product-title">{product?.name || "Untitled Product"}</h4>
        <p className="product-price">{currency}{formattedPrice}</p>
        <p className="product-desc-snippet">
          {product?.description || "No description provided."}
        </p>

        {/* CLICKING THIS BUTTON OPENS THE MODAL FOR THIS SPECIFIC PRODUCT */}
        <button
          className="btn-edit-card"
          onClick={() => onEditClick && onEditClick(product)}
        >
          ⚙️ Manage Settings
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
