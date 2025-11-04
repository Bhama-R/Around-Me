import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FakeReport.css";
import { Search, Eye, ShieldAlert, Calendar, User } from "lucide-react";

export default function FakeReportManagement() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch fake reports
  useEffect(() => {
    axios
      .get("http://localhost:3000/fakeReport/reports", { withCredentials: true })
      .then((res) => {
        console.log("📦 Fake Report API response:", res.data);
        const data = res.data?.reports || res.data;
        if (Array.isArray(data)) setReports(data);
        else if (data && typeof data === "object") setReports([data]);
        else setReports([]);
      })
      .catch((err) => {
        console.error("❌ Error fetching reports:", err);
        setReports([]);
      });
  }, []);

  // Filtered search
  const filteredReports = reports.filter((r) =>
    (r.reason || r.blockreason || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fake-report-page">
      <div className="header">
        <h1>Fake Reports</h1>
        <p>View and review all fake/spam reports and admin actions</p>
      </div>

      {/* 🔍 Search box */}
      <div className="search-bar">
        <Search className="icon" />
        <input
          type="text"
          placeholder="Search reports by reason..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 📋 Reports Table */}
      <div className="table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Reported By</th>
              <th>Reason</th>
              <th>Block Reason</th>
              <th>Actioned By</th>
              <th>Date</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr key={report._id}>
                  {/* Event Name */}
                  <td>
                    <p className="event-info">
                      <ShieldAlert size={14} className="icon-inline" />{" "}
                      {report.eventId?.title || "Unknown Event"}
                    </p>
                  </td>

                  {/* Reported By */}
                  <td>
                    <p className="reporter">
                      <User size={14} className="icon-inline" />{" "}
                      {report.reportedBy?.name || "Anonymous"}
                    </p>
                  </td>

                  {/* User Reason */}
                  <td>{report.reason || "No reason provided"}</td>

                  {/* Admin Block/Unblock Reason */}
                  <td>{report.blockreason || "-"}</td>

                  {/* Actioned By */}
                  <td>{report.actionedBy?.name || "-"}</td>

                  {/* Date */}
                  <td>
                    <Calendar size={14} className="icon-inline" />{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>

                  {/* View Button */}
                  <td>
                    <button
                      className="icon-btn view"
                      onClick={() =>
                        alert(
                          `📅 Event: ${report.eventId?.title || "Unknown"}\n\n👤 Reported By: ${
                            report.reportedBy?.name || "Anonymous"
                          }\n\n📝 Reason: ${report.reason || "No reason given"}\n\n🚫 Block Reason: ${
                            report.blockreason || "N/A"
                          }\n\n✅ Actioned By: ${
                            report.actionedBy?.name || "Not yet actioned"
                          }`
                        )
                      }
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No fake reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
