import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/auth.middleware.js";
import {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  updateAppointment,
  deleteAppointment
} from "../controllers/appointment.controller.js";

const router = Router();

// Apply JWT verification to all routes
router.use(verifyJWT);

// Routes for doctors
router.post("/", requireRole(["doctor"]), createAppointment);
router.get("/doctor", requireRole(["doctor"]), getDoctorAppointments);
router.put("/:appointmentId", requireRole(["doctor"]), updateAppointment);
router.delete("/:appointmentId", requireRole(["doctor"]), deleteAppointment);

// Routes for patients
router.get("/patient", requireRole(["patient"]), getPatientAppointments);

// Common routes
router.get("/:appointmentId", getAppointmentById);
router.patch("/:appointmentId/status", updateAppointmentStatus);

export default router;
