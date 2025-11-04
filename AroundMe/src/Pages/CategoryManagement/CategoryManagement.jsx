import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CategoryManagement.css";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [confirmPopup, setConfirmPopup] = useState({ visible: false, category: null });
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "",
  });

  // Fetch all categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch event stats
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

  // Add / Update category
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      if (editingCategory) {
        await axios.put(
          `http://localhost:3000/category/category/${editingCategory._id}`,
          newCategory
        );
        alert("Category updated successfully!");
      } else {
        await axios.post("http://localhost:3000/category/category", newCategory);
        alert("Category added successfully!");
      }

      setShowPopup(false);
      setEditingCategory(null);
      setNewCategory({ name: "", description: "", icon: "" });
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
      alert("Failed to save category");
    }
  };

  // Handle edit
  const handleEditClick = (cat) => {
    setEditingCategory(cat);
    setNewCategory({
      name: cat.name,
      description: cat.description,
      icon: cat.icon || "",
    });
    setShowPopup(true);
  };

  // Toggle Active / Inactive
const handleToggleStatus = (cat) => {
  const updatedStatus = cat.status === "active" ? "inactive" : "active";

  if (updatedStatus === "inactive") {
    setConfirmPopup({ visible: true, category: cat });
  } else {
    toggleCategoryStatus(cat, updatedStatus);
  }
};

const toggleCategoryStatus = async (cat, status) => {
  try {
    await axios.put(`http://localhost:3000/category/category/${cat._id}`, {
      status,
    });
    alert(`Category "${cat.name}" has been ${status}.`);
    fetchCategories();
  } catch (err) {
    console.error("Error toggling status:", err);
    alert("Failed to update category status");
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
              0
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

      {/* Popup Modal for Add/Edit Category */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{editingCategory ? "Edit Category" : "Add New Category"}</h2>
            <form onSubmit={handleSaveCategory}>
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
                  {editingCategory ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowPopup(false);
                    setEditingCategory(null);
                  }}
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
                <div className="card-actions inline-buttons">
                  <button className="edit-btn" onClick={() => handleEditClick(cat)}>
                    Edit
                  </button>
                  <button
                    className={`${
                      cat.status === "active" ? "deactivate-btn" : "activate-btn"
                    }`}
                    onClick={() => handleToggleStatus(cat)}
                  >
                    {cat.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </div>
                {/* Confirm Deactivation Popup */}
{confirmPopup.visible && (
  <div className="popup-overlay">
    <div className="popup-content confirm-popup">
      <h2>Confirm Deactivation</h2>
      <p>
        Are you sure you want to deactivate{" "}
        <strong>{confirmPopup.category.name}</strong>? <br />
        All events under this category will also become inactive.
      </p>
      <div className="popup-buttons">
        <button
          className="deactivate-btn"
          onClick={() => {
            toggleCategoryStatus(confirmPopup.category, "inactive");
            setConfirmPopup({ visible: false, category: null });
          }}
        >
          Yes, Deactivate
        </button>
        <button
          className="cancel-btn"
          onClick={() => setConfirmPopup({ visible: false, category: null })}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
