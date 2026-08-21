import React, { useState, useContext } from "react";
import "../css/login.css";
import { baseApi } from "../components/common/apiEndpoint";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SimpleAuthContext } from "../context/AuthContext"; // 🔌 Connects to your auth context

const Login = () => {
  // Pull the authentication state setter function from context
  const { setIsAuthenticated } = useContext(SimpleAuthContext);

  const existingRef = localStorage.getItem("companyRef");
  const [formData, setFormData] = useState({
    companyref: existingRef || "", // Fallback to an empty string if null
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.companyref || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${baseApi}/api/admin/login-owner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyref: formData.companyref.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Authentication failed. Check your details.",
        );
      }

      // 1. Store auth credentials safely in the storage layer
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("companyRef", formData.companyref.trim()); // Save ref for easier subsequent logins

      // 2. Alert the route guard immediately before redirecting
      setIsAuthenticated(true);

      // 3. Navigate cleanly over to your dashboard workspace
      toast.success("Welcome back! Loading workspace...");
      navigate("/manager");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🔐</div>
          <h2>Tenant Sign In</h2>
          <p>Access your company workspace and manage your store network.</p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Company Reference */}
          <div className="form-group">
            <label htmlFor="companyref">Company Reference ID</label>
            <input
              type="text"
              id="companyref"
              name="companyref"
              value={formData.companyref}
              onChange={handleChange}
              placeholder="Company Reference ID"
              required
            />
            <small className="input-hint">
              Provided by your administrator or platform owner.
            </small>
          </div>

          {/* User Email */}
          <div className="form-group">
            <label htmlFor="email">Work Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <a href="/forgetPassword" className="forgot-link">
                Forgot password?
              </a>
            </div>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-auth-submit"
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Sign In to Workspace"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Need a new company space?{" "}
            <a href="/register" className="auth-link">
              Register Company
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export { Login };
export default Login;
