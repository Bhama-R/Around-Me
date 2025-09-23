const express = require("express");
const router = express.Router();
const interestController = require("../Controllers/interestController");

// Express interest in event
router.post("/", interestController.expressInterest);

// Get all interests (filter by ?eventId=&userId=&status=)
router.get("/interests", interestController.listInterests);

// Get single interest
router.get("/interest/:id", interestController.interestDetails);

// Update interest (approve/reject/update payment info)
router.put("/interest/:id", interestController.updateInterest);

// Withdraw interest
router.post("/interest/withdraw/:id", interestController.withdrawInterest);

module.exports = router;
