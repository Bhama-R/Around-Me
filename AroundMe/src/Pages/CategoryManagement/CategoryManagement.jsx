import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CategoryManagement.css";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "",
  });

  // Fetch all categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch event data grouped by category
  useEffect(() => {
    const fetchEventStats = async () => {
      try {
        const res = await axios.get("http://localhost:3000/event");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching event stats:", err);
      }
    };
    fetchEventStats();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/category/categories");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Add category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      await axios.post("http://localhost:3000/category/category", newCategory);
      alert("Category added successfully!");
      setShowPopup(false);
      setNewCategory({ name: "", description: "", icon: "" });
      fetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
      alert("Failed to add category");
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="category-dashboard">
      <h1>Category Management</h1>
      <p className="subtitle">Manage event categories and their settings</p>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card blue">
          <h3>Total Categories</h3>
          <p>{categories.length}</p>
        </div>
        <div className="card green">
          <h3>Active</h3>
          <p>{categories.filter((c) => c.status === "active").length}</p>
        </div>
        <div className="card orange">
          <h3>Inactive</h3>
          <p>{categories.filter((c) => c.status === "inactive").length}</p>
        </div>
        <div className="card teal">
          <h3>Total Events</h3>
          <p>
            {events.reduce((acc, ev) => acc + (ev.totalRevenue || 0), 0).toFixed(
            )}
          </p>
        </div>
      </div>

      {/* Search + Add */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="add-btn" onClick={() => setShowPopup(true)}>
          + Add Category
        </button>
      </div>

      {/* Popup Modal for Add Category */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Add New Category</h2>
            <form onSubmit={handleAddCategory}>
              <label>Category Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                required
              />

              <label>Description</label>
              <textarea
                rows="3"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
              ></textarea>

              <label>Icon (optional)</label>
              <input
                type="text"
                placeholder="e.g., 🎉 or 🎯"
                value={newCategory.icon}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, icon: e.target.value })
                }
              />

              <div className="popup-buttons">
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Cards */}
      <div className="category-grid">
        {filteredCategories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          filteredCategories.map((cat) => (
            <div className="category-card-modern" key={cat._id}>
              <div className="card-image">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
                  alt={cat.name}
                />
                <span className={`status-badge ${cat.status}`}>
                  {cat.status}
                </span>
                <span className="icon-circle">{cat.icon || "🎯"}</span>
              </div>
              <div className="card-body">
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
                <div className="card-actions">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
