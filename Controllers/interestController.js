const interestServices = require("../Services/interestService");

// Create interest
async function expressInterest(req, res) {
  try {
    const payload = {
      eventId: req.body.eventId,
      userId: req.body.userId, // ideally from auth
      status: "pending",
      transaction: req.body.transaction || {},
    };
    const interest = await interestServices.createInterest(payload);
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

    const interests = await interestServices.getInterests(filter);
    return res.json({ interests });
  } catch (err) {
    return res.status(500).json({ msg: "Unable to fetch interests", error: err.message });
  }
}

// Get single interest
async function interestDetails(req, res) {
  try {
    const id = req.params.id;
    const interest = await interestServices.getInterestById(id);
    if (!interest) return res.status(404).json({ msg: "Interest not found" });
    return res.json({ interest });
  } catch (err) {
    return res.status(500).json({ msg: "Error fetching interest", error: err.message });
  }
}

// Update interest (approve/reject, update payment info)
async function updateInterest(req, res) {
  try {
    const id = req.params.id;
    const updates = req.body;
    const interest = await interestServices.updateInterest(id, updates);
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
    const interest = await interestServices.withdrawInterest(id, reason);
    if (!interest) return res.status(404).json({ msg: "Interest not found" });
    return res.json({ msg: "Interest withdrawn", interest });
  } catch (err) {
    return res.status(500).json({ msg: "Error withdrawing interest", error: err.message });
  }
}

module.exports = {
  expressInterest,
  listInterests,
  interestDetails,
  updateInterest,
  withdrawInterest,
};
