import { Router } from "express";
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient
} from "../controllers/patient.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
  .post(createPatient)
  .get(getPatients);

router.route("/:patientId")
  .get(getPatientById)
  .patch(updatePatient)
  .delete(deletePatient);

export default router;
