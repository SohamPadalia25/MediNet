"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  Activity,
  Phone,
  Mail,
  MapPin,
  Edit,
  Plus,
  Download,
  Brain,
  Heart,
  Thermometer,
  Weight,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock patient data - in real app, this would be fetched based on params.id
  const patient = {
    id: params.id,
    name: "Sarah Johnson",
    age: 34,
    gender: "Female",
    dateOfBirth: "1990-05-15",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    address: "123 Main St, City, State 12345",
    emergencyContact: {
      name: "John Johnson",
      relationship: "Spouse",
      phone: "(555) 123-4568",
    },
    insurance: "Blue Cross Blue Shield",
    status: "active",
    riskLevel: "medium",
    avatar: "/placeholder.svg?height=80&width=80",
    registrationDate: "2023-01-15",
    lastVisit: "2024-03-15",
    nextAppointment: "2024-03-25",
  }

  const vitalSigns = [
    { name: "Blood Pressure", value: "120/80 mmHg", status: "normal", icon: Heart, date: "2024-03-15" },
    { name: "Temperature", value: "98.6°F", status: "normal", icon: Thermometer, date: "2024-03-15" },
    { name: "Weight", value: "145 lbs", status: "stable", icon: Weight, date: "2024-03-10" },
    { name: "Heart Rate", value: "72 bpm", status: "normal", icon: Activity, date: "2024-03-15" },
  ]

  const medicalHistory = [
    {
      date: "2024-03-15",
      type: "AI Diagnosis",
      title: "Pneumonia Detection",
      result: "Positive - Moderate Severity",
      confidence: 92,
      doctor: "Dr. James Wilson",
      status: "completed",
    },
    {
      date: "2024-03-10",
      type: "Lab Test",
      title: "Complete Blood Count",
      result: "Normal ranges",
      confidence: null,
      doctor: "Dr. Sarah Chen",
      status: "completed",
    },
    {
      date: "2024-02-28",
      type: "Consultation",
      title: "Routine Checkup",
      result: "Good overall health",
      confidence: null,
      doctor: "Dr. James Wilson",
      status: "completed",
    },
    {
      date: "2024-02-15",
      type: "AI Diagnosis",
      title: "Chest X-Ray Analysis",
      result: "Normal - No abnormalities",
      confidence: 95,
      doctor: "Dr. James Wilson",
      status: "completed",
    },
  ]

  const medications = [
    {
      name: "Amoxicillin",
      dosage: "500mg",
      frequency: "3 times daily",
      duration: "7 days",
      prescribed: "2024-03-15",
      status: "active",
    },
    {
      name: "Ibuprofen",
      dosage: "400mg",
      frequency: "As needed",
      duration: "PRN",
      prescribed: "2024-03-15",
      status: "active",
    },
    {
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      duration: "Ongoing",
      prescribed: "2023-06-01",
      status: "active",
    },
  ]

  const appointments = [
    {
      date: "2024-03-25",
      time: "10:00 AM",
      type: "Follow-up",
      status: "scheduled",
      notes: "Pneumonia treatment follow-up",
    },
    {
      date: "2024-04-15",
      time: "2:00 PM",
      type: "Routine Checkup",
      status: "scheduled",
      notes: "Annual physical examination",
    },
  ]

  const treatmentPlan = {
    currentCondition: "Pneumonia - Moderate Severity",
    goals: [
      "Complete antibiotic course",
      "Monitor respiratory symptoms",
      "Prevent complications",
      "Return to normal activities",
    ],
    instructions: [
      "Take prescribed antibiotics as directed",
      "Rest and stay hydrated",
      "Monitor temperature daily",
      "Return if symptoms worsen",
    ],
    restrictions: ["Avoid strenuous activities", "No smoking or alcohol", "Limit exposure to others"],
  }

  return (
    <DashboardLayout userType="doctor" userName="Dr. James Wilson" userEmail="james.wilson@medinet.com">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/doctor/patients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patients
            </Button>
          </Link>
        </div>

        {/* Patient Info Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-serif font-bold">{patient.name}</h1>
                    <Badge
                      variant={
                        patient.riskLevel === "high"
                          ? "destructive"
                          : patient.riskLevel === "medium"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {patient.riskLevel} risk
                    </Badge>
                    <Badge variant={patient.status === "active" ? "default" : "secondary"}>{patient.status}</Badge>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>{patient.age} years old</span>
                    <span>{patient.gender}</span>
                    <span>DOB: {patient.dateOfBirth}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {patient.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {patient.phone}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="treatment">Treatment Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vital Signs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Latest Vital Signs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vitalSigns.map((vital, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <vital.icon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{vital.name}</p>
                          <p className="text-sm text-muted-foreground">{vital.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{vital.value}</p>
                        <Badge variant={vital.status === "normal" ? "default" : "secondary"}>{vital.status}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {medicalHistory.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="mt-1">
                        {item.type === "AI Diagnosis" ? (
                          <Brain className="h-4 w-4 text-primary" />
                        ) : item.type === "Lab Test" ? (
                          <FileText className="h-4 w-4 text-accent" />
                        ) : (
                          <User className="h-4 w-4 text-chart-1" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.result}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.date} • {item.doctor}
                        </p>
                      </div>
                      {item.confidence && (
                        <div className="text-right">
                          <p className="text-sm font-medium">{item.confidence}%</p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact & Insurance Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Contact Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{patient.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Emergency: {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{patient.emergencyContact.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Insurance & Registration</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Insurance:</strong> {patient.insurance}
                      </p>
                      <p>
                        <strong>Patient Since:</strong> {patient.registrationDate}
                      </p>
                      <p>
                        <strong>Last Visit:</strong> {patient.lastVisit}
                      </p>
                      <p>
                        <strong>Next Appointment:</strong> {patient.nextAppointment}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Medical History
                  </span>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicalHistory.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="mt-1">
                        {item.type === "AI Diagnosis" ? (
                          <Brain className="h-5 w-5 text-primary" />
                        ) : item.type === "Lab Test" ? (
                          <FileText className="h-5 w-5 text-accent" />
                        ) : (
                          <User className="h-5 w-5 text-chart-1" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{item.title}</h4>
                          <Badge variant="outline">{item.type}</Badge>
                          <Badge variant={item.status === "completed" ? "default" : "secondary"}>
                            {item.status === "completed" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{item.result}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{item.date}</span>
                          <span>by {item.doctor}</span>
                          {item.confidence && <span>Confidence: {item.confidence}%</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Current Medications</span>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medication
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medications.map((med, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{med.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {med.dosage} • {med.frequency} • {med.duration}
                        </p>
                        <p className="text-xs text-muted-foreground">Prescribed: {med.prescribed}</p>
                      </div>
                      <Badge variant={med.status === "active" ? "default" : "secondary"}>{med.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Appointments
                  </span>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((apt, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{apt.type}</h4>
                        <p className="text-sm text-muted-foreground">{apt.notes}</p>
                        <p className="text-xs text-muted-foreground">
                          {apt.date} at {apt.time}
                        </p>
                      </div>
                      <Badge variant={apt.status === "scheduled" ? "default" : "secondary"}>{apt.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treatment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Treatment Plan</CardTitle>
                <CardDescription>{treatmentPlan.currentCondition}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Treatment Goals</h4>
                  <ul className="space-y-2">
                    {treatmentPlan.goals.map((goal, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Patient Instructions</h4>
                  <ul className="space-y-2">
                    {treatmentPlan.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Restrictions</h4>
                  <ul className="space-y-2">
                    {treatmentPlan.restrictions.map((restriction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{restriction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
