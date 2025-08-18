import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Brain,
  Activity,
  TrendingUp,
  Server,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Shield,
  Database,
} from "lucide-react"

export default function AdminDashboard() {
  const systemStats = [
    {
      title: "Total Users",
      value: "1,247",
      change: "+23 today",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "AI Diagnoses",
      value: "5,432",
      change: "+156 today",
      icon: Brain,
      color: "text-accent",
    },
    {
      title: "System Uptime",
      value: "99.9%",
      change: "30 days",
      icon: Server,
      color: "text-chart-1",
    },
    {
      title: "Success Rate",
      value: "94.7%",
      change: "+1.2%",
      icon: TrendingUp,
      color: "text-chart-2",
    },
  ]

  const userBreakdown = [
    { type: "Doctors", count: 89, percentage: 7.1 },
    { type: "Patients", count: 1134, percentage: 91.0 },
    { type: "Admins", count: 24, percentage: 1.9 },
  ]

  const aiModelPerformance = [
    {
      model: "Pneumonia Detection",
      accuracy: 96.2,
      usage: 1234,
      status: "active",
    },
    {
      model: "Skin Lesion Analysis",
      accuracy: 94.8,
      usage: 987,
      status: "active",
    },
    {
      model: "Chest X-Ray Analysis",
      accuracy: 95.5,
      usage: 2156,
      status: "active",
    },
  ]

  const systemAlerts = [
    {
      type: "warning",
      message: "High server load detected on AI processing cluster",
      time: "5 minutes ago",
    },
    {
      type: "info",
      message: "Scheduled maintenance completed successfully",
      time: "2 hours ago",
    },
    {
      type: "success",
      message: "New AI model deployed: Enhanced Pneumonia Detection v2.1",
      time: "1 day ago",
    },
  ]

  return (
    <DashboardLayout userType="admin" userName="Admin User" userEmail="admin@medinet.com">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-black text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management console</p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemStats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                User Distribution
              </CardTitle>
              <CardDescription>Breakdown of platform users by type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userBreakdown.map((user, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{user.type}</span>
                    <span className="text-muted-foreground">
                      {user.count} ({user.percentage}%)
                    </span>
                  </div>
                  <Progress value={user.percentage} className="h-2" />
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>

          {/* AI Model Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Model Performance
              </CardTitle>
              <CardDescription>Current AI model accuracy and usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiModelPerformance.map((model, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{model.model}</p>
                    <p className="text-sm text-muted-foreground">{model.usage} diagnoses</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">{model.accuracy}%</p>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {model.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                Manage AI Models
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Alerts
            </CardTitle>
            <CardDescription>Recent system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-accent mt-0.5" />}
                {alert.type === "info" && <Activity className="h-5 w-5 text-primary mt-0.5" />}
                {alert.type === "success" && <CheckCircle className="h-5 w-5 text-chart-1 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent">
              View All Alerts
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>System Management</CardTitle>
            <CardDescription>Administrative tools and controls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="h-20 flex-col gap-2">
                <Users className="h-6 w-6" />
                User Management
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Brain className="h-6 w-6" />
                AI Models
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Database className="h-6 w-6" />
                Database
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Shield className="h-6 w-6" />
                Security
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
