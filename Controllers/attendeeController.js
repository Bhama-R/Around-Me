const attendeeServices = require("../Services/attendeeService");

// Approve attendee
async function approve(req, res) {
  try {
    const id = req.params.id;
    const attendee = await attendeeServices.approveAttendee(id);
    if (!attendee) return res.status(404).json({ msg: "Attendee not found" });
    return res.json({ msg: "Attendee approved", attendee });
  } catch (err) {
    return res.status(500).json({ msg: "Error approving attendee", error: err.message });
  }
}

// Reject attendee
async function reject(req, res) {
  try {
    const id = req.params.id;
    const reason = req.body.reason;
    const attendee = await attendeeServices.rejectAttendee(id, reason);
    if (!attendee) return res.status(404).json({ msg: "Attendee not found" });
    return res.json({ msg: "Attendee rejected", attendee });
  } catch (err) {
    return res.status(500).json({ msg: "Error rejecting attendee", error: err.message });
  }
}

// List all applicants for an event
async function listApplicants(req, res) {
  try {
    const eventId = req.params.eventId;
    const applicants = await attendeeServices.getApplicants(eventId);
    return res.json({ applicants });
  } catch (err) {
    return res.status(500).json({ msg: "Error fetching applicants", error: err.message });
  }
}

// Bulk update attendees
async function bulkUpdate(req, res) {
  try {
    const { ids, status } = req.body;
    const result = await attendeeServices.bulkUpdate(ids, status);
    return res.json({ msg: "Bulk update completed", result });
  } catch (err) {
    return res.status(500).json({ msg: "Error in bulk update", error: err.message });
  }
}

// Remove attendee
async function remove(req, res) {
  try {
    const id = req.params.id;
    const reason = req.body.reason;
    const attendee = await attendeeServices.removeAttendee(id, reason);
    if (!attendee) return res.status(404).json({ msg: "Attendee not found" });
    return res.json({ msg: "Attendee removed", attendee });
  } catch (err) {
    return res.status(500).json({ msg: "Error removing attendee", error: err.message });
  }
}

module.exports = { approve, reject, listApplicants, bulkUpdate, remove };
