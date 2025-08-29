"use client"

import { useState, useEffect } from "react"
import { DynamicDashboardLayout } from "@/components/dynamic-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Clock,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Video,
  MapPin,
  Phone,
  CheckCircle,
  AlertTriangle,
  X,
  Loader2,
  User,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { api } from "@/lib/api"

interface Appointment {
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
  appointmentDate: string
  appointmentTime: string
  appointmentType: string
  status: string
  reason: string
  symptoms: string[]
  notes?: string
  duration: number
  location: string
  createdAt: string
}

interface Patient {
  _id: string
  fullname: string
  email: string
}

const APPOINTMENTS_DUMMY: Appointment[] = [
  {
    _id: "apt-1",
    patientId: { _id: "p1", fullname: "Sarah Johnson", email: "sarah@example.com" },
    doctorId: { _id: "d1", fullname: "Dr. Demo" },
    appointmentDate: new Date().toISOString(),
    appointmentTime: "10:00",
    appointmentType: "consultation",
    status: "confirmed",
    reason: "Follow-up",
    symptoms: ["cough"],
    duration: 30,
    location: "Room 101",
    createdAt: new Date().toISOString(),
  }
]

const PATIENTS_DUMMY: Patient[] = [
  { _id: "p1", fullname: "Sarah Johnson", email: "sarah@example.com" },
  { _id: "p2", fullname: "Michael Chen", email: "michael@example.com" },
]

export default function AppointmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week")
  const [filterStatus, setFilterStatus] = useState("all")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    patientId: "",
    appointmentDate: "",
    appointmentTime: "",
    appointmentType: "consultation",
    reason: "",
    symptoms: [""],
    notes: "",
    duration: 30,
    location: "Clinic"
  })

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await api.get("/appointments/doctor")
      const list: Appointment[] = response?.data?.data?.appointments || []
      setAppointments(list.length ? list : APPOINTMENTS_DUMMY)
    } catch (error: any) {
      setAppointments(APPOINTMENTS_DUMMY)
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
    fetchAppointments()
    fetchPatients()
  }, [])

  // Create appointment
  const handleCreateAppointment = async () => {
    try {
      setCreating(true)
      const appointmentData = {
        ...formData,
        symptoms: formData.symptoms.filter(s => s.trim() !== "")
      }
      await api.post("/appointments", appointmentData)
      setIsNewAppointmentOpen(false)
      resetForm()
      fetchAppointments()
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create appointment")
    } finally {
      setCreating(false)
    }
  }

  // Update appointment status
  const handleStatusUpdate = async (appointmentId: string, status: string) => {
    try {
      await api.patch(`/appointments/${appointmentId}/status`, { status })
      fetchAppointments()
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update appointment status")
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      patientId: "",
      appointmentDate: "",
      appointmentTime: "",
      appointmentType: "consultation",
      reason: "",
      symptoms: [""],
      notes: "",
      duration: 30,
      location: "Clinic"
    })
  }

  // Add symptom field
  const addSymptom = () => {
    setFormData(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, ""]
    }))
  }

  // Remove symptom field
  const removeSymptom = (index: number) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter((_, i) => i !== index)
    }))
  }

  // Update symptom field
  const updateSymptom = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.map((symptom, i) => i === index ? value : symptom)
    }))
  }

  const todayAppointments = appointments.filter((apt) => 
    new Date(apt.appointmentDate).toDateString() === new Date().toDateString()
  )
  const upcomingAppointments = appointments.filter((apt) => 
    new Date(apt.appointmentDate) > new Date()
  )

  const stats = [
    { title: "Today's Appointments", value: todayAppointments.length, icon: Calendar, color: "text-primary" },
    { title: "This Week", value: appointments.length, icon: Clock, color: "text-accent" },
    {
      title: "Confirmed",
      value: appointments.filter((a) => a.status === "confirmed").length,
      icon: CheckCircle,
      color: "text-chart-1",
    },
    {
      title: "Pending",
      value: appointments.filter((a) => a.status === "scheduled").length,
      icon: AlertTriangle,
      color: "text-chart-2",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="default">Confirmed</Badge>
      case "scheduled":
        return <Badge variant="secondary">Scheduled</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      case "completed":
        return <Badge variant="outline">Completed</Badge>
      case "in-progress":
        return <Badge variant="default">In Progress</Badge>
      case "no-show":
        return <Badge variant="destructive">No Show</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "video":
        return <Video className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-black text-foreground">Appointments</h1>
            <p className="text-muted-foreground">Manage your appointment schedule and patient visits</p>
          </div>
          <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Appointment</DialogTitle>
                <DialogDescription>Schedule an appointment with a patient</DialogDescription>
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
                    <Label htmlFor="appointmentType">Appointment Type</Label>
                    <Select value={formData.appointmentType} onValueChange={(value) => setFormData(prev => ({ ...prev, appointmentType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="routine-checkup">Routine Checkup</SelectItem>
                        <SelectItem value="specialist">Specialist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="appointmentDate">Date *</Label>
                    <Input 
                      type="date" 
                      value={formData.appointmentDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, appointmentDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="appointmentTime">Time *</Label>
                    <Input 
                      type="time" 
                      value={formData.appointmentTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, appointmentTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (min)</Label>
                    <Input 
                      type="number" 
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="reason">Reason *</Label>
                  <Input 
                    placeholder="Appointment reason" 
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Symptoms</Label>
                  <div className="space-y-2 mt-2">
                    {formData.symptoms.map((symptom, index) => (
                      <div key={index} className="flex gap-2">
                        <Input 
                          placeholder="Enter symptom" 
                          value={symptom}
                          onChange={(e) => updateSymptom(index, e.target.value)}
                        />
                        {formData.symptoms.length > 1 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeSymptom(index)}
                            className="px-2"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addSymptom}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Symptom
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      placeholder="Appointment location" 
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Input 
                      placeholder="Additional notes" 
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsNewAppointmentOpen(false)
                  resetForm()
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateAppointment}
                  disabled={creating || !formData.patientId || !formData.appointmentDate || !formData.appointmentTime || !formData.reason}
                >
                  {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Create Appointment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Today's Schedule
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <CardDescription>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments
                    .filter((apt) => filterStatus === "all" || apt.status === filterStatus)
                    .map((appointment) => (
                      <div key={appointment._id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="text-center min-w-16">
                          <p className="text-sm font-medium">{appointment.appointmentTime}</p>
                          <p className="text-xs text-muted-foreground">{appointment.duration}min</p>
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>
                            {appointment.patientId.fullname
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{appointment.patientId.fullname}</p>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{appointment.appointmentType}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{appointment.location}</span>
                            </div>
                            <span>{appointment.patientId.email}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {appointment.status === "scheduled" && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(appointment._id, "confirmed")}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Confirm
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(appointment._id, "cancelled")}>
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </>
                          )}
                          {appointment.status === "confirmed" && (
                            <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(appointment._id, "in-progress")}>
                              Start Visit
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  {todayAppointments.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No appointments scheduled for today</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming
              </CardTitle>
              <CardDescription>Next appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 5).map((appointment) => (
                  <div key={appointment._id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>
                        {appointment.patientId.fullname
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{appointment.patientId.fullname}</p>
                      <p className="text-xs text-muted-foreground">{appointment.appointmentType}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                        <span>{appointment.appointmentTime}</span>
                      </div>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  View All Upcoming
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar View */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Calendar View</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-32 text-center">
                  {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="flex gap-1 ml-4">
                  <Button
                    variant={viewMode === "day" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("day")}
                  >
                    Day
                  </Button>
                  <Button
                    variant={viewMode === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("week")}
                  >
                    Week
                  </Button>
                  <Button
                    variant={viewMode === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("month")}
                  >
                    Month
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - 6)
                const isCurrentMonth = date.getMonth() === currentDate.getMonth()
                const isToday = date.toDateString() === new Date().toDateString()
                const dayAppointments = appointments.filter((apt) => 
                  new Date(apt.appointmentDate).toDateString() === date.toDateString()
                )

                return (
                  <div
                    key={i}
                    className={`min-h-24 p-2 border rounded-lg ${
                      isCurrentMonth ? "bg-background" : "bg-muted/50"
                    } ${isToday ? "ring-2 ring-primary" : ""}`}
                  >
                    <div className="text-sm font-medium mb-1">{date.getDate()}</div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map((apt) => (
                        <div
                          key={apt._id}
                          className={`text-xs p-1 rounded text-white ${
                            apt.status === "confirmed"
                              ? "bg-primary"
                              : apt.status === "scheduled"
                                ? "bg-accent"
                                : "bg-muted-foreground"
                          }`}
                        >
                          {apt.appointmentTime} {apt.patientId.fullname.split(" ")[0]}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-muted-foreground">+{dayAppointments.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DynamicDashboardLayout>
  )
}
