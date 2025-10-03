import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Send dob directly (YYYY-MM-DD string)
    const dataToSend = { ...formData };

    console.log("FormData being sent:", dataToSend);

    try {
      const res = await axios.post(
        "http://localhost:3000/users/register",
        dataToSend,
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Account created successfully!");
      console.log("Response:", res.data);
    } catch (err) {
      if (err.response) {
        console.error("Server error:", err.response.data);
      } else {
        console.error("Error submitting form:", err);
      }
      alert("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p className="subtitle">Join our community of event enthusiasts</p>

        <div className="form-row">
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <textarea
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <select
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        >
          <option value="">Select your city</option>
          <option value="Fort Kochi">Fort Kochi</option>
          <option value="Mattancherry">Mattancherry</option>
          <option value="Marine Drive">Marine Drive</option>
          <option value="Ernakulam">Ernakulam</option>
          <option value="Kaloor">Kaloor</option>
          <option value="Edappally">Edappally</option>
          <option value="Vyttila">Vyttila</option>
          <option value="Kakkanad">Kakkanad</option>
          <option value="Thrippunithura">Thrippunithura</option>
          <option value="Palarivattom">Palarivattom</option>
          <option value="Panampilly Nagar">Panampilly Nagar</option>
          <option value="Thevara">Thevara</option>
          <option value="Willingdon Island">Willingdon Island</option>
          <option value="Kadavanthra">Kadavanthra</option>
          <option value="Aluva">Aluva</option>
        </select>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="mobile"
          placeholder="Enter your phone number"
          value={formData.mobile}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="trans">Trans</option>
          <option value="other">Other</option>
        </select>

        <button type="submit">Create Account</button>

        <p className="signin-text">
          Already have an account? <a href="/">Back to Home</a>
        </p>
      </form>
    </div>
  );
}
