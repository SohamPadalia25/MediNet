"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Clock,
  Search,
  Calendar,
  User,
  FileText,
  Activity,
  Heart,
  Pill,
  TestTube,
  Stethoscope,
  Download,
} from "lucide-react"

export default function PatientHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterYear, setFilterYear] = useState("all")

  const medicalHistory = [
    {
      id: "1",
      date: "2024-03-15",
      type: "diagnosis",
      title: "Pneumonia Diagnosis & Treatment",
      doctor: "Dr. James Wilson",
      doctorAvatar: "/placeholder.svg?height=32&width=32",
      specialty: "Internal Medicine",
      description: "Diagnosed with pneumonia in right lower lobe. Prescribed antibiotics and follow-up care.",
      outcome: "Fully recovered",
      status: "completed",
      attachments: ["chest-xray-03-15.pdf", "prescription-03-15.pdf"],
      followUp: "Follow-up scheduled for March 25, 2024",
    },
    {
      id: "2",
      date: "2024-03-10",
      type: "prescription",
      title: "Blood Pressure Medication Started",
      doctor: "Dr. Sarah Chen",
      doctorAvatar: "/placeholder.svg?height=32&width=32",
      specialty: "Cardiology",
      description: "Started on Lisinopril 10mg daily for hypertension management.",
      outcome: "Blood pressure controlled",
      status: "ongoing",
      attachments: ["prescription-03-10.pdf"],
      followUp: "Monthly monitoring required",
    },
    {
      id: "3",
      date: "2024-03-08",
      type: "lab-test",
      title: "Complete Blood Count",
      doctor: "Dr. Michael Brown",
      doctorAvatar: "/placeholder.svg?height=32&width=32",
      specialty: "Internal Medicine",
      description: "Routine blood work showing normal values across all parameters.",
      outcome: "All normal",
      status: "completed",
      attachments: ["cbc-results-03-08.pdf"],
      followUp: "Next CBC in 6 months",
    },
    {
      id: "4",
      date: "2024-03-05",
      type: "imaging",
      title: "Skin Lesion Analysis",
      doctor: "Dr. Lisa Davis",
      doctorAvatar: "/placeholder.svg?height=32&width=32",
      specialty: "Dermatology",
      description: "AI-powered skin lesion analysis showing benign characteristics.",
      outcome: "Benign lesion",
      status: "completed",
      attachments: ["skin-analysis-03-05.pdf"],
      followUp: "Annual skin check recommended",
    },
    {
      id: "5",
      date: "2024-02-20",
      type: "appointment",
      title: "Annual Physical Examination",
      doctor: "Dr. James Wilson",
      doctorAvatar: "/placeholder.svg?height=32&width=32",
      specialty: "Internal Medicine",
      description: "Comprehensive annual physical examination with vital signs and health assessment.",
      outcome: "Generally healthy",
      status: "completed",
      attachments: ["physical-exam-02-20.pdf"],
      followUp: "Next annual exam in February 2025",
    },
    {
      id: "6",
      date: "2024-01-15",
      type: "vaccination",
      title: "Flu Vaccination",
      doctor: "Dr. Sarah Chen",
      doctorAvatar: "/placeholder.svg?height=32&width=32",
      specialty: "Internal Medicine",
      description: "Annual influenza vaccination administered.",
      outcome: "No adverse reactions",
      status: "completed",
      attachments: ["vaccination-record-01-15.pdf"],
      followUp: "Next flu shot due October 2024",
    },
    {
      id: "7",
      date: "2023-12-10",
      type: "surgery",
      title: "Minor Skin Lesion Removal",
      doctor: "Dr. Lisa Davis",
      doctorAvatar: "/placeholder.svg?height=32&width=32",
      specialty: "Dermatology",
      description: "Surgical removal of suspicious skin lesion on left arm.",
      outcome: "Successful removal, benign pathology",
      status: "completed",
      attachments: ["surgery-report-12-10.pdf", "pathology-12-10.pdf"],
      followUp: "Wound healed completely",
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "diagnosis":
        return <Heart className="h-4 w-4" />
      case "prescription":
        return <Pill className="h-4 w-4" />
      case "lab-test":
        return <TestTube className="h-4 w-4" />
      case "imaging":
        return <Activity className="h-4 w-4" />
      case "appointment":
        return <Stethoscope className="h-4 w-4" />
      case "vaccination":
        return <Activity className="h-4 w-4" />
      case "surgery":
        return <Heart className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "diagnosis":
        return "bg-destructive/10 text-destructive"
      case "prescription":
        return "bg-primary/10 text-primary"
      case "lab-test":
        return "bg-accent/10 text-accent"
      case "imaging":
        return "bg-chart-1/10 text-chart-1"
      case "appointment":
        return "bg-chart-2/10 text-chart-2"
      case "vaccination":
        return "bg-chart-3/10 text-chart-3"
      case "surgery":
        return "bg-chart-4/10 text-chart-4"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline">Completed</Badge>
      case "ongoing":
        return <Badge variant="default">Ongoing</Badge>
      case "scheduled":
        return <Badge variant="secondary">Scheduled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredHistory = medicalHistory.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || item.type === filterType
    const matchesYear = filterYear === "all" || item.date.startsWith(filterYear)
    return matchesSearch && matchesType && matchesYear
  })

  const years = [...new Set(medicalHistory.map((item) => item.date.split("-")[0]))].sort().reverse()

  return (
    <DashboardLayout userType="patient" userName="John Smith" userEmail="john.smith@email.com">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-black text-foreground">Medical History</h1>
            <p className="text-muted-foreground">Complete timeline of your medical care and treatments</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export History
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                  <p className="text-2xl font-bold">{medicalHistory.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Year</p>
                  <p className="text-2xl font-bold">
                    {medicalHistory.filter((item) => item.date.startsWith("2024")).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ongoing Care</p>
                  <p className="text-2xl font-bold">
                    {medicalHistory.filter((item) => item.status === "ongoing").length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Doctors Seen</p>
                  <p className="text-2xl font-bold">{new Set(medicalHistory.map((item) => item.doctor)).size}</p>
                </div>
                <User className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search medical history..."
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
                  <SelectItem value="lab-test">Lab Tests</SelectItem>
                  <SelectItem value="imaging">Imaging</SelectItem>
                  <SelectItem value="appointment">Appointments</SelectItem>
                  <SelectItem value="vaccination">Vaccinations</SelectItem>
                  <SelectItem value="surgery">Surgeries</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Medical History Timeline */}
        <div className="space-y-4">
          {filteredHistory.map((item, index) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`p-2 rounded-full ${getTypeColor(item.type)}`}>{getTypeIcon(item.type)}</div>
                    {index < filteredHistory.length - 1 && <div className="w-px h-16 bg-border mt-2" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {item.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.doctor}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {item.specialty}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        <Badge variant="outline" className="capitalize">
                          {item.type.replace("-", " ")}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={item.doctorAvatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-muted-foreground mb-2">{item.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-chart-1">Outcome:</p>
                            <p className="text-muted-foreground">{item.outcome}</p>
                          </div>
                          <div>
                            <p className="font-medium text-chart-2">Follow-up:</p>
                            <p className="text-muted-foreground">{item.followUp}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {item.attachments.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Attachments:</p>
                        <div className="flex flex-wrap gap-2">
                          {item.attachments.map((attachment, attachIndex) => (
                            <Button key={attachIndex} variant="outline" size="sm">
                              <Download className="mr-2 h-3 w-3" />
                              {attachment}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No medical history found</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm || filterType !== "all" || filterYear !== "all"
                  ? "Try adjusting your search or filters"
                  : "Your medical history will appear here as you receive care"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
