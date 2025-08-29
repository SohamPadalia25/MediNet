import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
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
  reportType: {
    type: String,
    enum: ["lab-report", "imaging-report", "diagnostic-report", "progress-report", "discharge-summary"],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  findings: {
    type: String,
    required: true,
    trim: true
  },
  testResults: [{
    testName: {
      type: String,
      required: true,
      trim: true
    },
    result: {
      type: String,
      required: true,
      trim: true
    },
    normalRange: {
      type: String,
      trim: true
    },
    unit: {
      type: String,
      trim: true
    },
    isAbnormal: {
      type: Boolean,
      default: false
    }
  }],
  diagnosis: {
    type: String,
    trim: true
  },
  recommendations: {
    type: String,
    trim: true
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String
  }],
  status: {
    type: String,
    enum: ["draft", "completed", "reviewed", "archived"],
    default: "draft"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium"
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  reviewedAt: {
    type: Date
  }
}, { timestamps: true });

export const Report = mongoose.model("Report", reportSchema);
