"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, Plus, Video, MapPin, Phone, CheckCircle, X, Edit, User } from "lucide-react"

export default function PatientAppointmentsPage() {
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    doctor: "",
    date: "",
    time: "",
    type: "",
    mode: "",
    reason: "",
  })

  const appointments = [
    {
      id: "1",
      doctor: "Dr. James Wilson",
      doctorAvatar: "/placeholder.svg?height=32&width=32",
      specialty: "Internal Medicine",
      date: "2024-03-25",
      time: "10:00 AM",
      duration: 30,
      type: "Follow-up",
      status: "confirmed",
      location: "Room 101",
      mode: "in-person",
      reason: "Pneumonia treatment follow-up",
      address: "123 Medical Center Dr, City, State",
    },
    {
      id: "2",
      doctor: "Dr. Sarah Chen",
      doctorAvatar: "/placeholder.svg?height=32&width=32",
      specialty: "Dermatology",
      date: "2024-04-02",
      time: "2:30 PM",
      duration: 45,
      type: "Consultation",
      status: "pending",
      location: "Room 205",
      mode: "in-person",
      reason: "Skin lesion examination",
      address: "123 Medical Center Dr, City, State",
    },
    {
      id: "3",
      doctor: "Dr. Michael Brown",
      doctorAvatar: "/placeholder.svg?height=32&width=32",
      specialty: "Cardiology",
      date: "2024-04-10",
      time: "11:00 AM",
      duration: 30,
      type: "Telemedicine",
      status: "confirmed",
      location: "Virtual",
      mode: "video",
      reason: "Routine cardiac check-up",
      address: "Virtual Appointment",
    },
  ]

  const doctors = [
    { id: "1", name: "Dr. James Wilson", specialty: "Internal Medicine" },
    { id: "2", name: "Dr. Sarah Chen", specialty: "Dermatology" },
    { id: "3", name: "Dr. Michael Brown", specialty: "Cardiology" },
    { id: "4", name: "Dr. Lisa Davis", specialty: "Pediatrics" },
  ]

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="default">Confirmed</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      case "completed":
        return <Badge variant="outline">Completed</Badge>
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

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle booking submission
    console.log("Booking submitted:", bookingForm)
    setShowBookingDialog(false)
    setBookingForm({
      doctor: "",
      date: "",
      time: "",
      type: "",
      mode: "",
      reason: "",
    })
  }

  const upcomingAppointments = appointments.filter((apt) => new Date(apt.date) >= new Date())
  const pastAppointments = appointments.filter((apt) => new Date(apt.date) < new Date())

  return (
    <DashboardLayout userType="patient" userName="John Smith" userEmail="john.smith@email.com">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-black text-foreground">My Appointments</h1>
            <p className="text-muted-foreground">Manage your medical appointments and consultations</p>
          </div>
          <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
                <DialogDescription>Schedule an appointment with your healthcare provider</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor">Select Doctor</Label>
                  <Select
                    value={bookingForm.doctor}
                    onValueChange={(value) => setBookingForm({ ...bookingForm, doctor: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <Select
                    value={bookingForm.time}
                    onValueChange={(value) => setBookingForm({ ...bookingForm, time: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Appointment Type</Label>
                  <Select
                    value={bookingForm.type}
                    onValueChange={(value) => setBookingForm({ ...bookingForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="routine">Routine Checkup</SelectItem>
                      <SelectItem value="urgent">Urgent Care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mode">Appointment Mode</Label>
                  <Select
                    value={bookingForm.mode}
                    onValueChange={(value) => setBookingForm({ ...bookingForm, mode: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-person">In-Person</SelectItem>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Textarea
                    id="reason"
                    placeholder="Describe your symptoms or reason for the appointment..."
                    value={bookingForm.reason}
                    onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowBookingDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Book Appointment
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">{appointments.length}</p>
                </div>
                <Clock className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{pastAppointments.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>Your scheduled medical appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="text-center min-w-20">
                    <p className="text-sm font-medium">{appointment.time}</p>
                    <p className="text-xs text-muted-foreground">{appointment.date}</p>
                  </div>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={appointment.doctorAvatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{appointment.doctor}</p>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{appointment.specialty}</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {appointment.type} - {appointment.reason}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {getModeIcon(appointment.mode)}
                        <span>{appointment.location}</span>
                      </div>
                      <span>{appointment.duration} minutes</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {appointment.status === "confirmed" && appointment.mode === "video" && (
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        Join Call
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Reschedule
                    </Button>
                    <Button size="sm" variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
              {upcomingAppointments.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">No upcoming appointments</p>
                  <Button onClick={() => setShowBookingDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Book Your First Appointment
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Past Appointments
              </CardTitle>
              <CardDescription>Your appointment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pastAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center gap-4 p-4 border rounded-lg opacity-75">
                    <div className="text-center min-w-20">
                      <p className="text-sm font-medium">{appointment.time}</p>
                      <p className="text-xs text-muted-foreground">{appointment.date}</p>
                    </div>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={appointment.doctorAvatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{appointment.doctor}</p>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{appointment.specialty}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.type} - {appointment.reason}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      View Summary
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
