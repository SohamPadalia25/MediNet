import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/auth.middleware.js";
import {
  createReport,
  getDoctorReports,
  getPatientReports,
  getReportById,
  updateReport,
  updateReportStatus,
  deleteReport,
  getReportsByType
} from "../controllers/report.controller.js";

const router = Router();

// Apply JWT verification to all routes
router.use(verifyJWT);

// Routes for doctors
router.post("/", requireRole(["doctor"]), createReport);
router.get("/doctor", requireRole(["doctor"]), getDoctorReports);
router.put("/:reportId", requireRole(["doctor"]), updateReport);
router.patch("/:reportId/status", requireRole(["doctor"]), updateReportStatus);
router.delete("/:reportId", requireRole(["doctor"]), deleteReport);

// Routes for patients
router.get("/patient", requireRole(["patient"]), getPatientReports);

// Common routes
router.get("/:reportId", getReportById);
router.get("/type/:reportType", getReportsByType);

export default router;
