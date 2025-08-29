import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  diagnosis: {
    type: String,
    required: true,
    trim: true
  },
  medications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    dosage: {
      type: String,
      required: true,
      trim: true
    },
    frequency: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: String,
      required: true,
      trim: true
    },
    instructions: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  instructions: {
    type: String,
    trim: true
  },
  followUpDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ["active", "completed", "cancelled"],
    default: "active"
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

export const Prescription = mongoose.model("Prescription", prescriptionSchema);
