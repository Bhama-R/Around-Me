import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import EventCard from "./EventCard";
import axios from "axios";
import "./EventPage.css";

const EventPage = () => {
  const location = useLocation();
  const initialCategory = location.state?.category || "All";

  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/event/")
      .then((res) => {
        const upcoming = res.data.filter(
          (event) => new Date(event.startDate) >= new Date()
        );
        const sorted = upcoming.sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );
        setEvents(sorted);
        setFiltered(sorted);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    let temp = [...events];

    // text search
    temp = temp.filter((event) => {
      const title = event.title?.toLowerCase() || "";
      const category = event.category?.name?.toLowerCase() || "";
      const city = event.location?.city?.toLowerCase() || "";
      const searchLower = search.toLowerCase();

      return (
        title.includes(searchLower) ||
        category.includes(searchLower) ||
        city.includes(searchLower)
      );
    });

    // category filter
    if (selectedCategory !== "All") {
      temp = temp.filter(
        (event) =>
          event.category?.name?.toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    // date filter
    if (selectedDate) {
      temp = temp.filter((event) => {
        const eventDate = new Date(event.startDate)
          .toISOString()
          .split("T")[0];
        return eventDate === selectedDate;
      });
    }

    setFiltered(temp);
  }, [search, selectedCategory, selectedDate, events]);

  const categories = ["All", ...new Set(events.map((e) => e.category?.name))];

  return (
    <div className="events-container">
      <h2>Discover Events</h2>
      <p>Find amazing upcoming events around you</p>

      <div className="filters">
        <input
          type="text"
          placeholder="Search events, locations, categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <p className="event-count">Showing {filtered.length} events</p>

      <div className="event-grid">
        {filtered.length > 0 ? (
          filtered.map((event) => <EventCard key={event._id} event={event} />)
        ) : (
          <p>No events found</p>
        )}
      </div>
    </div>
  );
};

export default EventPage;
