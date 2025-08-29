# MediNet Backend - Files to Run

## Main Backend Server
**File**: `Backend/src/index.js` (or `Backend/src/app.js` if using `node app.js`)
**Command**: `npm start` (from Backend directory)
**Port**: 8000
**Purpose**: Main Node.js/Express server with all API endpoints

## ML Services

### 1. Pneumonia Detection Service
**File**: `Backend/ml-services/pneumonia-detection/pneumonia_api.py`
**Command**: `python pneumonia_api.py`
**Port**: 5001
**Purpose**: X-ray image analysis for pneumonia detection
**Dependencies**: 
- TensorFlow/Keras
- PIL (Pillow)
- Flask
- Flask-CORS

### 2. Disease Prediction Service
**File**: `Backend/src/app.py`
**Command**: `python app.py`
**Port**: 5000
**Purpose**: Symptom-based disease prediction using SVM model
**Dependencies**:
- Flask
- Flask-CORS
- joblib
- numpy
- pandas

## Required Dependencies

### Backend (Node.js)
```bash
cd Backend
npm install
```

**Key packages**:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- cookie-parser
- multer

### ML Services (Python)
```bash
cd Backend/ml-services/pneumonia-detection
pip install -r requirements.txt

cd Backend/src
pip install flask flask-cors joblib numpy pandas pillow
```

## Startup Sequence

### 1. Start ML Services First
```bash
# Terminal 1 - Pneumonia Detection
cd Backend/ml-services/pneumonia-detection
python pneumonia_api.py

# Terminal 2 - Disease Prediction
cd Backend/src
python app.py
```

### 2. Start Main Backend Server
```bash
# Terminal 3 - Main Backend
cd Backend
npm start
```

## Port Configuration

- **Main Backend**: 8000
- **Pneumonia API**: 5001
- **Disease Prediction**: 5000
- **Frontend**: 3000

## Environment Variables

Create `.env` file in `Backend/` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/medinet

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Token Expiry
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Port
PORT=8000
```

## Database Setup

### MongoDB
1. Install MongoDB locally or use MongoDB Atlas
2. Create database named `medinet`
3. Collections will be created automatically when first data is inserted

### Required Collections
- `users` - User accounts and authentication
- `patients` - Patient-specific information
- `prescriptions` - Medication prescriptions
- `appointments` - Scheduled appointments
- `reports` - Medical reports
- `diagnoses` - AI diagnosis results

## File Structure After Setup

```
Backend/
├── src/
│   ├── models/
│   │   ├── user.model.js
│   │   ├── patient.model.js
│   │   ├── prescription.model.js      ← NEW
│   │   ├── appointment.model.js       ← NEW
│   │   ├── report.model.js            ← NEW
│   │   └── diagnosis.model.js
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── patient.controller.js
│   │   ├── prescription.controller.js  ← NEW
│   │   ├── appointment.controller.js   ← NEW
│   │   ├── report.controller.js        ← NEW
│   │   └── diagnosis.controller.js
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── patient.routes.js
│   │   ├── prescription.routes.js      ← NEW
│   │   ├── appointment.routes.js       ← NEW
│   │   ├── report.routes.js            ← NEW
│   │   └── diagnosis.routes.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── asyncHandler.js
│   ├── app.js                         ← UPDATED
│   └── index.js
├── ml-services/
│   └── pneumonia-detection/
│       ├── pneumonia_api.py
│       ├── pneumonia_model.keras
│       ├── pneumonia_labels.pkl
│       └── requirements.txt
├── package.json
├── API_ENDPOINTS.md                    ← NEW
├── Postman_Collections.md              ← NEW
└── FILES_TO_RUN.md                    ← THIS FILE
```

## Testing the Setup

### 1. Check ML Services
```bash
# Test Pneumonia API
curl http://localhost:5001/health

# Test Disease Prediction
curl http://localhost:5000/health
```

### 2. Check Main Backend
```bash
# Test main server
curl http://localhost:8000/api/v1/health
```

### 3. Test Authentication
```bash
# Register a user
curl -X POST http://localhost:8000/api/v1/users/register \
  -F "fullname=Test User" \
  -F "username=testuser" \
  -F "email=test@example.com" \
  -F "password=password123" \
  -F "role=patient"
```

## Common Issues & Solutions

### 1. Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :8000
# Kill process
taskkill /PID <process_id> /F
```

### 2. MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify database name

### 3. ML Model Loading Error
- Check if model files exist
- Verify Python dependencies
- Check file paths in ML services

### 4. CORS Issues
- Verify CORS_ORIGIN in `.env`
- Check frontend URL matches backend CORS settings

## Monitoring & Logs

### Backend Logs
- Check console output for errors
- Look for MongoDB connection messages
- Verify route registration

### ML Service Logs
- Check Flask development server output
- Look for model loading messages
- Verify endpoint accessibility

## Performance Considerations

- **Database Indexing**: Ensure proper indexes on frequently queried fields
- **ML Model Caching**: Models are loaded once at startup
- **File Upload Limits**: Configured in `app.js` (16kb default)
- **Pagination**: Implemented for all list endpoints

## Security Features

- **JWT Authentication**: All protected routes require valid tokens
- **Role-Based Access**: Different endpoints for different user roles
- **Input Validation**: Request body validation in controllers
- **File Upload Security**: Multer middleware for secure file handling
- **CORS Protection**: Configured to allow only specific origins

## Next Steps

1. **Frontend Integration**: Connect these endpoints to your React/Next.js frontend
2. **Real-time Features**: Consider adding WebSocket support for live updates
3. **File Storage**: Implement cloud storage for medical images and documents
4. **Email Notifications**: Add email service for appointment reminders
5. **Analytics**: Implement reporting and analytics features
6. **Mobile API**: Consider creating mobile-specific endpoints
