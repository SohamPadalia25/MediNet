import mongoose from "mongoose";

const diagnosisSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  diagnosisType: { type: String, enum: ['image_analysis', 'symptom_analysis', 'combined'], required: true },
  inputData: {
    symptoms: [String],
    images: [{
      url: String,
      type: String,
      analysisResult: mongoose.Schema.Types.Mixed
    }]
  },
  results: {
    primaryDiagnosis: String,
    confidenceScore: Number,
    differentialDiagnoses: [{
      condition: String,
      probability: Number
    }],
    recommendations: [String]
  },
  status: { type: String, enum: ['pending', 'reviewed', 'confirmed'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewedAt: Date,
}, { timestamps: true });

export const Diagnosis = mongoose.model("Diagnosis", diagnosisSchema);
