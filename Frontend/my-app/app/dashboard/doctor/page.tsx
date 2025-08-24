"use client"

import { DynamicDashboardLayout } from "@/components/dynamic-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Brain, 
  FileText, 
  Calendar, 
  BarChart3,
  Activity,
  Stethoscope
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {  TrendingUp, Clock, CheckCircle,  Search, Pill } from "lucide-react"
import Link from "next/link"

export default function DoctorDashboard() {
  const stats = [
    {
      title: "Total Patients",
      value: "247",
      change: "+12%",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Today's Appointments",
      value: "8",
      change: "2 pending",
      icon: Calendar,
      color: "text-accent",
    },
    {
      title: "AI Diagnoses",
      value: "156",
      change: "+8 today",
      icon: Brain,
      color: "text-chart-1",
    },
    {
      title: "Success Rate",
      value: "94.2%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-chart-2",
    },
  ]

  const recentPatients = [
    {
      name: "Sarah Johnson",
      condition: "Pneumonia Screening",
      status: "completed",
      time: "2 hours ago",
      confidence: 92,
    },
    {
      name: "Michael Chen",
      condition: "Skin Lesion Analysis",
      status: "pending",
      time: "4 hours ago",
      confidence: 87,
    },
    {
      name: "Emily Davis",
      condition: "Chest X-ray Review",
      status: "completed",
      time: "1 day ago",
      confidence: 95,
    },
  ]

  const upcomingAppointments = [
    {
      patient: "John Smith",
      time: "10:00 AM",
      type: "Follow-up",
      status: "confirmed",
    },
    {
      patient: "Lisa Wilson",
      time: "11:30 AM",
      type: "Consultation",
      status: "pending",
    },
    {
      patient: "Robert Brown",
      time: "2:00 PM",
      type: "AI Diagnosis Review",
      status: "confirmed",
    },
  ]

  return (
    <DynamicDashboardLayout requiredRole="doctor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-black text-foreground">Doctor Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent AI Diagnoses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Recent AI Diagnoses
              </CardTitle>
              <CardDescription>Latest AI-powered diagnostic results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPatients.map((patient, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">{patient.condition}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={patient.status === "completed" ? "default" : "secondary"}>
                        {patient.status === "completed" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {patient.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{patient.time}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{patient.confidence}%</p>
                    <Progress value={patient.confidence} className="w-16 h-2" />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                View All Diagnoses
              </Button>
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Appointments
              </CardTitle>
              <CardDescription>Your schedule for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">{appointment.time}</p>
                    <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                View Full Schedule
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used tools and features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/dashboard/doctor/disease-prediction">
                <Button className="h-20 flex-col gap-2 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg w-full">
                  <Search className="h-6 w-6" />
                  Disease Prediction
                </Button>
              </Link>
              <Link href="/dashboard/doctor/diagnosis">
                <Button className="h-20 flex-col gap-2 bg-gradient-to-br from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 shadow-lg w-full">
                  <Brain className="h-6 w-6" />
                  New AI Diagnosis
                </Button>
              </Link>
              <Link href="/dashboard/doctor/prescriptions">
                <Button className="h-20 flex-col gap-2 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg text-white w-full">
                  <Pill className="h-6 w-6" />
                  Prescriptions
                </Button>
              </Link>
              <Link href="/dashboard/doctor/patients">
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 bg-gradient-to-br from-background to-muted/20 hover:bg-muted/30 border-2 shadow-md w-full"
                >
                  <Users className="h-6 w-6" />
                  Patient Records
                </Button>
              </Link>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-gradient-to-br from-background to-muted/20 hover:bg-muted/30 border-2 shadow-md w-full"
              >
                <Activity className="h-6 w-6" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DynamicDashboardLayout>
  )
}
