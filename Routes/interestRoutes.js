const express = require("express");
const router = express.Router();
const interestController = require("../Controllers/interestController");

// Express interest in event
router.post("/", interestController.expressInterest);

// Get all interests
router.get("/interests", interestController.listInterests);

// Get single interest
router.get("/interest/:id", interestController.interestDetails);

// Update interest (approve/reject)
router.put("/interest/:id", interestController.updateInterest);

// Withdraw interest
router.post("/interest/withdraw/:id", interestController.withdrawInterest);

// ✅ Get all events the user has shown interest in
router.get("/interested-in/:userId", interestController.getMyInterestedEvents);

module.exports = router;
