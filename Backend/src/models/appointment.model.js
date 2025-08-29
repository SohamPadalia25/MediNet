import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
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
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  appointmentType: {
    type: String,
    enum: ["consultation", "follow-up", "emergency", "routine-checkup", "specialist"],
    default: "consultation"
  },
  status: {
    type: String,
    enum: ["scheduled", "confirmed", "in-progress", "completed", "cancelled", "no-show"],
    default: "scheduled"
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  symptoms: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true
  },
  duration: {
    type: Number, // in minutes
    default: 30
  },
  location: {
    type: String,
    trim: true,
    default: "Clinic"
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  cancellationReason: {
    type: String,
    trim: true
  }
}, { timestamps: true });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
