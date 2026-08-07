// src/components/catalog/CheckoutModal.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { baseApi } from "../common/apiEndpoint";

const INITIAL_FORM_STATE = {
  name: "",
  email: "",
  phone: "",
  address: "",
  narration: "",
};

const CheckoutModal = ({
  isOpen,
  items,
  onClose,
  onSuccessClearCart,
  onOrderSuccess,
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (acc, item) => acc + Number(item.price || 0) * item.quantity,
    0,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Client-side pre-validation matching backend rules
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and Email are required fields.");
      return;
    }

    if (!items || items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // 2. Format payload exact to backend requirements
    const payload = {
      items: items.map((item) => ({
        productId: item._id || item.id,
        quantity: item.quantity,
      })),
      customerDetails: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        narration: formData.narration.trim() || "not narration",
      },
    };

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      // Adjust endpoint path below to match your Express route (e.g. /api/orders/place)
      const response = await fetch(
        `${baseApi}/api/orders/public/checkout/place-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(payload),
        },
      );

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Failed to place order.");
      }

      toast.success(resData.message || "Order placed successfully!");

      // Clear cart, refresh catalog stock, and close modal
      onSuccessClearCart();
      if (onOrderSuccess) onOrderSuccess();
      setFormData(INITIAL_FORM_STATE);
      onClose();
    } catch (err) {
      console.error("Order Placement Error:", err);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-modal-overlay" onClick={onClose}>
      <div className="checkout-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="checkout-header">
          <h2>Complete Your Order</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="checkout-body">
          <p
            style={{
              color: "#475569",
              marginBottom: "1.25rem",
              fontSize: "0.9rem",
            }}
          >
            Total Items:{" "}
            <strong>{items.reduce((sum, i) => sum + i.quantity, 0)}</strong> |
            Total Price:{" "}
            <strong style={{ color: "#1d4ed8" }}>
              ${totalAmount.toFixed(2)}
            </strong>
          </p>

          <div className="form-group">
            <label>
              Full Name <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Email Address <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="e.g. +1 555-0199"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Delivery Address</label>
            <textarea
              name="address"
              rows="2"
              placeholder="Enter shipping or store pickup details..."
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Order Narration / Notes</label>
            <input
              type="text"
              name="narration"
              placeholder="e.g. Leave package at front desk"
              value={formData.narration}
              onChange={handleChange}
            />
          </div>

          {/* Footer Actions */}
          <div className="checkout-footer" style={{ padding: "1rem 0 0 0" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "0.75rem 1.25rem",
                borderRadius: "10px",
                border: "1.5px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-checkout-all"
              style={{ flex: 1, padding: "0.75rem 1.25rem" }}
            >
              {isSubmitting
                ? "⏳ Processing Order..."
                : `Confirm & Place Order ($${totalAmount.toFixed(2)})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
