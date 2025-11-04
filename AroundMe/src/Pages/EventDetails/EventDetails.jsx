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
  const [approvalStatus, setApprovalStatus] = useState(null); // "approved", "rejected", "pending"
  const [showForm, setShowForm] = useState(false);
  const [transaction, setTransaction] = useState({
    transactionId: "",
    paymentMode: "",
    paymentDate: "",
  });
  const [showFakeReport, setShowFakeReport] = useState(false);
  const [reportReason, setReportReason] = useState("");

  // 🔹 Fetch event + interest status
  useEffect(() => {
    if (!id || !userId) return;

    axios
      .get(`http://localhost:3000/event/${id}`)
      .then((res) => {
        console.log("🟢 Event fetched:", res.data);
        setEvent(res.data);
      })
      .catch((err) => console.error("Error fetching event:", err));

    axios
      .get(`http://localhost:3000/interest/interested-in/${userId}`)
      .then((res) => {
        const interest = res.data.find((i) => i.eventId === id);
        if (interest) {
          setIsInterested(true);
          setInterestId(interest._id);
          setApprovalStatus(interest.status);
        }
      })
      .catch((err) => console.error("Error fetching interest:", err));
  }, [id, userId]);

  // 🔹 Express Interest
  const handleExpressInterest = async () => {
    if (!event) return;

    if (event.fee && !isInterested) {
      // Requires payment form
      setShowForm(true);
    } else if (!isInterested) {
      // Free event
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
        setApprovalStatus("pending");
      } catch (err) {
        console.error("Error expressing interest:", err);
      }
    }
  };

  // 🔹 Payment Form Submission
  const handleSubmit = async () => {
    const { transactionId, paymentMode, paymentDate } = transaction;

    if (!transactionId || !paymentMode || !paymentDate) {
      alert("Please fill all payment details.");
      return;
    }

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
      setApprovalStatus("pending");
      setShowForm(false);
      setTransaction({ transactionId: "", paymentMode: "", paymentDate: "" });
    } catch (err) {
      console.error("Error submitting payment interest:", err);
    }
  };

  // 🔹 Withdraw Interest
  const handleWithdraw = async () => {
    if (!interestId) return;
    try {
      await axios.post(
        `http://localhost:3000/interest/withdraw/${interestId}`,
        { reason: "user withdraw interest" }
      );
      setIsInterested(false);
      setInterestId(null);
      setApprovalStatus(null);
      alert("You have withdrawn your interest.");
    } catch (err) {
      console.error("Error withdrawing interest:", err);
    }
  };

  // 🔹 Fake Event Report
  const handleFakeReport = async () => {
    if (!reportReason.trim()) {
      alert("Please enter a reason.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/fakeReport/report", {
        eventId: event._id,
        reportedBy: userId,
        reason: reportReason,
      });

      alert("Report submitted successfully.");
      setShowFakeReport(false);
      setReportReason("");
    } catch (err) {
      console.error("Error submitting fake report:", err);
      alert("Failed to submit report. Try again.");
    }
  };

  if (!event) return <div className="loading">Loading event details...</div>;

  // 🔹 Capacity Percentage (avoid NaN)
  const capacity =
    event.capacity && event.participants
      ? Math.round((event.participants.length / event.capacity) * 100)
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

          {/* Details */}
          <div className="details-grid">
            <div className="info-box">
              <Calendar className="icon" />
              <p>
                {new Date(event.startDate).toLocaleDateString()} -{" "}
                {new Date(event.endDate).toLocaleDateString()}
              </p>
            </div>

            <div className="info-box">
              <MapPin className="icon" />
              <p>{event.location?.city}</p>
              <p className="text-gray">{event.location?.address}</p>
            </div>

            <div className="info-box">
              <Users className="icon" />
              <p>{event.capacity} capacity</p>
            </div>
          </div>

          {/* About */}
          <div className="about">
            <h3>About This Event</h3>
            <p>{event.description}</p>
          </div>

          {/* Tabs */}
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
                {event.location?.mapLink && (
                  <a
                    href={event.location.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📍 View on Map
                  </a>
                )}
              </div>
            )}

            {activeTab === "Requirements" && (
              <div>
                <h3>Requirements</h3>
                {event.restrictions ? (
                  <ul>
                    <li>
                      <b>Gender:</b> {event.restrictions.gender || "Any"}
                    </li>
                    {event.restrictions.age?.min &&
                      event.restrictions.age?.max && (
                        <li>
                          <b>Age Range:</b>{" "}
                          {event.restrictions.age.min} -{" "}
                          {event.restrictions.age.max}
                        </li>
                      )}
                    {event.restrictions.place && (
                      <li>
                        <b>Place Restriction:</b> {event.restrictions.place}
                      </li>
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

            {!isInterested && approvalStatus !== "rejected" && (
              <button className="interest-btn" onClick={handleExpressInterest}>
                <Heart className="icon" /> Express Interest
              </button>
            )}

            {isInterested && approvalStatus === "approved" && (
              <>
                <button className="interested-btn">
                  ❤️ Interest Approved
                </button>
                <button className="withdraw-btn" onClick={handleWithdraw}>
                  <XCircle className="icon" /> Withdraw Interest
                </button>
              </>
            )}

            {approvalStatus === "rejected" && (
              <p className="rejected-msg">Your interest was rejected.</p>
            )}

            <hr className="divider" />
            <button
              className="report-btn"
              onClick={() => setShowFakeReport(true)}
            >
              <Flag className="icon" /> Report as Fake
            </button>
          </div>

          {/* Capacity card */}
          {/* <div className="card">
            <h3>Event Stats</h3>
            <div className="progress">
              <div
                className="progress-bar"
                style={{ width: `${capacity}%` }}
              ></div>
            </div>
            <p>{capacity}% full</p>
          </div> */}

          {/* Payment info */}
      {event.paymentDetails && (
        <div className="payment-details">
          <h3>Payment Details</h3>
          <p><strong>Account Number:</strong> {event.paymentDetails.AccountNumber}</p>
          <p><strong>UPI ID:</strong> {event.paymentDetails.UPIID}</p>
          <p><strong>IFSC Code:</strong> {event.paymentDetails.IFSCcode}</p>
        </div>
      )}

      {event.contacts && event.contacts.length > 0 && (
        <div className="contact-details">
          <h3>Contact Details</h3>
          {event.contacts.map((contact, index) => (
            <p key={index}>{contact.name} - {contact.phone}</p>
          ))}
        </div>
      )}

        </div>
      </div>

      {/* Payment form */}
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

      {/* Fake Report */}
      {showFakeReport && (
        <div className="overlay">
          <div className="dialog">
            <h3>Report Event as Fake</h3>
            <textarea
              placeholder="Enter reason for reporting"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />

            <div className="dialog-actions">
              <button
                onClick={() => setShowFakeReport(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button onClick={handleFakeReport} className="confirm-btn">
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
