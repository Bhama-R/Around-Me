import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageEvents.css";
import { Eye, Lock, Unlock, Loader2 } from "lucide-react";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      // Fetch events
      const eventsRes = await axios.get("http://localhost:3000/event");
      const eventsData = eventsRes.data;

      // Fetch fake reports
      const reportsRes = await axios.get(
        "http://localhost:3000/fakeReport/reports"
      );
      const reports = reportsRes.data.reports;

      // Merge block info into events
      const merged = eventsData.map((event) => {
        const report = reports.find(
          (r) => r.eventId && r.eventId._id === event._id
        );

        return {
          ...event,
          isBlocked: !!report?.blockreason,
          blockreason: report?.blockreason || null,
          actionedBy: report?.actionedBy || null,
          reportedBy: report?.reportedBy || null,
          reason: report?.reason || null,
        };
      });

      setEvents(merged);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  // Block Event
  const handleBlock = async (eventId) => {
    const blockreason = prompt("Enter reason for blocking this event:");
    if (!blockreason) return alert("Block reason is required.");

    try {
      await axios.put(
        `http://localhost:3000/fakeReport/report/event/${eventId}`,
        {
          blockreason,
          actionedBy: userId,
        }
      );

      await axios.put(`http://localhost:3000/event/${eventId}/block`, {
        status: "inactive",
      });

      alert("✅ Event blocked successfully and marked inactive.");
      fetchEvents();
    } catch (err) {
      console.error("Block Error:", err);
      alert("Failed to block event.");
    }
  };

  // Unblock Event
  const handleUnblock = async (eventId) => {
    try {
      await axios.put(
        `http://localhost:3000/fakeReport/report/event/${eventId}`,
        {
          blockreason: null,
          actionedBy: userId,
        }
      );

      await axios.put(`http://localhost:3000/event/${eventId}/unblock`, {
        status: "active",
      });

      alert("✅ Event unblocked successfully and marked active.");
      fetchEvents();
    } catch (err) {
      console.error("Unblock Error:", err);
      alert("Failed to unblock event.");
    }
  };

  return (
    <div className="manage-events">
      <div className="header-bar">
        <h2>Manage Events</h2>
      </div>

      {loading ? (
        <div className="loading-container">
          <Loader2 className="spin" size={28} />
          <p>Loading events...</p>
        </div>
      ) : (
        <div className="event-table">
          <div className="table-header">
            <span>Event</span>
            <span>Organizer</span>
            <span>Reported By</span>
            <span>Reason</span>
            <span>Category</span>
            <span>Status</span>
            <span>Block Reason</span>
            <span>Actioned By</span>
            <span>Actions</span>
          </div>

          {events.map((event) => (
            <div key={event._id} className="table-row">
              {/* Event Info (no image) */}
              <div className="event-info">
                <div>
                  <h4>{event.title}</h4>
                  <p className="event-desc">
                    {event.description?.slice(0, 60) || "No description"}...
                  </p>
                </div>
              </div>

              {/* Organizer */}
              <div className="organizer-info">
                <p>{event.createdBy?.name || "Unknown Organizer"}</p>
              </div>

              {/* Report Info */}
              <div className="reportedby-info">
                <p>{event.reportedBy?.name || "-"}</p>
              </div>

              <div className="reason-info">
                <p>{event.reason || "-"}</p>
              </div>

              {/* Category */}
              <div className="category-info">
                {event.category?.name || "Uncategorized"}
              </div>

              {/* Status */}
              <div className="status-info">
                {event.isBlocked ? (
                  <span className="status blocked">Blocked</span>
                ) : (
                  <span className="status active">Active</span>
                )}
              </div>

              {/* Block Reason */}
              <div className="block-reason-info">
                {event.blockreason || "-"}
              </div>

              {/* Actioned By */}
              <div className="actionedby-info">
                {event.actionedBy?.name || "-"}
              </div>

              {/* Actions */}
              <div className="action-buttons">
                <button
                  className="view-btn"
                  onClick={() => window.open(`/event/${event._id}`, "_blank")}
                >
                  <Eye size={16} />
                </button>

                <button
                  className="block-btn"
                  onClick={() => handleBlock(event._id)}
                  disabled={!!event.blockreason}
                  style={{
                    opacity: event.blockreason ? 0.6 : 1,
                    cursor: event.blockreason ? "not-allowed" : "pointer",
                  }}
                >
                  <Lock size={16} />
                </button>

                {event.isBlocked && (
                  <button
                    className="unblock-btn"
                    onClick={() => handleUnblock(event._id)}
                  >
                    <Unlock size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
