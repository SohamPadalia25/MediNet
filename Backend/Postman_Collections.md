# Postman Collections for MediNet Backend

## Setup Instructions

1. **Import the collections** into Postman
2. **Set up environment variables**:
   - `base_url`: `http://localhost:8000/api/v1`
   - `access_token`: (will be set after login)
   - `refresh_token`: (will be set after login)

## Authentication Flow

### 1. Register User
```json
POST {{base_url}}/users/register
Content-Type: multipart/form-data

Body (form-data):
- fullname: "Dr. John Smith"
- username: "drjohn"
- email: "drjohn@example.com"
- password: "password123"
- role: "doctor"
- profile: {"specialization": "Cardiology", "licenseNumber": "MD12345", "hospital": "City Hospital"}
```

### 2. Login User
```json
POST {{base_url}}/users/login
Content-Type: application/json

Body:
{
  "email": "drjohn@example.com",
  "password": "password123"
}
```

**Save the tokens from response:**
- Set `access_token` environment variable
- Set `refresh_token` environment variable

## Prescriptions Collection

### Create Prescription
```json
POST {{base_url}}/prescriptions
Authorization: Bearer {{access_token}}
Content-Type: application/json

Body:
{
  "patientId": "patient_user_id_here",
  "diagnosis": "Hypertension",
  "medications": [
    {
      "name": "Amlodipine",
      "dosage": "5mg",
      "frequency": "Once daily",
      "duration": "30 days",
      "instructions": "Take in the morning",
      "quantity": 30
    }
  ],
  "instructions": "Monitor blood pressure daily",
  "followUpDate": "2024-02-15",
  "notes": "Patient should reduce salt intake"
}
```

### Get Doctor's Prescriptions
```json
GET {{base_url}}/prescriptions/doctor?page=1&limit=10&status=active
Authorization: Bearer {{access_token}}
```

### Get Patient's Prescriptions
```json
GET {{base_url}}/prescriptions/patient?page=1&limit=10&status=active
Authorization: Bearer {{access_token}}
```

### Update Prescription
```json
PUT {{base_url}}/prescriptions/prescription_id_here
Authorization: Bearer {{access_token}}
Content-Type: application/json

Body:
{
  "status": "completed",
  "notes": "Patient responded well to treatment"
}
```

## Appointments Collection

### Create Appointment
```json
POST {{base_url}}/appointments
Authorization: Bearer {{access_token}}
Content-Type: application/json

Body:
{
  "patientId": "patient_user_id_here",
  "appointmentDate": "2024-01-20",
  "appointmentTime": "14:30",
  "appointmentType": "consultation",
  "reason": "Follow-up consultation",
  "symptoms": ["chest pain", "shortness of breath"],
  "notes": "Patient reports worsening symptoms",
  "duration": 45,
  "location": "Cardiology Department"
}
```

### Get Doctor's Appointments
```json
GET {{base_url}}/appointments/doctor?page=1&limit=10&status=scheduled&date=2024-01-20
Authorization: Bearer {{access_token}}
```

### Get Patient's Appointments
```json
GET {{base_url}}/appointments/patient?page=1&limit=10&status=scheduled
Authorization: Bearer {{access_token}}
```

### Update Appointment Status
```json
PATCH {{base_url}}/appointments/appointment_id_here/status
Authorization: Bearer {{access_token}}
Content-Type: application/json

Body:
{
  "status": "confirmed",
  "notes": "Appointment confirmed with patient"
}
```

## Reports Collection

### Create Report
```json
POST {{base_url}}/reports
Authorization: Bearer {{access_token}}
Content-Type: application/json

Body:
{
  "patientId": "patient_user_id_here",
  "reportType": "lab-report",
  "title": "Complete Blood Count Analysis",
  "description": "Routine blood work for annual checkup",
  "findings": "All parameters within normal range",
  "testResults": [
    {
      "testName": "Hemoglobin",
      "result": "14.5",
      "normalRange": "12.0-16.0",
      "unit": "g/dL",
      "isAbnormal": false
    },
    {
      "testName": "White Blood Cells",
      "result": "7.2",
      "normalRange": "4.5-11.0",
      "unit": "K/μL",
      "isAbnormal": false
    }
  ],
  "diagnosis": "Normal blood parameters",
  "recommendations": "Continue current diet and exercise routine",
  "priority": "low"
}
```

### Get Doctor's Reports
```json
GET {{base_url}}/reports/doctor?page=1&limit=10&status=completed&reportType=lab-report
Authorization: Bearer {{access_token}}
```

### Get Patient's Reports
```json
GET {{base_url}}/reports/patient?page=1&limit=10&status=completed
Authorization: Bearer {{access_token}}
```

### Update Report Status
```json
PATCH {{base_url}}/reports/report_id_here/status
Authorization: Bearer {{access_token}}
Content-Type: application/json

Body:
{
  "status": "reviewed"
}
```

### Get Reports by Type
```json
GET {{base_url}}/reports/type/lab-report?page=1&limit=10&status=completed
Authorization: Bearer {{access_token}}
```

## Sample Patient Registration

### Register Patient
```json
POST {{base_url}}/users/register
Content-Type: multipart/form-data

Body (form-data):
- fullname: "Jane Doe"
- username: "janedoe"
- email: "jane@example.com"
- password: "password123"
- role: "patient"
- profile: {"dateOfBirth": "1990-05-15", "gender": "female", "phone": "+1234567890"}
```

## Testing Scenarios

### 1. Complete Doctor Workflow
1. Register as doctor
2. Login as doctor
3. Create prescription
4. Create appointment
5. Create report
6. View all created items

### 2. Complete Patient Workflow
1. Register as patient
2. Login as patient
3. View prescriptions
4. View appointments
5. View reports

### 3. Error Testing
1. Try to access doctor endpoints as patient
2. Try to create prescription without required fields
3. Try to access endpoints without authentication
4. Try to update items created by other users

## Environment Variables Setup

Create a Postman environment with these variables:

```json
{
  "base_url": "http://localhost:8000/api/v1",
  "access_token": "",
  "refresh_token": "",
  "doctor_id": "",
  "patient_id": "",
  "prescription_id": "",
  "appointment_id": "",
  "report_id": ""
}
```

## Pre-request Scripts

### For Authentication
Add this to the "Tests" tab of your login request:

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("access_token", response.data.accessToken);
    pm.environment.set("refresh_token", response.data.refreshToken);
    pm.environment.set("user_id", response.data.user._id);
}
```

### For Error Handling
Add this to all requests:

```javascript
if (pm.response.code !== 200 && pm.response.code !== 201) {
    console.log("Error:", pm.response.json());
}
```

## Collection Variables

Set these in your collection:

```json
{
  "base_url": "http://localhost:8000/api/v1",
  "auth_header": "Bearer {{access_token}}"
}
```

## Running the Backend

Make sure your backend is running:

```bash
cd Backend
npm start
```

The server should start on `http://localhost:8000`

## Testing Checklist

- [ ] User registration (all roles)
- [ ] User login and token generation
- [ ] Prescription CRUD operations
- [ ] Appointment CRUD operations
- [ ] Report CRUD operations
- [ ] Role-based access control
- [ ] Error handling
- [ ] Pagination
- [ ] Filtering and sorting
- [ ] Data validation
