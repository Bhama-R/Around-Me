const InterestService = require("../Services/interestService");

// Create interest
async function expressInterest(req, res) {
  try {
    const payload = {
      eventId: req.body.eventId,
      userId: req.body.userId,
      status: "pending",
      transaction: req.body.transaction || {},
    };
    const interest = await InterestService.createInterest(payload);
    return res.status(201).json({ msg: "Interest expressed successfully", interest });
  } catch (err) {
    return res.status(500).json({ msg: "Unable to express interest", error: err.message });
  }
}

// List interests
async function listInterests(req, res) {
  try {
    const filter = {};
    if (req.query.eventId) filter.eventId = req.query.eventId;
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.status) filter.status = req.query.status;

    const interests = await InterestService.getInterests(filter);
    return res.json({ interests });
  } catch (err) {
    return res.status(500).json({ msg: "Unable to fetch interests", error: err.message });
  }
}

// Get single interest
async function interestDetails(req, res) {
  try {
    const id = req.params.id;
    const interest = await InterestService.getInterestById(id);
    if (!interest) return res.status(404).json({ msg: "Interest not found" });
    return res.json({ interest });
  } catch (err) {
    return res.status(500).json({ msg: "Error fetching interest", error: err.message });
  }
}

// Update interest status (approve/reject)
async function updateInterest(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const interest = await InterestService.updateInterestStatus(id, status);
    if (!interest) return res.status(404).json({ msg: "Interest not found" });
    return res.json({ msg: "Interest updated", interest });
  } catch (err) {
    return res.status(500).json({ msg: "Error updating interest", error: err.message });
  }
}

// Withdraw interest
async function withdrawInterest(req, res) {
  try {
    const id = req.params.id;
    const { reason } = req.body;
    const interest = await InterestService.withdrawInterest(id, reason);
    if (!interest) return res.status(404).json({ msg: "Interest not found" });
    return res.json({ msg: "Interest withdrawn", interest });
  } catch (err) {
    return res.status(500).json({ msg: "Error withdrawing interest", error: err.message });
  }
}

// ✅ Fetch all interested events by user
async function getMyInterestedEvents(req, res) {
  try {
    const { userId } = req.params;
    const interests = await InterestService.getMyInterestedEvents(userId);

    const formatted = interests.map((item) => ({
      eventId: item.eventId._id,
      title: item.eventId.title,
      description: item.eventId.description,
      image: item.eventId.image,
      status: item.status,
      startDate: item.eventId.startDate,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  expressInterest,
  listInterests,
  interestDetails,
  updateInterest,
  withdrawInterest,
  getMyInterestedEvents,
};
