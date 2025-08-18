"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
} from "lucide-react"

export default function AppointmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week")
  const [filterStatus, setFilterStatus] = useState("all")

  const appointments = [
    {
      id: "1",
      patient: "Sarah Johnson",
      patientAvatar: "/placeholder.svg?height=32&width=32",
      date: "2024-03-20",
      time: "09:00",
      duration: 30,
      type: "Follow-up",
      status: "confirmed",
      location: "Room 101",
      mode: "in-person",
      notes: "Pneumonia treatment follow-up",
      phone: "(555) 123-4567",
    },
    {
      id: "2",
      patient: "Michael Chen",
      patientAvatar: "/placeholder.svg?height=32&width=32",
      date: "2024-03-20",
      time: "10:30",
      duration: 45,
      type: "Consultation",
      status: "pending",
      location: "Room 102",
      mode: "in-person",
      notes: "Skin lesion consultation",
      phone: "(555) 234-5678",
    },
    {
      id: "3",
      patient: "Emily Davis",
      patientAvatar: "/placeholder.svg?height=32&width=32",
      date: "2024-03-20",
      time: "14:00",
      duration: 30,
      type: "Telemedicine",
      status: "confirmed",
      location: "Virtual",
      mode: "video",
      notes: "Routine check-in",
      phone: "(555) 345-6789",
    },
    {
      id: "4",
      patient: "Robert Brown",
      patientAvatar: "/placeholder.svg?height=32&width=32",
      date: "2024-03-21",
      time: "11:00",
      duration: 60,
      type: "AI Diagnosis Review",
      status: "confirmed",
      location: "Room 103",
      mode: "in-person",
      notes: "Review AI diagnosis results",
      phone: "(555) 456-7890",
    },
    {
      id: "5",
      patient: "Lisa Wilson",
      patientAvatar: "/placeholder.svg?height=32&width=32",
      date: "2024-03-21",
      time: "15:30",
      duration: 30,
      type: "Follow-up",
      status: "cancelled",
      location: "Room 101",
      mode: "in-person",
      notes: "Patient cancelled - reschedule needed",
      phone: "(555) 567-8901",
    },
  ]

  const todayAppointments = appointments.filter((apt) => apt.date === "2024-03-20")
  const upcomingAppointments = appointments.filter((apt) => new Date(apt.date) > new Date("2024-03-20"))

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
      value: appointments.filter((a) => a.status === "pending").length,
      icon: AlertTriangle,
      color: "text-chart-2",
    },
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

  return (
    <DashboardLayout userType="doctor" userName="Dr. James Wilson" userEmail="james.wilson@medinet.com">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-black text-foreground">Appointments</h1>
            <p className="text-muted-foreground">Manage your appointment schedule and patient visits</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <CardDescription>Wednesday, March 20, 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments
                    .filter((apt) => filterStatus === "all" || apt.status === filterStatus)
                    .map((appointment) => (
                      <div key={appointment.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="text-center min-w-16">
                          <p className="text-sm font-medium">{appointment.time}</p>
                          <p className="text-xs text-muted-foreground">{appointment.duration}min</p>
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={appointment.patientAvatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {appointment.patient
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{appointment.patient}</p>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{appointment.type}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              {getModeIcon(appointment.mode)}
                              <span>{appointment.location}</span>
                            </div>
                            <span>{appointment.phone}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {appointment.status === "pending" && (
                            <>
                              <Button size="sm" variant="outline">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Confirm
                              </Button>
                              <Button size="sm" variant="outline">
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </>
                          )}
                          {appointment.status === "confirmed" && (
                            <Button size="sm" variant="outline">
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
                  <div key={appointment.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={appointment.patientAvatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {appointment.patient
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{appointment.patient}</p>
                      <p className="text-xs text-muted-foreground">{appointment.type}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{appointment.date}</span>
                        <span>{appointment.time}</span>
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
                const dayAppointments = appointments.filter((apt) => apt.date === date.toISOString().split("T")[0])

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
                          key={apt.id}
                          className={`text-xs p-1 rounded text-white ${
                            apt.status === "confirmed"
                              ? "bg-primary"
                              : apt.status === "pending"
                                ? "bg-accent"
                                : "bg-muted-foreground"
                          }`}
                        >
                          {apt.time} {apt.patient.split(" ")[0]}
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
    </DashboardLayout>
  )
}
