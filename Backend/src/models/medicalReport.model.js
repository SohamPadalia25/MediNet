import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema({
    diagnosisId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Diagnosis",
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    reportType: {
        type: String,
        enum: ['diagnosis_report', 'lab_report', 'imaging_report'],
        default: 'diagnosis_report'
    },
    content: {
        summary: {
            type: String,
            required: true
        },
        findings: {
            type: String,
            required: true
        },
        recommendations: {
            type: String,
            required: true
        },
        followUp: String,
        additionalNotes: String
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isAIGenerated: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

medicalReportSchema.index({ diagnosisId: 1 });
medicalReportSchema.index({ patientId: 1, createdAt: -1 });

export const MedicalReport = mongoose.model("MedicalReport", medicalReportSchema);
