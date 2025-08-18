import { ApiError } from './ApiError.js';

// Disease-symptom mapping for basic analysis
const diseaseSymptoms = {
    'Common Cold': {
        symptoms: ['fever', 'cough', 'headache', 'fatigue', 'runny nose'],
        severity: 'mild'
    },
    'Pneumonia': {
        symptoms: ['fever', 'cough', 'chest pain', 'shortness of breath', 'fatigue'],
        severity: 'severe'
    },
    'COVID-19': {
        symptoms: ['fever', 'cough', 'shortness of breath', 'fatigue', 'loss of taste', 'loss of smell'],
        severity: 'moderate'
    },
    'Migraine': {
        symptoms: ['headache', 'nausea', 'dizziness', 'sensitivity to light'],
        severity: 'moderate'
    },
    'Gastroenteritis': {
        symptoms: ['nausea', 'abdominal pain', 'fatigue', 'vomiting', 'diarrhea'],
        severity: 'mild'
    },
    'Arthritis': {
        symptoms: ['joint pain', 'muscle pain', 'fatigue', 'stiffness'],
        severity: 'chronic'
    },
    'Hypertension': {
        symptoms: ['headache', 'dizziness', 'fatigue', 'chest pain'],
        severity: 'serious'
    },
    'Diabetes': {
        symptoms: ['fatigue', 'excessive thirst', 'frequent urination', 'blurred vision'],
        severity: 'serious'
    }
};

export const analyzeSymptoms = async (symptoms) => {
    try {
        if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
            throw new ApiError(400, "Valid symptoms array is required");
        }

        // Convert symptoms to lowercase for matching
        const processedSymptoms = symptoms.map(symptom => 
            symptom.toLowerCase().trim()
        );

        const results = [];

        // Calculate match scores for each disease
        for (const [disease, diseaseData] of Object.entries(diseaseSymptoms)) {
            let matchCount = 0;
            const matchedSymptoms = [];

            diseaseData.symptoms.forEach(diseaseSymptom => {
                const isMatch = processedSymptoms.some(symptom => 
                    symptom.includes(diseaseSymptom) || diseaseSymptom.includes(symptom)
                );
                if (isMatch) {
                    matchCount++;
                    matchedSymptoms.push(diseaseSymptom);
                }
            });

            if (matchCount > 0) {
                const probability = Math.min((matchCount / diseaseData.symptoms.length) * 100, 95);
                
                results.push({
                    condition: disease,
                    probability: Math.round(probability * 100) / 100,
                    matchedSymptoms,
                    severity: diseaseData.severity
                });
            }
        }

        // Sort by probability (highest first)
        results.sort((a, b) => b.probability - a.probability);

        // Add confidence adjustment based on number of symptoms
        results.forEach(result => {
            if (processedSymptoms.length < 3) {
                result.probability *= 0.8; // Reduce confidence for few symptoms
            } else if (processedSymptoms.length > 6) {
                result.probability *= 0.9; // Slightly reduce for too many symptoms
            }
            result.probability = Math.round(result.probability * 100) / 100;
        });

        return results.length > 0 ? results : [{
            condition: "Unspecified condition",
            probability: 50,
            matchedSymptoms: [],
            severity: 'unknown'
        }];

    } catch (error) {
        console.error('Error in symptom analysis:', error);
        throw new ApiError(500, "Failed to analyze symptoms");
    }
};

export const generateMedicalInsights = (diagnosisResults) => {
    if (!diagnosisResults || diagnosisResults.length === 0) {
        return {
            urgency: 'low',
            recommendations: ['Consult with a healthcare professional'],
            followUp: 'Schedule appointment if symptoms persist'
        };
    }

    const primaryResult = diagnosisResults[0];
    const urgencyMap = {
        'mild': 'low',
        'moderate': 'medium',
        'severe': 'high',
        'serious': 'high',
        'chronic': 'medium'
    };

    return {
        urgency: urgencyMap[primaryResult.severity] || 'medium',
        confidence: primaryResult.probability,
        recommendations: generateDetailedRecommendations(primaryResult),
        followUp: generateFollowUpPlan(primaryResult)
    };
};

const generateDetailedRecommendations = (result) => {
    const condition = result.condition.toLowerCase();
    
    const recommendationsMap = {
        'common cold': [
            'Get plenty of rest',
            'Drink lots of fluids',
            'Use over-the-counter medications for symptom relief',
            'Avoid contact with others to prevent spread'
        ],
        'pneumonia': [
            'Seek immediate medical attention',
            'Complete prescribed antibiotic course',
            'Get plenty of rest',
            'Monitor breathing and oxygen levels'
        ],
        'covid-19': [
            'Isolate for at least 10 days',
            'Monitor oxygen saturation',
            'Contact healthcare provider if symptoms worsen',
            'Follow current CDC guidelines'
        ]
    };

    return recommendationsMap[condition] || [
        'Consult with a healthcare professional',
        'Monitor symptoms closely',
        'Follow up as recommended'
    ];
};

const generateFollowUpPlan = (result) => {
    const severityMap = {
        'mild': 'Follow up in 1-2 weeks if symptoms persist',
        'moderate': 'Follow up in 3-7 days or sooner if symptoms worsen',
        'severe': 'Seek immediate medical attention and follow up within 24-48 hours',
        'serious': 'Ongoing monitoring and regular follow-ups required',
        'chronic': 'Regular monitoring and management required'
    };

    return severityMap[result.severity] || 'Follow up as needed';
};
