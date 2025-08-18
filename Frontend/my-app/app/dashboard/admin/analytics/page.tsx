"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  Users,
  Brain,
  Server,
  Activity,
  Globe,
  Shield,
  Download,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [metric, setMetric] = useState("all")

  // Mock analytics data
  const platformGrowth = [
    { month: "Jan", users: 1150, doctors: 85, patients: 1065, diagnoses: 2340 },
    { month: "Feb", users: 1280, doctors: 92, patients: 1188, diagnoses: 2680 },
    { month: "Mar", users: 1420, doctors: 98, patients: 1322, diagnoses: 3120 },
    { month: "Apr", users: 1580, doctors: 105, patients: 1475, diagnoses: 3450 },
    { month: "May", users: 1750, doctors: 112, patients: 1638, diagnoses: 3890 },
    { month: "Jun", users: 1920, doctors: 118, patients: 1802, diagnoses: 4320 },
  ]

  const aiModelPerformance = [
    { model: "Pneumonia Detection", accuracy: 96.2, usage: 1234, uptime: 99.8, version: "v2.1" },
    { model: "Skin Lesion Analysis", accuracy: 94.8, usage: 987, uptime: 99.5, version: "v1.8" },
    { model: "Chest X-Ray Analysis", accuracy: 95.5, usage: 2156, uptime: 99.9, version: "v3.0" },
    { model: "Blood Analysis", accuracy: 92.1, usage: 654, uptime: 98.7, version: "v1.5" },
  ]

  const systemMetrics = [
    { name: "CPU Usage", value: 68, color: "#0076A8" },
    { name: "Memory", value: 72, color: "#FF6F61" },
    { name: "Storage", value: 45, color: "#3A3A3A" },
    { name: "Network", value: 23, color: "#F0F4F8" },
  ]

  const userActivity = [
    { hour: "00", active: 45, diagnoses: 12, appointments: 8 },
    { hour: "04", active: 23, diagnoses: 5, appointments: 3 },
    { hour: "08", active: 156, diagnoses: 45, appointments: 32 },
    { hour: "12", active: 234, diagnoses: 67, appointments: 48 },
    { hour: "16", active: 189, diagnoses: 52, appointments: 41 },
    { hour: "20", active: 98, diagnoses: 28, appointments: 19 },
  ]

  const globalStats = [
    {
      title: "Total Users",
      value: "1,920",
      change: "+170",
      trend: "up",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "AI Diagnoses",
      value: "4,320",
      change: "+430",
      trend: "up",
      icon: Brain,
      color: "text-accent",
    },
    {
      title: "System Uptime",
      value: "99.7%",
      change: "+0.2%",
      trend: "up",
      icon: Server,
      color: "text-chart-1",
    },
    {
      title: "Success Rate",
      value: "95.1%",
      change: "+1.3%",
      trend: "up",
      icon: CheckCircle,
      color: "text-chart-2",
    },
  ]

  const geographicData = [
    { region: "North America", users: 45.2, color: "#0076A8" },
    { region: "Europe", users: 28.7, color: "#FF6F61" },
    { region: "Asia Pacific", users: 18.3, color: "#3A3A3A" },
    { region: "Latin America", users: 5.1, color: "#F0F4F8" },
    { region: "Others", users: 2.7, color: "#D1D1D1" },
  ]

  const systemAlerts = [
    {
      type: "warning",
      title: "High Server Load",
      message: "AI processing cluster experiencing high load",
      time: "5 minutes ago",
      severity: "medium",
    },
    {
      type: "info",
      title: "Model Update",
      message: "Pneumonia Detection v2.2 deployed successfully",
      time: "2 hours ago",
      severity: "low",
    },
    {
      type: "success",
      title: "Backup Completed",
      message: "Daily system backup completed successfully",
      time: "6 hours ago",
      severity: "low",
    },
  ]

  return (
    <DashboardLayout userType="admin" userName="Admin User" userEmail="admin@medinet.com">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-black text-foreground">System Analytics</h1>
            <p className="text-muted-foreground">Comprehensive platform performance and usage insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {globalStats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-3 w-3 text-chart-1" />
                      <span className="text-chart-1">{stat.change}</span>
                    </div>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Platform Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Platform Growth Trends
            </CardTitle>
            <CardDescription>User growth and platform usage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                users: { label: "Total Users", color: "#0076A8" },
                doctors: { label: "Doctors", color: "#FF6F61" },
                patients: { label: "Patients", color: "#3A3A3A" },
                diagnoses: { label: "AI Diagnoses", color: "#F0F4F8" },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={platformGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area type="monotone" dataKey="users" stackId="1" stroke="#0076A8" fill="#0076A8" fillOpacity={0.6} />
                  <Area
                    type="monotone"
                    dataKey="diagnoses"
                    stackId="2"
                    stroke="#FF6F61"
                    fill="#FF6F61"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Model Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Model Performance
              </CardTitle>
              <CardDescription>Real-time performance metrics for AI models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiModelPerformance.map((model, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{model.model}</h4>
                        <p className="text-sm text-muted-foreground">Version {model.version}</p>
                      </div>
                      <Badge variant={model.uptime > 99 ? "default" : "secondary"}>{model.uptime}% uptime</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Accuracy</p>
                        <p className="font-medium">{model.accuracy}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Usage</p>
                        <p className="font-medium">{model.usage.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Resource Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Resources
              </CardTitle>
              <CardDescription>Current system resource utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  usage: { label: "Usage %", color: "#0076A8" },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={systemMetrics}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {systemMetrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* User Activity Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Daily Activity Patterns
            </CardTitle>
            <CardDescription>User activity and system usage throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                active: { label: "Active Users", color: "#0076A8" },
                diagnoses: { label: "AI Diagnoses", color: "#FF6F61" },
                appointments: { label: "Appointments", color: "#3A3A3A" },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="active" fill="#0076A8" />
                  <Bar dataKey="diagnoses" fill="#FF6F61" />
                  <Bar dataKey="appointments" fill="#3A3A3A" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Geographic Distribution
              </CardTitle>
              <CardDescription>User distribution by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geographicData.map((region, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{region.region}</span>
                      <span className="text-sm font-medium">{region.users}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ width: `${region.users}%`, backgroundColor: region.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                System Alerts
              </CardTitle>
              <CardDescription>Recent system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-accent mt-0.5" />}
                    {alert.type === "info" && <Activity className="h-5 w-5 text-primary mt-0.5" />}
                    {alert.type === "success" && <CheckCircle className="h-5 w-5 text-chart-1 mt-0.5" />}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{alert.title}</p>
                        <Badge
                          variant={
                            alert.severity === "high"
                              ? "destructive"
                              : alert.severity === "medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
