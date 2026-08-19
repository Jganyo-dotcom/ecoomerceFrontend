import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/register.css";
import { baseApi } from "../components/common/apiEndpoint";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Combined Form State
  const [formData, setFormData] = useState({
    companyName: "",
    domain: "",
    location: "",
    ownerName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    const { companyName, domain, location } = formData;
    if (!companyName.trim() || !domain.trim() || !location.trim()) {
      setError("Please fill in all company workspace fields.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${baseApi}/api/admin/register-workspace`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Workspace onboarding failed.");
      }

      toast.success(data.message);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        {/* Wizard Progress Bar */}
        <div className="wizard-progress">
          <div className={`wizard-step ${step >= 1 ? "active" : ""}`}>
            <span className="step-num">1</span>
            <span className="step-label">Company Space</span>
          </div>
          <div className="step-line"></div>
          <div className={`wizard-step ${step >= 2 ? "active" : ""}`}>
            <span className="step-num">2</span>
            <span className="step-label">Owner Account</span>
          </div>
        </div>

        <div className="auth-header">
          <h2>{step === 1 ? "Setup Company Space" : "Create Admin Account"}</h2>
          <p>
            {step === 1
              ? "Configure your company workspace and domain slug."
              : "Setup the owner credentials for this workspace."}
          </p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        {/* STEP 1: COMPANY DETAILS */}
        {step === 1 && (
          <form className="auth-form" onSubmit={handleNextStep}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyName" className="input-label">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="your company"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="domain" className="input-label">
                  Domain Slug
                </label>
                <input
                  type="text"
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  placeholder="domain.com.gh"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location" className="input-label">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Accra Main"
                required
              />
            </div>

            <button type="submit" className="btn-auth-submit">
              Continue to Owner Setup &rarr;
            </button>
          </form>
        )}

        {/* STEP 2: OWNER ACCOUNT DETAILS */}
        {step === 2 && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ownerName" className="input-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="username" className="input-label">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@acme.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="wizard-actions">
              <button
                type="button"
                className="btn-wizard-back"
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                &larr; Back
              </button>
              <button
                type="submit"
                className="btn-auth-submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating Workspace..." : "Complete Onboarding"}
              </button>
            </div>
          </form>
        )}

        <div className="auth-footer">
          <p>
            Already have a workspace?{" "}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export { Register };
export default Register;
