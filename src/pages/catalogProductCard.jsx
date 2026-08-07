// src/pages/CatalogPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import CatalogProductCard from "../components/catalog/CatalogProductCard";
import CheckoutModal from "../components/catalog/CheckoutModal";
import { toast } from "react-toastify";
import { baseApi } from "../components/common/apiEndpoint";
import "../css/catalogPage.css";

const LOCAL_STORAGE_KEY = "store_catalog_cart_v1";

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState("ALL");

  // 🛒 1. CART STATE WITH LOCALSTORAGE PERSISTENCE
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Sync Cart changes to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // 📡 2. FETCH ALL CATALOG PRODUCTS
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${baseApi}/api/admin/product/all-available/products`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to load catalog products.");
      }

      const data = await response.json();
      const list = Array.isArray(data) ? data : data.products || [];
      setProducts(list);
    } catch (err) {
      console.error("Fetch Catalog Error:", err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 🏬 EXTRACT UNIQUE STORES FOR FILTER
  const storeOptions = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      const name = p?.store?.name || p?.storeName;
      if (name) set.add(name);
    });
    return Array.from(set);
  }, [products]);

  // 🔍 FILTER PRODUCTS
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      const storeName = p?.store?.name || p?.storeName || "";
      const matchStore = selectedStore === "ALL" || storeName === selectedStore;
      return matchSearch && matchStore;
    });
  }, [products, searchQuery, selectedStore]);

  // 🛒 CART MUTATION HANDLERS
  const addToCart = (product) => {
    setCart((prevCart) => {
      const pId = product._id || product.id;
      const existing = prevCart.find((item) => (item._id || item.id) === pId);

      if (existing) {
        return prevCart.map((item) =>
          (item._id || item.id) === pId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast.success(`Added "${product.name}" to cart!`);
  };

  const updateQuantity = (pId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if ((item._id || item.id) === pId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean),
    );
  };

  const handleBuyNow = (product) => {
    addToCart(product);
    setIsDrawerOpen(true);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cart.reduce(
    (acc, item) => acc + Number(item.price || 0) * item.quantity,
    0,
  );

  return (
    <div className="catalog-page-container">
      {/* 🛍️ HEADER */}
      <header className="catalog-header">
        <div>
          <h1 className="catalog-title">Store Marketplace</h1>
          <p className="catalog-subtitle">
            Explore hardware supplies across your store branches and test user
            orders.
          </p>
        </div>

        {/* 🛒 PERSISTENT CART TRIGGER BUTTON */}
        <button
          className="cart-trigger-btn"
          onClick={() => setIsDrawerOpen(true)}
        >
          <span>🛒 View Cart</span>
          <span className="cart-count-pill">{totalCartCount}</span>
        </button>
      </header>

      {/* 🔍 SEARCH AND FILTERS */}
      <div className="catalog-toolbar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by product title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="store-filter-select"
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
        >
          <option value="ALL">🏢 All Store Branches</option>
          {storeOptions.map((store) => (
            <option key={store} value={store}>
              {store}
            </option>
          ))}
        </select>
      </div>

      {/* ⏳ GRID OR EMPTY STATES */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#64748b" }}>
          ⏳ Loading store items...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#64748b" }}>
          🛍️ No products match your search or filter criteria.
        </div>
      ) : (
        <div className="catalog-grid">
          {filteredProducts.map((product) => (
            <CatalogProductCard
              key={product._id || product.id}
              product={product}
              onAddToCart={addToCart}
              onBuyNow={handleBuyNow}
            />
          ))}
        </div>
      )}

      {/* 🗂️ CART DRAWER */}
      {isDrawerOpen && (
        <div
          className="cart-drawer-overlay"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-drawer-header">
              <h3 style={{ margin: 0 }}>Shopping Cart ({totalCartCount})</h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
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

            <div className="cart-drawer-body">
              {cart.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#64748b",
                    marginTop: "2rem",
                  }}
                >
                  Your cart is currently empty.
                </p>
              ) : (
                cart.map((item) => (
                  <div key={item._id || item.id} className="cart-item-row">
                    <img
                      src={
                        item.images?.[0] ||
                        item.imageUrl ||
                        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' fill='%23f1f5f9'><rect width='60' height='60'/></svg>"
                      }
                      alt={item.name}
                      className="cart-item-img"
                    />
                    <div className="cart-item-details">
                      <div className="cart-item-title">{item.name}</div>
                      <div className="cart-item-price">
                        ${Number(item.price).toFixed(2)}
                      </div>
                      <div className="qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(item._id || item.id, -1)
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item._id || item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-drawer-footer">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                    fontWeight: "700",
                  }}
                >
                  <span>Subtotal:</span>
                  <span style={{ color: "#2563eb", fontSize: "1.1rem" }}>
                    ${totalCartPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  className="btn-checkout-all"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                >
                  ⚡ Order All in Cart (${totalCartPrice.toFixed(2)})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📋 CHECKOUT MODAL */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        items={cart}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccessClearCart={() => setCart([])}
        onOrderSuccess={fetchProducts}
      />
    </div>
  );
};

export default CatalogPage;
