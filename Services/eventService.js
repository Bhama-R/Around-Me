const express = require("express");
const mongoose = require("mongoose");
const Event = require("../Schema/eventSchema");

// Create new event
async function createEvent(data) {
  return await Event.create(data);
}

// Get all events
async function getEvents(filter = {}) {
  return await Event.find(filter)
    .populate("category")
    .populate("createdBy", "name email");
}

// Get event by ID
async function getEventById(id) {
  return await Event.findById(id)
    .populate("category")
    .populate("createdBy", "name email");
}

// Update event
async function updateEvent(id, data) {
  return await Event.findByIdAndUpdate(id, data, { new: true });
}

// Delete event
async function deleteEvent(id) {
  return await Event.findByIdAndDelete(id);
}

// Block event
async function blockEvent(id) {
  return await Event.findByIdAndUpdate(id, { status: "blocked" }, { new: true });
}

// Unblock event
async function unblockEvent(id) {
  return await Event.findByIdAndUpdate(id, { status: "active" }, { new: true });
}

// Add participant
async function addParticipant(eventId, participant) {
  return await Event.findByIdAndUpdate(
    eventId,
    { $push: { participants: participant } },
    { new: true }
  );
}

// Remove participant
async function removeParticipant(eventId, participantName) {
  return await Event.findByIdAndUpdate(
    eventId,
    { $pull: { participants: { name: participantName } } },
    { new: true }
  );
}

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  blockEvent,
  unblockEvent,
  addParticipant,
  removeParticipant,
};
