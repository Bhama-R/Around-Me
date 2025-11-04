const Interest = require("../Schema/interestSchema");

// Create interest (user expresses interest in event)
async function createInterest(payload) {
  try {
    const interest = new Interest(payload);
    await interest.save();
    return interest;
  } catch (err) {
    console.error("createInterest", err);
    throw err;
  }
}

// Get all interests (filter by event/user/status if needed)
async function getInterests(filter = {}) {
  try {
    return await Interest.find(filter)
      .populate("eventId", "title description startDate location category createdBy")
      .populate("userId", "name email");
  } catch (err) {
    console.error("getInterests", err);
    throw err;
  }
}

// Get single interest by ID
async function getInterestById(id) {
  try {
    return await Interest.findById(id)
      .populate("eventId", "title description startDate")
      .populate("userId", "name email");
  } catch (err) {
    console.error("getInterestById", err);
    throw err;
  }
}



// Update status (approve / reject)
async function updateInterestStatus(interestId, status) {
  try {
    const updated = await Interest.findByIdAndUpdate(
      interestId,
      { status },
      { new: true }
    ).populate("userId", "name email phone");
    return updated;
  } catch (err) {
    console.error("updateInterestStatus", err);
    throw err;
  }
}

// Withdraw interest
async function withdrawInterest(id, reason) {
  try {
    return await Interest.findByIdAndUpdate(
      id,
      { status: "withdrawn", withdrawnAt: Date.now(), withdrawReason: reason },
      { new: true }
    );
  } catch (err) {
    console.error("withdrawInterest", err);
    throw err;
  }
}

// Get participants by event
async function getParticipantsByEvent(eventId) {
  try {
    const interests = await Interest.find({ eventId, status: "applied" })
      .populate("userId", "name email")
      .populate("eventId", "title startDate");

    if (!interests.length) return null;

    const eventInfo = {
      title: interests[0].eventId.title,
      startDate: interests[0].eventId.startDate,
    };

    const users = interests.map((i) => i.userId);
    return { event: eventInfo, participants: users };
  } catch (err) {
    console.error("getParticipantsByEvent", err);
    throw err;
  }
}

// ✅ Get all interested events of a user
async function getMyInterestedEvents(userId) {
  try {
    return await Interest.find({ userId })
      .populate("eventId", "title description image startDate fee")
      .lean();
  } catch (err) {
    console.error("getMyInterestedEvents", err);
    throw err;
  }
}

async function updateMany(filter, updateData) {
  try {
    const result = await Interest.updateMany(filter, updateData);
    console.log(`✅ ${result.modifiedCount} interests updated.`);
    return result;
  } catch (err) {
    console.error("updateMany", err);
    throw err;
  }
}
module.exports = {
  createInterest,
  getInterests,
  getInterestById,
  updateInterestStatus,
  withdrawInterest,
  getParticipantsByEvent,
  getMyInterestedEvents,
  updateMany,
};
