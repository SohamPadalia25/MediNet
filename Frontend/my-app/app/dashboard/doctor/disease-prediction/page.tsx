"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Search, AlertCircle, Stethoscope, Activity, Heart, Plus, Minus } from "lucide-react"

export default function DiseasePrediction() {
  const [symptoms, setSymptoms] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [patientAge, setPatientAge] = useState("")
  const [patientGender, setPatientGender] = useState("")
  const [medicalHistory, setMedicalHistory] = useState("")
  const [symptomSeverity, setSymptomSeverity] = useState<{ [key: string]: number }>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [predictions, setPredictions] = useState<any[]>([])

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

  const adjustSeverity = (symptom: string, change: number) => {
    setSymptomSeverity((prev) => ({
      ...prev,
      [symptom]: Math.max(1, Math.min(10, (prev[symptom] || 5) + change)),
    }))
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      const mockPredictions = [
        {
          disease: "Viral Upper Respiratory Infection",
          confidence: 87,
          severity: "Mild",
          description: "Common cold or flu-like illness affecting the upper respiratory tract",
          recommendations: [
            "Rest and adequate hydration",
            "Over-the-counter pain relievers if needed",
            "Monitor symptoms for 7-10 days",
            "Seek medical attention if symptoms worsen",
          ],
          urgency: "low",
        },
        {
          disease: "Bacterial Pneumonia",
          confidence: 23,
          severity: "Moderate",
          description: "Infection of the lungs caused by bacteria",
          recommendations: [
            "Chest X-ray recommended",
            "Blood tests to confirm diagnosis",
            "Antibiotic treatment may be required",
            "Close monitoring of respiratory status",
          ],
          urgency: "medium",
        },
        {
          disease: "Gastroenteritis",
          confidence: 15,
          severity: "Mild",
          description: "Inflammation of the stomach and intestines",
          recommendations: [
            "Maintain hydration with clear fluids",
            "BRAT diet (Bananas, Rice, Applesauce, Toast)",
            "Avoid dairy and fatty foods",
            "Monitor for dehydration signs",
          ],
          urgency: "low",
        },
      ]

      setPredictions(mockPredictions)
      setIsAnalyzing(false)
    }, 3000)
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
    <DashboardLayout userType="doctor" userName="Dr. James Wilson" userEmail="james.wilson@medinet.com">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-xl border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-serif font-black text-foreground">AI Disease Prediction</h1>
          </div>
          <p className="text-muted-foreground">
            Enter patient symptoms to get AI-powered disease predictions and clinical recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Patient Information & Symptoms
                </CardTitle>
                <CardDescription>Provide patient details and select relevant symptoms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Patient Demographics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Patient Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter age"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="border-2 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={patientGender} onValueChange={setPatientGender}>
                      <SelectTrigger className="border-2 focus:border-primary">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Medical History */}
                <div className="space-y-2">
                  <Label htmlFor="history">Medical History & Risk Factors</Label>
                  <Textarea
                    id="history"
                    placeholder="Enter relevant medical history, chronic conditions, medications, allergies, family history..."
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                    className="min-h-20 border-2 focus:border-primary"
                  />
                </div>

                {/* Symptom Description */}
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Detailed Symptom Description</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe the patient's symptoms in detail, including duration, severity, and any relevant context..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="min-h-24 border-2 focus:border-primary"
                  />
                </div>

                {/* Common Symptoms Selection with Severity */}
                <div className="space-y-3">
                  <Label>Symptoms & Severity (1-10 scale)</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {commonSymptoms.map((symptom) => (
                      <div key={symptom} className="flex items-center gap-3 p-3 border-2 rounded-lg">
                        <Button
                          variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleSymptomToggle(symptom)}
                          className={`flex-1 justify-start ${
                            selectedSymptoms.includes(symptom)
                              ? "bg-primary text-primary-foreground"
                              : "bg-background hover:bg-muted"
                          }`}
                        >
                          {symptom}
                        </Button>
                        {selectedSymptoms.includes(symptom) && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => adjustSeverity(symptom, -1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{symptomSeverity[symptom] || 5}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => adjustSeverity(symptom, 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analyze Button */}
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || (!symptoms.trim() && selectedSymptoms.length === 0)}
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg text-lg font-semibold"
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="h-5 w-5 mr-2 animate-pulse" />
                      Analyzing Symptoms...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Predict Diseases
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className="shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-accent/20 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-accent" />
                  Prediction Results
                </CardTitle>
                <CardDescription>AI-generated disease predictions</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isAnalyzing ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center space-y-3">
                        <Brain className="h-12 w-12 text-primary mx-auto animate-pulse" />
                        <p className="text-sm text-muted-foreground">Analyzing symptoms...</p>
                        <Progress value={66} className="w-32" />
                      </div>
                    </div>
                  </div>
                ) : predictions.length > 0 ? (
                  <div className="space-y-4">
                    {predictions.map((prediction, index) => (
                      <Card key={index} className={`border-2 ${getUrgencyColor(prediction.urgency)}`}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-sm">{prediction.disease}</h4>
                                <p className="text-xs text-muted-foreground">{prediction.description}</p>
                              </div>
                              <Badge variant="secondary" className="ml-2">
                                {prediction.confidence}%
                              </Badge>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium">Confidence:</span>
                                <Progress value={prediction.confidence} className="flex-1 h-2" />
                              </div>

                              <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1">
                                  <Heart className="h-3 w-3" />
                                  Severity: {prediction.severity}
                                </span>
                                <Badge variant="outline" className={`text-xs ${getUrgencyColor(prediction.urgency)}`}>
                                  {prediction.urgency} priority
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <p className="text-xs font-medium">Recommendations:</p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {prediction.recommendations.slice(0, 2).map((rec: string, i: number) => (
                                  <li key={i} className="flex items-start gap-1">
                                    <span className="text-primary mt-1">•</span>
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Enter symptoms and click "Predict Diseases" to see AI analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="border-orange-200 bg-orange-50/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-orange-800">
                    <p className="font-medium mb-1">Medical Disclaimer</p>
                    <p>
                      This AI prediction tool is for clinical decision support only. Always use professional medical
                      judgment and conduct proper examinations before making diagnoses.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
