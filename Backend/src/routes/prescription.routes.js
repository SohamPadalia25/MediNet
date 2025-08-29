import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/auth.middleware.js";
import {
  createPrescription,
  getDoctorPrescriptions,
  getPatientPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription
} from "../controllers/prescription.controller.js";

const router = Router();

// Apply JWT verification to all routes
router.use(verifyJWT);

// Routes for doctors
router.post("/", requireRole(["doctor"]), createPrescription);
router.get("/doctor", requireRole(["doctor"]), getDoctorPrescriptions);
router.put("/:prescriptionId", requireRole(["doctor"]), updatePrescription);
router.delete("/:prescriptionId", requireRole(["doctor"]), deletePrescription);

// Routes for patients
router.get("/patient", requireRole(["patient"]), getPatientPrescriptions);

// Common routes
router.get("/:prescriptionId", getPrescriptionById);

export default router;
