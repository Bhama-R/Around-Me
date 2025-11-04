const mongoose = require("mongoose");
const FakeReport = require("../Schema/fakeReportSchema");
const Event = require("../Schema/eventSchema");

// Create a new report (for user or admin)
async function createReport(payload) {
  try {
    const { eventId, reportedBy, reason, blockreason, actionedBy } = payload;

    // If a report for this event already exists, update it instead of creating duplicate
    let report = await FakeReport.findOne({ eventId });

    if (report) {
      report.reportedBy = reportedBy || report.reportedBy;
      report.reason = reason || report.reason;
      report.blockreason = blockreason || report.blockreason;
      report.actionedBy = actionedBy || report.actionedBy;
      await report.save();
    } else {
      report = await FakeReport.create(payload);
    }

    return report;
  } catch (err) {
    console.error("createReport", err);
    throw err;
  }
}

// Get all reports
async function getReports(filter = {}) {
  try {
    return await FakeReport.find(filter)
      .populate("eventId", "title description startDate")
      .populate("reportedBy", "name email")
      .populate("actionedBy", "name email")
      .sort({ createdAt: -1 });
  } catch (err) {
    console.error("getReports", err);
    throw err;
  }
}

// Get single report by ID
async function getReportById(id) {
  try {
    return await FakeReport.findById(id)
      .populate("eventId", "title description startDate")
      .populate("reportedBy", "name email")
      .populate("actionedBy", "name email");
  } catch (err) {
    console.error("getReportById", err);
    throw err;
  }
}

async function updateByEventId(eventId, data) {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new Error("Invalid eventId");
  }

  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  let report = await FakeReport.findOne({ eventId });

  // BLOCK LOGIC
  if (data.blockreason) {
    if (report?.isBlocked) throw new Error("Event already blocked");

    if (report) {
      report.blockreason = data.blockreason;
      report.actionedBy = data.actionedBy;
      report.isBlocked = true;
      await report.save();
    } else {
      report = await FakeReport.create({
        eventId,
        blockreason: data.blockreason,
        actionedBy: data.actionedBy,
        isBlocked: true,
      });
    }

    await Event.findByIdAndUpdate(eventId, { status: "blocked" });
    return report;
  }

  // UNBLOCK LOGIC
  if (!report) {
    // If report doesn't exist, still update event to active
    await Event.findByIdAndUpdate(eventId, { status: "active" });
    return { message: "Event was not reported but is now active." };
  }

  report.blockreason = null;
  report.actionedBy = null;
  report.isBlocked = false;
  await report.save();

  await Event.findByIdAndUpdate(eventId, { status: "active" });
  return report;
}



module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReport,
  updateByEventId,
};
