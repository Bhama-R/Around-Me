import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Home, User, Folder, LogOut } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate("/")}>
        <h1 className="logo">Around Me Events</h1>
      </div>

      <div className="navbar-links">
        <button onClick={() => navigate("/home")}>
          <Home className="icon" /> Home
        </button>
        <button onClick={() => navigate("/events")}>
          <Calendar className="icon" /> Events
        </button>
        <button onClick={() => navigate("/categories")}>
          <Folder className="icon" /> Categories
        </button>
        <button onClick={() => navigate("/profile")}>
          <User className="icon" /> Profile
        </button>
      </div>

      <div className="navbar-right">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut className="icon" /> Logout
        </button>
      </div>
    </nav>
  );
}
