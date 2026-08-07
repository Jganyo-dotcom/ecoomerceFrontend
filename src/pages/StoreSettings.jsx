// src/pages/SettingsPage.jsx
import React, { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import "../css/SettingsPage.css";

const SettingsPage = () => {
  const [activeNav, setActiveNav] = useState("settings");
  const [activeTab, setActiveTab] = useState("general"); // general | store | receipts | staff | security
  const [searchQuery, setSearchQuery] = useState("");
  const [showSaveToast, setShowSaveToast] = useState(false);

  // --- SETTINGS FORM STATES ---
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Acme Hardware Ltd",
    tenantId: "COMP-8802",
    businessEmail: "info@acmehardware.com",
    phoneNumber: "+233 24 123 4567",
    taxNumber: "TIN-992019481",
    storeAddress: "Plot 14, Commercial Lane, Madina, Accra, Ghana",
  });

  const [storeSettings, setStoreSettings] = useState({
    currencySymbol: "GH₵",
    taxRate: 15.0, // VAT %
    enableLowStockAlerts: true,
    lowStockThreshold: 5,
    requireOrderNarration: true,
    allowNegativeStockSale: false,
    defaultPaymentMethod: "Mobile Money",
  });

  const [receiptSettings, setReceiptSettings] = useState({
    receiptHeader: "Acme Hardware Ltd - Quality Building Materials",
    receiptFooter:
      "Thank you for doing business with us! Goods sold are not returnable after 7 days.",
    autoPrintOnServe: true,
    showCustomerPhone: true,
  });

  const [staffList, setStaffList] = useState([
    {
      id: 1,
      name: "Kwesi Mensah",
      role: "Store Manager",
      email: "kwesi@acme.com",
      status: "Active",
    },
    {
      id: 2,
      name: "Yaw Boateng",
      role: "Cashier",
      email: "yaw@acme.com",
      status: "Active",
    },
    {
      id: 3,
      name: "Ama Serwaa",
      role: "Inventory Clerk",
      email: "ama@acme.com",
      status: "Inactive",
    },
  ]);

  const [securitySettings, setSecuritySettings] = useState({
    requirePinForRefunds: true,
    autoLogoutMinutes: 30,
    enableTwoFactor: false,
  });

  // Handle Save All Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
    }, 3000);
  };

  return (
    <div className="settings-layout-wrapper">
      {/* 📌 SIDEBAR INTEGRATION */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onSearch={(query) => setSearchQuery(query)}
      />

      {/* 📌 MAIN CONTENT AREA (WHITE BACKGROUND) */}
      <main className="settings-main-content">
        {/* PAGE HEADER */}
        <header className="settings-page-header">
          <div>
            <h1 className="page-title">⚙️ Company & System Settings</h1>
            <p className="page-subtitle">
              Configure your store preferences, tax rates, inventory thresholds,
              receipt formats, and staff access.
            </p>
          </div>
          <button
            type="button"
            className="btn-save-primary"
            onClick={handleSaveSettings}
          >
            💾 Save All Changes
          </button>
        </header>

        {/* SAVE SUCCESS NOTIFICATION */}
        {showSaveToast && (
          <div className="settings-toast-banner">
            ✅ Settings updated successfully! All active sessions updated.
          </div>
        )}

        {/* SETTINGS NAVIGATION TABS */}
        <div className="settings-nav-tabs">
          <button
            className={`tab-btn ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            🏢 General Profile
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
            📄 Receipts & Billing
          </button>
          <button
            className={`tab-btn ${activeTab === "staff" ? "active" : ""}`}
            onClick={() => setActiveTab("staff")}
          >
            👥 Staff & Access
          </button>
          <button
            className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            🔒 Security & Audit
          </button>
        </div>

        {/* TAB CONTENT AREA */}
        <div className="settings-tab-content">
          {/* TAB 1: GENERAL PROFILE */}
          {activeTab === "general" && (
            <div className="settings-section-card">
              <h2 className="section-card-title">Business Information</h2>
              <p className="section-card-subtitle">
                General tenant details displayed on invoices and client
                receipts.
              </p>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Company / Store Name</label>
                  <input
                    type="text"
                    value={generalSettings.companyName}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        companyName: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tenant Identifier Code</label>
                  <input
                    type="text"
                    value={generalSettings.tenantId}
                    disabled
                    className="form-input disabled-input"
                  />
                  <span className="field-hint">
                    Unique system tenant ID assigned during onboarding.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Support Email Address</label>
                  <input
                    type="email"
                    value={generalSettings.businessEmail}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        businessEmail: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Phone Number</label>
                  <input
                    type="text"
                    value={generalSettings.phoneNumber}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Taxpayer ID (TIN Number)</label>
                  <input
                    type="text"
                    value={generalSettings.taxNumber}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        taxNumber: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Physical Store Address</label>
                  <textarea
                    rows="3"
                    value={generalSettings.storeAddress}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        storeAddress: e.target.value,
                      })
                    }
                    className="form-textarea"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STORE & INVENTORY PREFERENCES */}
          {activeTab === "store" && (
            <div className="settings-section-card">
              <h2 className="section-card-title">
                Inventory & Transaction Rules
              </h2>
              <p className="section-card-subtitle">
                Control sales behavior, tax rates, and stock deduction rules.
              </p>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Store Currency Symbol</label>
                  <input
                    type="text"
                    value={storeSettings.currencySymbol}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        currencySymbol: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Standard Tax / VAT Rate (%)
                  </label>
                  <input
                    type="number"
                    value={storeSettings.taxRate}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        taxRate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Low Stock Threshold Limit
                  </label>
                  <input
                    type="number"
                    value={storeSettings.lowStockThreshold}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        lowStockThreshold: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="form-input"
                  />
                  <span className="field-hint">
                    Flag items (e.g. Pipe Cement) as low stock when quantity
                    falls below this value.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Default Payment Method</label>
                  <select
                    value={storeSettings.defaultPaymentMethod}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
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
                      Low Stock Email Notifications
                    </strong>
                    <p className="toggle-desc">
                      Automatically notify store managers when stock items reach
                      low thresholds.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={storeSettings.enableLowStockAlerts}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        enableLowStockAlerts: e.target.checked,
                      })
                    }
                    className="toggle-checkbox"
                  />
                </div>

                <div className="toggle-row">
                  <div>
                    <strong className="toggle-title">
                      Require Order Narration on Checkout
                    </strong>
                    <p className="toggle-desc">
                      Force staff to type special delivery notes or item
                      specifications during order placement.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={storeSettings.requireOrderNarration}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        requireOrderNarration: e.target.checked,
                      })
                    }
                    className="toggle-checkbox"
                  />
                </div>

                <div className="toggle-row">
                  <div>
                    <strong className="toggle-title">
                      Allow Negative Stock Sales
                    </strong>
                    <p className="toggle-desc">
                      Allow cashiers to process sales even if system stock shows
                      0 units remaining.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={storeSettings.allowNegativeStockSale}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        allowNegativeStockSale: e.target.checked,
                      })
                    }
                    className="toggle-checkbox"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RECEIPTS & BILLING */}
          {activeTab === "receipts" && (
            <div className="settings-section-card">
              <h2 className="section-card-title">
                Receipt Templates & Billing
              </h2>
              <p className="section-card-subtitle">
                Customize header text, terms, and auto-printing rules when
                serving orders.
              </p>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Receipt Header Banner</label>
                  <input
                    type="text"
                    value={receiptSettings.receiptHeader}
                    onChange={(e) =>
                      setReceiptSettings({
                        ...receiptSettings,
                        receiptHeader: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    Receipt Footer Notes & Policy
                  </label>
                  <textarea
                    rows="3"
                    value={receiptSettings.receiptFooter}
                    onChange={(e) =>
                      setReceiptSettings({
                        ...receiptSettings,
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
                      Auto-Print Receipt when Order is Served
                    </strong>
                    <p className="toggle-desc">
                      Trigger thermal printer dialog instantly when marking an
                      active order as served.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={receiptSettings.autoPrintOnServe}
                    onChange={(e) =>
                      setReceiptSettings({
                        ...receiptSettings,
                        autoPrintOnServe: e.target.checked,
                      })
                    }
                    className="toggle-checkbox"
                  />
                </div>

                <div className="toggle-row">
                  <div>
                    <strong className="toggle-title">
                      Print Customer Phone Number on Receipts
                    </strong>
                    <p className="toggle-desc">
                      Include buyer contact info on printed paper slips for
                      delivery validation.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={receiptSettings.showCustomerPhone}
                    onChange={(e) =>
                      setReceiptSettings({
                        ...receiptSettings,
                        showCustomerPhone: e.target.checked,
                      })
                    }
                    className="toggle-checkbox"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STAFF & ACCESS */}
          {activeTab === "staff" && (
            <div className="settings-section-card">
              <div className="card-header-flex">
                <div>
                  <h2 className="section-card-title">
                    Staff Members & Cashiers
                  </h2>
                  <p className="section-card-subtitle">
                    Manage store staff accounts, cashier permissions, and roles.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-secondary-sm"
                  onClick={() => alert("Invite staff feature opened")}
                >
                  + Add New Staff Member
                </button>
              </div>

              <div className="table-responsive">
                <table className="settings-table">
                  <thead>
                    <tr>
                      <th>Staff Member</th>
                      <th>Assigned Role</th>
                      <th>Email Address</th>
                      <th>Status</th>
                      <th className="text-right">Manage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map((member) => (
                      <tr key={member.id}>
                        <td className="font-bold">{member.name}</td>
                        <td>
                          <span className="role-badge">{member.role}</span>
                        </td>
                        <td>{member.email}</td>
                        <td>
                          <span
                            className={`status-tag ${
                              member.status === "Active"
                                ? "status-served"
                                : "status-pending"
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td className="text-right">
                          <button className="btn-table-action">
                            Edit Role
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY & AUDIT */}
          {activeTab === "security" && (
            <div className="settings-section-card">
              <h2 className="section-card-title">
                Security & Station Lockdown
              </h2>
              <p className="section-card-subtitle">
                Protect point-of-sale operations and set timeout policies.
              </p>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Auto Idle Session Logout (Minutes)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.autoLogoutMinutes}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        autoLogoutMinutes: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              <div className="toggle-list-group">
                <div className="toggle-row">
                  <div>
                    <strong className="toggle-title">
                      Require Manager PIN Code for Order Cancellation & Refunds
                    </strong>
                    <p className="toggle-desc">
                      Prompt cashiers to enter a manager PIN before deleting
                      served items.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={securitySettings.requirePinForRefunds}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        requirePinForRefunds: e.target.checked,
                      })
                    }
                    className="toggle-checkbox"
                  />
                </div>

                <div className="toggle-row">
                  <div>
                    <strong className="toggle-title">
                      Two-Factor Authentication (2FA)
                    </strong>
                    <p className="toggle-desc">
                      Require SMS verification code on login for admin and
                      manager accounts.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={securitySettings.enableTwoFactor}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
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
