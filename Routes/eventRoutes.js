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
router.get("/:id", EventController.getOne);
router.put("/:id", eventValidation, validationRes, EventController.update);
router.delete("/:id", EventController.remove);


router.put("/:id/block", EventController.block);
router.put("/:id/unblock", EventController.unblock);


router.post("/:id/participants",participantValidation,validationRes,EventController.addParticipant);

router.delete("/:id/participants",participantValidation, validationRes,EventController.removeParticipant
);

module.exports = router;
