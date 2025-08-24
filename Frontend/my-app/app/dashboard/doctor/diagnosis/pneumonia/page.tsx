"use client"

import type React from "react"

import { useState } from "react"
import api from "@/lib/api"
import { DynamicDashboardLayout } from "@/components/dynamic-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  AirVentIcon as Lung,
  Brain,
  CheckCircle,
  AlertTriangle,
  FileImage,
  Download,
  Share,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function PneumoniaDetectionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    symptoms: "",
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setError("")
    setAnalysisResult(null)

    try {
      const fd = new FormData()
      fd.append("medicalImage", selectedFile)
      // Optional metadata (backend currently ignores these, but safe to send)
      if (patientInfo.name) fd.append("patientName", patientInfo.name)
      if (patientInfo.age) fd.append("age", patientInfo.age)
      if (patientInfo.symptoms) fd.append("symptoms", patientInfo.symptoms)

      const resp = await api.post("/api/v1/diagnoses/image-analysis", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      // Backend returns ApiResponse -> { data: { file, results, message } }
      const data = resp?.data?.data
      setAnalysisResult(data)
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || "Analysis failed"
      setError(msg)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setSelectedFile(null)
    setAnalysisResult(null)
    setPatientInfo({ name: "", age: "", symptoms: "" })
  }

  return (
    <DynamicDashboardLayout requiredRole="doctor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/doctor/diagnosis">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-black text-foreground flex items-center gap-3">
              <div className="bg-primary rounded-lg p-2">
                <Lung className="h-6 w-6 text-primary-foreground" />
              </div>
              Pneumonia Detection
            </h1>
            <p className="text-muted-foreground">AI-powered chest X-ray analysis for pneumonia detection</p>
          </div>
        </div>

        {!analysisResult ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Chest X-Ray
                </CardTitle>
                <CardDescription>Upload a chest X-ray image for AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  {selectedFile ? (
                    <div className="space-y-2">
                      <FileImage className="h-12 w-12 mx-auto text-primary" />
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">Drag and drop or click to upload</p>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="mt-4"
                    placeholder="Choose file"
                  />
                </div>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Ensure the X-ray image is clear and properly oriented. Supported formats: JPEG, PNG, DICOM
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>Enter patient details for comprehensive analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    placeholder="Enter patient name"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientAge">Age</Label>
                  <Input
                    id="patientAge"
                    placeholder="Enter patient age"
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms & Clinical Notes</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe patient symptoms, medical history, and clinical observations..."
                    value={patientInfo.symptoms}
                    onChange={(e) => setPatientInfo({ ...patientInfo, symptoms: e.target.value })}
                    rows={4}
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Start AI Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-6">
            {/* Result Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`rounded-full p-3 ${
                        (analysisResult?.prediction?.diagnosis || "").toUpperCase() === "PNEUMONIA" ? "bg-accent" : "bg-primary"
                      }`}
                    >
                      {(analysisResult?.prediction?.diagnosis || "").toUpperCase() === "PNEUMONIA" ? (
                        <AlertTriangle className="h-6 w-6 text-white" />
                      ) : (
                        <CheckCircle className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-bold">
                        {analysisResult?.prediction?.diagnosis || "Analysis Result"}
                      </h2>
                      {typeof analysisResult?.prediction?.confidence === "number" && (
                        <p className="text-muted-foreground">
                          Confidence: {Math.round(analysisResult.prediction.confidence)}%
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                {typeof analysisResult?.prediction?.confidence === "number" && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Confidence Level</span>
                      <span>{Math.round(analysisResult.prediction.confidence)}%</span>
                    </div>
                    <Progress value={Math.round(analysisResult.prediction.confidence)} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {analysisResult?.prediction?.probabilities && (
              <Card>
                <CardHeader>
                  <CardTitle>Detected Conditions</CardTitle>
                  <CardDescription>Model probabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between text-sm">
                      <span className="font-medium">Pneumonia</span>
                      <span>{Math.round(analysisResult.prediction.probabilities.pneumonia)}%</span>
                    </li>
                    <li className="flex items-center justify-between text-sm">
                      <span className="font-medium">Normal</span>
                      <span>{Math.round(analysisResult.prediction.probabilities.normal)}%</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            )}

            {analysisResult?.medical_advice && (
              <Card>
                <CardHeader>
                  <CardTitle>Medical Advice</CardTitle>
                  <CardDescription>
                    Severity: {analysisResult.medical_advice.severity}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analysisResult.medical_advice.message && (
                    <p className="text-sm mb-3">{analysisResult.medical_advice.message}</p>
                  )}
                  {Array.isArray(analysisResult.medical_advice.recommendations) && (
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {analysisResult.medical_advice.recommendations.map((rec: string, idx: number) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  )}
                  {analysisResult.medical_advice.next_steps && (
                    <p className="text-sm mt-3 font-medium">Next steps: {analysisResult.medical_advice.next_steps}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {false && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {/* Reserved for extended outputs */}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Based on the model output, consider clinical correlation.</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button onClick={resetAnalysis} variant="outline">
                New Analysis
              </Button>
              <Button>Save to Patient Record</Button>
            </div>
          </div>
        )}

        {/* Analysis Progress */}
        {isAnalyzing && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Brain className="h-12 w-12 mx-auto text-primary animate-pulse" />
                <div>
                  <h3 className="text-lg font-semibold">AI Analysis in Progress</h3>
                  <p className="text-muted-foreground">Processing chest X-ray for pneumonia detection...</p>
                </div>
                <Progress value={66} className="w-full" />
                <p className="text-sm text-muted-foreground">This usually takes 2-5 seconds</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DynamicDashboardLayout>
  )
}
