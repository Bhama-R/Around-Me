const express = require("express");
const mongoose = require("mongoose");
const Interest = require("../Schema/interestSchema");

// Approve attendee
async function approveAttendee(id) {
  try {
    return await Interest.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    ).populate("userId", "name email").populate("eventId", "title startDate");
  } catch (err) {
    console.error("approveAttendee", err);
    throw err;
  }
}

// Reject attendee
async function rejectAttendee(id, reason) {
  try {
    return await Interest.findByIdAndUpdate(
      id,
      { status: "rejected", withdrawReason: reason },
      { new: true }
    );
  } catch (err) {
    console.error("rejectAttendee", err);
    throw err;
  }
}

// View all applicants for an event
async function getApplicants(eventId) {
  try {
    return await Interest.find({ eventId })
      .populate("userId", "name email mobile")
      .sort({ createdAt: 1 });
  } catch (err) {
    console.error("getApplicants", err);
    throw err;
  }
}

// Bulk approve/reject applicants
async function bulkUpdate(ids, status) {
  try {
    return await Interest.updateMany(
      { _id: { $in: ids } },
      { $set: { status: status } }
    );
  } catch (err) {
    console.error("bulkUpdate", err);
    throw err;
  }
}

// Remove attendee (set withdrawn)
async function removeAttendee(id, reason) {
  try {
    return await Interest.findByIdAndUpdate(
      id,
      { status: "withdrawn", withdrawnAt: Date.now(), withdrawReason: reason },
      { new: true }
    );
  } catch (err) {
    console.error("removeAttendee", err);
    throw err;
  }
}

module.exports = {
  approveAttendee,
  rejectAttendee,
  getApplicants,
  bulkUpdate,
  removeAttendee,
};