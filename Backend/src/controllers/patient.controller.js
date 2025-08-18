import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Patient } from '../models/patient.model.js';
import mongoose from 'mongoose';

const createPatient = asyncHandler(async (req, res) => {
    const { personalInfo, medicalHistory, allergies, medications } = req.body;

    if (!personalInfo || !personalInfo.fullName || !personalInfo.dateOfBirth || !personalInfo.gender) {
        throw new ApiError(400, "Personal information is required");
    }

    const patient = await Patient.create({
        userId: req.user._id,
        personalInfo,
        medicalHistory: medicalHistory || [],
        allergies: allergies || [],
        medications: medications || []
    });

    return res.status(201).json(
        new ApiResponse(201, patient, "Patient created successfully")
    );
});

const getPatients = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    
    const query = { userId: req.user._id };
    
    if (search) {
        query.$text = { $search: search };
    }

    const patients = await Patient.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const total = await Patient.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            patients,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        }, "Patients fetched successfully")
    );
});

const getPatientById = asyncHandler(async (req, res) => {
    const { patientId } = req.params;

    if (!mongoose.isValidObjectId(patientId)) {
        throw new ApiError(400, "Invalid patient ID");
    }

    const patient = await Patient.findOne({
        _id: patientId,
        userId: req.user._id
    });

    if (!patient) {
        throw new ApiError(404, "Patient not found");
    }

    return res.status(200).json(
        new ApiResponse(200, patient, "Patient fetched successfully")
    );
});

const updatePatient = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const updates = req.body;

    if (!mongoose.isValidObjectId(patientId)) {
        throw new ApiError(400, "Invalid patient ID");
    }

    const patient = await Patient.findOneAndUpdate(
        { _id: patientId, userId: req.user._id },
        { $set: updates },
        { new: true, runValidators: true }
    );

    if (!patient) {
        throw new ApiError(404, "Patient not found");
    }

    return res.status(200).json(
        new ApiResponse(200, patient, "Patient updated successfully")
    );
});

const deletePatient = asyncHandler(async (req, res) => {
    const { patientId } = req.params;

    if (!mongoose.isValidObjectId(patientId)) {
        throw new ApiError(400, "Invalid patient ID");
    }

    const patient = await Patient.findOneAndDelete({
        _id: patientId,
        userId: req.user._id
    });

    if (!patient) {
        throw new ApiError(404, "Patient not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Patient deleted successfully")
    );
});

export {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient
};
