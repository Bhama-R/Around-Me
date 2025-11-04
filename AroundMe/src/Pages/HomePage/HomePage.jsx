import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  // ✅ Step 1: Check authentication and store user info
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:3000/users/me", {
          withCredentials: true,
        });

        // ✅ Save correct user details to localStorage
        localStorage.setItem("userId", res.data._id);
        localStorage.setItem("userName", res.data.name);
        localStorage.setItem("role", res.data.role);

        setRole(res.data.role);
        console.log("✅ Logged-in user:", res.data);
      } catch (err) {
        console.log("❌ User not logged in or token expired:", err);
        localStorage.clear();
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  // ✅ Step 2: Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3000/category/categories");
        console.log("📦 Categories fetched:", res.data.categories);
        setCategories(res.data.categories);
      } catch (err) {
        console.error("❌ Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="homepage">
      {/* 🌟 Hero Section */}
      <section className="hero">
        <h1>
          Discover Amazing Events <span className="highlight">Around You</span>
        </h1>
        <p>
          From music festivals to art exhibitions, find and join the most
          exciting events happening in your area.
        </p>

        <div className="buttons">
          <button className="explore-btn" onClick={() => navigate("/events")}>
            Explore Events
          </button>

          {/* ✅ Only members, event managers, or admins can create events */}
          {["member", "event_manager", "admin"].includes(role) && (
            <button
              className="create-btn"
              onClick={() => navigate("/createEvents")}
            >
              Create Event
            </button>
          )}
        </div>
      </section>

      {/* 🧭 Categories Section */}
      <section className="categories">
        <h2>Event Categories</h2>
        <p>
          Choose from our diverse range of event categories to find exactly what
          you're looking for.
        </p>

        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <div className="category-grid">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="category-card"
                onClick={() =>
                  navigate("/events", { state: { category: cat.name } })
                }
                style={{ cursor: "pointer" }}
              >
                <div className="icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
