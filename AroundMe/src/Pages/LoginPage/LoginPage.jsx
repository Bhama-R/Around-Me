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
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Detect if link expired (from ?error=expired)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("error") === "expired") {
      setError("Your verification link has expired. Please log in again.");
      navigate("/login");
    }
  }, [location.search, navigate]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setMessage("");
  setLoading(true);

  try {
    const res = await api.post("/users/login", { email: formData.email });
    const data = res.data;

    if (data?.data?.message) {
      setMessage("A verification link has been sent to your email.");
    }
  } catch (err) {
    setError(err.response?.data?.error || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  // ✉️ Handle manual resend verification
  const handleResendLink = async () => {
    setError("");
    setMessage("");
    if (!formData.email) return setError("Please enter your email first.");

    setLoading(true);
    try {
      const res = await api.post("/users/resend-verification", { email: formData.email });
      setMessage(res.data.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend verification link");
    } finally {
      setLoading(false);
    }
  };

  fetch("http://localhost:3000/users/check-auth", {
  method: "GET",
  credentials: "include",
})
  .then((res) => res.json())
  .then((data) => {
    if (data.status) {
      // ✅ Logged in
      navigate("/home");
    } else {
      // ❌ Not logged in
      navigate("/login");
    }
  });
fetch("http://localhost:3000/users/check-auth", {
  method: "GET",
  credentials: "include",
})
  .then((res) => res.json())
  .then((data) => {
    if (data.status) {
      // ✅ Logged in
      navigate("/home");
    } else {
      // ❌ Not logged in
      navigate("/login");
    }
  });


  return (
    <div className="login-container">
      <div className="login-card">
        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft className="icon" /> Back to Home
        </button>

        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to your account</p>

        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}

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

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Processing..." : "Sign In"}
          </button>
        </form>

        {/* ✉️ Manual Resend Option */}
        <div className="resend-section">
          <p>Didn’t receive the link?</p>
          <button
            className="resend-btn"
            onClick={handleResendLink}
            disabled={loading}
          >
            {loading ? "Sending..." : "Resend Verification Link"}
          </button>
        </div>
      </div>
    </div>
  );
}
