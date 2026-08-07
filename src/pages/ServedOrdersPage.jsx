// src/pages/ServedOrdersPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../components/common/Sidebar";
import OrderDetailModal from "../components/orders/OrderDetailModal";
import { toast } from "react-toastify";
import { baseApi } from "../components/common/apiEndpoint";
import "../css/servedOrdersPage.css";

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

const ServedOrdersPage = () => {
  const [activeNav, setActiveNav] = useState("served-orders");
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isServing, setIsServing] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | Served | Pending
  const [dateFilter, setDateFilter] = useState("ALL"); // ALL | TODAY | THIS_WEEK | THIS_MONTH

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 📡 Fetch transaction log records from backend API
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseApi}/api/orders/all-orders`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to load order transaction records.");
      }

      const data = await response.json();
      const orderList = Array.isArray(data) ? data : data.orders || [];
      setTransactions(orderList);
    } catch (err) {
      console.error("Fetch Transactions Error:", err);
      toast.error(err.message || "Could not retrieve order transactions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // 🔍 Multi-criteria Filter Logic
  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const now = new Date();

    return transactions.filter((item) => {
      const orderId = (item.id || item._id || "").toString().toLowerCase();
      const name = (item.customerName || "").toLowerCase();
      const phone = (item.customerPhone || "").toLowerCase();
      const narration = (item.narration || "").toLowerCase();

      // 1. Search Query Match
      const matchesSearch =
        !query ||
        orderId.includes(query) ||
        name.includes(query) ||
        phone.includes(query) ||
        narration.includes(query);

      // 2. Status Match
      const itemStatus = (item.status || "").toLowerCase();
      const matchesStatus =
        statusFilter === "ALL" || itemStatus === statusFilter.toLowerCase();

      // 3. Date Range Match
      let matchesDate = true;
      const targetDateStr = item.servedAt || item.createdAt;

      if (dateFilter !== "ALL" && targetDateStr) {
        const orderDate = new Date(targetDateStr);
        if (!isNaN(orderDate.getTime())) {
          if (dateFilter === "TODAY") {
            matchesDate = orderDate.toDateString() === now.toDateString();
          } else if (dateFilter === "THIS_WEEK") {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            matchesDate = orderDate >= sevenDaysAgo;
          } else if (dateFilter === "THIS_MONTH") {
            matchesDate =
              orderDate.getMonth() === now.getMonth() &&
              orderDate.getFullYear() === now.getFullYear();
          }
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [transactions, searchQuery, statusFilter, dateFilter]);

  // 📊 Calculate Financial & Audit Summary Metrics
  const { totalRevenue, servedCount, pendingCount } = useMemo(() => {
    let revenue = 0;
    let served = 0;
    let pending = 0;

    filteredTransactions.forEach((tx) => {
      const status = (tx.status || "").toLowerCase();
      if (status === "served") {
        revenue += Number(tx.totalAmount ?? tx.total ?? 0);
        served += 1;
      } else if (status === "pending") {
        pending += 1;
      }
    });

    return {
      totalRevenue: revenue,
      servedCount: served,
      pendingCount: pending,
    };
  }, [filteredTransactions]);

  // Modal Handlers
  const handleInspectOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Re-Serve or Update order status on backend
  const handleMarkAsServed = async (orderId) => {
    if (isServing) return;
    setIsServing(true);

    try {
      const response = await fetch(`${baseApi}/api/orders/${orderId}/serve`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: "Served" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to mark order as served.");
      }

      toast.success(data.message || `Order #${orderId} marked as Served!`);
      await fetchTransactions();
      handleCloseModal();
    } catch (err) {
      console.error("Mark as Served Error:", err);
      toast.error(err.message || "Error updating order status.");
    } finally {
      setIsServing(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setDateFilter("ALL");
  };

  return (
    <div className="served-orders-layout">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onSearch={(query) => setSearchQuery(query)}
      />

      <main className="served-orders-main">
        {/* PAGE HEADER */}
        <header className="page-header">
          <div>
            <h1 className="header-title">📜 Order Audit & History</h1>
            <p className="header-subtitle">
              Audit transaction history, query served orders, inspect payment
              methods, and monitor stock updates.
            </p>
          </div>

          <div className="header-stats-group">
            <div className="stat-pill">
              <span className="stat-label">Total Revenue</span>
              <strong className="stat-value text-green">
                {currencyFormatter.format(totalRevenue)}
              </strong>
            </div>
            <div className="stat-pill">
              <span className="stat-label">Served Orders</span>
              <strong className="stat-value">{servedCount}</strong>
            </div>
            {pendingCount > 0 && (
              <div className="stat-pill warning">
                <span className="stat-label">Pending</span>
                <strong className="stat-value text-orange">
                  {pendingCount}
                </strong>
              </div>
            )}
          </div>
        </header>

        {/* 🔍 QUERY & FILTER TOOLBAR */}
        <section className="database-filter-bar">
          <div className="search-field">
            <span className="search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="text"
              placeholder="Query by Order ID, Customer Name, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="db-search-input"
              aria-label="Search transaction records"
            />
          </div>

          <div className="filter-controls-wrapper">
            <div className="filter-group">
              <label htmlFor="status-filter" className="filter-label">
                Status:
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="db-select-filter"
              >
                <option value="ALL">All Statuses</option>
                <option value="Served">✅ Served Only</option>
                <option value="Pending">🟡 Pending Only</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="date-filter" className="filter-label">
                Period:
              </label>
              <select
                id="date-filter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="db-select-filter"
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Today</option>
                <option value="THIS_WEEK">This Week</option>
                <option value="THIS_MONTH">This Month</option>
              </select>
            </div>

            <button
              onClick={fetchTransactions}
              disabled={isLoading}
              className="btn-refresh-history"
              title="Reload records from server"
            >
              {isLoading ? "Loading..." : "🔄 Refresh"}
            </button>
          </div>
        </section>

        {/* 📊 DATABASE TABLE VIEW */}
        <section className="table-container">
          <table className="orders-db-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Details</th>
                <th>Payment</th>
                <th>Items</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Date / Time</th>
                <th>Served By</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="no-data-cell">
                    ⏳ Querying order database logs...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-data-cell">
                    <div className="empty-search-box">
                      <p>
                        🔍 No order records found matching your query filters.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="btn-reset-filters"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const itemsCount = Array.isArray(tx.items)
                    ? tx.items.length
                    : 0;
                  const displayId = tx.id || tx._id || "N/A";
                  const statusClass = (tx.status || "pending").toLowerCase();
                  const total = tx.totalAmount ?? tx.total ?? 0;
                  const rawDate = tx.servedAt || tx.createdAt;

                  const formattedDate = rawDate
                    ? `${new Date(rawDate).toLocaleDateString()} ${new Date(
                        rawDate,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : "-";

                  return (
                    <tr key={displayId} className="table-row-item">
                      <td data-label="Order ID" className="font-mono font-bold">
                        #{displayId}
                      </td>
                      <td data-label="Customer Details">
                        <div className="customer-cell">
                          <span className="customer-name">
                            {tx.customerName || "Walk-in Customer"}
                          </span>
                          {tx.customerPhone && (
                            <span className="customer-phone">
                              {tx.customerPhone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td data-label="Payment">
                        <span className="payment-badge">
                          {tx.paymentMethod || "Cash"}
                        </span>
                      </td>
                      <td data-label="Items">{itemsCount} item(s)</td>
                      <td
                        data-label="Total Value"
                        className="font-bold text-dark"
                      >
                        {currencyFormatter.format(Number(total))}
                      </td>
                      <td data-label="Status">
                        <span className={`status-pill status-${statusClass}`}>
                          {tx.status || "Unknown"}
                        </span>
                      </td>
                      <td
                        data-label="Date / Time"
                        className="text-muted font-sm"
                      >
                        {formattedDate}
                      </td>
                      <td data-label="Served By" className="text-muted">
                        {tx.servedBy || "System Admin"}
                      </td>
                      <td data-label="Action" className="text-right">
                        <button
                          className="btn-inspect"
                          onClick={() => handleInspectOrder(tx)}
                        >
                          Inspect Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>

        {/* ORDER DETAIL / NARRATION MODAL */}
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

export default ServedOrdersPage;
