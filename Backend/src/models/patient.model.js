import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  personalInfo: {
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    phone: String,
    address: String,
    emergencyContact: { name: String, phone: String, relationship: String }
  },
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    status: { type: String, enum: ["active", "resolved"] },
    notes: String
  }],
  allergies: [String],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date
  }],
  vitalSigns: [{
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number,
    recordedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const Patient = mongoose.model("Patient", patientSchema);
