const mongoose = require("mongoose");

const fakeReportSchema = new mongoose.Schema(
  {
    eventId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Event" 
    },
    reportedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    reason: String,
    actionedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FakeReport", fakeReportSchema);
