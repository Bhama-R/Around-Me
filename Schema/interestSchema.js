const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema(
  {
    eventId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Event" },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" },
    status: { 
        type: String, 
        enum: [
            "pending", 
            "approved", 
            "rejected", 
            "withdrawn"
        ], 
        default: "pending" 
    },
    transaction: {
      amount: Number,
      paymentStatus: { 
        type: String, 
        enum: [
            "unpaid", 
            "paid", 
            "failed", 
            "refunded"
        ], 
        default: "unpaid" 
    },
      paymentMode: { 
        type: String, 
        enum: [
            "upi", 
            "card", 
            "netbanking", 
            "cash"] 
        },
      transactionId: String,
      paymentDate: Date,
      refundDate: Date,
    },
    withdrawnAt: Date,
    withdrawReason: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interest", interestSchema);
