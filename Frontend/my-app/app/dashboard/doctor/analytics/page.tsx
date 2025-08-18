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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { BarChart3, TrendingUp, Users, Brain, Calendar, Activity, Target, Award, Download } from "lucide-react"

export default function DoctorAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [metric, setMetric] = useState("all")

  // Mock analytics data
  const patientTrends = [
    { month: "Jan", newPatients: 12, totalVisits: 45, aiDiagnoses: 23 },
    { month: "Feb", newPatients: 15, totalVisits: 52, aiDiagnoses: 28 },
    { month: "Mar", newPatients: 18, totalVisits: 61, aiDiagnoses: 35 },
    { month: "Apr", newPatients: 14, totalVisits: 48, aiDiagnoses: 31 },
    { month: "May", newPatients: 20, totalVisits: 67, aiDiagnoses: 42 },
    { month: "Jun", newPatients: 16, totalVisits: 55, aiDiagnoses: 38 },
  ]

  const diagnosisAccuracy = [
    { condition: "Pneumonia", accuracy: 96.2, cases: 45, confidence: 94.1 },
    { condition: "Skin Lesions", accuracy: 94.8, cases: 32, confidence: 91.7 },
    { condition: "Chest X-Ray", accuracy: 95.5, cases: 67, confidence: 93.2 },
    { condition: "Blood Analysis", accuracy: 92.1, cases: 28, confidence: 89.4 },
  ]

  const treatmentOutcomes = [
    { name: "Successful", value: 87, color: "#0076A8" },
    { name: "Improving", value: 10, color: "#FF6F61" },
    { name: "Ongoing", value: 3, color: "#F0F4F8" },
  ]

  const weeklyActivity = [
    { day: "Mon", appointments: 8, diagnoses: 5, patients: 7 },
    { day: "Tue", appointments: 12, diagnoses: 8, patients: 10 },
    { day: "Wed", appointments: 10, diagnoses: 6, patients: 9 },
    { day: "Thu", appointments: 14, diagnoses: 9, patients: 12 },
    { day: "Fri", appointments: 11, diagnoses: 7, patients: 10 },
    { day: "Sat", appointments: 6, diagnoses: 3, patients: 5 },
    { day: "Sun", appointments: 4, diagnoses: 2, patients: 3 },
  ]

  const performanceMetrics = [
    {
      title: "Patient Satisfaction",
      value: "4.8/5.0",
      change: "+0.2",
      trend: "up",
      icon: Award,
      color: "text-primary",
    },
    {
      title: "Diagnosis Accuracy",
      value: "95.2%",
      change: "+1.4%",
      trend: "up",
      icon: Target,
      color: "text-chart-1",
    },
    {
      title: "Response Time",
      value: "2.3 min",
      change: "-0.5 min",
      trend: "up",
      icon: Activity,
      color: "text-accent",
    },
    {
      title: "Cases Resolved",
      value: "94.7%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-chart-2",
    },
  ]

  const topConditions = [
    { condition: "Respiratory Issues", cases: 45, percentage: 32.1 },
    { condition: "Skin Conditions", cases: 32, percentage: 22.9 },
    { condition: "Cardiovascular", cases: 28, percentage: 20.0 },
    { condition: "Neurological", cases: 18, percentage: 12.9 },
    { condition: "Other", cases: 17, percentage: 12.1 },
  ]

  return (
    <DashboardLayout userType="doctor" userName="Dr. James Wilson" userEmail="james.wilson@medinet.com">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-black text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Insights into your medical practice and patient outcomes</p>
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
              Export
            </Button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceMetrics.map((metric) => (
            <Card key={metric.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-3 w-3 text-chart-1" />
                      <span className="text-chart-1">{metric.change}</span>
                    </div>
                  </div>
                  <metric.icon className={`h-8 w-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Patient Trends
              </CardTitle>
              <CardDescription>Monthly patient activity and AI diagnosis usage</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  newPatients: { label: "New Patients", color: "#0076A8" },
                  totalVisits: { label: "Total Visits", color: "#FF6F61" },
                  aiDiagnoses: { label: "AI Diagnoses", color: "#F0F4F8" },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patientTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line type="monotone" dataKey="newPatients" stroke="#0076A8" strokeWidth={2} />
                    <Line type="monotone" dataKey="totalVisits" stroke="#FF6F61" strokeWidth={2} />
                    <Line type="monotone" dataKey="aiDiagnoses" stroke="#3A3A3A" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Treatment Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Treatment Outcomes
              </CardTitle>
              <CardDescription>Success rate of patient treatments</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  successful: { label: "Successful", color: "#0076A8" },
                  improving: { label: "Improving", color: "#FF6F61" },
                  ongoing: { label: "Ongoing", color: "#F0F4F8" },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={treatmentOutcomes}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {treatmentOutcomes.map((entry, index) => (
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

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Activity Overview
            </CardTitle>
            <CardDescription>Your daily activity patterns and workload distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                appointments: { label: "Appointments", color: "#0076A8" },
                diagnoses: { label: "AI Diagnoses", color: "#FF6F61" },
                patients: { label: "Unique Patients", color: "#3A3A3A" },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="appointments" fill="#0076A8" />
                  <Bar dataKey="diagnoses" fill="#FF6F61" />
                  <Bar dataKey="patients" fill="#3A3A3A" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Diagnosis Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Diagnosis Performance
              </CardTitle>
              <CardDescription>Accuracy metrics for different diagnostic categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {diagnosisAccuracy.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.condition}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.cases} cases</Badge>
                        <span className="text-sm font-medium">{item.accuracy}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.accuracy}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Confidence: {item.confidence}%</span>
                      <span>Accuracy: {item.accuracy}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Most Common Conditions
              </CardTitle>
              <CardDescription>Breakdown of conditions you've treated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topConditions.map((condition, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{condition.condition}</span>
                        <span className="text-sm text-muted-foreground">{condition.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${condition.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-medium">{condition.cases}</p>
                      <p className="text-xs text-muted-foreground">cases</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights and Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Insights</CardTitle>
            <CardDescription>Personalized recommendations to improve your practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-primary">Performance Improvement</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your diagnosis accuracy has improved by 3.2% this month. Consider focusing on cardiovascular cases
                      to further enhance your expertise.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-accent/10 rounded-lg">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-medium text-accent">Schedule Optimization</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your busiest days are Tuesday and Thursday. Consider redistributing some appointments to optimize
                      patient wait times.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
