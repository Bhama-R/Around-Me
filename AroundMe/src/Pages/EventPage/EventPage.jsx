import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import EventCard from "../EventCard/EventCard";
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
  const [categories, setCategories] =useState([]);
 
  const category = [
  { _id: "All", name: "All" },
  ...events
    .map((e) => e.category)
    .filter((cat) => cat) // remove undefined
    .filter(
      (cat, index, self) =>
        index === self.findIndex((c) => c._id === cat._id)
    ),
];

  // Fetch events from backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/event/") 
      .then((res) => {
        const upcoming = res.data
          .filter((event) => event.status !== "blocked")
          .filter((event) => new Date(event.startDate) >= new Date());

        const sorted = upcoming.sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );

        setEvents(sorted);
        setFiltered(sorted);
      })
      .catch((err) => console.error("Error fetching events:", err.response?.data || err.message));
  }, []);

  useEffect(() => {
  axios.get("http://localhost:3000/category/categories")
    .then((res) => setCategories(res.data))
    .catch((err) => console.error("Error fetching categories:", err));
}, []);


  // Apply search, category, and date filters
  useEffect(() => {
    let temp = [...events];

    // text search
    temp = temp.filter((event) => {
      const title = event.title?.toLowerCase() || "";
      const category = event.category?.name?.toLowerCase() || "";
      const city = event.location?.city?.toLowerCase() || "";
      const searchLower = search.toLowerCase();
      return title.includes(searchLower) || category.includes(searchLower) || city.includes(searchLower);
    });

   // category filter
if (selectedCategory !== "All") {
  temp = temp.filter(
    (event) => event.category?._id === selectedCategory
  );
}


    // date filter
    if (selectedDate) {
      temp = temp.filter((event) => {
        const eventDate = new Date(event.startDate).toISOString().split("T")[0];
        return eventDate === selectedDate;
      });
    }

    setFiltered(temp);
  }, [search, selectedCategory, selectedDate, events]);

  // Collect categories dynamically from events
 const categoryOptions = ["All", ...new Set(events.map((e) => e.category?.name).filter(Boolean))];

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
        {categoryOptions.map((name, index) => (
          <option key={index} value={name}>
            {name}
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
