import React, { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../components/common/Sidebar";
import StoreModal from "../components/stores/StoreModal";
import { toast } from "react-toastify";
import "../css/StoresPage.css";
import { baseApi } from "../components/common/apiEndpoint";

const StoresPage = () => {
  const [activeNav, setActiveNav] = useState("stores");
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedStore, setSelectedStore] = useState(null);

  // Helper utility to make sure baseApi always formats with a single clean trailing slash
  const getCleanUrl = useCallback((path) => {
    const base = baseApi.endsWith("/") ? baseApi : `${baseApi}/`;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${base}${cleanPath}`;
  }, []);

  // 📡 FETCH STORES FROM BACKEND API
  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      // 🔄 FIXED: Mapped endpoint route to match your back-end store routing path setup
      const url = getCleanUrl("api/admin/stores");

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.error || errData.message || "Failed to load store locations.",
        );
      }

      const data = await response.json();
      const storeList = Array.isArray(data) ? data : data.stores || [];
      setStores(storeList);
    } catch (err) {
      console.error("Fetch Stores Error:", err);
      toast.error(err.message || "Could not retrieve store locations.");
    } finally {
      setIsLoading(false);
    }
  }, [getCleanUrl]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // Open modal for new store creation
  const handleAddNewStore = () => {
    setSelectedStore(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  // Open modal for editing an existing store
  const handleEditStore = (store) => {
    setSelectedStore(store);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  // 💾 SAVE STORE (Create or Update API)
  const handleSaveStore = async (storeData) => {
    try {
      const token = localStorage.getItem("token");
      const storeId = storeData._id || storeData.id;
      const isAdd = modalMode === "add";

      // 🔄 FIXED: Route targets changed to align perfectly with your working backend endpoints
      const url = isAdd
        ? getCleanUrl("api/admin/create-store")
        : getCleanUrl(`api/admin/store/${storeId}`);
      const method = isAdd ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(storeData),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        // 🔄 FIXED: Evaluates errData.error to catch your backend structural validation guards
        throw new Error(
          errData.error || errData.message || `Failed to ${modalMode} store.`,
        );
      }

      toast.success(`Store successfully ${isAdd ? "created" : "updated"}!`);

      fetchStores();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save Store Error:", err);
      toast.error(err.message || "Error saving store.");
    }
  };

  // 🔍 FILTER STORES BY SEARCH QUERY
  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return stores;
    const query = searchQuery.toLowerCase();
    return stores.filter((s) => {
      const name = (s.name || "").toLowerCase();
      const category = (s.category || "").toLowerCase();
      const description = (s.description || "").toLowerCase();
      const ownerName = (s.owner?.name || "").toLowerCase();
      return (
        name.includes(query) ||
        category.includes(query) ||
        description.includes(query) ||
        ownerName.includes(query)
      );
    });
  }, [stores, searchQuery]);

  return (
    <div className="stores-layout">
      {/* 📌 REUSABLE SIDEBAR */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onSearch={(query) => setSearchQuery(query)}
      />

      {/* 💻 MAIN STORES PAGE CONTENT */}
      <main className="stores-main">
        <header className="stores-header">
          <div>
            <h1 className="page-title">Store Locations & Outlets</h1>
            <p className="page-subtitle">
              Manage multi-tenant retail stores, view assignees, categories, and
              branch operational statuses.
            </p>
          </div>

          <button className="btn-add-store" onClick={handleAddNewStore}>
            + Add New Store
          </button>
        </header>

        {/* STORES GRID OR LOADING / EMPTY STATES */}
        {isLoading ? (
          <div className="stores-loading-state">
            <div className="loading-icon">⏳</div>
            <p>Loading store locations...</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="stores-empty-state">
            <div className="empty-icon">🏪</div>
            <h3>
              {searchQuery ? "No matching stores found" : "No Store Locations"}
            </h3>
            <p>
              {searchQuery
                ? `No store matches "${searchQuery}".`
                : "You haven't registered any store branches yet."}
            </p>
          </div>
        ) : (
          <div className="stores-grid">
            {filteredStores.map((store) => {
              const storeId = store._id || store.id;
              const isActive = store.isActive ?? true;

              return (
                <div key={storeId} className="store-card">
                  <div className="store-card-header">
                    <div>
                      <h3 className="store-name">{store.name}</h3>
                      <span className="store-category-tag">
                        🏷️ {store.category || "General"}
                      </span>
                    </div>
                    <span
                      className={`status-pill ${
                        isActive ? "status-active" : "status-inactive"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="store-description">
                    {store.description ||
                      "No description available for this outlet."}
                  </p>

                  <div className="store-info-list">
                    <div className="info-row">
                      <span className="info-label">👤 Store Owner:</span>
                      <span className="info-value">
                        {store.owner?.name || "Unassigned"}
                      </span>
                    </div>
                    {store.owner?.email && (
                      <div className="info-row">
                        <span className="info-label">✉️ Owner Email:</span>
                        <span className="info-value">{store.owner.email}</span>
                      </div>
                    )}
                    <div className="info-row">
                      <span className="info-label">🔗 Identifier Slug:</span>
                      <span className="info-slug-code">
                        {store.slug || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="store-card-footer">
                    <button
                      className="btn-edit-store"
                      onClick={() => handleEditStore(store)}
                    >
                      ✏️ Edit Store Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* STORE ADD / EDIT MODAL */}
      <StoreModal
        isOpen={isModalOpen}
        mode={modalMode}
        store={selectedStore}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStore}
      />
    </div>
  );
};

export default StoresPage;
