from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
import joblib
import io
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Global variables for model
model = None
class_labels = None

def load_model():
    """Load the trained pneumonia detection model"""
    global model, class_labels
    try:
        print("Loading pneumonia detection model...")
        
        # Update these paths to your model location
       # MODEL_PATH = './balanced_pneumonia_model.keras'  # Update path
        MODEL_PATH = './models/pneumonia_model.keras'
        model = tf.keras.models.load_model(MODEL_PATH, compile=False)
        class_labels = joblib.load('./models/pneumonia_labels.pkl', mmap_mode=None)

        LABELS_PATH = './models/pneumonia_labels.pkl'           # Update path

       
        
        print(f"✅ Model loaded successfully!")
        print(f"Classes: {class_labels}")
        return True
        
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return False

def preprocess_image(image):
    """Preprocess image for prediction"""
    try:
        # Resize to model input size
        image = image.resize((224, 224))
        
        # Convert to RGB
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Normalize and add batch dimension
        image_array = np.array(image) / 255.0
        image_array = np.expand_dims(image_array, axis=0)
        
        return image_array
    except Exception as e:
        raise ValueError(f"Image preprocessing failed: {str(e)}")

def get_medical_advice(diagnosis, confidence):
    """Generate medical advice based on diagnosis"""
    advice = {
        "diagnosis": diagnosis,
        "confidence": confidence,
        "timestamp": datetime.now().isoformat()
    }
    
    if diagnosis == "PNEUMONIA":
        if confidence >= 85:
            advice.update({
                "severity": "HIGH",
                "message": "High probability of pneumonia detected. Immediate medical attention required.",
                "recommendations": [
                    "Seek immediate medical consultation",
                    "Consider emergency room visit if experiencing severe symptoms",
                    "Do not delay treatment",
                    "Monitor oxygen saturation if possible"
                ],
                "next_steps": "URGENT: Contact healthcare provider immediately"
            })
        elif confidence >= 70:
            advice.update({
                "severity": "MODERATE",
                "message": "Pneumonia suspected. Medical evaluation recommended within 24 hours.",
                "recommendations": [
                    "Schedule appointment with healthcare provider today",
                    "Monitor symptoms closely",
                    "Rest and stay hydrated",
                    "Avoid strenuous activities"
                ],
                "next_steps": "Contact healthcare provider within 24 hours"
            })
        else:
            advice.update({
                "severity": "LOW-MODERATE",
                "message": "Possible pneumonia signs detected. Medical consultation advised.",
                "recommendations": [
                    "Schedule appointment with healthcare provider",
                    "Monitor respiratory symptoms",
                    "Get adequate rest",
                    "Consider follow-up imaging if symptoms persist"
                ],
                "next_steps": "Consult healthcare provider within 2-3 days"
            })
    else:  # NORMAL
        if confidence >= 80:
            advice.update({
                "severity": "NORMAL",
                "message": "No clear signs of pneumonia detected in this chest X-ray.",
                "recommendations": [
                    "Continue monitoring symptoms if any",
                    "Maintain good respiratory hygiene",
                    "Follow up if symptoms worsen or persist"
                ],
                "next_steps": "Continue normal activities, monitor if symptoms present"
            })
        else:
            advice.update({
                "severity": "UNCERTAIN",
                "message": "Results inconclusive. Additional medical evaluation recommended.",
                "recommendations": [
                    "Clinical correlation with symptoms needed",
                    "Consider additional imaging if clinically indicated",
                    "Consult healthcare provider for interpretation"
                ],
                "next_steps": "Consult healthcare provider for clinical correlation"
            })
    
    return advice

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "classes": class_labels,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/predict', methods=['POST'])
def predict_pneumonia():
    global model, class_labels

    try:
        if model is None:
            return jsonify({'success': False, 'error': 'Model not loaded'}), 503

        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image provided'}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No image selected'}), 400

        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in {'.jpg','.jpeg','.png','.bmp','.tiff'}:
            return jsonify({'success': False, 'error': 'Invalid file type'}), 400

        # Preprocess
        image = Image.open(io.BytesIO(file.read()))
        processed = preprocess_image(image)  # (1,224,224,3)

        # Predict
        raw = model.predict(processed, verbose=0)
        # Debug prints (to your console)
        print("Raw model output:", raw)
        print("Raw output shape:", raw.shape)

        # Flatten to 1D array
        flat = raw.flatten()
        print("Flattened output:", flat)

        # Must have exactly 2 probabilities
        if flat.size != 2:
            return jsonify({
                'success': False,
                'error': 'Unexpected model output shape',
                'details': f'Model returned {flat.size} values instead of 2'
            }), 500

        # Convert to Python floats
        normal_prob    = float(flat[0] * 100)
        pneumonia_prob = float(flat[1] * 100)

        # Build response
        diagnosis = 'PNEUMONIA' if pneumonia_prob > normal_prob else 'NORMAL'
        confidence = max(normal_prob, pneumonia_prob)
        advice     = get_medical_advice(diagnosis, confidence)

        return jsonify({
            'success': True,
            'prediction': {
                'diagnosis': diagnosis,
                'confidence': round(confidence, 2),
                'probabilities': {
                    'normal': round(normal_prob, 2),
                    'pneumonia': round(pneumonia_prob, 2)
                }
            },
            'medical_advice': advice
        })

    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({
            'success': False,
            'error': 'Prediction failed',
            'details': str(e)
        }), 500

    
@app.route('/model-info', methods=['GET'])
def get_model_info():
    """Get model information"""
    return jsonify({
        'model_type': 'Pneumonia Detection',
        'architecture': 'ResNet50 Transfer Learning',
        'classes': class_labels,
        'input_size': '224x224 pixels',
        'training_accuracy': '81.24%',
        'validation_accuracy': '75%',
        'f1_score': '73%',
        'model_size': '92.02 MB'
    })

# Initialize model on startup
if __name__ == '__main__':
    print("Starting Pneumonia Detection API...")
    if load_model():
        print("🚀 Server starting on http://localhost:5001")
        app.run(host='0.0.0.0', port=5001, debug=True)
    else:
        print("❌ Failed to load model. Exiting...")
        exit(1)
