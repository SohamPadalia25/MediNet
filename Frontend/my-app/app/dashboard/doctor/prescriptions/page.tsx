"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DynamicDashboardLayout } from "@/components/dynamic-dashboard-layout"
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
import { Plus, Search, Filter, FileText, Clock, CheckCircle, AlertCircle, Pill, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "@/components/ui/toast"

interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
  quantity: number
}

interface Prescription {
  _id: string
  patientId: {
    _id: string
    fullname: string
    email: string
  }
  doctorId: {
    _id: string
    fullname: string
  }
  diagnosis: string
  medications: Medication[]
  instructions?: string
  followUpDate?: string
  notes?: string
  status: string
  createdAt: string
}

interface Patient {
  _id: string
  fullname: string
  email: string
}

const PRESCRIPTION_DUMMY: Prescription[] = [
  {
    _id: "demo-1",
    patientId: { _id: "p1", fullname: "Sarah Johnson", email: "sarah@example.com" },
    doctorId: { _id: "d1", fullname: "Dr. Demo" },
    diagnosis: "Upper Respiratory Infection",
    medications: [
      { name: "Amoxicillin", dosage: "500mg", frequency: "3 times daily", duration: "7 days", quantity: 21 },
      { name: "Ibuprofen", dosage: "400mg", frequency: "As needed", duration: "5 days", quantity: 10 },
    ],
    instructions: "Take with food",
    followUpDate: new Date().toISOString(),
    notes: "Complete full course of antibiotics.",
    status: "active",
    createdAt: new Date().toISOString(),
  },
]

const PATIENTS_DUMMY: Patient[] = [
  { _id: "p1", fullname: "Sarah Johnson", email: "sarah@example.com" },
  { _id: "p2", fullname: "Michael Chen", email: "michael@example.com" },
]

export default function PrescriptionsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState("all")
  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    patientId: "",
    diagnosis: "",
    medications: [{ name: "", dosage: "", frequency: "", duration: "", instructions: "", quantity: 1 }],
    instructions: "",
    followUpDate: "",
    notes: ""
  })

  // Fetch prescriptions
  const fetchPrescriptions = async () => {
    try {
      setLoading(true)
      const response = await api.get("/prescriptions/doctor")
      const list: Prescription[] = response?.data?.data?.prescriptions || []
      setPrescriptions(list.length ? list : PRESCRIPTION_DUMMY)
      if (!list.length) toast.info("Showing demo prescriptions until real data is available")
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setPrescriptions(PRESCRIPTION_DUMMY)
        toast.info("Prescriptions API not found yet, showing demo data")
      } else {
        toast.error("Failed to fetch prescriptions")
      }
    } finally {
      setLoading(false)
    }
  }

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const response = await api.get("/users", { params: { role: "patient", limit: 100 } })
      const list: Patient[] = response?.data?.data?.users || []
      setPatients(list.length ? list : PATIENTS_DUMMY)
    } catch (error: any) {
      setPatients(PATIENTS_DUMMY)
    }
  }

  useEffect(() => {
    fetchPrescriptions()
    fetchPatients()
  }, [])

  // Create prescription
  const handleCreatePrescription = async () => {
    try {
      setCreating(true)
      await api.post("/prescriptions", formData)
      toast.success("Prescription created successfully")
      setIsNewPrescriptionOpen(false)
      resetForm()
      fetchPrescriptions()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create prescription")
    } finally {
      setCreating(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      patientId: "",
      diagnosis: "",
      medications: [{ name: "", dosage: "", frequency: "", duration: "", instructions: "", quantity: 1 }],
      instructions: "",
      followUpDate: "",
      notes: ""
    })
  }

  // Add medication field
  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: "", dosage: "", frequency: "", duration: "", instructions: "", quantity: 1 }]
    }))
  }

  // Remove medication field
  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }))
  }

  // Update medication field
  const updateMedication = (index: number, field: keyof Medication, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }))
  }

  // Filter prescriptions
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.patientId.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPatient = selectedPatient === "all" || prescription.patientId._id === selectedPatient
    return matchesSearch && matchesPatient
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "completed":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <DynamicDashboardLayout requiredRole="doctor">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DynamicDashboardLayout>
    )
  }

  return (
    <DynamicDashboardLayout requiredRole="doctor">
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Prescription</DialogTitle>
                <DialogDescription>Add medications and instructions for a patient</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patient">Patient *</Label>
                    <Select value={formData.patientId} onValueChange={(value) => setFormData(prev => ({ ...prev, patientId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient._id} value={patient._id}>
                            {patient.fullname} ({patient.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="diagnosis">Diagnosis *</Label>
                    <Input 
                      placeholder="Enter diagnosis" 
                      value={formData.diagnosis}
                      onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Medications *</Label>
                  <div className="space-y-3 mt-2">
                    {formData.medications.map((med, index) => (
                      <div key={index} className="grid grid-cols-5 gap-2 items-end">
                        <Input 
                          placeholder="Medication name" 
                          value={med.name}
                          onChange={(e) => updateMedication(index, "name", e.target.value)}
                        />
                        <Input 
                          placeholder="Dosage" 
                          value={med.dosage}
                          onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                        />
                        <Input 
                          placeholder="Frequency" 
                          value={med.frequency}
                          onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                        />
                        <Input 
                          placeholder="Duration" 
                          value={med.duration}
                          onChange={(e) => updateMedication(index, "duration", e.target.value)}
                        />
                        <div className="flex gap-1">
                          <Input 
                            placeholder="Qty" 
                            type="number"
                            value={med.quantity}
                            onChange={(e) => updateMedication(index, "quantity", parseInt(e.target.value) || 1)}
                            className="w-16"
                          />
                          {formData.medications.length > 1 && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeMedication(index)}
                              className="px-2"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addMedication}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Medication
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="followUpDate">Follow-up Date</Label>
                    <Input 
                      type="date" 
                      value={formData.followUpDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="instructions">Instructions</Label>
                    <Input 
                      placeholder="General instructions" 
                      value={formData.instructions}
                      onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    placeholder="Additional notes or warnings..." 
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsNewPrescriptionOpen(false)
                  resetForm()
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreatePrescription}
                  disabled={creating || !formData.patientId || !formData.diagnosis || formData.medications.some(m => !m.name || !m.dosage || !m.frequency || !m.duration)}
                >
                  {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Create Prescription
                </Button>
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
                  {patients.map((patient) => (
                    <SelectItem key={patient._id} value={patient._id}>
                      {patient.fullname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {filteredPrescriptions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Pill className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No prescriptions found</p>
              </CardContent>
            </Card>
          ) : (
            filteredPrescriptions.map((prescription) => (
              <Card key={prescription._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-teal-600" />
                        {prescription.patientId.fullname}
                        <Badge variant="secondary">{prescription.patientId.email}</Badge>
                      </CardTitle>
                      <CardDescription>
                        {prescription.diagnosis} • {new Date(prescription.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(prescription.status)}
                      <Badge variant={prescription.status === "active" ? "default" : "secondary"}>
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
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{med.duration}</Badge>
                            <Badge variant="outline">Qty: {med.quantity}</Badge>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="notes">
                      <div className="space-y-3">
                        {prescription.instructions && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm font-medium mb-1">Instructions:</p>
                            <p className="text-sm">{prescription.instructions}</p>
                          </div>
                        )}
                        {prescription.notes && (
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <p className="text-sm font-medium mb-1">Notes:</p>
                            <p className="text-sm">{prescription.notes}</p>
                          </div>
                        )}
                        {prescription.followUpDate && (
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm font-medium mb-1">Follow-up Date:</p>
                            <p className="text-sm">{new Date(prescription.followUpDate).toLocaleDateString()}</p>
                          </div>
                        )}
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
            ))
          )}
        </div>
      </div>
    </DynamicDashboardLayout>
  )
}
