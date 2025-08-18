import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Calendar,
  FileText,
  Heart,
  Thermometer,
  Weight,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from "lucide-react"

export default function PatientDashboard() {
  const healthMetrics = [
    {
      title: "Blood Pressure",
      value: "120/80",
      status: "normal",
      icon: Heart,
      lastUpdated: "2 days ago",
    },
    {
      title: "Temperature",
      value: "98.6°F",
      status: "normal",
      icon: Thermometer,
      lastUpdated: "1 day ago",
    },
    {
      title: "Weight",
      value: "165 lbs",
      status: "stable",
      icon: Weight,
      lastUpdated: "1 week ago",
    },
    {
      title: "Heart Rate",
      value: "72 bpm",
      status: "normal",
      icon: Activity,
      lastUpdated: "2 days ago",
    },
  ]

  const recentTests = [
    {
      test: "Chest X-Ray",
      date: "March 15, 2024",
      result: "Normal",
      status: "completed",
      doctor: "Dr. James Wilson",
    },
    {
      test: "Blood Work",
      date: "March 10, 2024",
      result: "Pending Review",
      status: "pending",
      doctor: "Dr. Sarah Chen",
    },
    {
      test: "Skin Lesion Scan",
      date: "March 8, 2024",
      result: "Benign",
      status: "completed",
      doctor: "Dr. Michael Brown",
    },
  ]

  const upcomingAppointments = [
    {
      doctor: "Dr. James Wilson",
      date: "March 20, 2024",
      time: "10:00 AM",
      type: "Follow-up Consultation",
      status: "confirmed",
    },
    {
      doctor: "Dr. Sarah Chen",
      date: "March 25, 2024",
      time: "2:30 PM",
      type: "Blood Work Review",
      status: "pending",
    },
  ]

  return (
    <DashboardLayout userType="patient" userName="John Smith" userEmail="john.smith@email.com">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-black text-foreground">Patient Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, John. Here's your health overview.</p>
        </div>

        {/* Health Metrics */}
        <div>
          <h2 className="text-xl font-serif font-bold mb-4">Health Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthMetrics.map((metric) => (
              <Card key={metric.title}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className="h-5 w-5 text-primary" />
                    <Badge variant={metric.status === "normal" ? "default" : "secondary"}>{metric.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">Updated {metric.lastUpdated}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Test Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Test Results
              </CardTitle>
              <CardDescription>Your latest medical test results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{test.test}</p>
                    <p className="text-sm text-muted-foreground">by {test.doctor}</p>
                    <p className="text-xs text-muted-foreground">{test.date}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">{test.result}</p>
                    <Badge variant={test.status === "completed" ? "default" : "secondary"}>
                      {test.status === "completed" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {test.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                View All Results
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Your scheduled medical appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{appointment.doctor}</p>
                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                    {appointment.status}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                Schedule New Appointment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Health Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Health Insights
            </CardTitle>
            <CardDescription>AI-powered insights about your health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Great Progress!</p>
                  <p className="text-sm text-muted-foreground">
                    Your blood pressure has been consistently normal for the past 3 months. Keep up the good work with
                    your current lifestyle.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-accent/10 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="font-medium">Reminder</p>
                  <p className="text-sm text-muted-foreground">
                    It's been 6 months since your last comprehensive check-up. Consider scheduling one soon.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your health easily</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex-col gap-2">
                <Calendar className="h-6 w-6" />
                Book Appointment
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <FileText className="h-6 w-6" />
                View Records
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Activity className="h-6 w-6" />
                Update Metrics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
