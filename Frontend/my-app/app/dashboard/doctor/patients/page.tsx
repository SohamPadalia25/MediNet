"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Search,
  Filter,
  Plus,
  Calendar,
  FileText,
  Phone,
  Mail,
  Activity,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  const patients = [
    {
      id: "1",
      name: "Sarah Johnson",
      age: 34,
      gender: "Female",
      email: "sarah.johnson@email.com",
      phone: "(555) 123-4567",
      address: "123 Main St, City, State",
      lastVisit: "2024-03-15",
      nextAppointment: "2024-03-25",
      status: "active",
      condition: "Pneumonia Treatment",
      riskLevel: "medium",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Michael Chen",
      age: 45,
      gender: "Male",
      email: "michael.chen@email.com",
      phone: "(555) 234-5678",
      address: "456 Oak Ave, City, State",
      lastVisit: "2024-03-12",
      nextAppointment: "2024-03-28",
      status: "active",
      condition: "Skin Lesion Monitoring",
      riskLevel: "low",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Emily Davis",
      age: 28,
      gender: "Female",
      email: "emily.davis@email.com",
      phone: "(555) 345-6789",
      address: "789 Pine St, City, State",
      lastVisit: "2024-03-10",
      nextAppointment: null,
      status: "inactive",
      condition: "Routine Checkup",
      riskLevel: "low",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      name: "Robert Brown",
      age: 67,
      gender: "Male",
      email: "robert.brown@email.com",
      phone: "(555) 456-7890",
      address: "321 Elm St, City, State",
      lastVisit: "2024-03-08",
      nextAppointment: "2024-03-22",
      status: "active",
      condition: "Chronic Care Management",
      riskLevel: "high",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "5",
      name: "Lisa Wilson",
      age: 52,
      gender: "Female",
      email: "lisa.wilson@email.com",
      phone: "(555) 567-8901",
      address: "654 Maple Dr, City, State",
      lastVisit: "2024-03-14",
      nextAppointment: "2024-03-30",
      status: "active",
      condition: "Diabetes Management",
      riskLevel: "medium",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || patient.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    return status === "active" ? (
      <CheckCircle className="h-4 w-4 text-primary" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
    )
  }

  return (
    <DashboardLayout userType="doctor" userName="Dr. James Wilson" userEmail="james.wilson@medinet.com">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-black text-foreground">Patient Management</h1>
            <p className="text-muted-foreground">Manage and monitor your patients' health records</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Patient
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Patients</p>
                  <p className="text-2xl font-bold">189</p>
                </div>
                <Activity className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">34</p>
                </div>
                <Calendar className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients by name, email, or condition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  Table
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {patient.age} years, {patient.gender}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(patient.status)}
                      <Badge variant={getRiskBadgeVariant(patient.riskLevel)}>{patient.riskLevel} risk</Badge>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{patient.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{patient.condition}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Visit:</span>
                      <span>{patient.lastVisit}</span>
                    </div>
                    {patient.nextAppointment && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Next Appointment:</span>
                        <span>{patient.nextAppointment}</span>
                      </div>
                    )}
                  </div>

                  <Link href={`/dashboard/doctor/patients/${patient.id}`}>
                    <Button className="w-full" size="sm">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {patient.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {patient.age} years, {patient.gender}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{patient.email}</p>
                          <p className="text-sm text-muted-foreground">{patient.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{patient.condition}</TableCell>
                      <TableCell>{patient.lastVisit}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(patient.status)}
                          <span className="capitalize">{patient.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRiskBadgeVariant(patient.riskLevel)}>{patient.riskLevel}</Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/doctor/patients/${patient.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {filteredPatients.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No patients found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Add your first patient to get started"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
