import  asyncHandler  from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Appointment } from "../models/appointment.model.js";

// Create a new appointment
const createAppointment = asyncHandler(async (req, res) => {
  const { 
    patientId, 
    appointmentDate, 
    appointmentTime, 
    appointmentType, 
    reason, 
    symptoms, 
    notes, 
    duration, 
    location 
  } = req.body;
  const doctorId = req.user._id;

  if (!patientId || !appointmentDate || !appointmentTime || !reason) {
    throw new ApiError(400, "Patient ID, appointment date, time, and reason are required");
  }

  // Check if the time slot is available
  const existingAppointment = await Appointment.findOne({
    doctorId,
    appointmentDate,
    appointmentTime,
    status: { $in: ["scheduled", "confirmed"] }
  });

  if (existingAppointment) {
    throw new ApiError(400, "This time slot is already booked");
  }

  const appointment = await Appointment.create({
    patientId,
    doctorId,
    appointmentDate,
    appointmentTime,
    appointmentType,
    reason,
    symptoms,
    notes,
    duration,
    location
  });

  const createdAppointment = await Appointment.findById(appointment._id)
    .populate("patientId", "fullname email")
    .populate("doctorId", "fullname");

  return res.status(201).json(
    new ApiResponse(201, createdAppointment, "Appointment created successfully")
  );
});

// Get all appointments for a doctor
const getDoctorAppointments = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const { page = 1, limit = 10, status, date } = req.query;

  const query = { doctorId };
  if (status) query.status = status;
  if (date) query.appointmentDate = new Date(date);

  const appointments = await Appointment.find(query)
    .populate("patientId", "fullname email")
    .populate("doctorId", "fullname")
    .sort({ appointmentDate: 1, appointmentTime: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Appointment.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, "Appointments retrieved successfully")
  );
});

// Get all appointments for a patient
const getPatientAppointments = asyncHandler(async (req, res) => {
  const patientId = req.user._id;
  const { page = 1, limit = 10, status, date } = req.query;

  const query = { patientId };
  if (status) query.status = status;
  if (date) query.appointmentDate = new Date(date);

  const appointments = await Appointment.find(query)
    .populate("patientId", "fullname email")
    .populate("doctorId", "fullname")
    .sort({ appointmentDate: 1, appointmentTime: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Appointment.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, "Appointments retrieved successfully")
  );
});

// Get appointment by ID
const getAppointmentById = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;

  const appointment = await Appointment.findById(appointmentId)
    .populate("patientId", "fullname email")
    .populate("doctorId", "fullname");

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  return res.status(200).json(
    new ApiResponse(200, appointment, "Appointment retrieved successfully")
  );
});

// Update appointment status
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { status, notes, cancellationReason } = req.body;
  const userId = req.user._id;

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  // Check if user is authorized to update this appointment
  if (appointment.doctorId.toString() !== userId.toString() && 
      appointment.patientId.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only update appointments you're involved in");
  }

  const updateData = { status };
  if (notes) updateData.notes = notes;
  if (cancellationReason && status === "cancelled") {
    updateData.cancellationReason = cancellationReason;
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    updateData,
    { new: true }
  ).populate("patientId", "fullname email")
   .populate("doctorId", "fullname");

  return res.status(200).json(
    new ApiResponse(200, updatedAppointment, "Appointment status updated successfully")
  );
});

// Update appointment details
const updateAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const updateData = req.body;
  const doctorId = req.user._id;

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  if (appointment.doctorId.toString() !== doctorId.toString()) {
    throw new ApiError(403, "You can only update your own appointments");
  }

  // If updating time/date, check availability
  if ((updateData.appointmentDate || updateData.appointmentTime) && 
      appointment.status !== "cancelled") {
    const existingAppointment = await Appointment.findOne({
      _id: { $ne: appointmentId },
      doctorId,
      appointmentDate: updateData.appointmentDate || appointment.appointmentDate,
      appointmentTime: updateData.appointmentTime || appointment.appointmentTime,
      status: { $in: ["scheduled", "confirmed"] }
    });

    if (existingAppointment) {
      throw new ApiError(400, "This time slot is already booked");
    }
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    updateData,
    { new: true }
  ).populate("patientId", "fullname email")
   .populate("doctorId", "fullname");

  return res.status(200).json(
    new ApiResponse(200, updatedAppointment, "Appointment updated successfully")
  );
});

// Delete appointment
const deleteAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const userId = req.user._id;

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  if (appointment.doctorId.toString() !== userId.toString() && 
      appointment.patientId.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only delete appointments you're involved in");
  }

  await Appointment.findByIdAndDelete(appointmentId);

  return res.status(200).json(
    new ApiResponse(200, {}, "Appointment deleted successfully")
  );
});

export {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  updateAppointment,
  deleteAppointment
};
