const express = require("express");
const mongoose = require("mongoose");
const Interest = require("../Schema/interestSchema");

// Create interest (user expresses interest in event)
async function createInterest(payload) {
  try {
    const interest = new Interest(payload);
    await interest.save();
    return interest;
  } catch (err) {
    console.error("createInterest", err);
    throw err;
  }
}

// Get all interests (filter by event/user/status if needed)
async function getInterests(filter = {}) {
  try {
    return await Interest.find(filter)
      .populate("eventId", "title description startDate")
      .populate("userId", "name email");
  } catch (err) {
    console.error("getInterests", err);
    throw err;
  }
}

// Get single interest by ID
async function getInterestById(id) {
  try {
    return await Interest.findById(id)
      .populate("eventId", "title description startDate")
      .populate("userId", "name email");
  } catch (err) {
    console.error("getInterestById", err);
    throw err;
  }
}

// Update interest (status or payment info)
async function updateInterest(id, updates) {
  try {
    return await Interest.findByIdAndUpdate(id, updates, { new: true });
  } catch (err) {
    console.error("updateInterest", err);
    throw err;
  }
}

// Withdraw interest
async function withdrawInterest(id, reason) {
  try {
    return await Interest.findByIdAndUpdate(
      id,
      { status: "withdrawn", withdrawnAt: Date.now(), withdrawReason: reason },
      { new: true }
    );
  } catch (err) {
    console.error("withdrawInterest", err);
    throw err;
  }
}

module.exports = {
  createInterest,
  getInterests,
  getInterestById,
  updateInterest,
  withdrawInterest,
};
