import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, AirVentIcon as Lung, Scan, TrendingUp, Users, Clock } from "lucide-react"
import Link from "next/link"

export default function DiagnosisPage() {
  const diagnosisTools = [
    {
      title: "Pneumonia Detection",
      description: "AI-powered chest X-ray analysis for pneumonia detection",
      icon: Lung,
      href: "/dashboard/doctor/diagnosis/pneumonia",
      stats: {
        accuracy: "96.2%",
        processed: "1,234",
        avgTime: "2.3s",
      },
      color: "bg-primary",
    },
    {
      title: "Skin Lesion Analysis",
      description: "Advanced dermatological AI analysis for skin conditions",
      icon: Scan,
      href: "/dashboard/doctor/diagnosis/skin-lesion",
      stats: {
        accuracy: "94.8%",
        processed: "987",
        avgTime: "1.8s",
      },
      color: "bg-accent",
    },
  ]

  const recentDiagnoses = [
    {
      patient: "Sarah Johnson",
      type: "Pneumonia Detection",
      result: "Positive - High Confidence",
      confidence: 92,
      date: "2 hours ago",
      status: "completed",
    },
    {
      patient: "Michael Chen",
      type: "Skin Lesion Analysis",
      result: "Benign Nevus",
      confidence: 87,
      date: "4 hours ago",
      status: "completed",
    },
    {
      patient: "Emily Davis",
      type: "Pneumonia Detection",
      result: "Negative - Normal",
      confidence: 95,
      date: "1 day ago",
      status: "completed",
    },
  ]

  return (
    <DashboardLayout userType="doctor" userName="Dr. James Wilson" userEmail="james.wilson@medinet.com">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-black text-foreground">AI Diagnosis Center</h1>
          <p className="text-muted-foreground">Advanced AI-powered medical image analysis and diagnosis tools</p>
        </div>

        {/* Diagnosis Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diagnosisTools.map((tool) => (
            <Card key={tool.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`${tool.color} rounded-lg p-3`}>
                    <tool.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{tool.stats.accuracy}</p>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">{tool.stats.processed}</p>
                    <p className="text-xs text-muted-foreground">Processed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-chart-1">{tool.stats.avgTime}</p>
                    <p className="text-xs text-muted-foreground">Avg Time</p>
                  </div>
                </div>
                <Link href={tool.href}>
                  <Button className="w-full">
                    <Brain className="mr-2 h-4 w-4" />
                    Start Analysis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Diagnoses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Diagnoses
            </CardTitle>
            <CardDescription>Your latest AI-powered diagnostic results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDiagnoses.map((diagnosis, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{diagnosis.patient}</p>
                    <p className="text-sm text-muted-foreground">{diagnosis.type}</p>
                    <p className="text-xs text-muted-foreground">{diagnosis.date}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">{diagnosis.result}</p>
                    <p className="text-xs text-muted-foreground">Confidence: {diagnosis.confidence}%</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View All Diagnoses
            </Button>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Diagnoses</p>
                  <p className="text-2xl font-bold">2,221</p>
                  <p className="text-xs text-muted-foreground">+156 this week</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Patients Helped</p>
                  <p className="text-2xl font-bold">1,847</p>
                  <p className="text-xs text-muted-foreground">+89 this week</p>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Accuracy</p>
                  <p className="text-2xl font-bold">95.5%</p>
                  <p className="text-xs text-muted-foreground">+1.2% this month</p>
                </div>
                <Brain className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
