import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Diagnosis } from '../models/diagnosis.model.js';
import { Patient } from '../models/patient.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { analyzeSymptoms } from '../utils/aiAnalysis.js';
import { analyzeImage } from '../utils/imageAnalysis.js';
import mongoose from 'mongoose';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Existing symptom analysis
export const analyzeSymptoms = asyncHandler(async (req, res) => {
    const { symptoms } = req.body;
    
    if (!symptoms || symptoms.length === 0) {
        throw new ApiError(400, "Symptoms are required");
    }
    
    try {
        const response = await axios.post('http://localhost:5000/predict', { 
            symptoms 
        }, {
            timeout: 10000
        });
        
        return res.status(200).json(
            new ApiResponse(200, response.data, "Symptom analysis completed successfully")
        );
    } catch (error) {
        console.error('Symptom analysis error:', error.message);
        throw new ApiError(500, "Symptom analysis service unavailable");
    }
});

// NEW: Chest X-ray analysis
export const analyzeChestXray = asyncHandler(async (req, res) => {
    try {
        // Validate image upload
        if (!req.file) {
            throw new ApiError(400, "Chest X-ray image is required");
        }
        
        // Validate file type
        const allowedMimeTypes = [
            'image/jpeg', 
            'image/jpg', 
            'image/png', 
            'image/bmp', 
            'image/tiff'
        ];
        
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            throw new ApiError(400, "Invalid file type. Upload JPG, PNG, or BMP image");
        }
        
        // Check file size (max 10MB)
        if (req.file.size > 10 * 1024 * 1024) {
            throw new ApiError(400, "File too large. Maximum size is 10MB");
        }
        
        console.log(`Analyzing chest X-ray: ${req.file.filename} (${req.file.size} bytes)`);
        
        // Prepare form data for ML service
        const formData = new FormData();
        formData.append('image', fs.createReadStream(req.file.path));
        
        // Call pneumonia detection API
        const response = await axios.post(
            'http://localhost:5001/predict', 
            formData, 
            {
                headers: {
                    ...formData.getHeaders(),
                },
                timeout: 30000, // 30 seconds
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );
        
        // Clean up uploaded file
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        // TODO: Save analysis to database
        // const diagnosis = new Diagnosis({
        //     userId: req.user._id,
        //     type: 'chest_xray',
        //     result: response.data,
        //     createdAt: new Date()
        // });
        // await diagnosis.save();
        
        return res.status(200).json(
            new ApiResponse(
                200, 
                response.data, 
                "Chest X-ray analysis completed successfully"
            )
        );
        
    } catch (error) {
        // Clean up file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        console.error('Chest X-ray analysis error:', error);
        
        // Handle specific errors
        if (error.code === 'ECONNREFUSED') {
            throw new ApiError(503, "Image analysis service is currently unavailable");
        }
        
        if (error.response?.status === 400) {
            throw new ApiError(400, error.response.data.error || "Invalid image format");
        }
        
        throw new ApiError(500, `Image analysis failed: ${error.message}`);
    }
});

// Combined analysis (symptoms + chest X-ray)
export const createComprehensiveDiagnosis = asyncHandler(async (req, res) => {
    try {
        const { symptoms, patientId, notes } = req.body;
        const results = {
            patientId: patientId || null,
            timestamp: new Date().toISOString(),
            analyses: [],
            notes: notes || null
        };
        
        // Analyze symptoms if provided
        if (symptoms && symptoms.length > 0) {
            console.log('Analyzing symptoms:', symptoms);
            try {
                const symptomResponse = await axios.post(
                    'http://localhost:5000/predict', 
                    { symptoms },
                    { timeout: 10000 }
                );
                
                results.analyses.push({
                    type: 'symptom_analysis',
                    status: 'completed',
                    result: symptomResponse.data
                });
            } catch (error) {
                console.error('Symptom analysis failed:', error.message);
                results.analyses.push({
                    type: 'symptom_analysis',
                    status: 'failed',
                    error: 'Symptom analysis service unavailable'
                });
            }
        }
        
        // Analyze chest X-ray if provided
        if (req.file) {
            console.log('Analyzing chest X-ray:', req.file.filename);
            try {
                const formData = new FormData();
                formData.append('image', fs.createReadStream(req.file.path));
                
                const imageResponse = await axios.post(
                    'http://localhost:5001/predict',
                    formData,
                    {
                        headers: { ...formData.getHeaders() },
                        timeout: 30000
                    }
                );
                
                results.analyses.push({
                    type: 'chest_xray_analysis',
                    status: 'completed',
                    result: imageResponse.data
                });
                
                // Clean up file
                fs.unlinkSync(req.file.path);
                
            } catch (error) {
                console.error('Image analysis failed:', error.message);
                results.analyses.push({
                    type: 'chest_xray_analysis',
                    status: 'failed',
                    error: 'Image analysis service unavailable'
                });
                
                // Clean up file on error
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            }
        }
        
        // Ensure at least one analysis was attempted
        if (results.analyses.length === 0) {
            throw new ApiError(400, "No analysis data provided. Include symptoms or chest X-ray image");
        }
        
        return res.status(200).json(
            new ApiResponse(200, results, "Comprehensive diagnosis completed")
        );
        
    } catch (error) {
        // Clean up file if exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        throw new ApiError(500, `Comprehensive diagnosis failed: ${error.message}`);
    }
});

// Health check for all ML services
export const checkMLServicesHealth = asyncHandler(async (req, res) => {
    const services = {
        symptom_analysis: { url: 'http://localhost:5000/health', status: 'unknown' },
        pneumonia_detection: { url: 'http://localhost:5001/health', status: 'unknown' }
    };
    
    // Check each service
    for (const [serviceName, service] of Object.entries(services)) {
        try {
            await axios.get(service.url, { timeout: 5000 });
            services[serviceName].status = 'healthy';
        } catch (error) {
            services[serviceName].status = 'unhealthy';
            services[serviceName].error = error.message;
        }
    }
    
    return res.status(200).json(
        new ApiResponse(200, services, "ML services health check completed")
    );
});

const createSymptomAnalysis = asyncHandler(async (req, res) => {
    const { patientId, symptoms } = req.body;

    if (!patientId || !symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
        throw new ApiError(400, "Patient ID and symptoms are required");
    }

    // Verify patient exists and belongs to user
    const patient = await Patient.findOne({
        _id: patientId,
        userId: req.user._id
    });

    if (!patient) {
        throw new ApiError(404, "Patient not found");
    }

    // Analyze symptoms using AI
    const analysisResults = await analyzeSymptoms(symptoms);

    const diagnosis = await Diagnosis.create({
        patientId,
        doctorId: req.user._id,
        diagnosisType: 'symptom_analysis',
        inputData: { symptoms },
        results: {
            primaryDiagnosis: analysisResults[0]?.condition || "Unknown",
            confidenceScore: analysisResults?.probability || 0,
            differentialDiagnoses: analysisResults.slice(1, 4),
            recommendations: generateRecommendations(analysisResults)
        }
    });

    return res.status(201).json(
        new ApiResponse(201, diagnosis, "Symptom analysis completed successfully")
    );
});

export const createImageAnalysis = asyncHandler(async (req, res) => {
  // Check for file existence
  if (!req.file) {
    throw new ApiError(400, "Medical image is required");
  }

  // Optionally: Validate image mimetype and size
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(req.file.mimetype)) {
    throw new ApiError(400, "Invalid file type. Only JPEG/PNG allowed.");
  }

  // Here you would pass req.file.path to your ML image classifier
  // For demonstration, mock a result:
  const mockResults = [
    { condition: "Normal", probability: 73.2 },
    { condition: "Pneumonia", probability: 15.4 },
    { condition: "COVID-19", probability: 7.1 },
    { condition: "Tuberculosis", probability: 4.3 }
  ];

  // Optionally upload to Cloudinary or clean up local file after processing

  return res.status(201).json(
    new ApiResponse(201, {
      file: req.file,
      results: mockResults,
      message: "Image diagnosis completed successfully"
    })
  );
});

const getDiagnoses = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, patientId, status } = req.query;

    const query = { doctorId: req.user._id };
    
    if (patientId) {
        query.patientId = patientId;
    }
    
    if (status) {
        query.status = status;
    }

    const diagnoses = await Diagnosis.find(query)
        .populate('patientId', 'personalInfo')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const total = await Diagnosis.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            diagnoses,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        }, "Diagnoses fetched successfully")
    );
});

const getDiagnosisById = asyncHandler(async (req, res) => {
    const { diagnosisId } = req.params;

    if (!mongoose.isValidObjectId(diagnosisId)) {
        throw new ApiError(400, "Invalid diagnosis ID");
    }

    const diagnosis = await Diagnosis.findOne({
        _id: diagnosisId,
        doctorId: req.user._id
    }).populate('patientId', 'personalInfo');

    if (!diagnosis) {
        throw new ApiError(404, "Diagnosis not found");
    }

    return res.status(200).json(
        new ApiResponse(200, diagnosis, "Diagnosis fetched successfully")
    );
});

const updateDiagnosisStatus = asyncHandler(async (req, res) => {
    const { diagnosisId } = req.params;
    const { status } = req.body;

    if (!['pending', 'reviewed', 'confirmed'].includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    const diagnosis = await Diagnosis.findOneAndUpdate(
        { _id: diagnosisId, doctorId: req.user._id },
        { 
            status,
            reviewedBy: req.user._id,
            reviewedAt: new Date()
        },
        { new: true }
    );

    if (!diagnosis) {
        throw new ApiError(404, "Diagnosis not found");
    }

    return res.status(200).json(
        new ApiResponse(200, diagnosis, "Diagnosis status updated successfully")
    );
});

// Helper function to generate recommendations
const generateRecommendations = (primaryResult) => {
    if (!primaryResult) return ["Consult with a healthcare professional"];
    
    const condition = primaryResult.condition?.toLowerCase();
    
    const recommendationsMap = {
        'pneumonia': [
            "Consult a pulmonologist immediately",
            "Get chest X-ray and blood tests",
            "Complete bed rest recommended",
            "Follow up in 7 days"
        ],
        'covid-19': [
            "Isolate immediately",
            "Monitor oxygen levels",
            "Contact healthcare provider",
            "Follow CDC guidelines"
        ],
        'common cold': [
            "Rest and hydration",
            "Over-the-counter medications for symptoms",
            "Follow up if symptoms worsen",
            "Return to normal activities when fever-free"
        ]
    };

    return recommendationsMap[condition] || [
        "Consult with a healthcare professional",
        "Follow up as needed",
        "Monitor symptoms closely"
    ];
};

export {
    createSymptomAnalysis,
    
    getDiagnoses,
    getDiagnosisById,
    updateDiagnosisStatus
};
