"use client"

import { useState, useEffect } from "react"
import { DynamicDashboardLayout } from "@/components/dynamic-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, Filter, Search, Calendar, User, Brain, TrendingUp, Plus, Eye, Loader2 } from "lucide-react"
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

interface TestResult {
  testName: string
  result: string
  normalRange?: string
  unit?: string
  isAbnormal: boolean
}

interface Report {
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
  reportType: string
  title: string
  description: string
  findings: string
  testResults?: TestResult[]
  diagnosis?: string
  recommendations?: string
  status: string
  priority: string
  createdAt: string
}

interface Patient {
  _id: string
  fullname: string
  email: string
}

const REPORTS_DUMMY: Report[] = [
  {
    _id: "rep-1",
    patientId: { _id: "p1", fullname: "Sarah Johnson", email: "sarah@example.com" },
    doctorId: { _id: "d1", fullname: "Dr. Demo" },
    reportType: "lab-report",
    title: "CBC Results",
    description: "Routine blood work",
    findings: "All parameters within normal range",
    testResults: [{ testName: "Hemoglobin", result: "14.2", normalRange: "12.0-16.0", unit: "g/dL", isAbnormal: false }],
    diagnosis: "Normal",
    recommendations: "Continue lifestyle",
    status: "completed",
    priority: "medium",
    createdAt: new Date().toISOString(),
  }
]

const PATIENTS_DUMMY: Patient[] = [
  { _id: "p1", fullname: "Sarah Johnson", email: "sarah@example.com" },
  { _id: "p2", fullname: "Michael Chen", email: "michael@example.com" },
]

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [reportType, setReportType] = useState("all")
  const [dateRange, setDateRange] = useState("30d")
  const [reports, setReports] = useState<Report[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [isNewReportOpen, setIsNewReportOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    patientId: "",
    reportType: "lab-report",
    title: "",
    description: "",
    findings: "",
    testResults: [{ testName: "", result: "", normalRange: "", unit: "", isAbnormal: false }],
    diagnosis: "",
    recommendations: "",
    priority: "medium"
  })

  // Fetch reports
  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await api.get("/reports/doctor")
      const list: Report[] = response?.data?.data?.reports || []
      setReports(list.length ? list : REPORTS_DUMMY)
    } catch (error: any) {
      setReports(REPORTS_DUMMY)
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
    fetchReports()
    fetchPatients()
  }, [])

  // Create report
  const handleCreateReport = async () => {
    try {
      setCreating(true)
      const reportData = {
        ...formData,
        testResults: formData.testResults.filter(tr => tr.testName.trim() !== "" && tr.result.trim() !== "")
      }
      await api.post("/reports", reportData)
      setIsNewReportOpen(false)
      resetForm()
      fetchReports()
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create report")
    } finally {
      setCreating(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      patientId: "",
      reportType: "lab-report",
      title: "",
      description: "",
      findings: "",
      testResults: [{ testName: "", result: "", normalRange: "", unit: "", isAbnormal: false }],
      diagnosis: "",
      recommendations: "",
      priority: "medium"
    })
  }

  // Add test result field
  const addTestResult = () => {
    setFormData(prev => ({
      ...prev,
      testResults: [...prev.testResults, { testName: "", result: "", normalRange: "", unit: "", isAbnormal: false }]
    }))
  }

  // Remove test result field
  const removeTestResult = (index: number) => {
    setFormData(prev => ({
      ...prev,
      testResults: prev.testResults.filter((_, i) => i !== index)
    }))
  }

  // Update test result field
  const updateTestResult = (index: number, field: keyof TestResult, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      testResults: prev.testResults.map((tr, i) => 
        i === index ? { ...tr, [field]: value } : tr
      )
    }))
  }

  const reportTemplates = [
    {
      name: "Patient Summary",
      description: "Comprehensive patient health overview",
      icon: User,
    },
    {
      name: "AI Diagnosis Report",
      description: "Detailed AI analysis results",
      icon: Brain,
    },
    {
      name: "Treatment Progress",
      description: "Patient treatment timeline and outcomes",
      icon: TrendingUp,
    },
    {
      name: "Performance Analytics",
      description: "Practice performance metrics",
      icon: FileText,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Completed</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "reviewed":
        return <Badge variant="outline">Reviewed</Badge>
      case "archived":
        return <Badge variant="secondary">Archived</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.patientId.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = reportType === "all" || report.reportType.toLowerCase().includes(reportType.toLowerCase())
    return matchesSearch && matchesType
  })

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
            <h1 className="text-3xl font-serif font-black text-foreground">Reports & Documentation</h1>
            <p className="text-muted-foreground">Generate and manage medical reports and documentation</p>
          </div>
          <Dialog open={isNewReportOpen} onOpenChange={setIsNewReportOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>Generate a comprehensive medical report for a patient</DialogDescription>
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
                    <Label htmlFor="reportType">Report Type *</Label>
                    <Select value={formData.reportType} onValueChange={(value) => setFormData(prev => ({ ...prev, reportType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lab-report">Lab Report</SelectItem>
                        <SelectItem value="imaging-report">Imaging Report</SelectItem>
                        <SelectItem value="diagnostic-report">Diagnostic Report</SelectItem>
                        <SelectItem value="progress-report">Progress Report</SelectItem>
                        <SelectItem value="discharge-summary">Discharge Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="title">Report Title *</Label>
                  <Input 
                    placeholder="Enter report title" 
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea 
                    placeholder="Brief description of the report" 
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="findings">Findings *</Label>
                  <Textarea 
                    placeholder="Detailed findings and observations" 
                    value={formData.findings}
                    onChange={(e) => setFormData(prev => ({ ...prev, findings: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Test Results</Label>
                  <div className="space-y-3 mt-2">
                    {formData.testResults.map((test, index) => (
                      <div key={index} className="grid grid-cols-5 gap-2 items-end">
                        <Input 
                          placeholder="Test name" 
                          value={test.testName}
                          onChange={(e) => updateTestResult(index, "testName", e.target.value)}
                        />
                        <Input 
                          placeholder="Result" 
                          value={test.result}
                          onChange={(e) => updateTestResult(index, "result", e.target.value)}
                        />
                        <Input 
                          placeholder="Normal range" 
                          value={test.normalRange || ""}
                          onChange={(e) => updateTestResult(index, "normalRange", e.target.value)}
                        />
                        <Input 
                          placeholder="Unit" 
                          value={test.unit || ""}
                          onChange={(e) => updateTestResult(index, "unit", e.target.value)}
                        />
                        <div className="flex gap-1">
                          <Select 
                            value={test.isAbnormal ? "abnormal" : "normal"} 
                            onValueChange={(value) => updateTestResult(index, "isAbnormal", value === "abnormal")}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="abnormal">Abnormal</SelectItem>
                            </SelectContent>
                          </Select>
                          {formData.testResults.length > 1 && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeTestResult(index)}
                              className="px-2"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addTestResult}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Test Result
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="diagnosis">Diagnosis</Label>
                    <Input 
                      placeholder="Medical diagnosis" 
                      value={formData.diagnosis}
                      onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="recommendations">Recommendations</Label>
                  <Textarea 
                    placeholder="Treatment recommendations and next steps" 
                    value={formData.recommendations}
                    onChange={(e) => setFormData(prev => ({ ...prev, recommendations: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsNewReportOpen(false)
                  resetForm()
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateReport}
                  disabled={creating || !formData.patientId || !formData.title || !formData.description || !formData.findings}
                >
                  {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Create Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">{reports.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">
                    {reports.filter(r => {
                      const reportDate = new Date(r.createdAt)
                      const now = new Date()
                      return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear()
                    }).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {reports.filter(r => r.status === "completed").length}
                  </p>
                </div>
                <Brain className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Draft</p>
                  <p className="text-2xl font-bold">
                    {reports.filter(r => r.status === "draft").length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Report Templates</CardTitle>
            <CardDescription>Generate reports using predefined templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportTemplates.map((template, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <template.icon className="h-6 w-6 text-primary" />
                    <h4 className="font-medium">{template.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <Button size="sm" className="w-full">
                    Generate
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports by title or patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="lab-report">Lab Reports</SelectItem>
                  <SelectItem value="imaging-report">Imaging Reports</SelectItem>
                  <SelectItem value="diagnostic-report">Diagnostic Reports</SelectItem>
                  <SelectItem value="progress-report">Progress Reports</SelectItem>
                  <SelectItem value="discharge-summary">Discharge Summaries</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
            <CardDescription>Your recent medical reports and documentation</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredReports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No reports found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{report.title}</p>
                          <p className="text-sm text-muted-foreground">{report.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.reportType.replace('-', ' ')}</Badge>
                      </TableCell>
                      <TableCell>{report.patientId.fullname}</TableCell>
                      <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            report.priority === "urgent" ? "destructive" : 
                            report.priority === "high" ? "default" : 
                            report.priority === "medium" ? "secondary" : "outline"
                          }
                        >
                          {report.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DynamicDashboardLayout>
  )
}
