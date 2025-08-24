"use client"

import { useUser, AuthGuard } from "@/lib/user-context"
import { DashboardLayout } from "./dashboard-layout"

interface DynamicDashboardLayoutProps {
  children: React.ReactNode
  requiredRole?: "doctor" | "patient" | "admin"
}

export function DynamicDashboardLayout({ children, requiredRole }: DynamicDashboardLayoutProps) {
  const { user } = useUser()

  if (!user) {
    return null
  }

  // Check if user has required role
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <DashboardLayout
        userType={user.role}
        userName={user.fullname}
        userEmail={user.email}
      >
        {children}
      </DashboardLayout>
    </AuthGuard>
  )
}
