// src/pages/OwnerDashboard.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../components/common/Sidebar";
import ProductCard from "../components/products/ProductCard";
import ProductModal from "../components/products/ProductModal";
import { toast } from "react-toastify";
import "../css/ownerPage.css";
import { baseApi } from "../components/common/apiEndpoint";

const OwnerDashboard = () => {
  const [activeNav, setActiveNav] = useState("products");
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]); // 🏢 Store branches state
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("edit"); // 'add' | 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 📡 1. FETCH PRODUCTS FROM BACKEND API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${baseApi}/api/admin/product/get-your-goods`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      const productList = Array.isArray(data) ? data : data.products || [];
      setProducts(productList);
    } catch (err) {
      console.error("Fetch Products Error:", err);
      toast.error(err.message || "Could not fetch catalog products.", {
        toastId: "fetch-products-error", // 👈 Keeps it from printing twice!
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 📡 2. FETCH STORES FROM BACKEND API
  const fetchStores = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseApi}/api/admin/stores`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load stores list.");
      }

      const data = await response.json();
      // Safely extract array regardless of backend payload key structure
      const storeList = Array.isArray(data)
        ? data
        : data.stores || data.shops || [];
      setStores(storeList);
    } catch (err) {
      console.error("Fetch Stores Error:", err);
    }
  }, []);

  // Initial load for both Products & Stores
  useEffect(() => {
    fetchProducts();
    fetchStores();
  }, [fetchProducts, fetchStores]);

  // OPEN MODAL FOR EDITING
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  // OPEN MODAL FOR ADDING NEW PRODUCT
  const handleAddNewProduct = () => {
    setSelectedProduct(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  // SAVE PRODUCT (Handles both Create & Update with Backend Sync)
  const handleSaveProduct = async (productData) => {
    try {
      const token = localStorage.getItem("token");
      const productId = productData.id || productData._id;
      const isAdd = modalMode === "add";

      const url = isAdd
        ? `${baseApi}/api/admin/product/add-product`
        : `${baseApi}/api/admin/product/update/${productId}`;
      const method = isAdd ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(productData), // contains: { storeId, name, price, stock, description, images }
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to ${modalMode} product.`);
      }

      toast.success(`Product successfully ${isAdd ? "created" : "updated"}!`);

      // Refresh catalog & close modal
      fetchProducts();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save Product Error:", err);
      toast.error(err.message || "Error saving product. Please try again.");
    }
  };

  // 🔍 FILTERED PRODUCTS BASED ON SEARCH QUERY
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      return name.includes(query) || desc.includes(query);
    });
  }, [products, searchQuery]);

  return (
    <div
      className="dashboard-layout"
      style={{ display: "flex", minHeight: "100vh", width: "100%" }}
    >
      {/* 📌 REUSABLE HIDEABLE SIDEBAR */}
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* 💻 MAIN DASHBOARD CONTENT */}
      <main
        className="dashboard-main"
        style={{
          flex: 1,
          height: "100vh",
          overflowY: "auto",
          boxSizing: "border-box",
          padding: "2rem",
        }}
      >
        <header className="main-header">
          <div>
            <h1 className="page-title">Product Catalog</h1>
            <p className="page-subtitle">
              Manage inventory, prices, and imagery across your branches.
            </p>
          </div>

          <div
            style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            <button
              onClick={() => {
                fetchProducts();
                fetchStores();
              }}
              disabled={isLoading}
              style={{
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                padding: "0.6rem 0.9rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.85rem",
                color: "#475569",
              }}
            >
              {isLoading ? "Refreshing..." : "🔄 Refresh"}
            </button>

            {/* WIRED ADD PRODUCT BUTTON */}
            <button
              className="btn-primary-action"
              onClick={handleAddNewProduct}
            >
              + Add New Product
            </button>
          </div>
        </header>

        {/* 🔍 CATALOG SEARCH TOOLBAR */}
        <div style={{ margin: "1.5rem 0", maxWidth: "450px" }}>
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "0.85rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                fontSize: "0.9rem",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search catalog by product name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem 0.65rem 2.4rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "0.9rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* ⏳ LOADING STATE */}
        {isLoading ? (
          <div
            style={{
              padding: "4rem",
              textAlign: "center",
              color: "#64748b",
              background: "#ffffff",
              borderRadius: "12px",
              border: "1px dashed #cbd5e1",
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⏳</div>
            <p style={{ margin: 0, fontWeight: "600" }}>
              Loading catalog items from server...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* 💼 PROFESSIONAL EMPTY STATE */
          <div
            style={{
              padding: "4rem 2rem",
              textAlign: "center",
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              maxWidth: "520px",
              margin: "2rem auto",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem auto",
                fontSize: "1.75rem",
              }}
            >
              🏷️
            </div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                color: "#0f172a",
                margin: "0 0 0.5rem 0",
              }}
            >
              {searchQuery
                ? "No matching products found"
                : "No Products Available"}
            </h3>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#64748b",
                margin: "0 0 1.5rem 0",
                lineHeight: 1.5,
              }}
            >
              {searchQuery
                ? `No products match "${searchQuery}". Try searching with a different term.`
                : "Your store catalog is currently empty. Start adding products to populate your branches."}
            </p>

            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  background: "#f1f5f9",
                  color: "#334155",
                  border: "1px solid #cbd5e1",
                  padding: "0.6rem 1.25rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={handleAddNewProduct}
                style={{
                  background: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  padding: "0.6rem 1.25rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                + Add First Product
              </button>
            )}
          </div>
        ) : (
          /* PRODUCTS GRID */
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id || product._id}
                product={product}
                onEditClick={handleEditProduct}
              />
            ))}
          </div>
        )}
      </main>

      {/* MODAL */}
      <ProductModal
        isOpen={isModalOpen}
        mode={modalMode}
        product={selectedProduct}
        stores={stores} /* 👈 Passed stores list down to the modal */
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default OwnerDashboard;
