// src/components/catalog/CatalogProductCard.jsx
import React from "react";
import "../../css/catalogPage.css";

const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300' fill='%23f1f5f9'><rect width='300' height='300' fill='%23f1f5f9'/><path d='M120 110C111.716 110 105 116.716 105 125C105 133.284 111.716 140 120 140C128.284 140 135 133.284 135 125C135 116.716 128.284 110 120 110Z' fill='%2394a3b8'/><path d='M75 210L120 150L165 195L195 165L240 210H75Z' fill='%2394a3b8'/></svg>";

const CatalogProductCard = ({ product, onAddToCart, onBuyNow }) => {
  const imageSrc =
    (Array.isArray(product?.images) && product.images[0]) ||
    product?.imageUrl ||
    product?.image ||
    DEFAULT_PLACEHOLDER;

  const formattedPrice = Number(product?.price || 0).toFixed(2);
  const currency = product.currency;
  const stockCount = Number(product?.stock || 0);
  const isOutOfStock = stockCount <= 0;

  const storeName = product?.store?.name || product?.storeName || "Main Branch";
  const ownerName = product?.ownerName || product?.store?.ownerName;

  return (
    <div className="catalog-card">
      <div className="catalog-image-container">
        <img
          src={imageSrc}
          alt={product?.name || "Product preview"}
          className="catalog-card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_PLACEHOLDER;
          }}
        />

        <span
          className="store-badge"
          title={ownerName ? `Owner: ${ownerName}` : storeName}
        >
          🏢 {storeName}
        </span>

        <span
          className={`stock-status-badge ${
            isOutOfStock ? "out-of-stock" : stockCount < 5 ? "low-stock" : ""
          }`}
        >
          {isOutOfStock ? "Out of Stock" : `${stockCount} available`}
        </span>
      </div>

      <div className="catalog-card-body">
        <h3 className="catalog-product-title">
          {product?.name || "Untitled Product"}
        </h3>

        <div className="catalog-price-row">
          <span className="catalog-price-tag">
            {currency}:{formattedPrice}
          </span>
          {ownerName && <span className="owner-subtag">by {ownerName}</span>}
        </div>

        <p className="catalog-description">
          {product?.description || "No product description provided."}
        </p>

        <div className="catalog-card-actions">
          <button
            type="button"
            className="btn-add-cart"
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
          >
            🛒 Add to Cart
          </button>

          <button
            type="button"
            className="btn-buy-now"
            disabled={isOutOfStock}
            onClick={() => onBuyNow(product)}
          >
            ⚡ Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogProductCard;
