"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Search, Calendar, User, Heart, Activity, Pill, TestTube, Eye, Upload } from "lucide-react"

export default function PatientRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterDate, setFilterDate] = useState("all")

  const medicalRecords = [
    {
      id: "1",
      type: "diagnosis",
      title: "Pneumonia Diagnosis",
      doctor: "Dr. James Wilson",
      date: "2024-03-15",
      category: "Respiratory",
      status: "completed",
      description: "Chest X-ray revealed pneumonia in right lower lobe. Prescribed antibiotics.",
      attachments: ["chest-xray-03-15.pdf", "lab-results-03-15.pdf"],
    },
    {
      id: "2",
      type: "prescription",
      title: "Blood Pressure Medication",
      doctor: "Dr. Sarah Chen",
      date: "2024-03-10",
      category: "Cardiovascular",
      status: "active",
      description: "Prescribed Lisinopril 10mg daily for hypertension management.",
      attachments: ["prescription-03-10.pdf"],
    },
    {
      id: "3",
      type: "lab-result",
      title: "Complete Blood Count",
      doctor: "Dr. Michael Brown",
      date: "2024-03-08",
      category: "Laboratory",
      status: "completed",
      description: "Routine blood work showing normal values across all parameters.",
      attachments: ["cbc-results-03-08.pdf"],
    },
    {
      id: "4",
      type: "imaging",
      title: "Skin Lesion Scan",
      doctor: "Dr. Lisa Davis",
      date: "2024-03-05",
      category: "Dermatology",
      status: "completed",
      description: "AI-powered skin lesion analysis showing benign characteristics.",
      attachments: ["skin-scan-03-05.pdf", "ai-analysis-03-05.pdf"],
    },
  ]

  const vitalSigns = [
    {
      date: "2024-03-15",
      bloodPressure: "120/80",
      heartRate: "72",
      temperature: "98.6°F",
      weight: "165 lbs",
      height: "5'10\"",
    },
    {
      date: "2024-03-10",
      bloodPressure: "118/78",
      heartRate: "68",
      temperature: "98.4°F",
      weight: "164 lbs",
      height: "5'10\"",
    },
    {
      date: "2024-03-05",
      bloodPressure: "122/82",
      heartRate: "74",
      temperature: "98.7°F",
      weight: "166 lbs",
      height: "5'10\"",
    },
  ]

  const medications = [
    {
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      prescribedBy: "Dr. Sarah Chen",
      startDate: "2024-03-10",
      status: "active",
      purpose: "Blood pressure management",
    },
    {
      name: "Amoxicillin",
      dosage: "500mg",
      frequency: "Three times daily",
      prescribedBy: "Dr. James Wilson",
      startDate: "2024-03-15",
      endDate: "2024-03-25",
      status: "completed",
      purpose: "Pneumonia treatment",
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "diagnosis":
        return <Heart className="h-4 w-4" />
      case "prescription":
        return <Pill className="h-4 w-4" />
      case "lab-result":
        return <TestTube className="h-4 w-4" />
      case "imaging":
        return <Eye className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "completed":
        return <Badge variant="outline">Completed</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredRecords = medicalRecords.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || record.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <DashboardLayout userType="patient" userName="John Smith" userEmail="john.smith@email.com">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-black text-foreground">Health Records</h1>
            <p className="text-muted-foreground">Your complete medical history and health information</p>
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search records, doctors, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="diagnosis">Diagnoses</SelectItem>
                  <SelectItem value="prescription">Prescriptions</SelectItem>
                  <SelectItem value="lab-result">Lab Results</SelectItem>
                  <SelectItem value="imaging">Imaging</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterDate} onValueChange={setFilterDate}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="records" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-4">
            {filteredRecords.map((record) => (
              <Card key={record.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-muted rounded-lg">{getTypeIcon(record.type)}</div>
                      <div>
                        <h3 className="font-semibold text-lg">{record.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <User className="h-3 w-3" />
                          <span>{record.doctor}</span>
                          <Calendar className="h-3 w-3 ml-2" />
                          <span>{record.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(record.status)}
                      <Badge variant="outline">{record.category}</Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{record.description}</p>
                  {record.attachments.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Attachments:</p>
                      <div className="flex flex-wrap gap-2">
                        {record.attachments.map((attachment, index) => (
                          <Button key={index} variant="outline" size="sm">
                            <Download className="mr-2 h-3 w-3" />
                            {attachment}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="vitals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Vital Signs History
                </CardTitle>
                <CardDescription>Track your vital signs over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vitalSigns.map((vital, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium">{vital.date}</p>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-3 w-3" />
                          Export
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Blood Pressure</p>
                          <p className="font-medium">{vital.bloodPressure}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Heart Rate</p>
                          <p className="font-medium">{vital.heartRate} bpm</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Temperature</p>
                          <p className="font-medium">{vital.temperature}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Weight</p>
                          <p className="font-medium">{vital.weight}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Height</p>
                          <p className="font-medium">{vital.height}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Current & Past Medications
                </CardTitle>
                <CardDescription>Your medication history and current prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medications.map((medication, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{medication.name}</h4>
                          <p className="text-sm text-muted-foreground">{medication.purpose}</p>
                        </div>
                        {getStatusBadge(medication.status)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Dosage</p>
                          <p className="font-medium">{medication.dosage}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Frequency</p>
                          <p className="font-medium">{medication.frequency}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Prescribed By</p>
                          <p className="font-medium">{medication.prescribedBy}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Start Date</p>
                          <p className="font-medium">{medication.startDate}</p>
                          {medication.endDate && (
                            <>
                              <p className="text-muted-foreground mt-1">End Date</p>
                              <p className="font-medium">{medication.endDate}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Medical Documents
                </CardTitle>
                <CardDescription>All your medical documents and reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No additional documents uploaded</p>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
