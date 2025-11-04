import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyEvents.css";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, CheckCircle, XCircle, Eye } from "lucide-react";
import AttendeeDashboard from "../AttendeeDashboard/AttendeeDashboard";

export default function MyEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Fetch events created by this user
        const eventRes = await axios.get(`http://localhost:3000/event/created-by/${userId}`);
        const eventList = eventRes.data;

        // Step 2: For each event, fetch participants from the Interest collection
        const eventsWithParticipants = await Promise.all(
          eventList.map(async (event) => {
            const interestRes = await axios.get(
              `http://localhost:3000/interest/interests?eventId=${event._id}`
            );

            // Extract the participants array
            const participants = interestRes.data.interests.map((i) => ({
              _id: i._id,
              user: i.userId,
              status: i.status,
              payment: i.payment || "pending",
              seatNumber: i.seatNumber || "Not assigned",
            }));

            return { ...event, participants };
          })
        );

        setEvents(eventsWithParticipants);
      } catch (err) {
        console.error("❌ Error fetching events:", err);
      }
    };
    fetchData();
  }, [userId]);

  // Approve / Reject handler
  const handleStatusChange = async (participantId, eventId, status) => {
    try {
      await axios.put(
        `http://localhost:3000/event/${eventId}/participant/${participantId}/status`,
        { status }
      );

      setEvents((prev) =>
        prev.map((event) =>
          event._id === eventId
            ? {
                ...event,
                participants: event.participants.map((p) =>
                  p._id === participantId ? { ...p, status } : p
                ),
              }
            : event
        )
      );
    } catch (err) {
      console.error("❌ Failed to update status:", err);
    }
  };

  return (
    <div className="my-events-wrapper">
      <h1 className="page-title">🎫 My Owned Events</h1>

      {events.length === 0 ? (
        <p className="no-events">You haven’t created any events yet.</p>
      ) : (
        <div className="event-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-header">
                 <img
            src={
              event.image
                ? event.image.startsWith("data:")
                  ? event.image
                  : `http://localhost:3000/${event.image}`
                : "https://placehold.co/150x150?text=No+Image"
            }
            alt={event.title}
            className="event-image"
          />
                <h2>{event.title}</h2>
                <p className="desc">{event.description}</p>

                <div className="event-meta">
                  <p><Calendar size={16} /> {new Date(event.startDate).toLocaleDateString()}</p>
                  <p><MapPin size={16} /> {event.location?.address || "Location TBD"}</p>
                  <p><Users size={16} /> {event.participants.length} Interested</p>
                </div>

                <button
                  className="view-btn"
                  onClick={() => navigate(`/attendees/${event._id}`)}
                >
                  <Eye size={14} /> View Interested People
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
