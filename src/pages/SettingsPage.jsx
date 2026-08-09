import React, { useState, useEffect } from "react";
import Sidebar from "../components/common/Sidebar";
import "../css/settingsPage.css";
import { toast } from "react-toastify";
import { baseApi } from "../components/common/apiEndpoint";

const SettingsPage = () => {
  const [activeNav, setActiveNav] = useState("settings");
  const [activeTab, setActiveTab] = useState("general"); // general | account | store | receipts
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // --- 1. STATE DIRECTLY MATCHING YOUR API RESPONSE ---
  const [company, setCompany] = useState({
    id: "",
    name: "",
    companyref: "",
    domain: "",
    location: "",
    companySupportEmail: "",
    primaryPhone: "",
    companyLink: "",
  });

  const [user, setUser] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    phone: "",
    role: "",
  });

  const [store, setStore] = useState({
    enableLowStockAlerts: true,
    lowStockThreshold: 5,
    requireOrderNarration: true,
    allowNegativeStockSale: false,
    defaultPaymentMethod: "Mobile Money",
  });

  const [receiptsAndSecurity, setReceiptsAndSecurity] = useState({
    receiptHeader: "",
    receiptFooter: "",
    enableTwoFactor: false,
  });

  // Password mutation state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordFeedback, setPasswordFeedback] = useState({
    type: "",
    text: "",
  });

  // --- 2. INITIAL DATA FETCH ---
  useEffect(() => {
    const fetchSettingsData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${baseApi}/api/settings/settings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load settings data");
        }

        // Map payload directly from API response
        if (data.company) setCompany(data.company);
        if (data.user) setUser(data.user);
        if (data.store) setStore(data.store);
        if (data.receiptsAndSecurity)
          setReceiptsAndSecurity(data.receiptsAndSecurity);
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast.error(error.message || "❌ Failed to load settings from server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettingsData();
  }, [baseApi]);

  // --- HANDLERS ---
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
    }, 3500);
  };

  const handleSaveAllSettings = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${baseApi}/api/settings/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company,
          user,
          store,
          receiptsAndSecurity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update configuration settings.",
        );
      }

      triggerToast("✅ All system preferences saved and synchronized!");
    } catch (error) {
      console.error("Error saving settings:", error);
      triggerToast(
        error.message || "❌ Error saving settings. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordFeedback({ type: "", text: "" });

    if (!passwordForm.currentPassword) {
      setPasswordFeedback({
        type: "error",
        text: "Please enter your current password.",
      });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordFeedback({
        type: "error",
        text: "New password must be at least 8 characters long.",
      });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordFeedback({
        type: "error",
        text: "New passwords do not match.",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${baseApi}/api/settings/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Password update failed.",
        );
      }

      setPasswordFeedback({
        type: "success",
        text: "Password changed successfully!",
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordFeedback({
        type: "error",
        text: error.message || "Server error while updating password.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="settings-layout-wrapper">
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
        <main className="settings-main-content">
          <div className="loading-container">⌛ Loading settings data...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="settings-layout-wrapper">
      {/* SIDEBAR INTEGRATION */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onSearch={(query) => setSearchQuery(query)}
      />

      {/* MAIN CONTENT AREA */}
      <main className="settings-main-content">
        {/* PAGE HEADER */}
        <header className="settings-page-header">
          <div>
            <h1 className="page-title">⚙️ System & Store Settings</h1>
            <p className="page-subtitle">
              Manage company details, user account settings, store operational
              preferences, and security policies.
            </p>
          </div>
          <button
            type="button"
            className="btn-save-primary"
            onClick={handleSaveAllSettings}
            disabled={isSaving}
          >
            {isSaving ? "⌛ Saving..." : "💾 Save All Changes"}
          </button>
        </header>

        {/* SAVE SUCCESS TOAST BANNER */}
        {showSaveToast && (
          <div className="settings-toast-banner">{toastMessage}</div>
        )}

        {/* SETTINGS NAVIGATION TABS */}
        <div className="settings-nav-tabs">
          <button
            className={`tab-btn ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            🏢 Company Profile
          </button>
          <button
            className={`tab-btn ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            👤 My Account & Password
          </button>
          <button
            className={`tab-btn ${activeTab === "store" ? "active" : ""}`}
            onClick={() => setActiveTab("store")}
          >
            🛠 Store & Inventory
          </button>
          <button
            className={`tab-btn ${activeTab === "receipts" ? "active" : ""}`}
            onClick={() => setActiveTab("receipts")}
          >
            📄 Receipts & Security
          </button>
        </div>

        {/* TAB CONTENT AREA */}
        <div className="settings-tab-content">
          {/* TAB 1: COMPANY PROFILE */}
          {activeTab === "general" && (
            <div className="settings-section-card">
              <h2 className="section-card-title">Company Profile</h2>
              <p className="section-card-subtitle">
                Tenant details and public contact info.
              </p>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    value={company.name || ""}
                    onChange={(e) =>
                      setCompany({ ...company, name: e.target.value })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company Reference Code</label>
                  <input
                    type="text"
                    value={company.companyref || ""}
                    className="form-input disabled-input"
                  />
                  <span className="field-hint">
                    Unique reference identifier generated by system.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Domain Name</label>
                  <input
                    type="text"
                    value={company.domain || ""}
                    onChange={(e) =>
                      setCompany({ ...company, domain: e.target.value })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location / Address</label>
                  <input
                    type="text"
                    value={company.location || ""}
                    onChange={(e) =>
                      setCompany({ ...company, location: e.target.value })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Support Email Address</label>
                  <input
                    type="text"
                    value={company.companySupportEmail || ""}
                    onChange={(e) =>
                      setCompany({
                        ...company,
                        companySupportEmail: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Phone Number</label>
                  <input
                    type="text"
                    value={company.primaryPhone || ""}
                    onChange={(e) =>
                      setCompany({ ...company, primaryPhone: e.target.value })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Catalog Page URL</label>
                  <input
                    type="text"
                    value={company.companyLink || ""}
                    disabled
                    className="form-input disabled-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER ACCOUNT & PASSWORD */}
          {activeTab === "account" && (
            <div className="settings-section-card">
              <h2 className="section-card-title">User Account Details</h2>
              <p className="section-card-subtitle">
                Manage your user profile credentials and update system login
                password.
              </p>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={user.name || ""}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    value={user.username || ""}
                    onChange={(e) =>
                      setUser({ ...user, username: e.target.value })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Login Email</label>
                  <input
                    type="email"
                    value={user.email || ""}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="text"
                    value={user.phone || ""}
                    onChange={(e) =>
                      setUser({ ...user, phone: e.target.value })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">System Role</label>
                  <input
                    type="text"
                    value={user.role || ""}
                    disabled
                    className="form-input disabled-input"
                  />
                </div>
              </div>

              <hr className="divider-line" />

              <h3 className="sub-card-title">🔑 Change Password</h3>
              {passwordFeedback.text && (
                <div className={`alert-banner ${passwordFeedback.type}`}>
                  {passwordFeedback.text}
                </div>
              )}

              <form onSubmit={handlePasswordUpdate} className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    placeholder="Min 8 characters"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Re-enter new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <button type="submit" className="btn-secondary-sm">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: STORE & INVENTORY RULES */}
          {activeTab === "store" && (
            <div className="settings-section-card">
              <h2 className="section-card-title">
                Inventory & Transaction Rules
              </h2>
              <p className="section-card-subtitle">
                Manage stock thresholds, checkout rules, and payment options.
              </p>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Low Stock Threshold Limit
                  </label>
                  <input
                    type="number"
                    value={store.lowStockThreshold}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        lowStockThreshold: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="form-input"
                  />
                  <span className="field-hint">
                    Flag items as low stock when units fall below this number.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Default Payment Method</label>
                  <select
                    value={store.defaultPaymentMethod}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        defaultPaymentMethod: e.target.value,
                      })
                    }
                    className="form-select"
                  >
                    <option value="Mobile Money">Mobile Money (MoMo)</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="toggle-list-group">
                <div className="toggle-row">
                  <div>
                    <strong className="toggle-title">
                      Enable Low Stock Alerts
                    </strong>
                    <p className="toggle-desc">
                      Automatically alert managers when inventory drops below
                      the threshold limit.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={store.enableLowStockAlerts}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        enableLowStockAlerts: e.target.checked,
                      })
                    }
                    className="toggle-checkbox"
                  />
                </div>

                <div className="toggle-row">
                  <div>
                    <strong className="toggle-title">
                      Require Order Narration
                    </strong>
                    <p className="toggle-desc">
                      Require cashiers to enter order notes or delivery specs
                      during checkout.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={store.requireOrderNarration}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        requireOrderNarration: e.target.checked,
                      })
                    }
                    className="toggle-checkbox"
                  />
                </div>

                <div className="toggle-row">
                  <div>
                    <strong className="toggle-title">
                      Allow Negative Stock Sale
                    </strong>
                    <p className="toggle-desc">
                      Allow sales to proceed even when stock count reaches 0.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={store.allowNegativeStockSale}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        allowNegativeStockSale: e.target.checked,
                      })
                    }
                    className="toggle-checkbox"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RECEIPTS & SECURITY */}
          {activeTab === "receipts" && (
            <div className="settings-section-card">
              <h2 className="section-card-title">Receipts & Security</h2>
              <p className="section-card-subtitle">
                Configure receipt branding text and authentication settings.
              </p>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Receipt Header Message</label>
                  <input
                    type="text"
                    placeholder="e.g. Welcome to Eli Corporation!"
                    value={receiptsAndSecurity.receiptHeader || ""}
                    onChange={(e) =>
                      setReceiptsAndSecurity({
                        ...receiptsAndSecurity,
                        receiptHeader: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Receipt Footer Notes</label>
                  <textarea
                    rows="3"
                    placeholder="e.g. Thank you for shopping with us! No refunds after 7 days."
                    value={receiptsAndSecurity.receiptFooter || ""}
                    onChange={(e) =>
                      setReceiptsAndSecurity({
                        ...receiptsAndSecurity,
                        receiptFooter: e.target.value,
                      })
                    }
                    className="form-textarea"
                  />
                </div>
              </div>

              <div className="toggle-list-group">
                <div className="toggle-row">
                  <div>
                    <strong className="toggle-title">
                      Enable Two-Factor Authentication (2FA)
                    </strong>
                    <p className="toggle-desc">
                      Enforce verification codes on administrative logins for
                      extra security.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={receiptsAndSecurity.enableTwoFactor}
                    onChange={(e) =>
                      setReceiptsAndSecurity({
                        ...receiptsAndSecurity,
                        enableTwoFactor: e.target.checked,
                      })
                    }
                    className="toggle-checkbox"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
