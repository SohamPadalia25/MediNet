import  asyncHandler  from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Prescription } from "../models/prescription.model.js";

// Create a new prescription
const createPrescription = asyncHandler(async (req, res) => {
  const { patientId, diagnosis, medications, instructions, followUpDate, notes } = req.body;
  const doctorId = req.user._id;

  if (!patientId || !diagnosis || !medications || medications.length === 0) {
    throw new ApiError(400, "Patient ID, diagnosis, and medications are required");
  }

  const prescription = await Prescription.create({
    patientId,
    doctorId,
    diagnosis,
    medications,
    instructions,
    followUpDate,
    notes
  });

  const createdPrescription = await Prescription.findById(prescription._id)
    .populate("patientId", "fullname email")
    .populate("doctorId", "fullname");

  return res.status(201).json(
    new ApiResponse(201, createdPrescription, "Prescription created successfully")
  );
});

// Get all prescriptions for a doctor
const getDoctorPrescriptions = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const { page = 1, limit = 10, status } = req.query;

  const query = { doctorId };
  if (status) query.status = status;

  const prescriptions = await Prescription.find(query)
    .populate("patientId", "fullname email")
    .populate("doctorId", "fullname")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Prescription.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      prescriptions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, "Prescriptions retrieved successfully")
  );
});

// Get all prescriptions for a patient
const getPatientPrescriptions = asyncHandler(async (req, res) => {
  const patientId = req.user._id;
  const { page = 1, limit = 10, status } = req.query;

  const query = { patientId };
  if (status) query.status = status;

  const prescriptions = await Prescription.find(query)
    .populate("patientId", "fullname email")
    .populate("doctorId", "fullname")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Prescription.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      prescriptions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, "Prescriptions retrieved successfully")
  );
});

// Get prescription by ID
const getPrescriptionById = asyncHandler(async (req, res) => {
  const { prescriptionId } = req.params;

  const prescription = await Prescription.findById(prescriptionId)
    .populate("patientId", "fullname email")
    .populate("doctorId", "fullname");

  if (!prescription) {
    throw new ApiError(404, "Prescription not found");
  }

  return res.status(200).json(
    new ApiResponse(200, prescription, "Prescription retrieved successfully")
  );
});

// Update prescription
const updatePrescription = asyncHandler(async (req, res) => {
  const { prescriptionId } = req.params;
  const updateData = req.body;
  const doctorId = req.user._id;

  const prescription = await Prescription.findById(prescriptionId);

  if (!prescription) {
    throw new ApiError(404, "Prescription not found");
  }

  if (prescription.doctorId.toString() !== doctorId.toString()) {
    throw new ApiError(403, "You can only update your own prescriptions");
  }

  const updatedPrescription = await Prescription.findByIdAndUpdate(
    prescriptionId,
    updateData,
    { new: true }
  ).populate("patientId", "fullname email")
   .populate("doctorId", "fullname");

  return res.status(200).json(
    new ApiResponse(200, updatedPrescription, "Prescription updated successfully")
  );
});

// Delete prescription
const deletePrescription = asyncHandler(async (req, res) => {
  const { prescriptionId } = req.params;
  const doctorId = req.user._id;

  const prescription = await Prescription.findById(prescriptionId);

  if (!prescription) {
    throw new ApiError(404, "Prescription not found");
  }

  if (prescription.doctorId.toString() !== doctorId.toString()) {
    throw new ApiError(403, "You can only delete your own prescriptions");
  }

  await Prescription.findByIdAndDelete(prescriptionId);

  return res.status(200).json(
    new ApiResponse(200, {}, "Prescription deleted successfully")
  );
});

export {
  createPrescription,
  getDoctorPrescriptions,
  getPatientPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription
};
