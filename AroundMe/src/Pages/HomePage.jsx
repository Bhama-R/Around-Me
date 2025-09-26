import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HomePage.css";

function HomePage() {
  const navigate= useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3000/category/categories");
        console.log("API Response:", res.data); 
        setCategories(res.data.categories);     
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <h1>
          Discover Amazing Events <span className="highlight">Around You</span>
        </h1>
        <p>
          From music festivals to art exhibitions, find and join the most
          exciting events happening in your area.
        </p>
        <div className="buttons">
          <button 
          className="explore-btn"
          onClick={()=> navigate("/events")}
          >
            Explore Events</button>
          <button 
          className="create-btn"
          onClick={() => navigate("/createEvents")}
          >
            Create Event
          </button>
        </div>
      </section>

      {/* Categories Section */}
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
             onClick={() => navigate("/events", { state: { category: cat.name } })}
             style={{ cursor: "pointer" }} // make it clickable
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
