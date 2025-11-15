'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Play, ArrowLeft, Mail, Key, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'reset' | 'success'>('email')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [foundUser, setFoundUser] = useState<any>(null)
  const router = useRouter()

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    // Check if user exists with this email
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase())

    if (!user) {
      setError('No account found with this email address')
      return
    }

    setFoundUser(user)
    setUsername(user.username)
    setStep('reset')
  }

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!newPassword.trim()) {
      setError('Please enter a new password')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Update user password
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex((u: any) => u.id === foundUser.id)

    if (userIndex !== -1) {
      users[userIndex].password = newPassword
      localStorage.setItem('users', JSON.stringify(users))
      
      // Update current user if logged in as this user
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
      if (currentUser && currentUser.id === foundUser.id) {
        currentUser.password = newPassword
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
      }

      setStep('success')
    } else {
      setError('Error updating password. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center">
            <Play className="w-8 h-8 text-blue-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">YouTube Transcript Analyzer</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            {step === 'email' && (
              <>
                <CardTitle className="text-2xl flex items-center justify-center">
                  <Mail className="w-6 h-6 mr-2 text-blue-600" />
                  Forgot Password
                </CardTitle>
                <CardDescription>
                  Enter your email address and we'll help you reset your password
                </CardDescription>
              </>
            )}
            {step === 'reset' && (
              <>
                <CardTitle className="text-2xl flex items-center justify-center">
                  <Key className="w-6 h-6 mr-2 text-blue-600" />
                  Reset Password
                </CardTitle>
                <CardDescription>
                  Create a new password for your account: <strong>{username}</strong>
                </CardDescription>
              </>
            )}
            {step === 'success' && (
              <>
                <CardTitle className="text-2xl flex items-center justify-center text-green-600">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Password Reset Successful
                </CardTitle>
                <CardDescription>
                  Your password has been updated successfully
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {step === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Find My Account
                </Button>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Reset Password
                </Button>
              </form>
            )}

            {step === 'success' && (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Your password has been reset successfully! You can now sign in with your new password.
                  </p>
                </div>

                <Button 
                  onClick={() => router.push('/login')} 
                  className="w-full"
                >
                  Go to Sign In
                </Button>
              </div>
            )}

            {/* Back to Login */}
            {step !== 'success' && (
              <div className="mt-6 text-center">
                <Link href="/login" className="inline-flex items-center text-sm text-blue-600 hover:underline">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Sign In
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}