import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import { ArrowLeft } from "lucide-react";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "" });
  const [error, setError] = useState("");

  // ✅ Detect if link expired (from ?error=expired)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("error") === "expired") {
      setError("Your verification link has expired. Please log in again.");
      navigate("/login");
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/login", { email: formData.email });
      if (res.status === 200) {
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft className="icon" /> Back to Home
        </button>

        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to your account</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-icon">
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
