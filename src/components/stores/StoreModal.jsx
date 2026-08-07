// src/components/stores/StoreModal.jsx
import React, { useState, useEffect } from "react";
import "../../css/StoreModal.css";

const StoreModal = ({ store, isOpen, onClose, onSave, mode = "add" }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (store && mode === "edit") {
      setFormData({
        name: store.name || "",
        category: store.category || "",
        description: store.description || "",
        isActive: store.isActive ?? true,
      });
    } else {
      setFormData({
        name: "",
        category: "",
        description: "",
        isActive: true,
      });
    }
  }, [store, mode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 📤 Send exact payload expected by backend controller
    onSave({
      ...(mode === "edit" && store ? { _id: store._id || store.id } : {}),
      name: formData.name.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      isActive: Boolean(formData.isActive),
    });

    onClose();
  };

  return (
    <div className="store-modal-overlay" onClick={onClose}>
      <div
        className="store-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* PINNED HEADER */}
        <div className="store-modal-header">
          <div>
            <h3 className="store-modal-title">
              {mode === "add"
                ? "🏪 Create Store Front"
                : "⚙️ Edit Store Details"}
            </h3>
            <p className="store-modal-subtitle">
              {mode === "add"
                ? "Set up a new retail branch for your company"
                : formData.name}
            </p>
          </div>
          <button
            type="button"
            className="store-modal-close-btn"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* FORM WRAPPER */}
        <form onSubmit={handleSubmit} className="store-modal-form">
          {/* SCROLLABLE BODY */}
          <div className="store-modal-body">
            {/* STORE NAME */}
            <div className="form-group">
              <label htmlFor="name">Store Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Eli Flagship Electronics"
                required
              />
            </div>

            {/* CATEGORY */}
            <div className="form-group">
              <label htmlFor="category">Store Category *</label>
              <input
                id="category"
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Electronics"
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="form-group">
              <label htmlFor="description">Store Description *</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Our primary downtown retail hub featuring premium consumer electronics..."
                required
              />
            </div>

            {/* IS ACTIVE TOGGLE SWITCH */}
            <div className="form-group form-group-toggle">
              <div className="toggle-info">
                <label htmlFor="isActive" className="toggle-label-title">
                  Store Status
                </label>
                <span className="toggle-subtitle">
                  {formData.isActive
                    ? "Store is publicly active and accepting operations"
                    : "Store is currently inactive and hidden"}
                </span>
              </div>

              <div className="toggle-control-wrapper">
                <span
                  className={`status-pill-badge ${
                    formData.isActive ? "active" : "inactive"
                  }`}
                >
                  {formData.isActive ? "Active" : "Inactive"}
                </span>

                <label className="toggle-switch">
                  <input
                    id="isActive"
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <span className="toggle-slider round"></span>
                </label>
              </div>
            </div>
          </div>

          {/* PINNED FOOTER */}
          <div className="store-modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {mode === "add" ? "Create Store" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreModal;
