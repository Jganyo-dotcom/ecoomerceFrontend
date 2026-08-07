import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../css/register.css'

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Combined Form State
  const [formData, setFormData] = useState({
    // Company Fields
    companyName: "",
    companyref: "",
    domain: "",
    location: "",

    // Owner User Fields
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

  // Step 1 Validation before moving forward
  const handleNextStep = (e) => {
    e.preventDefault();
    const { companyName, companyref, domain, location } = formData;
    if (
      !companyName.trim() ||
      !companyref.trim() ||
      !domain.trim() ||
      !location.trim()
    ) {
      setError("Please fill in all company workspace fields.");
      return;
    }
    setError("");
    setStep(2);
  };

  // Sequential Onboarding Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 🏢 STEP 1: Create the Company Tenant
      const companyPayload = {
        name: formData.companyName.trim(),
        companyref: formData.companyref.trim(),
        domain: formData.domain.trim().toLowerCase(),
        location: formData.location.trim(),
      };

      const companyRes = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyPayload),
      });

      const companyData = await companyRes.json();

      if (!companyRes.ok) {
        throw new Error(
          companyData.error || "Failed to create company tenant.",
        );
      }

      // Extract generated Company ID from backend response
      const createdCompanyId =
        companyData.company._id || companyData.company.id;

      // 👤 STEP 2: Register Admin Owner linked to the newly created Company
      const userPayload = {
        companyId: createdCompanyId,
        name: formData.ownerName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const userRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });

      const userData = await userRes.json();

      if (!userRes.ok) {
        throw new Error(
          userData.error || "Company created, but user registration failed.",
        );
      }

      alert("Tenant & Owner account created successfully!");
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
              ? "Configure your company workspace and routing references."
              : "Setup the owner credentials for this workspace."}
          </p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        {/* STEP 1: COMPANY DETAILS */}
        {step === 1 && (
          <form className="auth-form" onSubmit={handleNextStep}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Acme Hardware"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="companyref">Company Ref ID</label>
                <input
                  type="text"
                  id="companyref"
                  name="companyref"
                  value={formData.companyref}
                  onChange={handleChange}
                  placeholder="COMP-8802"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="domain">Domain Slug</label>
                <input
                  type="text"
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  placeholder="acme-hardware"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location / Branch</label>
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
                <label htmlFor="ownerName">Full Name</label>
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
                <label htmlFor="username">Username</label>
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
              <label htmlFor="email">Work Email</label>
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
              <label htmlFor="password">Password</label>
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
                {isLoading ? "Creating Tenant..." : "Complete Onboarding"}
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
