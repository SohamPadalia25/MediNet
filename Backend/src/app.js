import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:3000", "http://127.0.0.1:3000"];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import userRouter from "./routes/user.routes.js";
import patientRouter from "./routes/patient.routes.js";
import diagnosisRouter from "./routes/diagnosis.routes.js";

// Route declarations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/diagnoses", diagnosisRouter);

export default app;
