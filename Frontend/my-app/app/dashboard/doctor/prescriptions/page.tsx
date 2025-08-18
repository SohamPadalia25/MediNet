"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Filter, FileText, Clock, CheckCircle, AlertCircle, Pill } from "lucide-react"

export default function PrescriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState("all")
  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false)

  const prescriptions = [
    {
      id: 1,
      patient: "Sarah Johnson",
      patientId: "P001",
      medications: [
        { name: "Amoxicillin", dosage: "500mg", frequency: "3 times daily", duration: "7 days" },
        { name: "Ibuprofen", dosage: "400mg", frequency: "As needed", duration: "5 days" },
      ],
      diagnosis: "Upper Respiratory Infection",
      date: "2024-01-15",
      status: "Active",
      notes: "Take with food. Complete full course of antibiotics.",
    },
    {
      id: 2,
      patient: "Michael Chen",
      patientId: "P002",
      medications: [
        { name: "Metformin", dosage: "850mg", frequency: "2 times daily", duration: "Ongoing" },
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "Ongoing" },
      ],
      diagnosis: "Type 2 Diabetes, Hypertension",
      date: "2024-01-14",
      status: "Active",
      notes: "Monitor blood glucose levels. Regular follow-up required.",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Completed":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "Cancelled":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <DashboardLayout userType="doctor" userName="Dr. James Wilson" userEmail="james.wilson@medinet.com">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Prescriptions</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage patient prescriptions and medications</p>
          </div>
          <Dialog open={isNewPrescriptionOpen} onOpenChange={setIsNewPrescriptionOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800">
                <Plus className="h-4 w-4 mr-2" />
                New Prescription
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Prescription</DialogTitle>
                <DialogDescription>Add medications and instructions for a patient</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patient">Patient</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="p001">Sarah Johnson</SelectItem>
                        <SelectItem value="p002">Michael Chen</SelectItem>
                        <SelectItem value="p003">Emily Davis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="diagnosis">Diagnosis</Label>
                    <Input placeholder="Enter diagnosis" />
                  </div>
                </div>
                <div>
                  <Label>Medications</Label>
                  <div className="space-y-3 mt-2">
                    <div className="grid grid-cols-4 gap-2">
                      <Input placeholder="Medication name" />
                      <Input placeholder="Dosage" />
                      <Input placeholder="Frequency" />
                      <Input placeholder="Duration" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Medication
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Instructions & Notes</Label>
                  <Textarea placeholder="Special instructions, warnings, or notes..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewPrescriptionOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewPrescriptionOpen(false)}>Create Prescription</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search prescriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Patients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients</SelectItem>
                  <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  <SelectItem value="michael">Michael Chen</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-teal-600" />
                      {prescription.patient}
                      <Badge variant="secondary">{prescription.patientId}</Badge>
                    </CardTitle>
                    <CardDescription>
                      {prescription.diagnosis} • {prescription.date}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(prescription.status)}
                    <Badge variant={prescription.status === "Active" ? "default" : "secondary"}>
                      {prescription.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="medications" className="w-full">
                  <TabsList>
                    <TabsTrigger value="medications">Medications</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="medications" className="space-y-3">
                    {prescription.medications.map((med, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{med.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {med.dosage} • {med.frequency}
                          </div>
                        </div>
                        <Badge variant="outline">{med.duration}</Badge>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="notes">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm">{prescription.notes}</p>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Renew
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
