import asyncHandler  from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Report } from "../models/report.model.js";

// Create a new report
const createReport = asyncHandler(async (req, res) => {
  const { 
    patientId, 
    reportType, 
    title, 
    description, 
    findings, 
    testResults, 
    diagnosis, 
    recommendations, 
    priority 
  } = req.body;
  const doctorId = req.user._id;

  if (!patientId || !reportType || !title || !description || !findings) {
    throw new ApiError(400, "Patient ID, report type, title, description, and findings are required");
  }

  const report = await Report.create({
    patientId,
    doctorId,
    reportType,
    title,
    description,
    findings,
    testResults,
    diagnosis,
    recommendations,
    priority
  });

  const createdReport = await Report.findById(report._id)
    .populate("patientId", "fullname email")
    .populate("doctorId", "fullname");

  return res.status(201).json(
    new ApiResponse(201, createdReport, "Report created successfully")
  );
});

// Get all reports for a doctor
const getDoctorReports = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const { page = 1, limit = 10, status, reportType, priority } = req.query;

  const query = { doctorId };
  if (status) query.status = status;
  if (reportType) query.reportType = reportType;
  if (priority) query.priority = priority;

  const reports = await Report.find(query)
    .populate("patientId", "fullname email")
    .populate("doctorId", "fullname")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Report.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      reports,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, "Reports retrieved successfully")
  );
});

// Get all reports for a patient
const getPatientReports = asyncHandler(async (req, res) => {
  const patientId = req.user._id;
  const { page = 1, limit = 10, status, reportType } = req.query;

  const query = { patientId };
  if (status) query.status = status;
  if (reportType) query.reportType = reportType;

  const reports = await Report.find(query)
    .populate("patientId", "fullname email")
    .populate("doctorId", "fullname")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Report.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      reports,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, "Reports retrieved successfully")
  );
});

// Get report by ID
const getReportById = asyncHandler(async (req, res) => {
  const { reportId } = req.params;

  const report = await Report.findById(reportId)
    .populate("patientId", "fullname email")
    .populate("doctorId", "fullname");

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  return res.status(200).json(
    new ApiResponse(200, report, "Report retrieved successfully")
  );
});

// Update report
const updateReport = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const updateData = req.body;
  const doctorId = req.user._id;

  const report = await Report.findById(reportId);

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  if (report.doctorId.toString() !== doctorId.toString()) {
    throw new ApiError(403, "You can only update your own reports");
  }

  const updatedReport = await Report.findByIdAndUpdate(
    reportId,
    updateData,
    { new: true }
  ).populate("patientId", "fullname email")
   .populate("doctorId", "fullname");

  return res.status(200).json(
    new ApiResponse(200, updatedReport, "Report updated successfully")
  );
});

// Update report status
const updateReportStatus = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { status, reviewedBy } = req.body;
  const userId = req.user._id;

  const report = await Report.findById(reportId);

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  // Only doctors can update report status
  if (req.user.role !== "doctor") {
    throw new ApiError(403, "Only doctors can update report status");
  }

  const updateData = { status };
  if (status === "reviewed") {
    updateData.reviewedBy = userId;
    updateData.reviewedAt = new Date();
  }

  const updatedReport = await Report.findByIdAndUpdate(
    reportId,
    updateData,
    { new: true }
  ).populate("patientId", "fullname email")
   .populate("doctorId", "fullname")
   .populate("reviewedBy", "fullname");

  return res.status(200).json(
    new ApiResponse(200, updatedReport, "Report status updated successfully")
  );
});

// Delete report
const deleteReport = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const doctorId = req.user._id;

  const report = await Report.findById(reportId);

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  if (report.doctorId.toString() !== doctorId.toString()) {
    throw new ApiError(403, "You can only delete your own reports");
  }

  await Report.findByIdAndDelete(reportId);

  return res.status(200).json(
    new ApiResponse(200, {}, "Report deleted successfully")
  );
});

// Get reports by type
const getReportsByType = asyncHandler(async (req, res) => {
  const { reportType } = req.params;
  const { page = 1, limit = 10, status, priority } = req.query;
  const userId = req.user._id;

  const query = { reportType };
  if (status) query.status = status;
  if (priority) query.priority = priority;

  // Filter by user role
  if (req.user.role === "doctor") {
    query.doctorId = userId;
  } else if (req.user.role === "patient") {
    query.patientId = userId;
  }

  const reports = await Report.find(query)
    .populate("patientId", "fullname email")
    .populate("doctorId", "fullname")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Report.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      reports,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, "Reports retrieved successfully")
  );
});

export {
  createReport,
  getDoctorReports,
  getPatientReports,
  getReportById,
  updateReport,
  updateReportStatus,
  deleteReport,
  getReportsByType
};
