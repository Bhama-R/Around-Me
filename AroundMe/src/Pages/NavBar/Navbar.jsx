import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // "public", "manager", or "admin"
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-title">Around Me</h2>
      </div>

      <div className="navbar-links">
        {/* Common links for all users */}
        <Link to="/home">Home</Link>
        <Link to="/events">All Events</Link>
        <Link to="/createEvents">Create Event</Link>
        <Link to="/myevents">My Owned Events</Link>
        <Link to="/myinterests">My Interests</Link>

        {/* Event Manager specific links */}
        {role === "event_manager" && (
          <>
            <Link to="/manageEvents">Manage Events</Link>
            <Link to="/fakeReport">Fake Reports</Link>
          </>
        )}

        {/* Administrator specific links */}
        {role === "admin" && (
          <>
            <Link to="/manageEvents">Manage Events</Link>
             <Link to="/fakeReport">Fake Reports</Link>
            <Link to="/categoryManagement">Manage Categories</Link>
            <Link to="/userManagement">User Management</Link>
          </>
        )}
      </div>

      <div className="navbar-right">
        {userName && <span className="navbar-user">👤 {userName}</span>}
        {/* <button onClick={handleLogout} className="logout-btn">Logout</button> */}
      </div>
    </nav>
  );
}
