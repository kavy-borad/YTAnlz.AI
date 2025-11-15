'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Check, Play, BarChart3, MessageSquare, Clock, AlertCircle, X } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import PricingCard from "@/components/pricing-card"

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showCancelAlert, setShowCancelAlert] = useState(false)
  const [showDemoModal, setShowDemoModal] = useState(false)

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      setIsLoggedIn(true)
      setUser(JSON.parse(currentUser))
    }

    // Check for canceled payment
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('canceled') === 'true') {
      setShowCancelAlert(true)
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  useEffect(() => {
    // Check for pricing section redirect
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('section') === 'pricing') {
      const pricingSection = document.getElementById('pricing-section')
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  const features = [
    {
      icon: <Play className="w-6 h-6" />,
      title: "YouTube Integration",
      description: "Extract transcripts from any YouTube video with just a URL"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "AI Analysis",
      description: "Get insights, summaries, and key points using advanced AI"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Interactive Chat",
      description: "Ask questions about the transcript and get instant answers"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Time-stamped",
      description: "Navigate through content with precise timestamps"
    }
  ]

  const pricingTiers = [
    {
      name: "Free",
      price: "₹0",
      period: "/month",
      attempts: "10 daily attempts",
      features: [
        "10 daily transcript extractions",
        "Basic AI analysis",
        "Chat interface",
        "Standard support"
      ],
      popular: false,
      plan: "free"
    },
    {
      name: "Pro",
      price: "₹99",
      period: "/month",
      attempts: "100 daily attempts",
      features: [
        "100 daily transcript extractions",
        "Advanced AI analysis",
        "Priority chat interface",
        "Export transcripts",
        "Priority support"
      ],
      popular: true,
      plan: "pro"
    },
    {
      name: "Enterprise",
      price: "₹999",
      period: "/month",
      attempts: "Unlimited attempts",
      features: [
        "Unlimited daily extractions",
        "Custom AI models",
        "API access",
        "Bulk processing",
        "24/7 support"
      ],
      popular: false,
      plan: "enterprise"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Play className="w-8 h-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">YouTube Transcript Analyzer</h1>
            </div>
            <div className="flex space-x-4">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Payment Canceled Alert */}
      {showCancelAlert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Payment was canceled. You can try again anytime or continue with the free plan.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Unlock the Power of
            <span className="text-blue-600"> YouTube Transcripts</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Extract, analyze, and chat with YouTube video transcripts using advanced AI. 
            Get insights, summaries, and answers from any video content in seconds.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register">
              <Button size="lg" className="px-8 py-3">
                Start Free Trial
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-3"
              onClick={() => setShowDemoModal(true)}
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to analyze video content
            </h3>
            <p className="text-lg text-gray-600">
              Powerful features to help you extract maximum value from YouTube videos
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Choose your plan
            </h3>
            <p className="text-lg text-gray-600">
              Start free and upgrade as you grow. All prices in Indian Rupees (₹)
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className="transform transition-all duration-500 hover:z-10"
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <PricingCard
                  name={tier.name}
                  price={tier.price}
                  period={tier.period}
                  attempts={tier.attempts}
                  features={tier.features}
                  popular={tier.popular}
                  plan={tier.plan}
                  user={user}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already analyzing YouTube content with AI
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Play className="w-6 h-6 text-blue-400 mr-2" />
              <span className="text-lg font-semibold">YouTube Transcript Analyzer</span>
            </div>
            <p className="text-gray-400">
              © 2025 YouTube Transcript Analyzer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Product Demo</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDemoModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">How YouTube Transcript Analyzer Works</h3>
                <p className="text-gray-600 mb-4">
                  Watch this quick demo to see how you can extract, analyze, and chat with YouTube video transcripts using our AI-powered platform.
                </p>
              </div>

              {/* Demo Video/Content */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="bg-white rounded-lg border p-6">
                  <h4 className="text-lg font-semibold mb-4 text-center">Try it yourself - Interactive Demo</h4>
                  
                  {/* Step 1: URL Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      1. Paste YouTube URL
                    </label>
                    <div className="flex space-x-2">
                      <input 
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=example"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      />
                      <Button className="px-4 py-2">
                        Analyze
                      </Button>
                    </div>
                  </div>

                  {/* Step 2: Loading State */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      <span className="text-blue-800">Extracting transcript using AI...</span>
                    </div>
                  </div>

                  {/* Step 3: Transcript Result */}
                  <div className="mb-6">
                    <h5 className="font-medium text-gray-900 mb-3">2. AI-Generated Transcript</h5>
                    <div className="bg-gray-50 border rounded-lg p-4 max-h-32 overflow-y-auto">
                      <p className="text-sm text-gray-700">
                        "Welcome to this amazing tutorial where we'll explore the fascinating world of technology. 
                        In today's video, we're going to dive deep into artificial intelligence and machine learning concepts. 
                        First, let's understand what AI really means and how it impacts our daily lives. 
                        Artificial intelligence is the simulation of human intelligence in machines..."
                      </p>
                    </div>
                  </div>

                  {/* Step 4: AI Analysis */}
                  <div className="mb-6">
                    <h5 className="font-medium text-gray-900 mb-3">3. AI Analysis & Insights</h5>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h6 className="font-medium text-green-800 mb-1">Key Topics</h6>
                        <div className="flex flex-wrap gap-1">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">AI</span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Technology</span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Tutorial</span>
                        </div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h6 className="font-medium text-blue-800 mb-1">Summary</h6>
                        <p className="text-xs text-blue-700">
                          Educational content about AI and technology concepts with practical examples.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 5: Chat Interface */}
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-3">4. Chat with the Content</h5>
                    <div className="border rounded-lg">
                      <div className="bg-gray-50 p-3 border-b max-h-24 overflow-y-auto">
                        <div className="mb-2">
                          <div className="bg-blue-100 text-blue-800 text-sm p-2 rounded inline-block">
                            What are the main topics covered in this video?
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="bg-gray-100 text-gray-800 text-sm p-2 rounded inline-block">
                            🤖 The video covers artificial intelligence, machine learning concepts, and their practical applications in daily life.
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex space-x-2">
                          <input 
                            type="text"
                            placeholder="Ask anything about the video content..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                          <Button size="sm">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Features */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
                    AI Analysis
                  </h4>
                  <p className="text-sm text-gray-600">
                    Get summaries, key points, and sentiment analysis from any YouTube video
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-green-600" />
                    Interactive Chat
                  </h4>
                  <p className="text-sm text-gray-600">
                    Ask questions about the video content and get instant AI-powered answers
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold mb-2">Ready to get started?</h4>
                <p className="text-gray-600 mb-4">
                  Try it yourself with 5 free transcript analyses
                </p>
                <div className="space-x-3">
                  <Link href="/register">
                    <Button className="px-6">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => setShowDemoModal(false)}>
                    Close Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
