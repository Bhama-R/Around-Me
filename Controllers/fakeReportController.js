const fakeReportService = require("../Services/fakeReportService");
const Event = require("../Schema/eventSchema");

// Create or update report
async function createReport(req, res) {
  try {
    const payload = {
      eventId: req.body.eventId,
      reportedBy: req.body.reportedBy || null,
      reason: req.body.reason || null,
      blockreason: req.body.blockreason || null,
      actionedBy: req.body.actionedBy || null,
    };

    const report = await fakeReportService.createReport(payload);
    return res.status(201).json({ msg: "Report saved successfully", report });
  } catch (err) {
    console.error("createReport Error:", err);
    return res.status(500).json({ msg: "Unable to save report", error: err.message });
  }
}

// Get all reports
async function getReports(req, res) {
  try {
    const filter = {};
    if (req.query.eventId) filter.eventId = req.query.eventId;
    if (req.query.reportedBy) filter.reportedBy = req.query.reportedBy;

    const reports = await fakeReportService.getReports(filter);
    return res.status(200).json({ reports });
  } catch (err) {
    console.error("getReports Error:", err);
    return res.status(500).json({ msg: "Unable to fetch reports", error: err.message });
  }
}

// Get single report
async function getReportById(req, res) {
  try {
    const report = await fakeReportService.getReportById(req.params.id);
    if (!report) return res.status(404).json({ msg: "Report not found" });
    return res.status(200).json({ report });
  } catch (err) {
    console.error("getReportById Error:", err);
    return res.status(500).json({ msg: "Error fetching report", error: err.message });
  }
}

// Update by MongoDB _id
async function updateReport(req, res) {
  try {
    const updates = {
      ...req.body,
      actionedBy: req.body.actionedBy || null,
    };
    const report = await fakeReportService.updateReport(req.params.id, updates);
    if (!report) return res.status(404).json({ msg: "Report not found" });
    return res.status(200).json({ msg: "Report updated", report });
  } catch (err) {
    console.error("updateReport Error:", err);
    return res.status(500).json({ msg: "Error updating report", error: err.message });
  }
}

// Update or create by eventId (admin block/unblock)
async function updateByEventId(req, res) {
  try {
    const { eventId } = req.params;
    const { blockreason, actionedBy } = req.body;

    const report = await fakeReportService.updateByEventId(eventId, {
      blockreason,
      actionedBy,
    });

    res.status(200).json({ message: "Event updated successfully", report });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReport,
  updateByEventId,
};
