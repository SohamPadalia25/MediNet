"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Download, FileText, CalendarIcon, Filter, TrendingUp, Users, Activity, BarChart3 } from "lucide-react"
import { format } from "date-fns"

export default function ReportsManagement() {
  const [selectedReport, setSelectedReport] = useState("user-activity")
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date())

  const reports = [
    {
      id: "user-activity",
      name: "User Activity Report",
      description: "Detailed analysis of user engagement and platform usage",
      category: "Analytics",
      lastGenerated: "2024-01-15",
      size: "2.4 MB",
      format: "PDF",
    },
    {
      id: "ai-performance",
      name: "AI Model Performance",
      description: "Comprehensive analysis of AI model accuracy and predictions",
      category: "AI Analytics",
      lastGenerated: "2024-01-14",
      size: "1.8 MB",
      format: "Excel",
    },
    {
      id: "patient-demographics",
      name: "Patient Demographics",
      description: "Statistical breakdown of patient population and trends",
      category: "Demographics",
      lastGenerated: "2024-01-13",
      size: "3.1 MB",
      format: "PDF",
    },
    {
      id: "system-health",
      name: "System Health Report",
      description: "Infrastructure performance and system reliability metrics",
      category: "Technical",
      lastGenerated: "2024-01-15",
      size: "1.2 MB",
      format: "PDF",
    },
    {
      id: "financial-summary",
      name: "Financial Summary",
      description: "Revenue, costs, and financial performance analysis",
      category: "Financial",
      lastGenerated: "2024-01-12",
      size: "2.7 MB",
      format: "Excel",
    },
    {
      id: "compliance-audit",
      name: "HIPAA Compliance Audit",
      description: "Security and compliance status report",
      category: "Compliance",
      lastGenerated: "2024-01-10",
      size: "4.2 MB",
      format: "PDF",
    },
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Analytics":
        return <BarChart3 className="h-4 w-4" />
      case "AI Analytics":
        return <Activity className="h-4 w-4" />
      case "Demographics":
        return <Users className="h-4 w-4" />
      case "Technical":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Analytics":
        return "bg-blue-100 text-blue-800"
      case "AI Analytics":
        return "bg-purple-100 text-purple-800"
      case "Demographics":
        return "bg-green-100 text-green-800"
      case "Technical":
        return "bg-orange-100 text-orange-800"
      case "Financial":
        return "bg-yellow-100 text-yellow-800"
      case "Compliance":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and download system reports</p>
        </div>
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {dateRange ? format(dateRange, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={dateRange} onSelect={setDateRange} initialFocus />
            </PopoverContent>
          </Popover>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">47.2 MB</p>
              </div>
              <Download className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="analytics">Analytics</SelectItem>
            <SelectItem value="ai-analytics">AI Analytics</SelectItem>
            <SelectItem value="demographics">Demographics</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="financial">Financial</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="recent">
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="size">File Size</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(report.category)}
                  <Badge className={getCategoryColor(report.category)}>{report.category}</Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-lg">{report.name}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Generated:</span>
                  <span className="font-medium">{report.lastGenerated}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">File Size:</span>
                  <span className="font-medium">{report.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Format:</span>
                  <span className="font-medium">{report.format}</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Regenerate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Report Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
          <CardDescription>Create custom reports with specific data and date ranges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user-activity">User Activity</SelectItem>
                  <SelectItem value="ai-performance">AI Performance</SelectItem>
                  <SelectItem value="system-health">System Health</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="mt-4">
            <FileText className="h-4 w-4 mr-2" />
            Generate Custom Report
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
