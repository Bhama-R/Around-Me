const fakeReportServices = require("../Services/fakeReportService");

// Create report
async function createReport(req, res) {
  try {
    const payload = {
      eventId: req.body.eventId,
      reportedBy: req.body.reportedBy, // ideally req.user.id from auth
      reason: req.body.reason,
      actionedBy: req.body.actionedBy
    };
    const report = await fakeReportServices.createReport(payload);
    return res.status(201).json({ msg: "Fake event reported", report });
  } catch (err) {
    return res.status(500).json({ msg: "Unable to submit report", error: err.message });
  }
}

// List all reports
async function getReports(req, res) {
  try {
    const filter = {};
    if (req.query.eventId) filter.eventId = req.query.eventId;
    if (req.query.reportedBy) filter.reportedBy = req.query.reportedBy;

    const reports = await fakeReportServices.getReports(filter);
    return res.json({ reports });
  } catch (err) {
    return res.status(500).json({ msg: "Unable to fetch reports", error: err.message });
  }
}

// Get single report
async function getReportById(req, res) {
  try {
    const id = req.params.id;
    const report = await fakeReportServices.getReportById(id);
    if (!report) return res.status(404).json({ msg: "Report not found" });
    return res.json({ report });
  } catch (err) {
    return res.status(500).json({ msg: "Error fetching report", error: err.message });
  }
}

// Update report (for admins)
async function updateReport(req, res) {
  try {
    const id = req.params.id;
    const updates = {
      actionedBy: req.body.actionedBy, // admin id
      ...req.body,
    };
    const report = await fakeReportServices.updateReport(id, updates);
    if (!report) return res.status(404).json({ msg: "Report not found" });
    return res.json({ msg: "Report updated", report });
  } catch (err) {
    return res.status(500).json({ msg: "Error updating report", error: err.message });
  }
}

module.exports = { 
    createReport, 
    getReports, 
    getReportById, 
    updateReport 
};

