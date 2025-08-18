"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, Filter, Search, Calendar, User, Brain, TrendingUp, Plus, Eye } from "lucide-react"

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [reportType, setReportType] = useState("all")
  const [dateRange, setDateRange] = useState("30d")

  const reports = [
    {
      id: "1",
      title: "Monthly Patient Summary",
      type: "Patient Report",
      date: "2024-03-20",
      patient: "Sarah Johnson",
      status: "completed",
      size: "2.3 MB",
      pages: 12,
    },
    {
      id: "2",
      title: "AI Diagnosis Analysis",
      type: "AI Report",
      date: "2024-03-19",
      patient: "Michael Chen",
      status: "completed",
      size: "1.8 MB",
      pages: 8,
    },
    {
      id: "3",
      title: "Treatment Outcome Report",
      type: "Treatment Report",
      date: "2024-03-18",
      patient: "Emily Davis",
      status: "pending",
      size: "3.1 MB",
      pages: 15,
    },
    {
      id: "4",
      title: "Quarterly Performance Review",
      type: "Performance Report",
      date: "2024-03-15",
      patient: "All Patients",
      status: "completed",
      size: "5.2 MB",
      pages: 24,
    },
  ]

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
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "processing":
        return <Badge variant="outline">Processing</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.patient.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = reportType === "all" || report.type.toLowerCase().includes(reportType.toLowerCase())
    return matchesSearch && matchesType
  })

  return (
    <DashboardLayout userType="doctor" userName="Dr. James Wilson" userEmail="james.wilson@medinet.com">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-black text-foreground">Reports & Documentation</h1>
            <p className="text-muted-foreground">Generate and manage medical reports and documentation</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">247</p>
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
                  <p className="text-2xl font-bold">34</p>
                </div>
                <Calendar className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Reports</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <Brain className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">8</p>
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
                  <SelectItem value="patient">Patient Reports</SelectItem>
                  <SelectItem value="ai">AI Reports</SelectItem>
                  <SelectItem value="treatment">Treatment Reports</SelectItem>
                  <SelectItem value="performance">Performance Reports</SelectItem>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-muted-foreground">{report.pages} pages</p>
                      </div>
                    </TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.patient}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>{report.size}</TableCell>
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
