const mongoose = require("mongoose");
const Event = require("../Schema/eventSchema");
const InterestService = require("./interestService"); 


// Create new event
async function createEvent(data) {
   // Convert createdBy to ObjectId
  if (data.createdBy) {
    data.createdBy = new mongoose.Types.ObjectId(data.createdBy);
  }

  const event = await Event.create(data);
  return event;
}

// Get all events
async function getEvents(filter = {}) {
  return await Event.find(filter)
    .populate("category")
    .populate("createdBy", "name email");
}

// Get event by ID
async function getEventById(id) {
  try {
    console.log("🔍 Fetching event by ID:", id); 

    const event = await Event.findById(id)
      .populate("category")
      .populate("createdBy", "name email")

    if (!event) {
      console.log("⚠️ Event not found in DB for ID:", id);
      return null;
    }

    console.log("✅ Event fetched successfully from DB:", {
      title: event.title,
      contacts: event.contacts,
      paymentDetails: event.paymentDetails,
    });

    return event;
  } catch (err) {
    console.error("❌ Error fetching event:", err.message);
    throw err;
  }
}

async function getEventsByCreator(userId) {
  console.log("Looking up events in DB for:", userId);
  return await Event.find({ createdBy: userId })
    .populate("category")
    .populate("createdBy", "name email");
}

 async function getEventsByCategory() {
  try {
    const result = await Event.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$fee" }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      {
        $unwind: "$categoryInfo"
      },
      {
        $project: {
          categoryName: "$categoryInfo.name",
          count: 1,
          totalRevenue: 1
        }
      }
    ]);

    return result;
  } catch (error) {
    throw new Error("Error fetching events by category: " + error);
  }
};

async function getEventParticipants(eventId) {
  return await InterestService.getParticipantsByEvent(eventId);
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
// async function blockEvent(id) {
//   return await Event.findByIdAndUpdate(id, { status: "blocked" }, { new: true });
// }

// Block / Unblock event
async function blockEvent(id) {
  try {
    const event = await Event.findByIdAndUpdate(id, { status: "blocked" }, { new: true });

    await InterestService.updateMany(
      { eventId: new mongoose.Types.ObjectId(id), status: "approved" },
      { $set: { status: "pending" } }
    );
const check = await InterestService.getInterests(); // fetch all interests
console.log("🧩 Interests after update:", check);

    console.log(`✅ Updated all approved interests for event ${id} to pending.`);
    return event;
  } catch (err) {
    console.error("❌ Error blocking event:", err);
    throw err;
  }
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
    throw new Error(`Event allows to ${event.restrictions.gender} participants only`);

  if (event.restrictions?.age) {
    const { min, max } = event.restrictions.age;
    if ((min && participant.age < min) || (max && participant.age > max)) {
      throw new Error(`Event restricted to age between ${min || "-"} and ${max || "-"}`);
    }
  }

 // Restrict to participants from the event's place only
if (event.restrictions?.place && participant.place.trim().toLowerCase() !== event.restrictions.place.trim().toLowerCase())
 {
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

/* ======================================================
   🧩 Get events created by user (with participants)
====================================================== */
async function getEventsWithParticipantsByUser(userId) {
  // Get all events created by this user
  const events = await Event.find({ createdBy: userId }).lean();

  // Collect all event IDs
  const eventIds = events.map((e) => e._id);

  // Get all interests related to those events
  const interests = await Interest.find({ eventId: { $in: eventIds } })
    .populate("userId", "name email") // populate participant user details
    .lean();

  // Attach participants to each event
  const eventsWithParticipants = events.map((event) => {
    const participants = interests
      .filter((i) => i.eventId.toString() === event._id.toString())
      .map((i) => i.userId); // extract user details
    return { ...event, participants };
  });

  return eventsWithParticipants;
}

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  getEventsByCreator,
  getEventsByCategory,
  getEventParticipants,
  updateEvent,
  deleteEvent,
  blockEvent,
  unblockEvent,
  applyForEvent,
  cancelParticipation,
  updateParticipation,
  overrideApplication,
  updatePayment,
  getEventsWithParticipantsByUser,
};
