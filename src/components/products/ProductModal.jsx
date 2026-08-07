// src/components/products/ProductModal.jsx
import React, { useState, useEffect } from "react";
import "../../css/productModal.css";

const DEFAULT_IMAGE = "https://via.placeholder.com/150?text=No+Image";

const CURRENCY_OPTIONS = [
  { code: "USD", symbol: "$", label: "USD ($) - US Dollar" },
  { code: "GHS", symbol: "₵", label: "GHS (₵) - Ghanaian Cedi" },
  { code: "EUR", symbol: "€", label: "EUR (€) - Euro" },
  { code: "GBP", symbol: "£", label: "GBP (£) - British Pound" },
  { code: "CAD", symbol: "CA$", label: "CAD ($) - Canadian Dollar" },
  { code: "AUD", symbol: "A$", label: "AUD ($) - Australian Dollar" },
  { code: "NGN", symbol: "₦", label: "NGN (₦) - Nigerian Naira" },
  { code: "KES", symbol: "KSh", label: "KES (KSh) - Kenyan Shilling" },
  { code: "INR", symbol: "₹", label: "INR (₹) - Indian Rupee" },
];

const ProductModal = ({
  product,
  stores = [],
  isOpen,
  onClose,
  onSave,
  mode = "add",
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [errorMsg, setErrorMsg] = useState("");
  const [isUploading, setIsUploading] = useState([false, false]);

  const [formData, setFormData] = useState({
    storeId: "",
    name: "",
    price: "",
    currency: "USD",
    stock: "0",
    description: "",
    images: ["", ""],
  });

  // 🛠️ Populate/reset form state when modal visibility or product ID changes
  useEffect(() => {
    if (!isOpen) return;

    const defaultStoreId =
      product?.store?._id ||
      product?.store ||
      (stores.length === 1 ? stores[0]._id : "");

    if (product && mode === "edit") {
      setFormData({
        storeId: defaultStoreId,
        name: product.name || "",
        price: product.price !== undefined ? product.price.toString() : "",
        currency: product.currency || "USD",
        stock: product.stock !== undefined ? product.stock.toString() : "0",
        description: product.description || "",
        images: [product.images?.[0] || "", product.images?.[1] || ""],
      });
    } else {
      // Reset form for "Add New Product"
      setFormData({
        storeId: defaultStoreId,
        name: "",
        price: "",
        currency: "USD",
        stock: "0",
        description: "",
        images: ["", ""],
      });
    }

    setActiveTab("details");
    setErrorMsg("");
    setIsUploading([false, false]);
  }, [isOpen, product?._id, mode]);

  // 🛡️ Safely handle async stores loading
  useEffect(() => {
    if (isOpen && !formData.storeId && stores.length > 0) {
      setFormData((prev) => ({
        ...prev,
        storeId: stores[0]._id || stores[0].id || "",
      }));
    }
  }, [isOpen, stores.length, formData.storeId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🚀 Direct Cloudinary Unsigned Upload Handler
  const handleImageUpload = async (index, e) => {
    setErrorMsg("");
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("File is too large! Please upload an image under 2MB.");
      e.target.value = null;
      return;
    }

    setIsUploading((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });

    try {
      const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        },
      );

      if (!response.ok) {
        throw new Error("Cloudinary upload failed.");
      }

      const data = await response.json();

      setFormData((prev) => {
        const updatedImages = [...prev.images];
        updatedImages[index] = data.secure_url;
        return { ...prev, images: updatedImages };
      });
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      setErrorMsg("Image sync failed. Please check network connectivity.");
      e.target.value = null;
    } finally {
      setIsUploading((prev) => {
        const copy = [...prev];
        copy[index] = false;
        return copy;
      });
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = "";
      return { ...prev, images: updatedImages };
    });
    const fileInput = document.getElementById(`file-input-${index}`);
    if (fileInput) fileInput.value = null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.storeId) {
      setErrorMsg("⚠️ Please select a Store Branch to link this product to.");
      setActiveTab("details");
      return;
    }

    if (isUploading.includes(true)) {
      setErrorMsg("Please wait for all image uploads to finish processing.");
      return;
    }

    const activeImages = formData.images
      .filter((img) => typeof img === "string" && img.trim() !== "")
      .slice(0, 2);

    const payload = {
      ...(mode === "edit" && product ? { id: product._id || product.id } : {}),
      storeId: formData.storeId,
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price) || 0,
      currency: formData.currency,
      stock: parseInt(formData.stock, 10) || 0,
      images: activeImages,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 className="modal-title">
              {mode === "add" ? "📦 Add New Product" : "⚙️ Edit Product"}
            </h3>
            <p className="modal-subtitle">
              {mode === "add"
                ? "Link your item to a store branch and catalog parameters"
                : formData.name || "Update product entry"}
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="modal-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            📝 General Info
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "price" ? "active" : ""}`}
            onClick={() => setActiveTab("price")}
          >
            💰 Price & Stock
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "media" ? "active" : ""}`}
            onClick={() => setActiveTab("media")}
          >
            🖼️ Photos (Max 2)
          </button>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div
            style={{
              padding: "0.6rem 1rem",
              background: "#fee2e2",
              color: "#991b1b",
              fontSize: "0.85rem",
              fontWeight: "600",
              borderLeft: "4px solid #dc2626",
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* TAB 1: GENERAL DETAILS & STORE SELECTION */}
          {activeTab === "details" && (
            <div className="tab-content">
              <div className="form-group">
                <label htmlFor="storeId" style={{ fontWeight: "600" }}>
                  Store Branch <span style={{ color: "#e11d48" }}>*</span>
                </label>

                {stores.length > 0 ? (
                  <select
                    id="storeId"
                    name="storeId"
                    value={formData.storeId}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="" disabled>
                      -- Select Target Store Branch --
                    </option>
                    {stores.map((s) => (
                      <option key={s._id || s.id} value={s._id || s.id}>
                        🏢 {s.name} {s.location ? `(${s.location})` : ""}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div
                    style={{
                      padding: "0.75rem",
                      background: "#fef3c7",
                      color: "#92400e",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                    }}
                  >
                    ⚠️ No active store branches found. Please create a store
                    branch first.
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="name" style={{ fontWeight: "600" }}>
                  Product Name <span style={{ color: "#e11d48" }}>*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Heavy Duty PVC Cement 500ml"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product specs or details..."
                  className="form-textarea"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PRICE & STOCK */}
          {activeTab === "price" && (
            <div className="tab-content">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: "1rem",
                }}
              >
                {/* Currency Dropdown */}
                <div className="form-group">
                  <label htmlFor="currency" style={{ fontWeight: "600" }}>
                    Currency <span style={{ color: "#e11d48" }}>*</span>
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unit Price */}
                <div className="form-group">
                  <label htmlFor="price" style={{ fontWeight: "600" }}>
                    Unit Price ({formData.currency}){" "}
                    <span style={{ color: "#e11d48" }}>*</span>
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="29.99"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "1.25rem" }}>
                <label htmlFor="stock" style={{ fontWeight: "600" }}>
                  Stock Quantity <span style={{ color: "#e11d48" }}>*</span>
                </label>
                <input
                  id="stock"
                  type="number"
                  min="0"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="100"
                  required
                  className="form-input"
                />
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA (FILE UPLOAD) */}
          {activeTab === "media" && (
            <div className="tab-content">
              <p className="field-hint">
                Adding product images is optional. Up to 2 photos (Max 2MB
                each).
              </p>

              <div className="image-slots-grid">
                {[0, 1].map((index) => (
                  <div
                    key={index}
                    className="image-slot-card"
                    style={{ marginBottom: "1rem" }}
                  >
                    <div
                      className="slot-header"
                      style={{ fontWeight: "600", marginBottom: "0.5rem" }}
                    >
                      Photo {index + 1}{" "}
                      {isUploading[index] && (
                        <span
                          style={{ color: "var(--accent)", fontSize: "0.8rem" }}
                        >
                          ⚡ Uploading...
                        </span>
                      )}
                    </div>

                    <div className="image-preview-box">
                      {formData.images[index] ? (
                        <div
                          className="preview-wrapper"
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "1rem",
                          }}
                        >
                          <img
                            src={formData.images[index] || DEFAULT_IMAGE}
                            alt={`Product slot ${index + 1}`}
                            className="preview-img"
                            style={{
                              maxHeight: "120px",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = DEFAULT_IMAGE;
                            }}
                          />
                          <button
                            type="button"
                            className="btn-secondary-sm"
                            onClick={() => handleRemoveImage(index)}
                          >
                            ✕ Remove
                          </button>
                        </div>
                      ) : (
                        <div className="no-image-placeholder">
                          <span>
                            {isUploading[index]
                              ? "Uploading to Cloud..."
                              : "No image selected"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: "0.5rem" }}>
                      <input
                        id={`file-input-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                        disabled={isUploading[index]}
                        className="file-input"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isUploading.includes(true) || stores.length === 0}
            >
              {mode === "add" ? "Create Product" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
