# MediNet Backend API Documentation

## Base URL
`http://localhost:8000/api/v1`

## Authentication
All protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## User Management

### Register User
- **POST** `/users/register`
- **Body**: `multipart/form-data`
  - `fullname` (required)
  - `username` (required)
  - `email` (required)
  - `password` (required)
  - `role` (required): "doctor", "patient", or "admin"
  - `profile` (optional): JSON string with role-specific fields
  - `avatar` (optional): image file
  - `coverImage` (optional): image file

### Login User
- **POST** `/users/login`
- **Body**: JSON
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Logout User
- **POST** `/users/logout`
- **Headers**: Authorization required

### Refresh Token
- **POST** `/users/refresh-token`
- **Body**: JSON
  ```json
  {
    "refreshToken": "refresh_token_here"
  }
  ```

## Prescriptions

### Create Prescription (Doctor Only)
- **POST** `/prescriptions`
- **Headers**: Authorization required, Role: doctor
- **Body**: JSON
  ```json
  {
    "patientId": "patient_user_id",
    "diagnosis": "Common cold",
    "medications": [
      {
        "name": "Paracetamol",
        "dosage": "500mg",
        "frequency": "Every 6 hours",
        "duration": "5 days",
        "instructions": "Take with food",
        "quantity": 20
      }
    ],
    "instructions": "Rest well and stay hydrated",
    "followUpDate": "2024-01-15",
    "notes": "Patient should avoid cold drinks"
  }
  ```

### Get Doctor's Prescriptions
- **GET** `/prescriptions/doctor?page=1&limit=10&status=active`
- **Headers**: Authorization required, Role: doctor
- **Query Parameters**:
  - `page` (optional): page number (default: 1)
  - `limit` (optional): items per page (default: 10)
  - `status` (optional): filter by status

### Get Patient's Prescriptions
- **GET** `/prescriptions/patient?page=1&limit=10&status=active`
- **Headers**: Authorization required, Role: patient
- **Query Parameters**: same as above

### Get Prescription by ID
- **GET** `/prescriptions/:prescriptionId`
- **Headers**: Authorization required

### Update Prescription (Doctor Only)
- **PUT** `/prescriptions/:prescriptionId`
- **Headers**: Authorization required, Role: doctor
- **Body**: JSON (same structure as create, but all fields optional)

### Delete Prescription (Doctor Only)
- **DELETE** `/prescriptions/:prescriptionId`
- **Headers**: Authorization required, Role: doctor

## Appointments

### Create Appointment (Doctor Only)
- **POST** `/appointments`
- **Headers**: Authorization required, Role: doctor
- **Body**: JSON
  ```json
  {
    "patientId": "patient_user_id",
    "appointmentDate": "2024-01-15",
    "appointmentTime": "10:00",
    "appointmentType": "consultation",
    "reason": "Regular checkup",
    "symptoms": ["fever", "cough"],
    "notes": "Patient has mild symptoms",
    "duration": 30,
    "location": "Main Clinic"
  }
  ```

### Get Doctor's Appointments
- **GET** `/appointments/doctor?page=1&limit=10&status=scheduled&date=2024-01-15`
- **Headers**: Authorization required, Role: doctor
- **Query Parameters**:
  - `page` (optional): page number (default: 1)
  - `limit` (optional): items per page (default: 10)
  - `status` (optional): filter by status
  - `date` (optional): filter by date (YYYY-MM-DD)

### Get Patient's Appointments
- **GET** `/appointments/patient?page=1&limit=10&status=scheduled&date=2024-01-15`
- **Headers**: Authorization required, Role: patient
- **Query Parameters**: same as above

### Get Appointment by ID
- **GET** `/appointments/:appointmentId`
- **Headers**: Authorization required

### Update Appointment Status
- **PATCH** `/appointments/:appointmentId/status`
- **Headers**: Authorization required
- **Body**: JSON
  ```json
  {
    "status": "confirmed",
    "notes": "Appointment confirmed",
    "cancellationReason": "Patient requested"
  }
  ```

### Update Appointment Details (Doctor Only)
- **PUT** `/appointments/:appointmentId`
- **Headers**: Authorization required, Role: doctor
- **Body**: JSON (same structure as create, but all fields optional)

### Delete Appointment
- **DELETE** `/appointments/:appointmentId`
- **Headers**: Authorization required

## Reports

### Create Report (Doctor Only)
- **POST** `/reports`
- **Headers**: Authorization required, Role: doctor
- **Body**: JSON
  ```json
  {
    "patientId": "patient_user_id",
    "reportType": "lab-report",
    "title": "Blood Test Results",
    "description": "Complete blood count analysis",
    "findings": "All parameters within normal range",
    "testResults": [
      {
        "testName": "Hemoglobin",
        "result": "14.2",
        "normalRange": "12.0-16.0",
        "unit": "g/dL",
        "isAbnormal": false
      }
    ],
    "diagnosis": "Normal blood parameters",
    "recommendations": "Continue current diet",
    "priority": "medium"
  }
  ```

### Get Doctor's Reports
- **GET** `/reports/doctor?page=1&limit=10&status=completed&reportType=lab-report&priority=high`
- **Headers**: Authorization required, Role: doctor
- **Query Parameters**:
  - `page` (optional): page number (default: 1)
  - `limit` (optional): items per page (default: 10)
  - `status` (optional): filter by status
  - `reportType` (optional): filter by report type
  - `priority` (optional): filter by priority

### Get Patient's Reports
- **GET** `/reports/patient?page=1&limit=10&status=completed&reportType=lab-report`
- **Headers**: Authorization required, Role: patient
- **Query Parameters**: same as above

### Get Report by ID
- **GET** `/reports/:reportId`
- **Headers**: Authorization required

### Update Report (Doctor Only)
- **PUT** `/reports/:reportId`
- **Headers**: Authorization required, Role: doctor
- **Body**: JSON (same structure as create, but all fields optional)

### Update Report Status (Doctor Only)
- **PATCH** `/reports/:reportId/status`
- **Headers**: Authorization required, Role: doctor
- **Body**: JSON
  ```json
  {
    "status": "reviewed"
  }
  ```

### Delete Report (Doctor Only)
- **DELETE** `/reports/:reportId`
- **Headers**: Authorization required, Role: doctor

### Get Reports by Type
- **GET** `/reports/type/:reportType?page=1&limit=10&status=completed&priority=high`
- **Headers**: Authorization required
- **Path Parameters**: `reportType` (lab-report, imaging-report, diagnostic-report, progress-report, discharge-summary)
- **Query Parameters**: same as above

## Diagnosis & AI Services

### Image Analysis (Pneumonia Detection)
- **POST** `/diagnoses/image-analysis`
- **Headers**: Authorization required, Role: doctor
- **Body**: `multipart/form-data`
  - `medicalImage` (required): X-ray image file

### Symptom Analysis
- **POST** `/diagnoses/analyze-symptoms`
- **Headers**: Authorization required
- **Body**: JSON
  ```json
  {
    "symptoms": ["fever", "cough", "fatigue"]
  }
  ```

## Response Format

All API responses follow this format:
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success message",
  "success": true
}
```

## Error Format

Error responses follow this format:
```json
{
  "statusCode": 400,
  "message": "Error message",
  "success": false
}
```

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Role-Based Access

- **Admin**: Full access to all endpoints
- **Doctor**: Can create, read, update, delete prescriptions, appointments, and reports
- **Patient**: Can only read their own prescriptions, appointments, and reports
