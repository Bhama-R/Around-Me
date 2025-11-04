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
    reason: {
      type:String,
      default: null
    },
    blockreason: {
      type: String,
      default: null
    },
    actionedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
     isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FakeReport", fakeReportSchema);
