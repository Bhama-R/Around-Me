import React from "react";
import { useNavigate } from "react-router-dom";
import "./EventCard.css";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <div className="event-card">
      <div className="event-image">
        {event.attachments?.length > 0 ? (
          <img src={event.attachments[0]} alt={event.title} />
        ) : (
          <div className="placeholder">No Image</div>
        )}
        <span className="event-category">{event.category?.name || "General"}</span>
      </div>

      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">{event.description}</p>
        <p className="event-location">📍 {event.location?.city}, {event.location?.address}</p>
        <p className="event-date">
          🗓 {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
        </p>

        <div className="event-footer">
          <span className="event-fee">{event.fee > 0 ? `₹${event.fee}` : "Free"}</span>
          <button className="explore-btn" onClick={() => navigate(`/event/${event._id}`)}>
            View Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
