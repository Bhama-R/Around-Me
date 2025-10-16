import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// import "./VerifyPage.css"; // optional

export default function VerifyPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your account...");

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/users/verify/${token}`);
        setMessage(response.data.message || "Your account has been verified successfully!");

        // ✅ Optionally redirect after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        setMessage("Your verification link has expired. Please log in again.");

        // ✅ Redirect to login page after delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    };

    verifyUser();
  }, [token, navigate]);

  return (
    <div className="verify-container">
      <h2>{message}</h2>
    </div>
  );
}
