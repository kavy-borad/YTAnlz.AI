'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Smartphone, Lock, Check } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: string
  amount: number
  onSuccess: () => void
}

export default function PaymentModal({ open, onOpenChange, plan, amount, onSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('upi')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  
  // Card form states
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  
  // UPI form states
  const [upiId, setUpiId] = useState('')
  
  const [error, setError] = useState('')

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const chunks = cleaned.match(/.{1,4}/g)
    return chunks ? chunks.join(' ') : cleaned
  }

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const handleCardPayment = async () => {
    setError('')
    
    // Validation
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setError('Please fill all card details')
      return
    }
    
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Card number must be 16 digits')
      return
    }
    
    if (cvv.length !== 3) {
      setError('CVV must be 3 digits')
      return
    }

    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setPaymentSuccess(true)
      
      setTimeout(() => {
        onSuccess()
        onOpenChange(false)
        resetForm()
      }, 2000)
    }, 2000)
  }

  const handleUpiPayment = async () => {
    setError('')
    
    if (!upiId) {
      setError('Please enter your UPI ID')
      return
    }
    
    if (!upiId.includes('@')) {
      setError('Invalid UPI ID format')
      return
    }

    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setPaymentSuccess(true)
      
      setTimeout(() => {
        onSuccess()
        onOpenChange(false)
        resetForm()
      }, 2000)
    }, 2000)
  }

  const resetForm = () => {
    setCardNumber('')
    setCardName('')
    setExpiryDate('')
    setCvv('')
    setUpiId('')
    setError('')
    setPaymentSuccess(false)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen)
      if (!isOpen) resetForm()
    }}>
      <DialogContent className="sm:max-w-[500px]">
        {paymentSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 text-center">
              Your {plan} plan has been activated successfully.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Complete Your Payment</DialogTitle>
              <DialogDescription>
                Subscribe to {plan} Plan - ₹{amount}/month
              </DialogDescription>
            </DialogHeader>

            <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'card' | 'upi')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upi" className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  UPI
                </TabsTrigger>
                <TabsTrigger value="card" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Card
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="upi" className="space-y-4">
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      placeholder="yourname@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      disabled={isProcessing}
                    />
                    <p className="text-xs text-gray-500">
                      Enter your UPI ID (e.g., 9876543210@paytm, username@oksbi)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <Lock className="w-4 h-4" />
                    <span>Secured by 256-bit encryption</span>
                  </div>

                  <Button 
                    onClick={handleUpiPayment} 
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>Processing Payment...</>
                    ) : (
                      <>Pay ₹{amount}</>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="card" className="space-y-4">
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value)
                        if (formatted.replace(/\s/g, '').length <= 16) {
                          setCardNumber(formatted)
                        }
                      }}
                      maxLength={19}
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="JOHN DOE"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => {
                          const formatted = formatExpiry(e.target.value)
                          if (formatted.length <= 5) {
                            setExpiryDate(formatted)
                          }
                        }}
                        maxLength={5}
                        disabled={isProcessing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="password"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => {
                          if (/^\d*$/.test(e.target.value) && e.target.value.length <= 3) {
                            setCvv(e.target.value)
                          }
                        }}
                        maxLength={3}
                        disabled={isProcessing}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <Lock className="w-4 h-4" />
                    <span>Secured by 256-bit encryption</span>
                  </div>

                  <Button 
                    onClick={handleCardPayment} 
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>Processing Payment...</>
                    ) : (
                      <>Pay ₹{amount}</>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
