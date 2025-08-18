"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
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
  Scan,
  Brain,
  CheckCircle,
  AlertTriangle,
  FileImage,
  Download,
  Share,
  ArrowLeft,
  Info,
} from "lucide-react"
import Link from "next/link"

export default function SkinLesionAnalysisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    lesionLocation: "",
    symptoms: "",
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile || !patientInfo.name) return

    setIsAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult({
        prediction: "Benign Nevus",
        confidence: 87.6,
        malignancyRisk: "Low",
        lesionType: "Melanocytic Nevus",
        findings: [
          "Symmetrical lesion with regular borders",
          "Uniform brown pigmentation",
          "Diameter less than 6mm",
          "No signs of recent changes",
          "Benign dermatoscopic features",
        ],
        recommendations: [
          "Routine monitoring recommended",
          "Annual dermatological examination",
          "Patient education on ABCDE criteria",
          "Photography for future comparison",
        ],
        riskFactors: ["Fair skin type", "Multiple moles"],
        followUp: "Schedule follow-up in 12 months unless changes occur",
        abcdeAnalysis: {
          asymmetry: "Symmetrical",
          border: "Regular",
          color: "Uniform brown",
          diameter: "4mm",
          evolving: "No recent changes",
        },
      })
      setIsAnalyzing(false)
    }, 3000)
  }

  const resetAnalysis = () => {
    setSelectedFile(null)
    setAnalysisResult(null)
    setPatientInfo({ name: "", age: "", lesionLocation: "", symptoms: "" })
  }

  return (
    <DashboardLayout userType="doctor" userName="Dr. James Wilson" userEmail="james.wilson@medinet.com">
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
              <div className="bg-accent rounded-lg p-2">
                <Scan className="h-6 w-6 text-accent-foreground" />
              </div>
              Skin Lesion Analysis
            </h1>
            <p className="text-muted-foreground">Advanced AI-powered dermatological image analysis</p>
          </div>
        </div>

        {!analysisResult ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Skin Image
                </CardTitle>
                <CardDescription>Upload a high-quality image of the skin lesion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  {selectedFile ? (
                    <div className="space-y-2">
                      <FileImage className="h-12 w-12 mx-auto text-accent" />
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
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    For best results, ensure good lighting, clear focus, and include a ruler for scale reference.
                    Supported formats: JPEG, PNG
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle>Patient & Lesion Information</CardTitle>
                <CardDescription>Enter patient details and lesion characteristics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name *</Label>
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
                  <Label htmlFor="lesionLocation">Lesion Location</Label>
                  <Input
                    id="lesionLocation"
                    placeholder="e.g., Left shoulder, Right forearm"
                    value={patientInfo.lesionLocation}
                    onChange={(e) => setPatientInfo({ ...patientInfo, lesionLocation: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Clinical Notes & History</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe any changes, symptoms, family history, or clinical observations..."
                    value={patientInfo.symptoms}
                    onChange={(e) => setPatientInfo({ ...patientInfo, symptoms: e.target.value })}
                    rows={4}
                  />
                </div>
                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || !patientInfo.name || isAnalyzing}
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
                        analysisResult.malignancyRisk === "High" ? "bg-destructive" : "bg-primary"
                      }`}
                    >
                      {analysisResult.malignancyRisk === "High" ? (
                        <AlertTriangle className="h-6 w-6 text-white" />
                      ) : (
                        <CheckCircle className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-bold">{analysisResult.prediction}</h2>
                      <p className="text-muted-foreground">
                        Confidence: {analysisResult.confidence}% | Risk: {analysisResult.malignancyRisk}
                      </p>
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
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Confidence Level</span>
                    <span>{analysisResult.confidence}%</span>
                  </div>
                  <Progress value={analysisResult.confidence} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ABCDE Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>ABCDE Analysis</CardTitle>
                  <CardDescription>Systematic evaluation of lesion characteristics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Asymmetry:</span>
                      <span className="text-sm">{analysisResult.abcdeAnalysis.asymmetry}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Border:</span>
                      <span className="text-sm">{analysisResult.abcdeAnalysis.border}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Color:</span>
                      <span className="text-sm">{analysisResult.abcdeAnalysis.color}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Diameter:</span>
                      <span className="text-sm">{analysisResult.abcdeAnalysis.diameter}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Evolving:</span>
                      <span className="text-sm">{analysisResult.abcdeAnalysis.evolving}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Findings */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Findings</CardTitle>
                  <CardDescription>AI-identified dermatological features</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisResult.findings.map((finding: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Clinical Recommendations</CardTitle>
                  <CardDescription>Suggested management and follow-up</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisResult.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Risk Factors & Follow-up */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Factors & Follow-up</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Risk Factors:</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.riskFactors.map((factor: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Follow-up Plan:</h4>
                    <p className="text-sm text-muted-foreground">{analysisResult.followUp}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

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
                <Brain className="h-12 w-12 mx-auto text-accent animate-pulse" />
                <div>
                  <h3 className="text-lg font-semibold">AI Analysis in Progress</h3>
                  <p className="text-muted-foreground">Processing skin lesion image for dermatological analysis...</p>
                </div>
                <Progress value={75} className="w-full" />
                <p className="text-sm text-muted-foreground">This usually takes 2-4 seconds</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
