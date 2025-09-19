const express = require("express");
const router = express.Router();
const attendeeController = require("../Controllers/attendeeController");

// Approve attendee
router.put("/attendee/approve/:id", attendeeController.approve);

// Reject attendee
router.put("/attendee/reject/:id", attendeeController.reject);

// List applicants for an event
router.get("/attendees/event/:eventId", attendeeController.listApplicants);

// Bulk approve/reject attendees
router.post("/attendees/bulk", attendeeController.bulkUpdate);

// Remove attendee
router.delete("/attendee/:id", attendeeController.remove);

module.exports = router;
