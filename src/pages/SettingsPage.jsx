// src/pages/SettingsPage.jsx
import React, { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import "../css/SettingsPage.css";

const SettingsPage = () => {
  const [activeNav, setActiveNav] = useState("settings");
  const [activeTab, setActiveTab] = useState("general"); // general | account | store | receipts | staff | security
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // --- 1. USER ACCOUNT & PASSWORD STATE ---
  const [accountProfile, setAccountProfile] = useState({
    fullName: "Kwame Asante",
    email: "kwame.admin@acmehardware.com",
    role: "System Administrator",
    phone: "+233 20 888 9900",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordFeedback, setPasswordFeedback] = useState({
    type: "",
    text: "",
  });

  // --- 2. GENERAL COMPANY SETTINGS STATE ---
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Acme Hardware Ltd",
    tenantId: "COMP-8802",
    businessEmail: "info@acmehardware.com",
    phoneNumber: "+233 24 123 4567",
    taxNumber: "TIN-992019481",
    storeAddress: "Plot 14, Commercial Lane, Madina, Accra, Ghana",
  });

  // --- 3. STORE & INVENTORY SETTINGS STATE ---
  const [storeSettings, setStoreSettings] = useState({
    currencySymbol: "GH₵",
    taxRate: 15.0, // VAT %
    enableLowStockAlerts: true,
    lowStockThreshold: 5,
    requireOrderNarration: true,
    allowNegativeStockSale: false,
    defaultPaymentMethod: "Mobile Money",
  });

  // --- 4. RECEIPT SETTINGS STATE ---
  const [receiptSettings, setReceiptSettings] = useState({
    receiptHeader: "Acme Hardware Ltd - Quality Building Materials",
    receiptFooter:
      "Thank you for doing business with us! Goods sold are not returnable after 7 days.",
    autoPrintOnServe: true,
    showCustomerPhone: true,
    paperWidth: "80mm", // 80mm thermal vs 58mm
  });

  // --- 5. STAFF LIST & ADD STAFF MODAL STATE ---
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

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "Cashier",
    email: "",
  });

  // --- 6. SECURITY & 2FA STATE ---
  const [securitySettings, setSecuritySettings] = useState({
    requirePinForRefunds: true,
    autoLogoutMinutes: 30,
    enableTwoFactor: false,
  });

  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  // --- HANDLERS ---
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
    }, 3500);
  };

  const handleSaveAllSettings = (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      triggerToast("✅ All system preferences saved and synchronized!");
    }, 800);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setPasswordFeedback({ type: "", text: "" });

    if (!passwordForm.currentPassword) {
      setPasswordFeedback({
        type: "error",
        text: "Please enter your current password.",
      });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
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

    // Simulate API call
    setPasswordFeedback({
      type: "success",
      text: "Password changed successfully!",
    });
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleAddStaffMember = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;

    const createdMember = {
      id: Date.now(),
      name: newStaff.name,
      role: newStaff.role,
      email: newStaff.email,
      status: "Active",
    };

    setStaffList([...staffList, createdMember]);
    setNewStaff({ name: "", role: "Cashier", email: "" });
    setIsStaffModalOpen(false);
    triggerToast(`👤 Invitation sent to ${createdMember.email}`);
  };

  const handleToggleStaffStatus = (id) => {
    setStaffList(
      staffList.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "Active" ? "Inactive" : "Active" }
          : m,
      ),
    );
  };

  const handleConfirm2FA = () => {
    if (twoFactorCode.length === 6) {
      setSecuritySettings({ ...securitySettings, enableTwoFactor: true });
      setIs2FAModalOpen(false);
      setTwoFactorCode("");
      triggerToast("🔒 Two-Factor Authentication enabled successfully!");
    } else {
      alert("Please enter a valid 6-digit verification code.");
    }
  };

  return (
    <div className="settings-layout-wrapper">
      {/* 📌 SIDEBAR INTEGRATION */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onSearch={(query) => setSearchQuery(query)}
      />

      {/* 📌 MAIN CONTENT AREA */}
      <main className="settings-main-content">
        {/* PAGE HEADER */}
        <header className="settings-page-header">
          <div>
            <h1 className="page-title">⚙️ System & Store Settings</h1>
            <p className="page-subtitle">
              Manage account credentials, store preferences, tax compliance,
              receipts, and security policies.
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

        {/* SAVE SUCCESS NOTIFICATION */}
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
            🔒 Security & 2FA
          </button>
        </div>

        {/* TAB CONTENT AREA */}
        <div className="settings-tab-content">
          {/* TAB 1: GENERAL COMPANY PROFILE */}
          {activeTab === "general" && (
            <div className="settings-section-card">
              <h2 className="section-card-title">Business Information</h2>
              <p className="section-card-subtitle">
                General tenant details displayed on invoices, tax filings, and
                client receipts.
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
                    System identifier assigned during store registration.
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

          {/* TAB 2: MY ACCOUNT & PASSWORD */}
          {activeTab === "account" && (
            <div className="settings-section-card">
              <h2 className="section-card-title">User Account Details</h2>
              <p className="section-card-subtitle">
                Update your administrator profile information and account
                password.
              </p>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={accountProfile.fullName}
                    onChange={(e) =>
                      setAccountProfile({
                        ...accountProfile,
                        fullName: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Login Email</label>
                  <input
                    type="email"
                    value={accountProfile.email}
                    onChange={(e) =>
                      setAccountProfile({
                        ...accountProfile,
                        email: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">System Role</label>
                  <input
                    type="text"
                    value={accountProfile.role}
                    disabled
                    className="form-input disabled-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="text"
                    value={accountProfile.phone}
                    onChange={(e) =>
                      setAccountProfile({
                        ...accountProfile,
                        phone: e.target.value,
                      })
                    }
                    className="form-input"
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

          {/* TAB 3: STORE & INVENTORY PREFERENCES */}
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
                    step="0.1"
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
                    Flag items (e.g. Pipe Cement) as low stock when inventory
                    drops below this value.
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

          {/* TAB 4: RECEIPTS & BILLING */}
          {activeTab === "receipts" && (
            <div className="settings-section-card">
              <h2 className="section-card-title">
                Receipt Templates & Billing
              </h2>
              <p className="section-card-subtitle">
                Customize printed receipts, header terms, and printer
                specifications.
              </p>

              <div className="form-grid">
                <div className="form-group">
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

                <div className="form-group">
                  <label className="form-label">Printer Paper Standard</label>
                  <select
                    value={receiptSettings.paperWidth}
                    onChange={(e) =>
                      setReceiptSettings({
                        ...receiptSettings,
                        paperWidth: e.target.value,
                      })
                    }
                    className="form-select"
                  >
                    <option value="80mm">80mm Thermal Receipt Printer</option>
                    <option value="58mm">58mm Portable Thermal Printer</option>
                    <option value="A4">A4 Full Page Invoice Standard</option>
                  </select>
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

          {/* TAB 5: STAFF & ACCESS */}
          {activeTab === "staff" && (
            <div className="settings-section-card">
              <div className="card-header-flex">
                <div>
                  <h2 className="section-card-title">
                    Staff Members & Cashiers
                  </h2>
                  <p className="section-card-subtitle">
                    Manage store staff accounts, role assignments, and active
                    statuses.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-secondary-sm"
                  onClick={() => setIsStaffModalOpen(true)}
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
                      <th className="text-right">Manage Action</th>
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
                          <button
                            className="btn-table-action"
                            onClick={() => handleToggleStaffStatus(member.id)}
                          >
                            {member.status === "Active"
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MODAL: ADD NEW STAFF */}
              {isStaffModalOpen && (
                <div className="modal-backdrop">
                  <div className="modal-card">
                    <h3 className="modal-title">Invite New Staff Member</h3>
                    <form onSubmit={handleAddStaffMember}>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newStaff.name}
                          onChange={(e) =>
                            setNewStaff({ ...newStaff, name: e.target.value })
                          }
                          className="form-input"
                          placeholder="e.g. Kofi Annan"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          required
                          value={newStaff.email}
                          onChange={(e) =>
                            setNewStaff({ ...newStaff, email: e.target.value })
                          }
                          className="form-input"
                          placeholder="kofi@acme.com"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Role</label>
                        <select
                          value={newStaff.role}
                          onChange={(e) =>
                            setNewStaff({ ...newStaff, role: e.target.value })
                          }
                          className="form-select"
                        >
                          <option value="Cashier">Cashier</option>
                          <option value="Store Manager">Store Manager</option>
                          <option value="Inventory Clerk">
                            Inventory Clerk
                          </option>
                        </select>
                      </div>
                      <div className="modal-actions">
                        <button
                          type="button"
                          className="btn-link"
                          onClick={() => setIsStaffModalOpen(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn-secondary-sm">
                          Send Invite
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SECURITY & 2FA */}
          {activeTab === "security" && (
            <div className="settings-section-card">
              <h2 className="section-card-title">
                Security & Station Lockdown
              </h2>
              <p className="section-card-subtitle">
                Configure point-of-sale timeout policies, manager overrides, and
                2FA authentication.
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
                      Require Manager PIN for Refunds & Cancellations
                    </strong>
                    <p className="toggle-desc">
                      Prompt cashiers to enter a manager PIN before voiding or
                      refunding served orders.
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
                      {securitySettings.enableTwoFactor
                        ? "🔒 Enabled (Authenticator App or SMS code required on login)"
                        : "🔓 Disabled (Enhance account security by enabling 2FA)"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={
                      securitySettings.enableTwoFactor
                        ? "btn-danger-outline"
                        : "btn-secondary-sm"
                    }
                    onClick={() => {
                      if (securitySettings.enableTwoFactor) {
                        setSecuritySettings({
                          ...securitySettings,
                          enableTwoFactor: false,
                        });
                        triggerToast("🔓 2FA has been disabled.");
                      } else {
                        setIs2FAModalOpen(true);
                      }
                    }}
                  >
                    {securitySettings.enableTwoFactor
                      ? "Disable 2FA"
                      : "Set Up 2FA"}
                  </button>
                </div>
              </div>

              {/* MODAL: SETUP 2FA */}
              {is2FAModalOpen && (
                <div className="modal-backdrop">
                  <div className="modal-card">
                    <h3 className="modal-title">
                      Set Up Two-Factor Authentication
                    </h3>
                    <p className="modal-subtitle">
                      Scan this QR code with Google Authenticator or your
                      primary authenticator app.
                    </p>
                    <div className="qr-code-placeholder">
                      <div className="mock-qr">[ MOCK QR CODE ]</div>
                      <span className="secret-key">
                        Secret: ACM3-HW-8802-2FA
                      </span>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Enter 6-Digit Code</label>
                      <input
                        type="text"
                        maxLength="6"
                        placeholder="123456"
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value)}
                        className="form-input text-center"
                      />
                    </div>
                    <div className="modal-actions">
                      <button
                        type="button"
                        className="btn-link"
                        onClick={() => setIs2FAModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn-secondary-sm"
                        onClick={handleConfirm2FA}
                      >
                        Verify & Enable
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
