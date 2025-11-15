'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from 'lucide-react'
import PaymentModal from './payment-modal'

interface PricingCardProps {
  name: string
  price: string
  period: string
  attempts: string
  features: string[]
  popular: boolean
  plan?: string
  user?: any
}

export default function PricingCard({ 
  name, 
  price, 
  period, 
  attempts, 
  features, 
  popular, 
  plan,
  user 
}: PricingCardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handleSubscribe = () => {
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = () => {
    // Just show success message, don't actually upgrade plan
    // This is a demo payment UI only
    alert('✅ Payment Successful!\n\nNote: This is a demo payment interface.\n\nIn production, this would activate your ' + name + ' plan.')
    setShowPaymentModal(false)
  }

  const isFree = name === 'Free'
  const isCurrentPlan = user?.plan === name.toLowerCase()

  return (
    <div>
      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        plan={name}
        amount={parseInt(price.replace('₹', '').replace(',', ''))}
        onSuccess={handlePaymentSuccess}
      />
      
      <Card className={`relative pricing-card-hover ${
        popular 
          ? 'border-blue-500 border-2 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl' 
          : 'hover:border-blue-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50'
      } ${isCurrentPlan ? 'bg-gray-50 border-gray-400' : ''}`}>
        {popular && (
          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 shadow-lg">
            Most Popular
          </Badge>
        )}
        <CardHeader className="text-center transition-all duration-300 hover:transform hover:scale-105">
          <CardTitle className={`text-2xl transition-colors duration-300 ${
            popular ? 'text-blue-700' : 'hover:text-blue-600'
          }`}>
            {name}
          </CardTitle>
          <div className="mt-4 transition-transform duration-300 hover:scale-110">
            <span className={`text-4xl font-bold transition-colors duration-300 ${
              popular ? 'text-blue-600' : 'hover:text-blue-500'
            }`}>
              {price}
            </span>
            <span className="text-gray-600">{period}</span>
          </div>
          <CardDescription className={`text-lg font-medium transition-colors duration-300 ${
            popular ? 'text-blue-700' : 'text-blue-600 hover:text-blue-700'
          }`}>
            {attempts}
          </CardDescription>
        </CardHeader>
        <CardContent className="transition-all duration-300">
        <ul className="space-y-3 mb-6">
          {features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-center feature-hover group cursor-pointer">
              <Check className="w-5 h-5 text-green-500 mr-2 transition-all duration-200 group-hover:text-green-600 group-hover:scale-110 group-hover:rotate-12" />
              <span className="transition-colors duration-200 group-hover:font-medium">{feature}</span>
            </li>
          ))}
        </ul>
        
        {isCurrentPlan ? (
          <Button className="w-full transition-all duration-300 bg-gray-500 hover:bg-gray-600 transform hover:scale-105" disabled>
            Current Plan
          </Button>
        ) : isFree ? (
          <Button className="w-full transition-all duration-300 transform hover:scale-105" variant="outline" disabled>
            Free Plan
          </Button>
        ) : (
          <Button 
            className={`w-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              popular 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'hover:bg-blue-600'
            }`}
            variant={popular ? "default" : "outline"}
            onClick={handleSubscribe}
          >
            <span className="transition-all duration-200 hover:tracking-wide">
              Subscribe Now
            </span>
          </Button>
        )}
        </CardContent>
      </Card>
    </div>
  )
}
