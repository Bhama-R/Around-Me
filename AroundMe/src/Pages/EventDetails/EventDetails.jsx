import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Flag,
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Star,
  XCircle,
} from "lucide-react";
import "./EventDetails.css";

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
 const userId = localStorage.getItem("userId");

  const [event, setEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("Agenda");
  const [isInterested, setIsInterested] = useState(false);
  const [interestId, setInterestId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [transaction, setTransaction] = useState({
    transactionId: "",
    paymentMode: "",
    paymentDate: "",
  });

  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:3000/event/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error("Error fetching event:", err));
  }, [id]);

  const handleExpressInterest = async () => {
    if (event?.fee && !isInterested) {
      setShowForm(true);
    } else if (!isInterested) {
      try {
        const res = await axios.post(`http://localhost:3000/interest`, {
          eventId: event._id,
          userId,
          transaction: {
            amount: event.fee || 0,
            paymentStatus: event.fee ? "paid" : "unpaid",
          },
        });
        setIsInterested(true);
        setInterestId(res.data.interest._id);
      } catch (err) {
        console.error("Error expressing interest:", err);
      }
    }
  };

  const handleSubmit = async () => {
    const { transactionId, paymentMode, paymentDate } = transaction;
    if (transactionId && paymentMode && paymentDate) {
      try {
        const res = await axios.post("http://localhost:3000/interest", {
          eventId: event._id,
          userId,
          transaction: {
            amount: event.fee,
            transactionId,
            paymentMode,
            paymentDate,
            paymentStatus: "paid",
          },
        });
        setIsInterested(true);
        setInterestId(res.data.interest._id);
        setShowForm(false);
        setTransaction({ transactionId: "", paymentMode: "", paymentDate: "" });
      } catch (err) {
        console.error("Error submitting interest:", err);
      }
    }
  };

  const handleWithdraw = async () => {
    if (!interestId) return;
    try {
      await axios.post(
        `http://localhost:3000/interest/interest/withdraw/${interestId}`,
        { reason: "user withdraw interest" }
      );
      setIsInterested(false);
      setInterestId(null);
      alert("You have withdrawn your interest.");
    } catch (err) {
      console.error("Error withdrawing interest:", err);
    }
  };

  if (!event) return <div className="loading">Loading event details...</div>;

  const capacity =
    event.totalCapacity && event.attendees
      ? Math.round((event.attendees / event.totalCapacity) * 100)
      : 0;

  return (
    <div className="event-details">
      {/* Header */}
      <div className="header">
        <button onClick={() => navigate("/events")} className="back-btn">
          <ArrowLeft className="icon" /> Back to Events
        </button>
        <h1 className="site-title">Around Me Events</h1>
      </div>

      {/* Main Content */}
      <div className="content">
        {/* Left Section */}
        <div className="left">
          {event.image && (
            <img src={event.image} alt={event.title} className="event-image" />
          )}

          <h2 className="event-title">{event.title}</h2>

          <div className="event-info">
            <div>
              <Star className="star-icon" /> {event.rating || "4.5"} (
              {event.reviews || "100"} reviews)
            </div>
            <span className="event-price">₹{event.fee || 0}</span>
          </div>

          <div className="details-grid">
            <div className="info-box">
              <Calendar className="icon" />
              <div>
                <p>
                  {new Date(event.startDate).toLocaleDateString()} -{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="info-box">
              <MapPin className="icon" />
              <div>
                <p>{event.location?.city}</p>
                <p className="text-gray">{event.location?.address}</p>
              </div>
            </div>

            <div className="info-box">
              <Users className="icon" />
              <div>
                <p>{event.capacity} capacity</p>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="about">
            <h3>About This Event</h3>
            <p>{event.description}</p>
          </div>

          {/* Tabs Section */}
          <div className="tabs">
            {["Agenda", "Participants", "Location", "Requirements"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "Agenda" && (
              <div>
                <h3>Event Schedule</h3>
                <ul className="agenda-list">
                  {event.agenda && event.agenda.length > 0 ? (
                    event.agenda.map((item, idx) => (
                      <li key={idx}>
                        <span className="agenda-time">{item.time}</span>
                        <div>
                          <h4>{item.title}</h4>
                          <p>{item.location}</p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p>No agenda available</p>
                  )}
                </ul>
              </div>
            )}

            {activeTab === "Participants" && (
              <div>
                <h3>Participants</h3>
                {event.participants && event.participants.length > 0 ? (
                  <ul className="participants-list">
                    {event.participants.map((p, idx) => (
                      <li key={idx}>
                        <img src={p.profile} alt={p.name} />
                        <p>{p.name}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No participants yet</p>
                )}
              </div>
            )}

            {activeTab === "Location" && (
              <div>
                <h3>Location Details</h3>
                <p>
                  <b>Address:</b> {event.location?.address}
                </p>
                <p>
                  <b>City:</b> {event.location?.city}
                </p>
                <p>
                  {/* <b>Venue:</b> {event.location?.venue} */}
                </p>
              </div>
            )}

           {activeTab === "Requirements" && (
          <div>
            <h3>Requirements</h3>
            {event.restrictions ? (
              <ul>
                <li><b>Gender:</b> {event.restrictions.gender || "Any"}</li>
                {event.restrictions.age?.min && event.restrictions.age?.max && (
                  <li><b>Age Range:</b> {event.restrictions.age.min} - {event.restrictions.age.max}</li>
                )}
                {event.restrictions.place && (
                    <li><b>Place Restriction:</b> {event.restrictions.place}</li>
                  )}
                </ul>
              ) : (
                <p>No special requirements listed.</p>
              )}
            </div>
          )}

          </div>
        </div>

        {/* Right Section */}
        <div className="right">
          <div className="card join-card">
            <h3>Join This Event</h3>

            {!isInterested ? (
              <button className="interest-btn" onClick={handleExpressInterest}>
                <Heart className="icon" /> Express Interest
              </button>
            ) : (
              <>
                <button className="interested-btn">
                  ❤️ Interest Expressed!
                </button>
                <button className="withdraw-btn" onClick={handleWithdraw}>
                  <XCircle className="icon" /> Withdraw Interest
                </button>
              </>
            )}

            <hr className="divider" />
            <button className="report-btn">
              <Flag className="icon" /> Report as Fake
            </button>
          </div>

          <div className="card">
            <h3>Event Stats</h3>
            <div className="progress">
              <div
                className="progress-bar"
                style={{ width: `${capacity}%` }}
              ></div>
            </div>
            <p>{capacity}% full</p>
          </div>

          {event.paymentDetails && (
            <div className="card">
              <h3>
                <CreditCard className="icon" /> Payment Info
              </h3>
              <p>
                Ticket Price: <b>₹{event.fee || 0}</b>
              </p>
              <div className="payment-box">
                <p>Account Number: {event.paymentDetails.AccountNumber}</p>
                <p>UPI ID: {event.paymentDetails.UPIID}</p>
                <p>IFSC Code: {event.paymentDetails.IFSCcode}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Confirmation Form */}
      {showForm && (
        <div className="overlay">
          <div className="dialog">
            <h3>Payment Confirmation</h3>
            <p>Enter your payment details to confirm your interest.</p>

            <input
              type="text"
              placeholder="Transaction ID"
              value={transaction.transactionId}
              onChange={(e) =>
                setTransaction({ ...transaction, transactionId: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Payment Mode (UPI, Card, etc.)"
              value={transaction.paymentMode}
              onChange={(e) =>
                setTransaction({ ...transaction, paymentMode: e.target.value })
              }
            />
            <input
              type="date"
              value={transaction.paymentDate}
              onChange={(e) =>
                setTransaction({ ...transaction, paymentDate: e.target.value })
              }
            />

            <div className="dialog-actions">
              <button
                onClick={() => setShowForm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button onClick={handleSubmit} className="confirm-btn">
                Confirm Interest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
