import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import axios from "axios";
import "./EventPage.css";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    // Fetch events from backend
    axios.get("http://localhost:3000/event")
      .then((res) => {
        setEvents(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Handle search
  useEffect(() => {
    setFiltered(
      events.filter((event) =>
        event.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, events]);

  return (
    <div className="events-container">
      <h2>Discover Events</h2>
      <p>Find amazing events happening around you</p>

      {/* Search + Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search events, locations, categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select>
          <option>All Categories</option>
          <option>Music</option>
          <option>Drama</option>
          <option>Sports</option>
        </select>
        <select>
          <option>All Events</option>
          <option>Upcoming</option>
          <option>Past</option>
        </select>
      </div>

      <p>Showing {filtered.length} events</p>

      {/* Event Cards */}
      <div className="event-grid">
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event._id} event={event} />)
        ) : (
          <p>No events found</p>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
