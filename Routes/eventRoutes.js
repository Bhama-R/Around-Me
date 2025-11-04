const express = require("express");
const router = express.Router();
const EventController = require("../Controllers/eventController");
const {
  eventValidation,
  participantValidation,
  validationRes,
} = require("../middleware/Validation/validation");


router.post("/", eventValidation, validationRes, EventController.create);
router.get("/", EventController.getAll);
router.get("/created-by/:userId", EventController.getMyCreatedEvents);
router.get("/by-category", EventController.fetchEventsByCategory);
//  Approve / Reject participant interest
router.put("/:id/participant/:participantId/status", EventController.updateInterestStatus);
router.put("/:id", eventValidation, validationRes, EventController.update);
router.delete("/:id", EventController.remove);
router.get("/:id/participants", EventController.getEventParticipants);
router.get("/:id", EventController.getEventById);




router.put("/:id/block", EventController.block);
router.put("/:id/unblock", EventController.unblock);


router.post("/:id/participants",participantValidation,validationRes,EventController.addParticipant);

router.delete("/:id/participants",participantValidation, validationRes,EventController.removeParticipant);




module.exports = router;
