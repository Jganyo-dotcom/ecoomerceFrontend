// src/components/catalog/CatalogProductCard.jsx
import React, { useState } from "react";
import "../../css/catalogPage.css";

const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300' fill='%23f1f5f9'><rect width='300' height='300' fill='%23f1f5f9'/><path d='M120 110C111.716 110 105 116.716 105 125C105 133.284 111.716 140 120 140C128.284 140 135 133.284 135 125C135 116.716 128.284 110 120 110Z' fill='%2394a3b8'/><path d='M75 210L120 150L165 195L195 165L240 210H75Z' fill='%2394a3b8'/></svg>";

const CatalogProductCard = ({ product, onAddToCart, onBuyNow }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  // Normalize image sources into an array
  const imageList =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : [product?.imageUrl || product?.image].filter(Boolean);

  const mainImage = imageList[0] || DEFAULT_PLACEHOLDER;
  const currentPreviewImg = imageList[selectedImgIndex] || DEFAULT_PLACEHOLDER;
  const hasMultipleImages = imageList.length > 1;

  const formattedPrice = Number(product?.price || 0).toFixed(2);
  const currency = product?.currency || "GH₵";
  const stockCount = Number(product?.stock || 0);
  const isOutOfStock = stockCount <= 0;

  const storeName = product?.store?.name || product?.storeName || "Main Branch";
  const ownerName = product?.ownerName || product?.store?.ownerName;

  // Handle opening modal and selecting second picture if available
  const handleImageClick = () => {
    // If there's a second image, jump straight to it in the preview
    if (hasMultipleImages) {
      setSelectedImgIndex(1);
    } else {
      setSelectedImgIndex(0);
    }
    setShowModal(true);
  };

  return (
    <>
      {/* ── CARD COMPONENT ── */}
      <div className="catalog-card">
        <div
          className="catalog-image-container"
          onClick={handleImageClick}
          style={{ cursor: "pointer", position: "relative" }}
          title="Click to view full preview & details"
        >
          <img
            src={mainImage}
            alt={product?.name || "Product preview"}
            className="catalog-card-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_PLACEHOLDER;
            }}
          />

          {/* Hover overlay hint */}
          <div className="image-hover-hint" style={styles.hoverHint}>
            🔍 Quick View
          </div>

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
              {currency} {formattedPrice}
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

      {/* ── JUMIA-STYLE PREVIEW MODAL ── */}
      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button style={styles.closeBtn} onClick={() => setShowModal(false)}>
              ✕
            </button>

            <div style={styles.modalBody}>
              {/* Left Column: Image Viewer */}
              <div style={styles.imageSection}>
                <div style={styles.mainImgWrapper}>
                  <img
                    src={currentPreviewImg}
                    alt="Product detailed view"
                    style={styles.modalMainImg}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_PLACEHOLDER;
                    }}
                  />
                </div>

                {/* Multiple Images Thumbnails OR No Preview Banner */}
                {hasMultipleImages ? (
                  <div style={styles.thumbnailRow}>
                    {imageList.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`View ${idx + 1}`}
                        style={{
                          ...styles.thumbnail,
                          border:
                            selectedImgIndex === idx
                              ? "2px solid #2563eb"
                              : "2px solid #e2e8f0",
                        }}
                        onClick={() => setSelectedImgIndex(idx)}
                      />
                    ))}
                  </div>
                ) : (
                  <div style={styles.noExtraPreviewBanner}>
                    📷 No additional previews available for this item
                  </div>
                )}
              </div>

              {/* Right Column: Detailed View */}
              <div style={styles.detailsSection}>
                <span style={styles.modalStoreTag}>🏢 {storeName}</span>
                <h2 style={styles.modalTitle}>
                  {product?.name || "Untitled Product"}
                </h2>

                <div style={styles.modalPrice}>
                  {currency} {formattedPrice}
                </div>

                <div style={styles.modalStock}>
                  Status:{" "}
                  <strong
                    style={{ color: isOutOfStock ? "#dc2626" : "#16a34a" }}
                  >
                    {isOutOfStock
                      ? "Out of Stock"
                      : `In Stock (${stockCount} units)`}
                  </strong>
                </div>

                {ownerName && (
                  <div style={styles.modalOwner}>
                    Sold & Managed by: <strong>{ownerName}</strong>
                  </div>
                )}

                <hr style={styles.divider} />

                <div style={styles.descriptionBox}>
                  <h4 style={{ margin: "0 0 6px 0", color: "#334155" }}>
                    Product Details & Description
                  </h4>
                  <p style={{ margin: 0, color: "#64748b", lineHeight: "1.5" }}>
                    {product?.description ||
                      "No detailed description provided."}
                  </p>
                </div>

                <div style={styles.modalActions}>
                  <button
                    type="button"
                    className="btn-add-cart"
                    disabled={isOutOfStock}
                    onClick={() => {
                      onAddToCart(product);
                      setShowModal(false);
                    }}
                  >
                    🛒 Add to Cart
                  </button>

                  <button
                    type="button"
                    className="btn-buy-now"
                    disabled={isOutOfStock}
                    onClick={() => {
                      onBuyNow(product);
                      setShowModal(false);
                    }}
                  >
                    ⚡ Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Internal styles to guarantee modal works out-of-the-box without touching CSS files
const styles = {
  hoverHint: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "0.9rem",
    opacity: 0,
    transition: "opacity 0.2s ease",
    borderRadius: "8px 8px 0 0",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    backdropFilter: "blur(4px)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "800px",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
    padding: "24px",
  },
  closeBtn: {
    position: "absolute",
    top: "16px",
    right: "16px",
    border: "none",
    background: "#f1f5f9",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    fontSize: "18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#475569",
  },
  modalBody: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  imageSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "center",
  },
  mainImgWrapper: {
    width: "100%",
    height: "280px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalMainImg: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  thumbnailRow: {
    display: "flex",
    gap: "8px",
    overflowX: "auto",
    maxWidth: "100%",
    paddingBottom: "4px",
  },
  thumbnail: {
    width: "56px",
    height: "56px",
    objectFit: "cover",
    borderRadius: "8px",
    cursor: "pointer",
  },
  noExtraPreviewBanner: {
    fontSize: "0.82rem",
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    padding: "8px 12px",
    borderRadius: "8px",
    textAlign: "center",
    width: "100%",
  },
  detailsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  modalStoreTag: {
    fontSize: "0.85rem",
    color: "#2563eb",
    fontWeight: "600",
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.4rem",
    color: "#0f172a",
  },
  modalPrice: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#0f172a",
  },
  modalStock: {
    fontSize: "0.9rem",
    color: "#475569",
  },
  modalOwner: {
    fontSize: "0.85rem",
    color: "#64748b",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e2e8f0",
    margin: "8px 0",
  },
  descriptionBox: {
    backgroundColor: "#f8fafc",
    padding: "12px",
    borderRadius: "8px",
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    marginTop: "auto",
    paddingTop: "12px",
  },
};

export default CatalogProductCard;
