import React, { useState, useEffect, useMemo, useCallback } from "react";
import CatalogProductCard from "../components/catalog/CatalogProductCard";
import CheckoutModal from "../components/catalog/CheckoutModal";
import { toast } from "react-toastify";
import { baseApi } from "../components/common/apiEndpoint";
import "../css/catalogPage.css";

const LOCAL_STORAGE_KEY = "store_catalog_cart_v1";

// Helper: Standardize entity ID retrieval
const getItemId = (item) =>
  item?._id || item?.id || item?.companyref || item?.slug;

// Helper: Extract unique companies directly from products list (Fallback)
const extractCompaniesFromProducts = (productList = []) => {
  const compMap = new Map();
  productList.forEach((p) => {
    const c = p?.company;
    if (c && typeof c === "object" && c.companyref) {
      compMap.set(c.companyref, c);
    } else if (p?.companyref) {
      compMap.set(p.companyref, {
        name: p.companyName || "Partner Business",
        companyref: p.companyref,
        location: p.location || "N/A",
        domain: p.domain || "",
        companySupportEmail: p.companySupportEmail || "N/A",
        primaryPhone: p.primaryPhone || "N/A",
      });
    }
  });
  return Array.from(compMap.values());
};

// Helper: Extract unique stores for a company from products list (Fallback)
const extractStoresFromProducts = (productList = [], companyRef, companyId) => {
  const localStores = productList
    .filter(
      (p) =>
        (companyRef && p?.company?.companyref === companyRef) ||
        (companyId && p?.company === companyId) ||
        (companyRef && p?.companyref === companyRef),
    )
    .map((p) => p.store)
    .filter(Boolean);

  return Array.from(
    new Map(localStores.map((s) => [s._id || s.name || s.slug, s])).values(),
  );
};

const CatalogPage = () => {
  // 🧭 VIEW & NAVIGATION STATE (Defaults to COMPANIES on load)
  const [viewMode, setViewMode] = useState("COMPANIES");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);

  // 📦 DATA STATES
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [stores, setStores] = useState([]);

  // ⏳ LOADING & FILTER STATES
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStoreFilter, setSelectedStoreFilter] = useState("ALL");

  // 👤 AUTH STATE
  const [userToken, setUserToken] = useState(
    () => localStorage.getItem("token") || "",
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup'
  const [authFormData, setAuthFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  // 🛒 CART STATE WITH LOCALSTORAGE PERSISTENCE
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

  // 📡 FETCH ALL CATALOG PRODUCTS
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(
        `${baseApi}/api/product/all-available/products`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: userToken ? `Bearer ${userToken}` : "",
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
    }
  }, [userToken]);

  // 📡 FETCH COMPANIES
  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseApi}/api/customer/company/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: userToken ? `Bearer ${userToken}` : "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : data.companies || [];
        setCompanies(list);
      } else {
        setCompanies(extractCompaniesFromProducts(products));
      }
    } catch {
      setCompanies(extractCompaniesFromProducts(products));
    } finally {
      setIsLoading(false);
    }
  }, [userToken, products]);

  // 📡 FETCH STORES FOR A SELECTED COMPANY
  const fetchStoresForCompany = useCallback(
    async (companyRef, companyId) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${baseApi}/api/customer/company/${companyRef || companyId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: userToken ? `Bearer ${userToken}` : "",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          const list = Array.isArray(data) ? data : data.stores || [];
          if (list.length > 0) {
            setStores(list);
          } else {
            setStores(
              extractStoresFromProducts(products, companyRef, companyId),
            );
          }
        } else {
          setStores(extractStoresFromProducts(products, companyRef, companyId));
        }
      } catch {
        setStores(extractStoresFromProducts(products, companyRef, companyId));
      } finally {
        setIsLoading(false);
      }
    },
    [products, userToken],
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (viewMode === "COMPANIES" && !selectedCompany) {
      fetchCompanies();
    }
  }, [viewMode, selectedCompany, fetchCompanies]);

  // Re-fetch or re-extract stores whenever products update or selectedCompany changes
  useEffect(() => {
    if (selectedCompany) {
      fetchStoresForCompany(selectedCompany.companyref, selectedCompany._id);
    }
  }, [products, selectedCompany, fetchStoresForCompany]);

  // 🔗 READ URL QUERY PARAMS ON INITIAL LOAD (Product search term only)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchVal = params.get("search") || params.get("q");

    if (searchVal) {
      setSearchQuery(searchVal);
    }
  }, []);

  // 🎯 AUTO-SELECT COMPANY IF URL PARAM MATCHES AN EXISTING COMPANY
  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      const params = new URLSearchParams(window.location.search);
      const targetQuery = params.get("company") || params.get("companyRef");

      if (targetQuery) {
        const queryLower = targetQuery.toLowerCase().trim();
        const match = companies.find(
          (c) =>
            (c.companyref && c.companyref.toLowerCase() === queryLower) ||
            (c.name && c.name.toLowerCase() === queryLower) ||
            (c._id && c._id === targetQuery),
        );

        if (match) {
          setSelectedCompany(match);
          setSelectedStore(null);
          setSearchQuery(""); // Clear search box so ref doesn't filter out products
        }
      }
    }
  }, [companies, selectedCompany]);

  // Handle drill down navigation
  const handleSelectCompany = (comp) => {
    setSelectedCompany(comp);
    setSelectedStore(null);
    setSearchQuery("");
  };

  const handleSelectStore = (store) => {
    setSelectedStore(store);
    setSearchQuery("");
  };

  const handleResetNavigation = () => {
    setSelectedCompany(null);
    setSelectedStore(null);
    setSearchQuery("");
  };

  // 🏬 EXTRACT UNIQUE STORES FOR DROPDOWN FILTER
  const storeOptions = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      const name = p?.store?.name || p?.storeName;
      if (name) set.add(name);
    });
    return Array.from(set);
  }, [products]);

  // 🔍 FILTER COMPANIES BASED ON SEARCH QUERY
  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) return companies;
    const q = searchQuery.toLowerCase().trim();
    return companies.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(q) ||
        (c.companyref || "").toLowerCase().includes(q) ||
        (c.location || "").toLowerCase().includes(q) ||
        (c.domain || "").toLowerCase().includes(q),
    );
  }, [companies, searchQuery]);

  // 🔍 FILTER STORES BASED ON SEARCH QUERY
  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return stores;
    const q = searchQuery.toLowerCase().trim();
    return stores.filter(
      (s) =>
        (s.name || "").toLowerCase().includes(q) ||
        (s.description || "").toLowerCase().includes(q) ||
        (s.category || "").toLowerCase().includes(q) ||
        (s.slug || "").toLowerCase().includes(q),
    );
  }, [stores, searchQuery]);

  // 🔍 FILTER PRODUCTS BASED ON VIEW & SEARCH CONTEXT
  const filteredProducts = useMemo(() => {
    let sourceProducts = products;

    if (viewMode === "COMPANIES" && selectedCompany && selectedStore) {
      sourceProducts = products.filter((p) => {
        const matchComp =
          p?.company?.companyref === selectedCompany.companyref ||
          p?.company === selectedCompany._id ||
          p?.companyref === selectedCompany.companyref;

        const matchStore =
          p?.store?._id === selectedStore._id ||
          p?.store === selectedStore._id ||
          p?.store?.slug === selectedStore.slug ||
          p?.storeName === selectedStore.name;

        return matchComp && matchStore;
      });
    }

    return sourceProducts.filter((p) => {
      const matchSearch =
        !searchQuery.trim() ||
        (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());

      const storeName = p?.store?.name || p?.storeName || "";
      const matchStore =
        selectedStoreFilter === "ALL" || storeName === selectedStoreFilter;

      return matchSearch && matchStore;
    });
  }, [
    products,
    searchQuery,
    selectedStoreFilter,
    viewMode,
    selectedCompany,
    selectedStore,
  ]);

  // 🛒 CART MUTATION HANDLERS
  const addToCart = (product) => {
    const targetId = getItemId(product);
    setCart((prevCart) => {
      const existing = prevCart.find((item) => getItemId(item) === targetId);

      if (existing) {
        return prevCart.map((item) =>
          getItemId(item) === targetId
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
          if (getItemId(item) === pId) {
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

  // 👤 AUTH HANDLER
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const endpoint =
      authMode === "login"
        ? `${baseApi}/api/user/login`
        : `${baseApi}/api/user/register`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authFormData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Authentication failed.");

      if (data.token) {
        localStorage.setItem("token", data.token);
        setUserToken(data.token);
      }
      toast.success(
        authMode === "login"
          ? "Welcome back!"
          : "Account created successfully!",
      );
      setShowAuthModal(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserToken("");
    toast.info("Logged out successfully.");
  };

  const toggleAuthMode = () => {
    setAuthMode((prev) => (prev === "login" ? "signup" : "login"));
    setAuthFormData({ name: "", username: "", email: "", password: "" });
  };

  return (
    <div className="catalog-page-container">
      {/* 🛍️ HEADER */}
      <header className="catalog-header">
        <div>
          <h1 className="catalog-title">Store Marketplace</h1>
          <p className="catalog-subtitle">
            Explore hardware supplies across businesses, branch stores, and
            multi-tenant catalogs.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {userToken ? (
            <button className="auth-btn logout-btn" onClick={handleLogout}>
              👤 Account (Logout)
            </button>
          ) : (
            <button
              className="auth-btn login-btn"
              onClick={() => setShowAuthModal(true)}
            >
              🔑 Login / Sign Up
            </button>
          )}

          <button
            className="cart-trigger-btn"
            onClick={() => setIsDrawerOpen(true)}
          >
            <span>🛒 View Cart</span>
            <span className="cart-count-pill">{totalCartCount}</span>
          </button>
        </div>
      </header>

      {/* 🔄 VIEW SWITCHER TABS */}
      <div className="view-mode-tabs" style={inlineStyles.tabContainer}>
        <button
          style={{
            ...inlineStyles.tabBtn,
            ...(viewMode === "COMPANIES" ? inlineStyles.activeTab : {}),
          }}
          onClick={() => setViewMode("COMPANIES")}
        >
          🏢 Browse Companies & Stores
        </button>
        <button
          style={{
            ...inlineStyles.tabBtn,
            ...(viewMode === "ALL_PRODUCTS" ? inlineStyles.activeTab : {}),
          }}
          onClick={() => {
            setViewMode("ALL_PRODUCTS");
            handleResetNavigation();
          }}
        >
          📦 All Products Catalog
        </button>
      </div>

      {/* 🧭 DRILL-DOWN BREADCRUMBS */}
      {viewMode === "COMPANIES" && (
        <div style={inlineStyles.breadcrumbBar}>
          <span
            style={inlineStyles.breadcrumbLink}
            onClick={handleResetNavigation}
          >
            🏢 Companies
          </span>
          {selectedCompany && (
            <>
              {" ❯ "}
              <span
                style={inlineStyles.breadcrumbLink}
                onClick={() => {
                  setSelectedStore(null);
                  setSearchQuery("");
                }}
              >
                {selectedCompany.name} ({selectedCompany.companyref})
              </span>
            </>
          )}
          {selectedStore && (
            <>
              {" ❯ "}
              <span style={{ fontWeight: "bold", color: "#0f172a" }}>
                🏪 {selectedStore.name} Catalog
              </span>
            </>
          )}
        </div>
      )}

      {/* 🔍 SEARCH AND FILTERS */}
      <div className="catalog-toolbar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={
              viewMode === "COMPANIES" && !selectedCompany
                ? "Search company name, reference code, or location..."
                : viewMode === "COMPANIES" && selectedCompany && !selectedStore
                  ? "Search store branch name or category..."
                  : "Search by product title or description..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {viewMode === "ALL_PRODUCTS" && (
          <select
            className="store-filter-select"
            value={selectedStoreFilter}
            onChange={(e) => setSelectedStoreFilter(e.target.value)}
          >
            <option value="ALL">🏢 All Store Branches</option>
            {storeOptions.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* LEVEL 1: COMPANIES LIST VIEW */}
      {viewMode === "COMPANIES" && !selectedCompany && (
        <>
          <h2 style={inlineStyles.sectionTitle}>Partner Companies</h2>
          {isLoading ? (
            <div style={inlineStyles.centerMessage}>
              ⏳ Loading companies...
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div style={inlineStyles.centerMessage}>
              🏢 No companies match your query "{searchQuery}".
            </div>
          ) : (
            <div style={inlineStyles.cardsGrid}>
              {filteredCompanies.map((comp) => (
                <div key={getItemId(comp)} style={inlineStyles.entityCard}>
                  <div style={inlineStyles.entityHeader}>
                    <span style={inlineStyles.companyBadge}>
                      REF: {comp.companyref || "N/A"}
                    </span>
                    <h3 style={{ margin: "8px 0 4px 0", color: "#0f172a" }}>
                      {comp.name}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: "#64748b",
                        fontSize: "0.85rem",
                      }}
                    >
                      📍 {comp.location || "Location not specified"}
                    </p>
                  </div>

                  <div style={inlineStyles.entityBody}>
                    {comp.domain && (
                      <div style={inlineStyles.cardDetailRow}>
                        🌐 <span>{comp.domain}</span>
                      </div>
                    )}
                    <div style={inlineStyles.cardDetailRow}>
                      ✉️ <span>{comp.companySupportEmail || "N/A"}</span>
                    </div>
                    <div style={inlineStyles.cardDetailRow}>
                      📞 <span>{comp.primaryPhone || "N/A"}</span>
                    </div>
                  </div>

                  <button
                    style={inlineStyles.actionBtn}
                    onClick={() => handleSelectCompany(comp)}
                  >
                    View Outlets & Stores →
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* LEVEL 2: STORES LIST VIEW */}
      {viewMode === "COMPANIES" && selectedCompany && !selectedStore && (
        <>
          <div style={{ marginBottom: "16px" }}>
            <h2 style={inlineStyles.sectionTitle}>
              Stores under {selectedCompany.name}
            </h2>
            <p style={{ color: "#64748b", margin: 0 }}>
              Select a store branch to view its product inventory.
            </p>
          </div>

          {isLoading ? (
            <div style={inlineStyles.centerMessage}>
              ⏳ Fetching company stores...
            </div>
          ) : filteredStores.length === 0 ? (
            <div style={inlineStyles.centerMessage}>
              {searchQuery
                ? `🏪 No stores match your search "${searchQuery}".`
                : "🏪 No registered stores found for this company yet."}
            </div>
          ) : (
            <div style={inlineStyles.cardsGrid}>
              {filteredStores.map((store) => (
                <div key={getItemId(store)} style={inlineStyles.entityCard}>
                  <div style={inlineStyles.entityHeader}>
                    <span style={inlineStyles.storeCategoryBadge}>
                      {store.category || "General Store"}
                    </span>
                    <h3 style={{ margin: "8px 0 4px 0", color: "#0f172a" }}>
                      🏪 {store.name}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: "#64748b",
                        fontSize: "0.85rem",
                      }}
                    >
                      {store.description || "No description provided."}
                    </p>
                  </div>

                  <div style={inlineStyles.entityBody}>
                    <div style={inlineStyles.cardDetailRow}>
                      💳 Accepted Payment:{" "}
                      <strong>{store.paymentMethode || "MOMO"}</strong>
                    </div>
                    <div style={inlineStyles.cardDetailRow}>
                      🏷️ Slug: <code>{store.slug}</code>
                    </div>
                  </div>

                  <button
                    style={inlineStyles.actionBtn}
                    onClick={() => handleSelectStore(store)}
                  >
                    Enter Store Catalog 🛒
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* LEVEL 3: STORE SPECIFIC CATALOG PRODUCTS */}
      {viewMode === "COMPANIES" && selectedCompany && selectedStore && (
        <>
          {filteredProducts.length === 0 ? (
            <div style={inlineStyles.centerMessage}>
              🛍️ No items available in <strong>{selectedStore.name}</strong>{" "}
              matching your query.
            </div>
          ) : (
            <div className="catalog-grid">
              {filteredProducts.map((product) => (
                <CatalogProductCard
                  key={getItemId(product)}
                  product={product}
                  onAddToCart={addToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ALL PRODUCTS VIEW */}
      {viewMode === "ALL_PRODUCTS" && (
        <>
          {isLoading ? (
            <div style={inlineStyles.centerMessage}>
              ⏳ Loading store items...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={inlineStyles.centerMessage}>
              🛍️ No products match your search or filter criteria.
            </div>
          ) : (
            <div className="catalog-grid">
              {filteredProducts.map((product) => (
                <CatalogProductCard
                  key={getItemId(product)}
                  product={product}
                  onAddToCart={addToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* 🗂️ CART DRAWER */}
      {isDrawerOpen && (
        <div
          className="cart-drawer-overlay"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            {/* Header with prominent X close button */}
            <div
              className="cart-drawer-header"
              style={inlineStyles.cartDrawerHeader}
            >
              <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#0f172a" }}>
                Shopping Cart ({totalCartCount})
              </h3>
              <button
                type="button"
                aria-label="Close Shopping Cart"
                onClick={() => setIsDrawerOpen(false)}
                style={inlineStyles.mobileCloseCartBtn}
              >
                ✕
              </button>
            </div>

            <div className="cart-drawer-body">
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <p style={{ color: "#64748b", marginBottom: "1rem" }}>
                    Your cart is currently empty.
                  </p>
                  <button
                    style={inlineStyles.secondaryCloseBtn}
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={getItemId(item)} className="cart-item-row">
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
                        {item.currency || "GHS"}{" "}
                        {Number(item.price || 0).toFixed(2)}
                      </div>
                      <div className="qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(getItemId(item), -1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(getItemId(item), 1)}
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
                    GHS {totalCartPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  className="btn-checkout-all"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                >
                  ⚡ Order All in Cart (GHS {totalCartPrice.toFixed(2)})
                </button>

                <button
                  style={inlineStyles.secondaryCloseBtn}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  ✕ Close Cart
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

      {/* 🔑 CUSTOMER AUTH MODAL */}
      {showAuthModal && (
        <div
          style={inlineStyles.modalOverlay}
          onClick={() => setShowAuthModal(false)}
        >
          <div
            style={inlineStyles.authCard}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={inlineStyles.modalCloseBtn}
              onClick={() => setShowAuthModal(false)}
            >
              ✕
            </button>
            <h3 style={{ margin: "0 0 8px 0" }}>
              {authMode === "login" ? "🔑 Customer Login" : "📝 Create Account"}
            </h3>
            <p
              style={{
                color: "#64748b",
                fontSize: "0.85rem",
                margin: "0 0 16px 0",
              }}
            >
              Log in to track your orders across all store locations.
            </p>

            <form onSubmit={handleAuthSubmit} style={inlineStyles.formStack}>
              {authMode === "signup" && (
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  style={inlineStyles.inputField}
                  value={authFormData.name}
                  onChange={(e) =>
                    setAuthFormData({ ...authFormData, name: e.target.value })
                  }
                />
              )}

              <input
                type="text"
                placeholder="Username or Email"
                required
                style={inlineStyles.inputField}
                value={authFormData.username}
                onChange={(e) =>
                  setAuthFormData({ ...authFormData, username: e.target.value })
                }
              />

              {authMode === "signup" && (
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  style={inlineStyles.inputField}
                  value={authFormData.email}
                  onChange={(e) =>
                    setAuthFormData({ ...authFormData, email: e.target.value })
                  }
                />
              )}

              <input
                type="password"
                placeholder="Password"
                required
                style={inlineStyles.inputField}
                value={authFormData.password}
                onChange={(e) =>
                  setAuthFormData({ ...authFormData, password: e.target.value })
                }
              />

              <button type="submit" style={inlineStyles.submitBtn}>
                {authMode === "login" ? "Sign In" : "Register"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "12px" }}>
              <button
                style={inlineStyles.textToggleBtn}
                onClick={toggleAuthMode}
              >
                {authMode === "login"
                  ? "Don't have an account? Sign up"
                  : "Already registered? Sign in"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Layout styles
const inlineStyles = {
  tabContainer: {
    display: "flex",
    gap: "12px",
    margin: "16px 0",
    borderBottom: "2px solid #e2e8f0",
    paddingBottom: "8px",
  },
  tabBtn: {
    padding: "10px 20px",
    border: "none",
    background: "#f1f5f9",
    color: "#475569",
    fontWeight: "600",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  activeTab: {
    background: "#2563eb",
    color: "#ffffff",
  },
  breadcrumbBar: {
    padding: "10px 16px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    marginBottom: "16px",
    fontSize: "0.95rem",
  },
  breadcrumbLink: {
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: "600",
  },
  centerMessage: {
    textAlign: "center",
    padding: "4rem",
    color: "#64748b",
    fontSize: "1.1rem",
  },
  sectionTitle: {
    margin: "0 0 12px 0",
    color: "#0f172a",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  entityCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  entityHeader: {
    marginBottom: "12px",
  },
  companyBadge: {
    fontSize: "0.75rem",
    fontWeight: "bold",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  storeCategoryBadge: {
    fontSize: "0.75rem",
    fontWeight: "bold",
    backgroundColor: "#f0fdf4",
    color: "#166534",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  entityBody: {
    fontSize: "0.88rem",
    color: "#475569",
    margin: "12px 0",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  cardDetailRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  actionBtn: {
    width: "100%",
    padding: "10px",
    marginTop: "12px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  authCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    width: "100%",
    maxWidth: "400px",
    position: "relative",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  modalCloseBtn: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "#f1f5f9",
    border: "1px solid #cbd5e1",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    fontSize: "1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cartDrawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "12px",
    borderBottom: "1px solid #e2e8f0",
  },
  mobileCloseCartBtn: {
    background: "#f1f5f9",
    border: "1px solid #cbd5e1",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#334155",
    cursor: "pointer",
    touchAction: "manipulation",
  },
  secondaryCloseBtn: {
    width: "100%",
    marginTop: "8px",
    padding: "10px",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  formStack: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  inputField: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
  },
  submitBtn: {
    padding: "10px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  textToggleBtn: {
    background: "none",
    border: "none",
    color: "#2563eb",
    fontSize: "0.85rem",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default CatalogPage;
