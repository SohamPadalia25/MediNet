"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Stethoscope,
  Brain,
  Shield,
  Users,
  Activity,
  CheckCircle,
  ArrowRight,
  Star,
  Heart,
  Award,
  TrendingUp,
  Clock,
  Globe,
  Sparkles,
} from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Diagnostics",
      description: "Advanced machine learning algorithms for accurate medical image analysis and disease prediction.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security ensuring patient data privacy and regulatory compliance.",
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "Real-time Analysis",
      description: "Instant diagnostic results with confidence scores and detailed medical recommendations.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Multi-user Platform",
      description: "Seamless collaboration between doctors, patients, and healthcare administrators.",
    },
  ]

  const stats = [
    { value: "94.2%", label: "Diagnostic Accuracy", icon: <TrendingUp className="h-5 w-5" /> },
    { value: "50K+", label: "Diagnoses Made", icon: <Activity className="h-5 w-5" /> },
    { value: "500+", label: "Healthcare Providers", icon: <Users className="h-5 w-5" /> },
    { value: "24/7", label: "Platform Availability", icon: <Clock className="h-5 w-5" /> },
  ]

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      hospital: "Mayo Clinic",
      content:
        "Medinet has revolutionized how I diagnose patients. The AI accuracy is remarkable and has improved our patient outcomes significantly.",
      rating: 5,
      avatar: "/placeholder-r9pij.png",
    },
    {
      name: "Dr. Michael Chen",
      role: "Radiologist",
      hospital: "Johns Hopkins",
      content:
        "The pneumonia detection feature has significantly improved our diagnostic speed while maintaining exceptional accuracy.",
      rating: 5,
      avatar: "/professional-asian-doctor.png",
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Dermatologist",
      hospital: "Cleveland Clinic",
      content:
        "Skin lesion analysis with ABCDE criteria integration is incredibly helpful for early detection and treatment planning.",
      rating: 5,
      avatar: "/placeholder-we21u.png",
    },
  ]

  const benefits = [
    {
      title: "Reduce Diagnostic Time",
      description: "Cut diagnosis time by up to 70% with instant AI analysis",
      icon: <Clock className="h-6 w-6" />,
    },
    {
      title: "Improve Accuracy",
      description: "Achieve 94.2% diagnostic accuracy with AI-powered insights",
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      title: "Global Accessibility",
      description: "Access advanced diagnostics from anywhere in the world",
      icon: <Globe className="h-6 w-6" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-full p-2 shadow-lg">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-serif font-black bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Medinet
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="hover:bg-primary/10">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="shadow-lg hover:shadow-xl transition-shadow">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-full blur-3xl transform -translate-y-1/2"></div>

        <div className="max-w-5xl mx-auto space-y-10 relative z-10">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-3 text-base font-medium shadow-sm">
            <Sparkles className="h-4 w-4 mr-2" />
            AI-Powered Medical Diagnostics Platform
          </Badge>

          <h1 className="text-6xl md:text-8xl font-serif font-black leading-tight tracking-tight">
            The Future of{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Healthcare
            </span>{" "}
            is Here
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Revolutionize medical diagnostics with cutting-edge AI technology. Accurate, fast, and reliable analysis for
            healthcare professionals worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="text-lg px-10 py-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-10 py-7 bg-transparent border-2 hover:bg-primary/5 transition-all duration-300"
              >
                Watch Demo
              </Button>
            </Link>
          </div>

          <div className="pt-12">
            <p className="text-sm text-muted-foreground mb-6">Trusted by leading healthcare institutions</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-lg font-semibold">Mayo Clinic</div>
              <div className="text-lg font-semibold">Johns Hopkins</div>
              <div className="text-lg font-semibold">Cleveland Clinic</div>
              <div className="text-lg font-semibold">Mass General</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center border-0 bg-card/50 backdrop-blur hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-center mb-4 text-primary">{stat.icon}</div>
                <div className="text-4xl font-bold text-primary mb-3">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Why Choose Medinet?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your healthcare practice with AI-powered insights that deliver real results
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="bg-primary/10 rounded-full p-6 w-fit mx-auto mb-6 text-primary group-hover:bg-primary/20 transition-colors">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Advanced Medical AI Technology</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Powered by state-of-the-art machine learning algorithms designed specifically for healthcare professionals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 bg-card/50 backdrop-blur hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group"
            >
              <CardContent className="p-8 text-center">
                <div className="bg-primary/10 rounded-full p-6 w-fit mx-auto mb-6 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Diagnostic Features */}
      <section className="container mx-auto px-4 py-24">
        <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-3xl p-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Comprehensive Diagnostic Suite</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Multiple specialized AI models working together for accurate medical analysis across different specialties
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <Card className="border-0 bg-background/90 backdrop-blur hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-10">
                <div className="bg-blue-100 rounded-full p-4 w-fit mb-6">
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Pneumonia Detection</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Advanced CNN analysis of chest X-rays with industry-leading 94.2% accuracy rate
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Instant X-ray analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Confidence scoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Clinical recommendations
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 bg-background/90 backdrop-blur hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-10">
                <div className="bg-green-100 rounded-full p-4 w-fit mb-6">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Skin Lesion Analysis</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  ABCDE criteria-based analysis for comprehensive dermatological condition assessment
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Multi-class classification
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Risk assessment
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Treatment suggestions
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 bg-background/90 backdrop-blur hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-10">
                <div className="bg-purple-100 rounded-full p-4 w-fit mb-6">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Disease Prediction</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Symptom-based AI analysis for early disease detection and prevention
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Symptom correlation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Probability scoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    Differential diagnosis
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Trusted by Healthcare Professionals</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what leading doctors and medical professionals are saying about Medinet's impact on their practice
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-0 bg-card/50 backdrop-blur hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-8">
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.hospital}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <Card className="border-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
          <CardContent className="p-16 text-center relative z-10">
            <Award className="h-20 w-20 mx-auto mb-8 opacity-80" />
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Ready to Transform Your Practice?</h2>
            <p className="text-xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Join thousands of healthcare professionals using AI-powered diagnostics to improve patient outcomes and
              streamline their workflow
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-10 py-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-7 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent transition-all duration-300"
                >
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-gradient-to-r from-primary to-primary/80 rounded-full p-2 shadow-lg">
                  <Stethoscope className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-serif font-black">Medinet</span>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                AI-powered medical diagnostics platform for the future of healthcare. Empowering doctors with
                intelligent insights.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">f</span>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">t</span>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">in</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">Product</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">Company</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Press Kit
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Medinet. All rights reserved. Built with ❤️ for healthcare professionals.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
