"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Stethoscope, ArrowLeft, CheckCircle } from "lucide-react"

import api from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userType: "patient",
    licenseNumber: "",
    specialization: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Minimal validation: email and password are required via input attributes

    const derivedName = `${formData.firstName} ${formData.lastName}`.trim()
    const fullname = derivedName || (formData.email.split("@")[0] || "user")
    const baseUsername = (formData.email.split("@")[0] || "").toLowerCase()
    const safeBaseUsername = baseUsername.replace(/[^a-z0-9._-]/gi, "")
    const fallbackUsername = `${formData.firstName}${formData.lastName}`.replace(/\s+/g, "").toLowerCase() || "user"
    const username = safeBaseUsername || fallbackUsername
    const role = formData.userType || "patient"
    const profile = role === "doctor" ? { licenseNumber: formData.licenseNumber, specialization: formData.specialization } : {}

    try {
      const fd = new FormData()
      fd.append("fullname", fullname)
      fd.append("username", username)
      fd.append("email", formData.email)
      fd.append("password", formData.password)
      fd.append("role", role)
      if (role === "doctor") {
        if (profile.licenseNumber) fd.append("profile[licenseNumber]", profile.licenseNumber)
        if (profile.specialization) fd.append("profile[specialization]", profile.specialization)
      }

      await api.post("/api/v1/users/register", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      router.push("/auth/login")
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message || err?.response?.data?.error
      setError(apiMessage || "Registration failed")
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-full p-4 shadow-lg">
              <Stethoscope className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-serif font-black bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Medinet
          </h1>
          <p className="text-muted-foreground">Join the future of healthcare</p>
        </div>

        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-serif font-bold">Create Your Account</CardTitle>
            <CardDescription>Start your journey with AI-powered medical diagnostics</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userType">Account Type</Label>
                <Select value={formData.userType} onValueChange={(value) => handleInputChange("userType", value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">
                      <div className="flex items-center">
                        <Stethoscope className="h-4 w-4 mr-2" />
                        Healthcare Professional
                      </div>
                    </SelectItem>
                    <SelectItem value="patient">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Patient
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.userType === "doctor" && (
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                  <p className="text-sm font-medium text-muted-foreground">Professional Information</p>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">Medical License Number</Label>
                    <Input
                      id="licenseNumber"
                      placeholder="Enter your license number"
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Medical Specialization</Label>
                    <Input
                      id="specialization"
                      placeholder="e.g., Cardiology, Dermatology, General Practice"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange("specialization", e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="h-11 pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex space-x-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded ${
                            i < passwordStrength
                              ? passwordStrength <= 2
                                ? "bg-red-500"
                                : passwordStrength === 3
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password strength: {passwordStrength <= 2 ? "Weak" : passwordStrength === 3 ? "Good" : "Strong"}
                    </p>
                  </div>
                )}
              </div>

              

              <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
