import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ManageEvents.css";

export default function ManageEvents() {
    const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ Always an array
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // ✅ Fetch events
  useEffect(() => {
    axios
      .get("http://localhost:3000/event")
      .then((res) => {
        if (Array.isArray(res.data)) setEvents(res.data);
        else console.error("Unexpected events format:", res.data);
      })
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // ✅ Fetch categories safely
  useEffect(() => {
    axios
      .get("http://localhost:3000/category/categories")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else if (Array.isArray(res.data.categories)) {
          // handle case where backend wraps data
          setCategories(res.data.categories);
        } else {
          console.warn("Unexpected category response:", res.data);
          setCategories([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setCategories([]);
      });
  }, []);

  // ✅ Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;

  const matchesCategory =
  categoryFilter === "all" ||
  event.category?.name?.toLowerCase() === categoryFilter.toLowerCase();


    return matchesSearch && matchesStatus && matchesCategory;
  });

  // ✅ Block Event
  const handleBlockEvent = async (id) => {
    try {
      await axios.put(`http://localhost:3000/event/${id}/block`);
      alert("Event blocked");
      setEvents((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status: "blocked" } : e))
      );
    } catch (err) {
      console.error("Error blocking event:", err);
    }
  };

  // ✅ Unblock Event
  const handleUnblockEvent = async (id) => {
    try {
      await axios.put(`http://localhost:3000/event/${id}/unblock`);
      alert("Event unblocked");
      setEvents((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status: "active" } : e))
      );
    } catch (err) {
      console.error("Error unblocking event:", err);
    }
  };

  return (
    <div className="manage-events">
      <h2>Manage Events</h2>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title or organizer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="flagged">Flagged</option>
          <option value="blocked">Blocked</option>
          <option value="pending">Pending</option>
        </select>

        {/* ✅ Category dropdown (safe rendering) */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {Array.isArray(categories) &&
            categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
        </select>

        <button onClick={() => navigate("/createEvents")}>Create Event</button>
      </div>

      {/* Event Table */}
      <table className="event-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Organizer</th>
            <th>Category</th>
            <th>Status</th>
            <th>Attendees</th>
            <th>Date</th>
            <th>Revenue</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <tr key={event._id}>
                <td>{event.title}</td>
                <td>{event.organizer}</td>
               <td>{event.category?.name || "No category"}</td>
                <td className={`status ${event.status}`}>{event.status}</td>
                <td>{event.attendees || 0}</td>
                <td>{event.date}</td>
                <td>{event.revenue || "-"}</td>
                <td>
                  {event.status === "blocked" ? (
                    <button
                      className="unblock-btn"
                      onClick={() => handleUnblockEvent(event._id)}
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      className="block-btn"
                      onClick={() => handleBlockEvent(event._id)}
                    >
                      Block
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No events found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
