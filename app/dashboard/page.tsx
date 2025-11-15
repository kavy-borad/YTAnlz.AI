'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, LogOut, User, Send, MessageSquare, Youtube, Loader2, Crown, Download, Trash2 } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface TranscriptItem {
  text: string
  start?: number
  duration?: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [transcript, setTranscript] = useState<TranscriptItem[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const router = useRouter()
  const [collections, setCollections] = useState<any[]>([])
  const [showCollections, setShowCollections] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      router.push('/login')
      return
    }
    
    const userData = JSON.parse(currentUser)
    
    if (!userData.plan) {
      userData.plan = 'free'
      localStorage.setItem('currentUser', JSON.stringify(userData))
    }
    
    // Check for successful payment
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      const plan = urlParams.get('plan')
      if (plan) {
        // Update user plan
        userData.plan = plan
        userData.attemptsRemaining = plan === 'pro' ? 100 : plan === 'enterprise' ? 999 : userData.attemptsRemaining
        localStorage.setItem('currentUser', JSON.stringify(userData))
        
        // Update users array
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const userIndex = users.findIndex((u: any) => u.id === userData.id)
        if (userIndex !== -1) {
          users[userIndex] = userData
          localStorage.setItem('users', JSON.stringify(users))
        }
        
        // Clear URL params
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
    
    // Check if it's a new day and reset attempts (only for free users)
    const today = new Date().toDateString()
    const lastUsedDate = userData.lastUsedDate || ''
    
    if (lastUsedDate !== today && userData.plan === 'free') {
      // Reset attempts for new day (free users only)
      userData.attemptsRemaining = 10
      userData.lastUsedDate = today
      localStorage.setItem('currentUser', JSON.stringify(userData))
      
      // Update users array
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const userIndex = users.findIndex((u: any) => u.id === userData.id)
      if (userIndex !== -1) {
        users[userIndex] = userData
        localStorage.setItem('users', JSON.stringify(users))
      }
    }
    
    setUser(userData)
    
    // Load user's collections
    const userCollections = JSON.parse(localStorage.getItem(`collections_${userData.id}`) || '[]')
    setCollections(userCollections)
  }, [router])

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/
    return youtubeRegex.test(url)
  }

  const canUseService = () => {
    if (user.plan === 'enterprise') return true
    if (user.plan === 'pro' && user.attemptsRemaining > 0) return true
    if (user.plan === 'free' && user.attemptsRemaining > 0) return true
    return false
  }

  const fetchTranscript = async () => {
    if (!isValidYouTubeUrl(youtubeUrl)) {
      setError('Please enter a valid YouTube URL')
      return
    }

    if (!canUseService()) {
      setError('You have used all your attempts. Upgrade to Pro for more access!')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch transcript')
      }

      setTranscript(data.transcript)
      
      // Create collection entry
      const collection = {
        id: Date.now().toString(),
        url: youtubeUrl,
        title: data.title || 'YouTube Video',
        transcript: data.transcript,
        createdAt: new Date().toISOString(),
        chatHistory: []
      }
      
      // Save to collections
      const updatedCollections = [...collections, collection]
      setCollections(updatedCollections)
      localStorage.setItem(`collections_${user.id}`, JSON.stringify(updatedCollections))
      
      // Decrease attempts (except for enterprise users)
      if (user.plan !== 'enterprise') {
        const updatedUser = { ...user, attemptsRemaining: user.attemptsRemaining - 1 }
        setUser(updatedUser)
        
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        
        // Update users array
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const userIndex = users.findIndex((u: any) => u.id === user.id)
        if (userIndex !== -1) {
          users[userIndex] = updatedUser
          localStorage.setItem('users', JSON.stringify(users))
        }
      }

      // Store current transcript
      localStorage.setItem('currentTranscript', JSON.stringify(data.transcript))
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transcript')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadTranscript = () => {
    if (!transcript) return
    
    // Format transcript text with better styling
    let transcriptText = ''
    
    // Header section
    transcriptText += '=' .repeat(80) + '\n'
    transcriptText += '                    YOUTUBE TRANSCRIPT ANALYZER\n'
    transcriptText += '=' .repeat(80) + '\n\n'
    
    // Video information
    if (selectedCollection) {
      transcriptText += '📹 VIDEO INFORMATION:\n'
      transcriptText += '-' .repeat(50) + '\n'
      transcriptText += `🏷️  Title: ${selectedCollection.title}\n`
      transcriptText += `🔗 URL: ${selectedCollection.url}\n`
      transcriptText += `📅 Generated: ${new Date(selectedCollection.createdAt).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}\n`
      transcriptText += `⏱️  Duration: ${transcript.length} segments\n\n`
    }
    
    // Transcript section
    transcriptText += '📝 FULL TRANSCRIPT:\n'
    transcriptText += '=' .repeat(80) + '\n\n'
    
    let wordCount = 0
    let currentParagraph = ''
    let sentenceCount = 0
    
    transcript.forEach((item, index) => {
      const words = item.text.split(' ').length
      wordCount += words
      
      if (item.start) {
        const minutes = Math.floor(item.start / 60)
        const seconds = (item.start % 60).toFixed(0).padStart(2, '0')
        
        // Add paragraph break every 5 sentences or 2 minutes
        if (index > 0 && (sentenceCount % 5 === 0 || (item.start - (transcript[index-1]?.start || 0)) > 120)) {
          transcriptText += '\n'
        }
        
        transcriptText += `[${minutes}:${seconds}] ${item.text}\n`
        
        // Count sentences
        if (item.text.includes('.') || item.text.includes('!') || item.text.includes('?')) {
          sentenceCount++
        }
      } else {
        transcriptText += `${item.text}\n`
      }
    })
    
    // Statistics section
    transcriptText += '\n' + '=' .repeat(80) + '\n'
    transcriptText += '📊 TRANSCRIPT STATISTICS:\n'
    transcriptText += '-' .repeat(50) + '\n'
    transcriptText += `📝 Total Segments: ${transcript.length}\n`
    transcriptText += `🔤 Estimated Word Count: ${wordCount}\n`
    transcriptText += `📖 Estimated Reading Time: ${Math.ceil(wordCount / 200)} minutes\n`
    transcriptText += `⏰ Video Duration: ${transcript[transcript.length - 1]?.start ? 
      Math.ceil((transcript[transcript.length - 1]?.start || 0) / 60) + ' minutes' : 'Unknown'}\n\n`
    
    // Footer
    transcriptText += '-' .repeat(80) + '\n'
    transcriptText += '🤖 Generated by YouTube Transcript Analyzer\n'
    transcriptText += '🌐 Powered by AI Technology\n'
    transcriptText += `📅 Downloaded on: ${new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}\n`
    transcriptText += '=' .repeat(80) + '\n'
    
    // Create and download file
    const blob = new Blob([transcriptText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    
    // Generate filename with better naming
    const currentDate = new Date().toISOString().split('T')[0]
    const title = selectedCollection?.title
      .replace(/[^a-z0-9\s]/gi, '')
      .replace(/\s+/g, '_')
      .substring(0, 50)
      .toLowerCase() || 'youtube_transcript'
    
    a.href = url
    a.download = `${title}_transcript_${currentDate}.txt`
    
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    // Show success message
    alert(`📥 Transcript downloaded successfully!\n\nFile: ${title}_transcript_${currentDate}.txt\nWords: ~${wordCount}\nReading time: ~${Math.ceil(wordCount / 200)} minutes`)
  }

  const deleteCollection = (collectionId: string) => {
    if (!confirm('Are you sure you want to delete this transcript? This action cannot be undone.')) {
      return
    }
    
    const updatedCollections = collections.filter(col => col.id !== collectionId)
    setCollections(updatedCollections)
    localStorage.setItem(`collections_${user.id}`, JSON.stringify(updatedCollections))
    
    // If the deleted collection was currently selected, clear it
    if (selectedCollection?.id === collectionId) {
      setSelectedCollection(null)
      setTranscript(null)
      setShowChat(false)
    }
  }

  const loadCollection = (collection: any) => {
    setTranscript(collection.transcript)
    setMessages(collection.chatHistory || [
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m ready to help you analyze this transcript. You can ask me questions about the content, request summaries, key points, or any specific information from the video.',
        timestamp: new Date()
      }
    ])
    setShowCollections(false)
    setShowChat(true)
    localStorage.setItem('currentTranscript', JSON.stringify(collection.transcript))
  }

  const saveMessageToCollection = (newMessages: Message[]) => {
    if (selectedCollection) {
      const updatedCollections = collections.map(col => 
        col.id === selectedCollection.id 
          ? { ...col, chatHistory: newMessages }
          : col
      )
      setCollections(updatedCollections)
      localStorage.setItem(`collections_${user.id}`, JSON.stringify(updatedCollections))
    }
  }

  const redirectToPricing = () => {
    router.push('/?section=pricing')
  }

  const startChat = () => {
    setShowChat(true)
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m ready to help you analyze this transcript. You can ask me questions about the content, request summaries, key points, or any specific information from the video.',
        timestamp: new Date()
      }
    ])
  }

  const sendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return

    console.log('Starting sendMessage with:', { chatInput, transcriptAvailable: !!transcript, timestamp: new Date().toISOString() })

    const userMessage: Message = {
      id: `user_${Date.now()}_${Math.random()}`,
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    const currentInput = chatInput
    setChatInput('')
    setIsChatLoading(true)

    try {
      console.log('Sending chat request:', { 
        message: currentInput, 
        transcriptLength: transcript?.length,
        hasTranscript: !!transcript,
        messageId: userMessage.id
      })
      
      if (!transcript || transcript.length === 0) {
        throw new Error('No transcript available. Please analyze a video first.')
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          transcript: transcript,
          messageId: userMessage.id, // Add unique identifier
          timestamp: new Date().toISOString()
        }),
      })

      console.log('Chat API response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Chat API response received:', { 
        hasResponse: !!data.response, 
        responseLength: data.response?.length,
        responsePreview: data.response?.substring(0, 50) + '...'
      })

      if (!data.response) {
        throw new Error('No response received from AI')
      }

      const assistantMessage: Message = {
        id: `assistant_${Date.now()}_${Math.random()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      const finalMessages = [...newMessages, assistantMessage]
      setMessages(finalMessages)
      saveMessageToCollection(finalMessages)
      console.log('Message sent successfully, total messages:', finalMessages.length)
      
    } catch (err: any) {
      console.error('Chat error details:', err)
      
      let errorContent = 'Sorry, I encountered an error processing your request. Please try again.'
      
      if (err.message?.includes('transcript')) {
        errorContent = 'Error: No transcript available. Please analyze a video first before chatting.'
      } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
        errorContent = 'Network error. Please check your connection and try again.'
      } else if (err.message?.includes('503')) {
        errorContent = 'AI service is temporarily busy. Please try again in a moment.'
      } else if (err.message?.includes('400')) {
        errorContent = 'Invalid request. Please make sure you have analyzed a video first.'
      }
      
      const errorMessage: Message = {
        id: `error_${Date.now()}_${Math.random()}`,
        role: 'assistant',
        content: errorContent,
        timestamp: new Date()
      }
      const finalMessages = [...newMessages, errorMessage]
      setMessages(finalMessages)
      saveMessageToCollection(finalMessages)
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('currentTranscript')
    router.push('/')
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-blue-500'
      case 'enterprise': return 'bg-purple-500'
      case 'free':
      default: return 'bg-gray-500'
    }
  }

  const getAttemptsDisplay = () => {
    if (user.plan === 'enterprise') return 'Unlimited'
    if (user.plan === 'pro') return `${user.attemptsRemaining}/100`
    return `${user.attemptsRemaining}/10 daily`
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <Play className="w-8 h-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">YouTube Transcript Analyzer</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCollections(!showCollections)}
                className="hidden md:flex"
              >
                My Collections ({collections.length})
              </Button>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">{user.username}</span>
                <Badge className={`${getPlanBadgeColor(user.plan || 'free')} text-white`}>
                  {user.plan === 'enterprise' && <Crown className="w-3 h-3 mr-1" />}
                  {(user.plan || 'free').toUpperCase()}
                </Badge>
                <Badge variant={canUseService() ? "default" : "destructive"}>
                  {getAttemptsDisplay()} attempts
                </Badge>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showCollections ? (
          /* Collections View */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Collections</h2>
              <Button variant="outline" onClick={() => setShowCollections(false)}>
                Back to Dashboard
              </Button>
            </div>
            
            {collections.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Youtube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Collections Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start analyzing YouTube videos to build your collection
                  </p>
                  <Button onClick={() => setShowCollections(false)}>
                    Analyze Your First Video
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <Card key={collection.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg truncate pr-2">{collection.title}</CardTitle>
                          <CardDescription>
                            {new Date(collection.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteCollection(collection.id)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {collection.transcript.slice(0, 3).map((item: any) => item.text).join(' ')}...
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => loadCollection(collection)}>
                          Open Chat
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setTranscript(collection.transcript)
                          setShowCollections(false)
                          setShowChat(false)
                        }}>
                          View Transcript
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : !showChat ? (
          <div className="space-y-8">
            {/* Plan Status Card */}
            {(user.plan === 'pro' || user.plan === 'enterprise') && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      {user.plan === 'pro' ? 'Pro Plan Active' : 'Enterprise Plan Active'}
                    </span>
                  </div>
                  <Badge className="bg-green-600 text-white">
                    {user.plan === 'enterprise' ? 'Unlimited' : `${user.attemptsRemaining} attempts left`}
                  </Badge>
                </CardContent>
              </Card>
            )}

            {user.plan === 'free' && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-2">
                    <Play className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Free Plan</span>
                    <span className="text-sm text-blue-600">
                      - Upgrade to unlock more features
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={redirectToPricing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Upgrade to Pro ₹99/month
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* YouTube URL Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Youtube className="w-6 h-6 mr-2 text-red-600" />
                  Analyze YouTube Video
                </CardTitle>
                <CardDescription>
                  Enter a YouTube URL to extract and analyze its transcript with AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {error}
                      {!canUseService() && (
                        <Button 
                          variant="link" 
                          className="p-0 h-auto ml-2 text-red-600 underline"
                          onClick={redirectToPricing}
                        >
                          Upgrade Now
                        </Button>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex space-x-2">
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={fetchTranscript} 
                    disabled={isLoading || !canUseService()}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Fetching...
                      </>
                    ) : (
                      'Get Transcript'
                    )}
                  </Button>
                </div>
                
                {!canUseService() && (
                  <Alert>
                    <AlertDescription>
                      You've used all your attempts. 
                      <Button 
                        variant="link" 
                        className="p-0 h-auto ml-1 text-blue-600 underline"
                        onClick={redirectToPricing}
                      >
                        Upgrade to Pro (₹99/month)
                      </Button> 
                      for 100 daily attempts, or wait until tomorrow for 10 new attempts.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Usage Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {user.plan === 'free' ? 'Daily Usage' : 'Plan Usage'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      {user.plan === 'enterprise' ? (
                        <span>Unlimited attempts available</span>
                      ) : user.plan === 'pro' ? (
                        <span>Attempts used: <strong>{100 - user.attemptsRemaining}/100</strong></span>
                      ) : (
                        <span>Attempts used today: <strong>{10 - user.attemptsRemaining}/10</strong></span>
                      )}
                    </p>
                    {user.plan === 'free' && (
                      <p className="text-xs text-gray-500 mt-1">
                        Resets daily at midnight
                      </p>
                    )}
                  </div>
                  {user.plan !== 'enterprise' && (
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: user.plan === 'pro' 
                            ? `${((100 - user.attemptsRemaining) / 100) * 100}%`
                            : `${((10 - user.attemptsRemaining) / 10) * 100}%`
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Transcript Display */}
            {transcript && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Transcript</CardTitle>
                    <CardDescription>
                      Video transcript extracted successfully
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={downloadTranscript}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={startChat}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat with Transcript
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 w-full border rounded-md p-4">
                    <div className="space-y-2">
                      {transcript.map((item, index) => (
                        <div key={index} className="text-sm">
                          {item.start && (
                            <span className="text-blue-600 font-mono text-xs mr-2">
                              [{Math.floor(item.start / 60)}:{(item.start % 60).toFixed(0).padStart(2, '0')}]
                            </span>
                          )}
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Chat Interface - keep existing chat interface code */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transcript Panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Transcript Reference</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowChat(false)}
                >
                  Back to Transcript
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2 text-xs">
                    {transcript?.slice(0, 20).map((item, index) => (
                      <div key={index}>
                        {item.start && (
                          <span className="text-blue-600 font-mono mr-1">
                            [{Math.floor(item.start / 60)}:{(item.start % 60).toFixed(0).padStart(2, '0')}]
                          </span>
                        )}
                        <span>{item.text}</span>
                      </div>
                    ))}
                    {transcript && transcript.length > 20 && (
                      <p className="text-gray-500 italic">... and more</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Panel */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  AI Chat
                </CardTitle>
                <CardDescription>
                  Ask questions about the transcript content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Messages */}
                <ScrollArea className="h-96 border rounded-md p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg px-4 py-2">
                          <div className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask a question about the transcript..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={isChatLoading}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={isChatLoading || !chatInput.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quick Questions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Quick Questions:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setChatInput("Summarize the main points of this video")
                        // Auto-send after setting input
                        setTimeout(async () => {
                          if (transcript && transcript.length > 0) {
                            setIsChatLoading(true)
                            await sendMessage()
                          }
                        }, 200)
                      }}
                      disabled={isChatLoading || !transcript}
                    >
                      Summarize
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setChatInput("What are the key takeaways from this video?")
                        setTimeout(async () => {
                          if (transcript && transcript.length > 0) {
                            setIsChatLoading(true)
                            await sendMessage()
                          }
                        }, 200)
                      }}
                      disabled={isChatLoading || !transcript}
                    >
                      Key Points
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setChatInput("Analyze the sentiment and tone of this video")
                        setTimeout(async () => {
                          if (transcript && transcript.length > 0) {
                            setIsChatLoading(true)
                            await sendMessage()
                          }
                        }, 200)
                      }}
                      disabled={isChatLoading || !transcript}
                    >
                      Sentiment
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setChatInput("What topics are discussed in this video?")
                        setTimeout(async () => {
                          if (transcript && transcript.length > 0) {
                            setIsChatLoading(true)
                            await sendMessage()
                          }
                        }, 200)
                      }}
                      disabled={isChatLoading || !transcript}
                    >
                      Topics
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setChatInput("Provide important quotes from this video")
                        setTimeout(async () => {
                          if (transcript && transcript.length > 0) {
                            setIsChatLoading(true)
                            await sendMessage()
                          }
                        }, 200)
                      }}
                      disabled={isChatLoading || !transcript}
                    >
                      Quotes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
