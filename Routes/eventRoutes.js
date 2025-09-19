const express = require("express");
const router = express.Router();
const EventController = require("../Controllers/eventController");

// CRUD
router.post("/", EventController.create);
router.get("/", EventController.getAll);
router.get("/:id", EventController.getOne);
router.put("/:id", EventController.update);
router.delete("/:id", EventController.remove);

// Moderation
router.put("/:id/block", EventController.block);
router.put("/:id/unblock", EventController.unblock);

// Participants
router.post("/:id/participants", EventController.addParticipant);
router.delete("/:id/participants", EventController.removeParticipant);

module.exports = router;
