const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["member", "event_manager", "admin"],
    default: "member",
  },
  status: {
    type: String,
    enum: ["active", "blocked"],
    default: "active",
  },
  preferredCategories: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  ],
  gender: {
    type: String,
    enum: ["male", "female", "trans", "other"],
  },
  dob: {
    type: Date,
    validate: {
      validator: function (value) {
        return !isNaN(Date.parse(value));
      },
      message: "Invalid date format for 'dob'",
    },
  },
  address: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  cookieKey: {
    type: String,
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
