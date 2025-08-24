"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Stethoscope,
  Menu,
  Home,
  Users,
  Calendar,
  FileText,
  Brain,
  BarChart3,
  Settings,
  LogOut,
  User,
  Activity,
  Clock,
  Search,
} from "lucide-react"
import { clearAuth } from "@/lib/auth"

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: "doctor" | "patient" | "admin"
  userName: string
  userEmail: string
}

export function DashboardLayout({ children, userType, userName, userEmail }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    clearAuth()
    router.push("/auth/login")
  }

  const getNavigationItems = () => {
    switch (userType) {
      case "doctor":
        return [
          { icon: Home, label: "Dashboard", href: "/dashboard/doctor" },
          { icon: Users, label: "Patients", href: "/dashboard/doctor/patients" },
          { icon: Search, label: "Disease Prediction", href: "/dashboard/doctor/disease-prediction" },
          { icon: Brain, label: "AI Diagnosis", href: "/dashboard/doctor/diagnosis" },
          { icon: FileText, label: "Prescriptions", href: "/dashboard/doctor/prescriptions" },
          { icon: Calendar, label: "Appointments", href: "/dashboard/doctor/appointments" },
          { icon: FileText, label: "Reports", href: "/dashboard/doctor/reports" },
          { icon: BarChart3, label: "Analytics", href: "/dashboard/doctor/analytics" },
        ]
      case "patient":
        return [
          { icon: Home, label: "Dashboard", href: "/dashboard/patient" },
          { icon: User, label: "Profile", href: "/dashboard/patient/profile" },
          { icon: Activity, label: "Health Records", href: "/dashboard/patient/records" },
          { icon: Calendar, label: "Appointments", href: "/dashboard/patient/appointments" },
          { icon: FileText, label: "Test Results", href: "/dashboard/patient/results" },
          { icon: Clock, label: "History", href: "/dashboard/patient/history" },
        ]
      case "admin":
        return [
          { icon: Home, label: "Dashboard", href: "/dashboard/admin" },
          { icon: Users, label: "User Management", href: "/dashboard/admin/users" },
          { icon: BarChart3, label: "Analytics", href: "/dashboard/admin/analytics" },
          { icon: Brain, label: "AI Models", href: "/dashboard/admin/ai-models" },
          { icon: Settings, label: "System Settings", href: "/dashboard/admin/settings" },
          { icon: FileText, label: "Reports", href: "/dashboard/admin/reports" },
        ]
      default:
        return []
    }
  }

  const navigationItems = getNavigationItems()

  const Sidebar = ({ className = "" }: { className?: string }) => (
    <div className={`flex flex-col h-full bg-card border-r ${className}`}>
      {/* Logo */}
      <div className="flex items-center gap-2 p-6 border-b">
        <div className="bg-primary rounded-full p-2">
          <Stethoscope className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-serif font-black">Medinet</h1>
          <p className="text-xs text-muted-foreground capitalize">{userType} Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button variant="ghost" className="w-full justify-start gap-3 h-11">
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 h-11">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs text-muted-foreground">{userEmail}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-full p-1">
              <Stethoscope className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-serif font-black">Medinet</span>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
