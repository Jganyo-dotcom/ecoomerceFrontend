// src/components/orders/OrderDetailModal.jsx
import React, { useState } from "react";

const DEFAULT_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' fill='%23f1f5f9'><rect width='60' height='60'/><path d='M20 20h20v20H20z' fill='%23cbd5e1'/></svg>";

const OrderDetailModal = ({ order, isOpen, onClose, onServeOrder }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  // 🛡️ Data Extraction aligned with Mongoose Schema
  const orderId = order._id || order.id;
  const storeName = order.store?.name || "Main Store Branch";
  const totalAmount = Number(order.totalAmount || 0);
  const items = Array.isArray(order.items) ? order.items : [];
  const status = (order.status || "pending").toLowerCase();
  const isServed = status === "served";

  // Nested Customer Details Extraction
  const customer = order.customerDetails || {};
  const customerName = customer.name || "Walk-in Customer";
  const customerEmail = customer.email || "N/A";
  const customerPhone = customer.phone || "N/A";
  const customerAddress = customer.address || "N/A";
  const narration =
    customer.narration && customer.narration !== "not narration"
      ? customer.narration
      : null;

  const handleServeClick = async () => {
    setIsSubmitting(true);
    try {
      await onServeOrder(orderId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="order-modal-header">
          <div className="modal-header-meta">
            <span className="order-id-badge">Order #{orderId?.slice(-6)}</span>
            <span className={`status-pill status-${status}`}>
              {status === "served" ? "✓ Served" : "⏳ Pending"}
            </span>
          </div>
          <button
            className="modal-close-icon"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="order-modal-body">
          {/* STORE & TIMESTAMP SUMMARY */}
          <div className="order-context-bar">
            <span>
              🏢 Store: <strong>{storeName}</strong>
            </span>
            <span>
              ⏱️ Date:{" "}
              <strong>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "Recently"}
              </strong>
            </span>
          </div>

          {/* CUSTOMER DETAILS GRID */}
          <div className="modal-section">
            <h4 className="section-heading">👤 Customer Details</h4>
            <div className="customer-info-grid">
              <div className="info-cell">
                <span className="info-label">Full Name</span>
                <span className="info-value">{customerName}</span>
              </div>
              <div className="info-cell">
                <span className="info-label">Phone Number</span>
                <span className="info-value">{customerPhone}</span>
              </div>
              <div className="info-cell">
                <span className="info-label">Email Address</span>
                <span className="info-value">{customerEmail}</span>
              </div>
              <div className="info-cell">
                <span className="info-label">Delivery Address</span>
                <span className="info-value">{customerAddress}</span>
              </div>
            </div>
          </div>

          {/* CUSTOMER NARRATION / NOTES */}
          {narration && (
            <div className="narration-callout">
              <span className="narration-icon">💬</span>
              <div>
                <strong>Customer Note:</strong>
                <p>"{narration}"</p>
              </div>
            </div>
          )}

          {/* ORDERED ITEMS BREAKDOWN */}
          <div className="modal-section">
            <h4 className="section-heading">📦 Order Items ({items.length})</h4>
            <div className="order-items-list">
              {items.map((item, idx) => {
                const product = item.product || {};
                const name = item.name || product.name || "Item";
                const price = Number(item.price || product.price || 0);
                const quantity = Number(item.quantity || 1);
                const itemTotal = price * quantity;
                const imageSrc =
                  product.images?.[0] || product.imageUrl || DEFAULT_IMAGE;

                return (
                  <div key={item._id || idx} className="order-item-card">
                    <img
                      src={imageSrc}
                      alt={name}
                      className="item-thumbnail"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE;
                      }}
                    />
                    <div className="item-info">
                      <h5 className="item-title">{name}</h5>
                      <span className="item-unit-price">
                        GH₵ {price.toFixed(2)} × {quantity}
                      </span>
                    </div>
                    <div className="item-total-price">
                      GH₵ {itemTotal.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="order-modal-footer">
          <div className="modal-total-wrapper">
            <span className="total-label">Total Payable</span>
            <span className="total-amount">GH₵ {totalAmount.toFixed(2)}</span>
          </div>

          <div className="footer-actions">
            <button className="btn-secondary" onClick={onClose}>
              Close
            </button>
            {!isServed && (
              <button
                className="btn-primary-serve"
                disabled={isSubmitting}
                onClick={handleServeClick}
              >
                {isSubmitting ? "Processing..." : "✓ Serve Order"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
