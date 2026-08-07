// src/pages/OrdersPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "../components/common/Sidebar";
import OrderDetailModal from "../components/orders/OrderDetailModal";
import { toast } from "react-toastify";
import { baseApi } from "../components/common/apiEndpoint";
import "../css/ordersPage.css";

const currencyFormatter = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
});

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const OrdersPage = () => {
  const [activeNav, setActiveNav] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isServing, setIsServing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 📡 Fetch live pending orders from backend
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${baseApi}/api/orders/all-orders?status=pending`,
        { headers: getAuthHeaders() },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch live orders from server.");
      }

      const data = await response.json();
      const orderList = Array.isArray(data) ? data : data.orders || [];
      setOrders(orderList);
    } catch (err) {
      console.error("Orders Fetch Error:", err);
      toast.error(err.message || "Could not load incoming orders.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOpenOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // 🛑 API call to trigger stock deduction & mark order served
  const handleMarkAsServed = async (orderId) => {
    if (isServing) return;
    setIsServing(true);

    try {
      const response = await fetch(`${baseApi}/api/orders/${orderId}/serve`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to mark order as served");
      }

      setOrders((prev) =>
        prev.filter((ord) => (ord._id || ord.id) !== orderId),
      );
      handleCloseModal();
      toast.success(data.message || `Order #${orderId} served successfully!`);
    } catch (err) {
      console.error("Serve Order Error:", err);
      toast.error(err.message || "Failed to process order update.");
    } finally {
      setIsServing(false);
    }
  };

  // Filter orders memoized for search query changes
  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return orders;

    return orders.filter((order) => {
      const id = (order._id || order.id || "").toString().toLowerCase();
      const customer = (order.customerName || "").toLowerCase();
      return id.includes(query) || customer.includes(query);
    });
  }, [orders, searchQuery]);

  return (
    <div className="orders-layout-wrapper">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="orders-main-content">
        <header className="orders-page-header">
          <div>
            <h1 className="page-title">📦 Active Incoming Orders</h1>
            <p className="page-subtitle">
              Manage live incoming orders, inspect details, and serve orders to
              sync stock.
            </p>
          </div>
          <div className="orders-header-actions">
            <button
              onClick={fetchOrders}
              disabled={isLoading}
              className="btn-refresh-orders"
            >
              {isLoading ? "Refreshing..." : "🔄 Refresh"}
            </button>
            <div className="orders-count-badge">
              <span>
                Pending Orders: <strong>{orders.length}</strong>
              </span>
            </div>
          </div>
        </header>

        {/* TOOLBAR */}
        <div className="orders-toolbar">
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by Order ID or Customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="orders-search-input"
              aria-label="Search orders"
            />
          </div>
        </div>

        {/* FEED / CONTENT AREA */}
        {isLoading ? (
          <div className="orders-loading-state">
            ⏳ Fetching active orders from server...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="orders-empty-state">
            <div className="empty-icon" aria-hidden="true">
              📥
            </div>
            <h3 className="empty-title">
              {searchQuery ? "No matching orders found" : "All Caught Up!"}
            </h3>
            <p className="empty-description">
              {searchQuery
                ? `No pending orders match "${searchQuery}".`
                : "There are no incoming active orders right now."}
            </p>
          </div>
        ) : (
          <div className="orders-cards-grid">
            {filteredOrders.map((order) => {
              const orderId = order._id || order.id;
              const total = order.totalAmount ?? order.total ?? 0;
              const itemsCount = order.items?.length || 0;
              const formattedTotal = currencyFormatter.format(Number(total));

              return (
                <div
                  key={orderId}
                  className="order-feed-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpenOrder(order)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOpenOrder(order);
                    }
                  }}
                >
                  <div className="card-top-row">
                    <span className="order-number">#{orderId}</span>
                    <span
                      className={`status-tag status-${(order.status || "pending").toLowerCase()}`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </div>

                  <div className="card-middle-content">
                    <h3 className="card-customer-name">
                      👤 {order.customerName || "Walk-in Customer"}
                    </h3>
                    <p className="card-items-info">
                      🛍️ {itemsCount} item(s) •{" "}
                      <strong className="card-amount">{formattedTotal}</strong>
                    </p>

                    {order.narration && (
                      <div className="card-narration-snippet">
                        💬 "
                        {order.narration.length > 50
                          ? `${order.narration.substring(0, 50)}...`
                          : order.narration}
                        "
                      </div>
                    )}
                  </div>

                  <div className="card-bottom-row">
                    <span className="card-time">
                      ⏱️{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Recently"}
                    </span>
                    <button
                      className="btn-open-order"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenOrder(order);
                      }}
                    >
                      View Details & Serve →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ORDER DETAIL MODAL */}
        <OrderDetailModal
          order={selectedOrder}
          isOpen={isModalOpen}
          isSubmitting={isServing}
          onClose={handleCloseModal}
          onServeOrder={handleMarkAsServed}
        />
      </main>
    </div>
  );
};

export default OrdersPage;
