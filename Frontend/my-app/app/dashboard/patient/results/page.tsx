"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TestTube,
  Download,
  Search,
  Calendar,
  User,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react"

export default function PatientResultsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")

  const testResults = [
    {
      id: "1",
      testName: "Complete Blood Count (CBC)",
      testType: "Blood Work",
      doctor: "Dr. Michael Brown",
      date: "2024-03-15",
      status: "completed",
      priority: "routine",
      results: [
        { parameter: "White Blood Cells", value: "7.2", unit: "K/uL", range: "4.0-11.0", status: "normal" },
        { parameter: "Red Blood Cells", value: "4.8", unit: "M/uL", range: "4.2-5.4", status: "normal" },
        { parameter: "Hemoglobin", value: "14.5", unit: "g/dL", range: "12.0-16.0", status: "normal" },
        { parameter: "Platelets", value: "285", unit: "K/uL", range: "150-450", status: "normal" },
      ],
      summary: "All blood parameters are within normal ranges. No abnormalities detected.",
      recommendations: "Continue current health regimen. Next CBC recommended in 6 months.",
    },
    {
      id: "2",
      testName: "Chest X-Ray",
      testType: "Imaging",
      doctor: "Dr. James Wilson",
      date: "2024-03-12",
      status: "completed",
      priority: "urgent",
      results: [
        { parameter: "Lung Fields", value: "Clear", unit: "", range: "Normal", status: "normal" },
        { parameter: "Heart Size", value: "Normal", unit: "", range: "Normal", status: "normal" },
        { parameter: "Pneumonia", value: "Resolved", unit: "", range: "None", status: "improved" },
      ],
      summary: "Pneumonia has resolved completely. Lung fields are clear with no residual changes.",
      recommendations: "Continue prescribed antibiotics as directed. Follow-up in 2 weeks.",
    },
    {
      id: "3",
      testName: "Lipid Panel",
      testType: "Blood Work",
      doctor: "Dr. Sarah Chen",
      date: "2024-03-08",
      status: "completed",
      priority: "routine",
      results: [
        { parameter: "Total Cholesterol", value: "195", unit: "mg/dL", range: "<200", status: "normal" },
        { parameter: "LDL Cholesterol", value: "118", unit: "mg/dL", range: "<100", status: "high" },
        { parameter: "HDL Cholesterol", value: "52", unit: "mg/dL", range: ">40", status: "normal" },
        { parameter: "Triglycerides", value: "125", unit: "mg/dL", range: "<150", status: "normal" },
      ],
      summary: "LDL cholesterol is slightly elevated. Other lipid parameters are within normal ranges.",
      recommendations: "Consider dietary modifications and increased physical activity. Recheck in 3 months.",
    },
    {
      id: "4",
      testName: "Skin Lesion Biopsy",
      testType: "Pathology",
      doctor: "Dr. Lisa Davis",
      date: "2024-03-05",
      status: "pending",
      priority: "routine",
      results: [],
      summary: "Sample sent for pathological analysis. Results pending.",
      recommendations: "Results expected within 5-7 business days. Will contact with findings.",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-chart-1" />
      case "pending":
        return <Clock className="h-4 w-4 text-accent" />
      case "abnormal":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      default:
        return <TestTube className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Completed</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "abnormal":
        return <Badge variant="destructive">Abnormal</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getParameterStatus = (status: string) => {
    switch (status) {
      case "normal":
        return { icon: <CheckCircle className="h-4 w-4 text-chart-1" />, color: "text-chart-1" }
      case "high":
        return { icon: <TrendingUp className="h-4 w-4 text-destructive" />, color: "text-destructive" }
      case "low":
        return { icon: <TrendingDown className="h-4 w-4 text-accent" />, color: "text-accent" }
      case "improved":
        return { icon: <TrendingUp className="h-4 w-4 text-chart-1" />, color: "text-chart-1" }
      default:
        return { icon: <Minus className="h-4 w-4 text-muted-foreground" />, color: "text-muted-foreground" }
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>
      case "routine":
        return <Badge variant="outline">Routine</Badge>
      case "follow-up":
        return <Badge variant="secondary">Follow-up</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const filteredResults = testResults.filter((result) => {
    const matchesSearch =
      result.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.testType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || result.status === filterStatus
    const matchesType = filterType === "all" || result.testType.toLowerCase() === filterType.toLowerCase()
    return matchesSearch && matchesStatus && matchesType
  })

  const completedResults = testResults.filter((r) => r.status === "completed").length
  const pendingResults = testResults.filter((r) => r.status === "pending").length
  const abnormalResults = testResults.filter((r) =>
    r.results.some((param) => param.status === "high" || param.status === "low"),
  ).length

  return (
    <DashboardLayout userType="patient" userName="John Smith" userEmail="john.smith@email.com">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-black text-foreground">Test Results</h1>
            <p className="text-muted-foreground">View and track your medical test results and reports</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export All Results
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Results</p>
                  <p className="text-2xl font-bold">{testResults.length}</p>
                </div>
                <TestTube className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedResults}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingResults}</p>
                </div>
                <Clock className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Needs Attention</p>
                  <p className="text-2xl font-bold">{abnormalResults}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search test results..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="abnormal">Abnormal</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="blood work">Blood Work</SelectItem>
                  <SelectItem value="imaging">Imaging</SelectItem>
                  <SelectItem value="pathology">Pathology</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <div className="space-y-4">
          {filteredResults.map((result) => (
            <Card key={result.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg">{getStatusIcon(result.status)}</div>
                    <div>
                      <CardTitle className="text-lg">{result.testName}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {result.doctor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {result.date}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(result.status)}
                    {getPriorityBadge(result.priority)}
                    <Badge variant="outline">{result.testType}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.results.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Test Parameters</h4>
                    <div className="space-y-2">
                      {result.results.map((param, index) => {
                        const statusInfo = getParameterStatus(param.status)
                        return (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              {statusInfo.icon}
                              <div>
                                <p className="font-medium">{param.parameter}</p>
                                {param.range && <p className="text-xs text-muted-foreground">Normal: {param.range}</p>}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-medium ${statusInfo.color}`}>
                                {param.value} {param.unit}
                              </p>
                              <p className="text-xs text-muted-foreground capitalize">{param.status}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Summary</h4>
                    <p className="text-muted-foreground">{result.summary}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <p className="text-muted-foreground">{result.recommendations}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-3 w-3" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-3 w-3" />
                      Download Report
                    </Button>
                  </div>
                  {result.status === "pending" && (
                    <p className="text-sm text-muted-foreground">Results expected within 5-7 business days</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResults.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <TestTube className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No test results found</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm || filterStatus !== "all" || filterType !== "all"
                  ? "Try adjusting your search or filters"
                  : "Your test results will appear here once available"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
