"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Activity, TrendingUp, Settings, Play, RefreshCw, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export default function AIModelsManagement() {
  const [selectedModel, setSelectedModel] = useState("pneumonia")

  const models = [
    {
      id: "pneumonia",
      name: "Pneumonia Detection",
      type: "Image Classification",
      status: "active",
      accuracy: 94.2,
      version: "v2.1.0",
      lastTrained: "2024-01-10",
      predictions: 15420,
      confidence: 0.94,
      description: "Advanced CNN model for detecting pneumonia in chest X-rays",
    },
    {
      id: "skin-lesion",
      name: "Skin Lesion Analysis",
      type: "Image Classification",
      status: "active",
      accuracy: 91.8,
      version: "v1.8.2",
      lastTrained: "2024-01-08",
      predictions: 8930,
      confidence: 0.92,
      description: "Multi-class classifier for skin lesion diagnosis using ABCDE criteria",
    },
    {
      id: "disease-prediction",
      name: "Disease Prediction",
      type: "Symptom Analysis",
      status: "training",
      accuracy: 88.5,
      version: "v3.0.0-beta",
      lastTrained: "2024-01-12",
      predictions: 12340,
      confidence: 0.89,
      description: "NLP-based model for disease prediction from symptom descriptions",
    },
    {
      id: "drug-interaction",
      name: "Drug Interaction Checker",
      type: "Knowledge Graph",
      status: "maintenance",
      accuracy: 96.7,
      version: "v1.5.1",
      lastTrained: "2024-01-05",
      predictions: 5670,
      confidence: 0.97,
      description: "Graph neural network for detecting potential drug interactions",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "training":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "maintenance":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "training":
        return <Badge className="bg-yellow-100 text-yellow-800">Training</Badge>
      case "maintenance":
        return <Badge className="bg-orange-100 text-orange-800">Maintenance</Badge>
      default:
        return <Badge variant="destructive">Error</Badge>
    }
  }

  const currentModel = models.find((m) => m.id === selectedModel) || models[0]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold">AI Models Management</h1>
          <p className="text-muted-foreground">Monitor and manage AI diagnostic models</p>
        </div>
        <Button>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Models
        </Button>
      </div>

      {/* Models Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Models</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Predictions</p>
                <p className="text-2xl font-bold">42.3K</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Accuracy</p>
                <p className="text-2xl font-bold">92.8%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Models Training</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <Activity className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Models List */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>AI Models</CardTitle>
              <CardDescription>Select a model to view details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {models.map((model) => (
                <div
                  key={model.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedModel === model.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{model.name}</h4>
                    {getStatusIcon(model.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{model.type}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{model.accuracy}% accuracy</span>
                    {getStatusBadge(model.status)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{currentModel.name}</CardTitle>
                  <CardDescription>{currentModel.description}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Deploy
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="training">Training</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Version</p>
                      <p className="text-lg font-semibold">{currentModel.version}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(currentModel.status)}
                        <span className="capitalize">{currentModel.status}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Predictions</p>
                      <p className="text-lg font-semibold">{currentModel.predictions.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Last Trained</p>
                      <p className="text-lg font-semibold">{currentModel.lastTrained}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Accuracy</span>
                        <span className="text-sm font-medium">{currentModel.accuracy}%</span>
                      </div>
                      <Progress value={currentModel.accuracy} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Confidence Score</span>
                        <span className="text-sm font-medium">{(currentModel.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={currentModel.confidence * 100} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm font-medium text-muted-foreground">Precision</p>
                          <p className="text-2xl font-bold">91.2%</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm font-medium text-muted-foreground">Recall</p>
                          <p className="text-2xl font-bold">89.8%</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="training" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Retrain Model</h4>
                        <p className="text-sm text-muted-foreground">Update model with latest data</p>
                      </div>
                      <Button>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Start Training
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Training Progress</p>
                      <Progress value={currentModel.status === "training" ? 65 : 0} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {currentModel.status === "training"
                          ? "Training in progress... 65% complete"
                          : "No active training"}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
