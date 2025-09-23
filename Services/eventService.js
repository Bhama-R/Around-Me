const mongoose = require("mongoose");
const Event = require("../Schema/eventSchema");
const InterestService = require("./interestService"); // Make sure this exists

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

// Delete event (admin or owner)
async function deleteEvent(id, userId) {
  const event = await Event.findById(id);
  if (!event) throw new Error("Event not found");

  if (userId && event.createdBy.toString() !== userId.toString()) {
    throw new Error("Not authorized to delete this event");
  }

  return await Event.findByIdAndDelete(id);
}

// Block / Unblock event
async function blockEvent(id) {
  return await Event.findByIdAndUpdate(id, { status: "blocked" }, { new: true });
}

async function unblockEvent(id) {
  return await Event.findByIdAndUpdate(id, { status: "active" }, { new: true });
}

// Apply for event / add participant
async function applyForEvent(eventId, participant) {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  // Check existing interest
  const existingInterest = await InterestService.getInterests({
    eventId,
    userId: participant.userId,
  });
  if (existingInterest.length > 0) throw new Error("User has already expressed interest");

  // Capacity check
  const totalParticipants = await InterestService.getInterests({ eventId, status: "approved" });
  if (event.capacity && totalParticipants.length >= event.capacity) throw new Error("Event full");
  

  // Restrictions
  if (event.restrictions?.gender && participant.gender !== event.restrictions.gender)
    throw new Error(`Event restricted to ${event.restrictions.gender} participants`);

  if (event.restrictions?.age) {
    const { min, max } = event.restrictions.age;
    if ((min && participant.age < min) || (max && participant.age > max)) {
      throw new Error(`Event restricted to age between ${min || "-"} and ${max || "-"}`);
    }
  }

 // Restrict to participants from the event's place only
if (participant.place.trim().toLowerCase() !== event.place.trim().toLowerCase()) {
  throw new Error(`Event is only open to members from ${event.place}`);
}


  // Create Interest
  const interest = await InterestService.createInterest({
    eventId,
    userId: participant.userId,
    status: "pending",
    payment: participant.payment || null,
    seatNumber: null,
  });

  return interest;
}

// Cancel / remove participant
async function cancelParticipation(eventId, userId) {
  return await Event.findByIdAndUpdate(
    eventId,
    { $pull: { participants: { userId: userId } } },
    { new: true }
  );
}

// Update participation
async function updateParticipation(eventId, userId, updateData) {
  return await Event.findOneAndUpdate(
    { _id: eventId, "participants.userId": userId },
    { $set: { "participants.$": updateData } },
    { new: true }
  );
}

// Override application (approve/reject)
async function overrideApplication(eventId, participantId, status) {
  return await Event.findOneAndUpdate(
    { _id: eventId, "participants._id": participantId },
    { $set: { "participants.$.status": status } },
    { new: true }
  );
}

// Update payment
async function updatePayment(eventId, userId, paymentData) {
  return await Event.findOneAndUpdate(
    { _id: eventId, "participants.userId": userId },
    { $set: { "participants.$.payment": paymentData } },
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
  applyForEvent,
  cancelParticipation,
  updateParticipation,
  overrideApplication,
  updatePayment,
};
