const express = require("express");
const router = express.Router();
const fakeReportController = require("../Controllers/fakeReportController");

// Create report
router.post("/report", fakeReportController.createReport);

// Get all reports
router.get("/reports", fakeReportController.getReports);

// Get single report by ID
router.get("/report/:id", fakeReportController.getReportById);

// Update report
router.put("/report/:id", fakeReportController.updateReport);

router.put("/report/event/:eventId", fakeReportController.updateByEventId);



module.exports = router;
