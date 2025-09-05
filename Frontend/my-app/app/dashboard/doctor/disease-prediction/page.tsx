"use client"

import { useState } from "react"
import api from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Search, AlertCircle, Stethoscope, Activity, Heart, X, Check, Sparkles } from "lucide-react"
import { DynamicDashboardLayout } from "@/components/dynamic-dashboard-layout"

export default function DiseasePrediction() {
  const [symptoms, setSymptoms] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [quickSymptom, setQuickSymptom] = useState("")
  const [patientAge, setPatientAge] = useState("")
  const [patientGender, setPatientGender] = useState("")
  const [medicalHistory, setMedicalHistory] = useState("")
  const [symptomSeverity, setSymptomSeverity] = useState<{ [key: string]: number }>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [predictions, setPredictions] = useState<any[]>([])
  const [details, setDetails] = useState<{
    predictedDisease?: string
    description?: string
    precautions?: string[]
    medications?: string[]
    diets?: string[]
    workout?: string[]
  }>({})
  const [error, setError] = useState("")

  const commonSymptoms = [
    "Fever",
    "Headache",
    "Cough",
    "Fatigue",
    "Nausea",
    "Vomiting",
    "Diarrhea",
    "Chest Pain",
    "Shortness of Breath",
    "Dizziness",
    "Muscle Aches",
    "Sore Throat",
    "Runny Nose",
    "Loss of Appetite",
    "Weight Loss",
    "Joint Pain",
    "Skin Rash",
    "Abdominal Pain",
    "Back Pain",
    "Difficulty Swallowing",
    "Night Sweats",
    "Confusion",
    "Blurred Vision",
    "Rapid Heartbeat",
    "Swelling",
  ]

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) => {
      if (prev.includes(symptom)) {
        const newSeverity = { ...symptomSeverity }
        delete newSeverity[symptom]
        setSymptomSeverity(newSeverity)
        return prev.filter((s) => s !== symptom)
      } else {
        setSymptomSeverity((prev) => ({ ...prev, [symptom]: 5 }))
        return [...prev, symptom]
      }
    })
  }

  const normalizeForAPI = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "_")

  // Normalize list-like strings (e.g., "['A', 'B']") into separate bullet items
  const toBulletItems = (value?: string[]): string[] => {
    if (!value || value.length === 0) return []
    const result: string[] = []
    for (const raw of value) {
      if (typeof raw !== "string") continue
      const s = raw.trim()
      if (s.startsWith("[") && s.endsWith("]")) {
        const inner = s.slice(1, -1)
        inner.split(",").forEach((part) => {
          const cleaned = part.replace(/^\s*["']?|["']?\s*$/g, "").trim()
          if (cleaned) result.push(cleaned)
        })
      } else {
        result.push(s)
      }
    }
    return result
  }

  const addQuickSymptom = () => {
    const raw = quickSymptom.trim()
    if (!raw) return
    const parts = raw
      .split(/[,\n]/)
      .map((p) => p.trim())
      .filter(Boolean)
    if (parts.length === 0) return
    setSelectedSymptoms((prev) => {
      const set = new Set(prev)
      parts.forEach((p) => set.add(p))
      return Array.from(set)
    })
    setQuickSymptom("")
  }

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) => prev.filter((s) => s !== symptom))
    setSymptomSeverity((prev) => {
      const copy = { ...prev }
      delete copy[symptom]
      return copy
    })
  }

  const adjustSeverity = (symptom: string, change: number) => {
    setSymptomSeverity((prev) => ({
      ...prev,
      [symptom]: Math.max(1, Math.min(10, (prev[symptom] || 5) + change)),
    }))
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setError("")
    setPredictions([])
    setDetails({})

    try {
      const chosen = selectedSymptoms.length
        ? selectedSymptoms
        : symptoms
            .split(/[,\n]/)
            .map((s) => s.trim())
            .filter(Boolean)

      if (chosen.length === 0) {
        setIsAnalyzing(false)
        return
      }

      const apiSymptoms = chosen.map(normalizeForAPI)
      const resp = await api.post("/diagnoses/predict-disease", {
        symptoms: apiSymptoms,
      })
      const data = resp?.data?.data

      const disease = String(data?.predictedDisease || "").trim()

      setPredictions([
        {
          disease: disease || "Predicted Disease",
          confidence: 82,
          severity: "Moderate",
          description: "Predicted by disease ML service",
          recommendations: ["Clinical correlation recommended", "Order confirmatory diagnostics as needed"],
          urgency: "medium",
        },
      ])

      setDetails({
        predictedDisease: disease,
        description: data?.description,
        precautions: Array.isArray(data?.precautions) ? data.precautions : [],
        medications: Array.isArray(data?.medications) ? data.medications : [],
        diets: Array.isArray(data?.diets) ? data.diets : [],
        workout: Array.isArray(data?.workout) ? data.workout : [],
      })
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || "Prediction failed"
      setError(msg)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <DynamicDashboardLayout requiredRole="doctor">
      <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-muted/20">
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-accent/5 to-primary/10 p-8 rounded-2xl border-2 border-primary/10 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 shadow-sm">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">AI Disease Prediction System</h1>
                  <p className="text-lg text-muted-foreground text-pretty">
                    Advanced machine learning analysis for accurate medical diagnosis support
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <Sparkles className="h-4 w-4" />
                Powered by Medical AI • Clinical Decision Support
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="shadow-xl border-2 border-primary/10 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-primary/10">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>
                  Patient Symptom Assessment
                </CardTitle>
                <CardDescription className="text-base">
                  Enter patient symptoms for comprehensive AI-powered disease prediction analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="space-y-4">
                  <Label className="text-base font-semibold text-foreground">Quick Add Symptoms</Label>
                  <div className="flex gap-3 relative">
                    <Input
                      placeholder="Type symptoms (e.g., fever, chest pain, headache)"
                      value={quickSymptom}
                      onChange={(e) => setQuickSymptom(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addQuickSymptom()
                        }
                      }}
                      className="h-12 text-base border-2 focus:border-primary shadow-sm bg-background"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={addQuickSymptom}
                      className="h-12 px-6 bg-accent hover:bg-accent/80 text-accent-foreground font-medium"
                    >
                      Add
                    </Button>
                    {quickSymptom.trim().length > 0 && (
                      <div className="absolute left-0 right-0 top-16 z-10 bg-background border rounded-md shadow-md max-h-56 overflow-auto">
                        {commonSymptoms
                          .filter(
                            (s) =>
                              s.toLowerCase().includes(quickSymptom.toLowerCase()) && !selectedSymptoms.includes(s),
                          )
                          .slice(0, 8)
                          .map((s) => (
                            <button
                              type="button"
                              key={s}
                              onClick={() => {
                                setSelectedSymptoms((prev) => (prev.includes(s) ? prev : [...prev, s]))
                                setQuickSymptom("")
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-2"
                            >
                              <Check className="h-3 w-3 text-primary" /> {s}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>

                  {selectedSymptoms.length > 0 && (
                    <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          Selected Symptoms ({selectedSymptoms.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedSymptoms.map((s) => (
                          <Badge
                            key={s}
                            variant="secondary"
                            className="flex items-center gap-2 px-3 py-1 text-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                          >
                            {s}
                            <button
                              type="button"
                              className="ml-1 text-primary/70 hover:text-primary transition-colors"
                              onClick={() => removeSymptom(s)}
                              aria-label={`Remove ${s}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold text-foreground">Common Medical Symptoms</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {commonSymptoms.map((symptom) => (
                      <Button
                        key={symptom}
                        variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSymptomToggle(symptom)}
                        className={`h-10 px-3 text-sm font-medium transition-all duration-200 ${
                          selectedSymptoms.includes(symptom)
                            ? "bg-primary text-primary-foreground shadow-md scale-105 border-primary"
                            : "bg-background text-foreground hover:bg-muted hover:text-foreground border-2 hover:border-primary/30 hover:shadow-sm"
                        }`}
                        title={symptom}
                      >
                        {symptom}
                      </Button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg text-sm font-medium">
                    {error}
                  </div>
                )}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || selectedSymptoms.length === 0}
                    className="flex-1 h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg text-lg font-semibold transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                  >
                    {isAnalyzing ? (
                      <>
                        <Brain className="h-6 w-6 mr-3 animate-pulse" />
                        Analyzing Symptoms...
                      </>
                    ) : (
                      <>
                        <Search className="h-6 w-6 mr-3" />
                        Run AI Prediction Analysis
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedSymptoms([])
                      setQuickSymptom("")
                      setError("")
                      setPredictions([])
                    }}
                    className="h-14 px-8 border-2 hover:bg-muted font-medium"
                  >
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-2 border-accent/20 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/5 border-b border-accent/20">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Activity className="h-6 w-6 text-accent" />
                  </div>
                  AI Prediction Results
                </CardTitle>
                <CardDescription className="text-base">
                  Comprehensive disease analysis and medical recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {isAnalyzing ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center space-y-4">
                        <div className="relative">
                          <Brain className="h-16 w-16 text-primary mx-auto animate-pulse" />
                          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-foreground">Processing Medical Data</p>
                          <p className="text-sm text-muted-foreground">AI is analyzing symptom patterns...</p>
                        </div>
                        <Progress value={66} className="w-48 h-3" />
                      </div>
                    </div>
                  </div>
                ) : predictions.length > 0 ? (
                  <div className="space-y-8">
                    {predictions.map((prediction, index) => (
                      <Card
                        key={index}
                        className={`border-2 shadow-lg bg-gradient-to-r from-background to-card/50 ${getUrgencyColor(prediction.urgency)}`}
                      >
                        <CardContent className="p-8">
                          <div className="space-y-6">
                            {/* Enhanced prediction header */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-primary/10 rounded-lg">
                                    <Stethoscope className="h-5 w-5 text-primary" />
                                  </div>
                                  <h3 className="text-2xl font-bold text-foreground">{prediction.disease}</h3>
                                </div>
                                <p className="text-base text-muted-foreground leading-relaxed pl-11">
                                  {prediction.description}
                                </p>
                              </div>
                              {/* Confidence display removed as requested */}
                            </div>

                            {/* Metrics section removed (confidence/accuracy). Keep severity and priority inline below. */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/10">
                              <div className="flex items-center gap-3">
                                <Heart className="h-5 w-5 text-primary" />
                                <span className="text-lg font-semibold text-foreground">
                                  Severity: {prediction.severity}
                                </span>
                              </div>
                              <Badge
                                variant="outline"
                                className={`${getUrgencyColor(prediction.urgency)} font-semibold px-4 py-1 text-sm`}
                              >
                                {prediction.urgency.toUpperCase()} PRIORITY
                              </Badge>
                            </div>

                            {/* Enhanced recommendations */}
                            <div className="space-y-3">
                              <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-accent" />
                                Immediate Clinical Recommendations
                              </h4>
                              <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                                <ul className="space-y-3">
                                  {prediction.recommendations.slice(0, 2).map((rec: string, i: number) => (
                                    <li key={i} className="flex items-start gap-4 text-base">
                                      <div className="w-3 h-3 bg-accent rounded-full mt-2 flex-shrink-0" />
                                      <span className="text-foreground leading-relaxed font-medium">{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Detailed Medical Information */}
                    {details?.predictedDisease && (
                      <div className="space-y-6 mt-12">
                        <div className="border-t-2 border-primary/20 pt-8">
                          <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Stethoscope className="h-6 w-6 text-primary" />
                            </div>
                            Comprehensive Medical Information
                          </h3>
                        </div>

                        {/* Medical Overview */}
                        <Card className="border shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold">Medical Overview</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                              {details.description || "No detailed description available."}
                            </p>
                          </CardContent>
                        </Card>

                        {/* Precautions */}
                        {Array.isArray(details.precautions) && details.precautions.length > 0 && (
                          <Card className="border shadow-sm">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-orange-500" />
                                Precautions & Safety Measures
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <ul className="space-y-2">
                                {details.precautions.map((p, i) => (
                                  <li key={i} className="flex items-start gap-3 text-base">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                                    <span className="text-muted-foreground leading-relaxed">{p}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}

                        {/* Medications */}
                        {Array.isArray(details.medications) && details.medications.length > 0 && (
                          <Card className="border">
                            <CardContent className="p-4 space-y-2">
                              <h4 className="font-semibold text-lg">Medications</h4>
                              <ul className="text-base text-muted-foreground list-disc pl-4 space-y-1">
                                {toBulletItems(details.medications).map((m, i) => (
                                  <li key={i}>{m}</li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}

                        {/* Diet and Workout in a grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Diet Recommendations */}
                          {Array.isArray(details.diets) && details.diets.length > 0 && (
                            <Card className="border">
                              <CardContent className="p-4 space-y-2">
                                <h4 className="font-semibold text-lg">Diet Recommendations</h4>
                                <ul className="text-base text-muted-foreground list-disc pl-4 space-y-1">
                                  {toBulletItems(details.diets).map((d, i) => (
                                    <li key={i}>{d}</li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          )}

                          {/* Workout Recommendations */}
                          {Array.isArray(details.workout) && details.workout.length > 0 && (
                            <Card className="border shadow-sm">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                  <Activity className="h-4 w-4 text-purple-500" />
                                  Exercise & Activity
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <ul className="space-y-2">
                                  {details.workout.map((w, i) => (
                                    <li key={i} className="flex items-start gap-3 text-base">
                                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                                      <span className="text-muted-foreground leading-relaxed">{w}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    <div className="space-y-4">
                      <div className="relative mx-auto w-20 h-20">
                        <Brain className="h-20 w-20 mx-auto opacity-30" />
                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">Ready for Medical Analysis</h3>
                        <p className="text-base">
                          Select patient symptoms and run AI prediction to begin diagnosis support
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DynamicDashboardLayout>
  )
}
