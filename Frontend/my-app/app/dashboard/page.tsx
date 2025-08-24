"use client"

import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardRedirect() {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      switch (user.role) {
        case "doctor":
          router.push("/dashboard/doctor")
          break
        case "patient":
          router.push("/dashboard/patient")
          break
        case "admin":
          router.push("/dashboard/admin")
          break
        default:
          router.push("/auth/login")
      }
    } else if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return null
}
