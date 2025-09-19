const express = require("express");
const mongoose = require("mongoose");
const FakeReport = require("../Schema/fakeReportSchema");

// Create a new report
async function createReport(payload) {
  try {
    const report = new FakeReport(payload);
    await report.save();
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
      .populate("actionedBy", "name email");
  } catch (err) {
    console.error("getReports", err);
    throw err;
  }
}

// Get report by ID
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

// Update report 
async function updateReport(id, updates) {
  try {
    return await FakeReport.findByIdAndUpdate(id, updates, { new: true });
  } catch (err) {
    console.error("updateReport", err);
    throw err;
  }
}

module.exports = { 
    createReport, 
    getReports, 
    getReportById, 
    updateReport 
};
