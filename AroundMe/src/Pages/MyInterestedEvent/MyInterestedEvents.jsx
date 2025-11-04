import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyInterestedEvent.css";
import { Calendar, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function MyInterestedEvents() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchInterests() {
      try {
        const res = await axios.get(
          `http://localhost:3000/interest/interested-in/${userId}`
        );
        console.log("Fetched interests:", res.data);
        setInterests(res.data);
      } catch (err) {
        console.error("Error fetching interests:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInterests();
  }, [userId]);

  if (loading) {
    return (
      <div className="loading">
        <Loader2 size={48} className="spinner" />
        Loading...
      </div>
    );
  }

  if (interests.length === 0) {
    return (
      <div className="no-interests">
        You haven't shown interest in any events yet.
      </div>
    );
  }

  // Deduplicate interests by eventId
  const uniqueInterestsMap = new Map();
  interests.forEach((item) => {
    if (!uniqueInterestsMap.has(item.eventId)) {
      uniqueInterestsMap.set(item.eventId, item);
    }
  });
  const uniqueInterests = Array.from(uniqueInterestsMap.values());

  return (
    <div className="interest-container">
      <h2>My Interested Events</h2>
      <div className="interest-grid">
        {uniqueInterests.map((item) => (
          <div key={`${item.eventId}-${item._id}`} className="interest-card">
            <img
              src={item.image || "/default-event.jpg"}
              alt={item.title}
              className="event-image"
            />
            <div className="event-info-row">
              <div className="event-left">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="event-right">
                <p>
                  <Calendar /> {new Date(item.startDate).toLocaleDateString()}
                </p>
                <p>
                    Status:{" "}
                    {["accepted", "approved"].includes(item.status?.toLowerCase()) && (
                        <span style={{ color: "green" }}>Approved <CheckCircle /></span>
                    )}
                    {item.status?.toLowerCase() === "rejected" && (
                        <span style={{ color: "red" }}>Rejected <XCircle /></span>
                    )}
                    {item.status?.toLowerCase() === "pending" && (
                        <span style={{ color: "orange" }}>Pending</span>
                    )}
                    {item.status?.toLowerCase() === "withdrawn" && (
                        <span style={{ color: "gray" }}>Withdrawn</span>
                    )}
                    </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
