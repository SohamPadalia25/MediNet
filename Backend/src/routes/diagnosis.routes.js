import { Router } from "express";
import {
  createSymptomAnalysis,
  createImageAnalysis,
  getDiagnoses,
  getDiagnosisById,
  updateDiagnosisStatus
} from "../controllers/diagnosis.controller.js";
import { verifyJWT, requireRole } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/symptom-analysis", requireRole(['doctor']), createSymptomAnalysis);

//router.post("/image-analysis", requireRole(['doctor']), upload.single([{ name: "medicalImage", maxCount: 1 }]), createImageAnalysis);

// For single file "medicalImage"
router.post(
  "/image-analysis",
  verifyJWT,
  requireRole(['doctor']), // or adjust if not using role middleware
  upload.single("medicalImage"), // <---- Accept one file under field medicalImage
  createImageAnalysis
);

router.get("/", requireRole(['doctor']), getDiagnoses);

router.get("/:diagnosisId", requireRole(['doctor']), getDiagnosisById);

router.patch("/:diagnosisId/status", requireRole(['doctor']), updateDiagnosisStatus);
//import { Router } from "express";
import { 
    analyzeSymptoms1,
    analyzeChestXray,
    createComprehensiveDiagnosis,
    checkMLServicesHealth
} from "../controllers/diagnosis.controller.js";
//import { upload } from "../middlewares/multer.middleware.js";
//import { verifyJWT } from "../middlewares/auth.middleware.js";



// Health check for ML services
router.get("/health", checkMLServicesHealth);

// Symptom analysis
router.post(
    "/analyze-symptoms",
    verifyJWT,
    analyzeSymptoms1
);

// Chest X-ray analysis
router.post(
    "/analyze-chest-xray",
    verifyJWT,
    upload.single("chestXray"),
    analyzeChestXray
);

// Comprehensive diagnosis (symptoms + image)
router.post(
    "/comprehensive-diagnosis",
    verifyJWT,
    upload.single("medicalImage"),
    createComprehensiveDiagnosis
);

export default router;


