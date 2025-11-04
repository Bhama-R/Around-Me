import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AttendeeDashboard.css";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function AttendeeDashboard() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [event, setEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch event details
        const eventRes = await axios.get(`http://localhost:3000/event/${eventId}`);
        setEvent(eventRes.data);

        // 2️⃣ Fetch participants
        const res = await axios.get(
          `http://localhost:3000/interest/interests?eventId=${eventId}`
        );

        const list = res.data.interests
          .filter((i) => (eventRes.data.fee > 0 ? i.transaction?.paymentStatus === "paid" : true))

          .map((i) => ({
            _id: i._id,
            user: i.userId,
            status: i.status,
            seatNumber: i.seatNumber || "Not assigned",
            paymentStatus: i.transaction?.paymentStatus || "unpaid",
            paymentMode: i.transaction?.paymentMode || "-",
            transactionId: i.transaction?.transactionId || "-",
          }));

        setParticipants(list);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      }
    };

    fetchData();
  }, [eventId]);

  const handleStatusChange = async (participantId, status) => {
    try {
      await axios.put(
        `http://localhost:3000/event/${eventId}/participant/${participantId}/status`,
        { status }
      );
      setParticipants((prev) =>
        prev.map((p) =>
          p._id === participantId ? { ...p, status } : p
        )
      );
    } catch (err) {
      console.error("❌ Failed to update status:", err);
    }
  };

  const filteredParticipants =
    activeTab === "all"
      ? participants
      : participants.filter((p) => p.status === activeTab);

  if (!event) return <p>Loading event details...</p>;

  return (
    <div className="attendee-dashboard">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to My Events
      </button>

      {/* Event Header */}
      <div className="event-header">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} className="event-image" />
        ) : (
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
        )}
        <div className="event-info">
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <p>
            📅 {new Date(event.startDate).toLocaleDateString()} | 📍{" "}
            {event.location?.address || "Location TBD"}
          </p>
         <p>
            💰 {event.fee > 0 ? "Paid Event" : "Free Event"}
          </p>

        </div>
      </div>

      {/* Stats */}
      <div className="stats-container">
        <div className="stat-card total">Total: {participants.length}</div>
        <div className="stat-card pending">
          Pending: {participants.filter((p) => p.status === "pending").length}
        </div>
        <div className="stat-card approved">
          Approved: {participants.filter((p) => p.status === "approved").length}
        </div>
        <div className="stat-card rejected">
          Rejected: {participants.filter((p) => p.status === "rejected").length}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {["all", "pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} (
            {
              (tab === "all"
                ? participants
                : participants.filter((p) => p.status === tab)
              ).length
            }
            )
          </button>
        ))}
      </div>

      {/* Table */}
      <table className="attendee-table">
     <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Seat</th>
          {event.fee && <th>Payment</th>}
          {event.fee && <th>Mode</th>}
          {event.fee && <th>Txn ID</th>}
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

        <tbody>
          {filteredParticipants.length > 0 ? (
            filteredParticipants.map((p) => (
              <tr key={p._id}>
                <td>{p.user?.name}</td>
                <td>{p.user?.email}</td>
                <td>{p.seatNumber}</td>
                {event.fee && (
                  <>
                    <td className={p.paymentStatus}>{p.paymentStatus}</td>
                    <td>{p.paymentMode}</td>
                    <td>{p.transactionId}</td>
                  </>
                )}
                <td className={p.status}>{p.status}</td>
                <td>
                  <button
                    className="approve-btn"
                    onClick={() => handleStatusChange(p._id, "approved")}
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleStatusChange(p._id, "rejected")}
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={event.fee ? 8 : 5}>No participants found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
