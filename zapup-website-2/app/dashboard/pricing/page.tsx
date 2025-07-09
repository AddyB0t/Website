'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AppLayout } from '@/components/AppLayout'
import { AuthGuard } from '@/components/AuthGuard'
import { useRazorpay } from '@/hooks/useRazorpay'
import { 
  Check, 
  BookOpen, 
  Target, 
  Crown,
  Globe,
  Sparkles,
  CreditCard,
  Shield
} from 'lucide-react'

const pricingTiers = [
  {
    id: 'free',
    name: 'Explorer',
    price: '₹0',
    badge: 'Current Plan',
    badgeColor: 'bg-gray-100 text-gray-700',
    ideal: 'Trial users, awareness phase',
    icon: <Globe className="w-6 h-6" />,
    color: 'from-gray-500 to-gray-600',
    borderColor: 'border-gray-200',
    buttonVariant: 'outline' as const,
    buttonText: 'Current Plan',
    popular: false,
    features: [
      'Access to 3–5 questions per day (per subject)',
      'Limited classes (e.g., Class 6–8 only)',
      'Basic AI explanations (no personalization)',
      'Occasional ads or nudges to upgrade'
    ]
  },
  {
    id: 'basic',
    name: 'Scholar',
    price: '₹149',
    annualPrice: '₹1,299',
    annualMonthlyEquivalent: '₹108',
    annualSavings: '27%',
    badge: 'Basic',
    badgeColor: 'bg-blue-100 text-blue-700',
    ideal: 'Budget-conscious parents',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'from-blue-500 to-blue-600',
    borderColor: 'border-blue-200',
    buttonVariant: 'outline' as const,
    buttonText: 'Upgrade to Scholar',
    popular: false,
    features: [
      'Unlimited questions for 1 class (e.g., Class 7 only)',
      'Personalized explanations based on school curriculum',
      'Basic progress tracking (daily/weekly insights)',
      'Email or in-app parental summaries (monthly)',
      'Access to doubt-solving chatbot (text only)'
    ]
  },
  {
    id: 'plus',
    name: 'Achiever',
    price: '₹349',
    annualPrice: '₹3,049',
    annualMonthlyEquivalent: '₹254',
    annualSavings: '27%',
    badge: 'Recommended',
    badgeColor: 'bg-green-100 text-green-700',
    ideal: 'Serious learners (high usage)',
    icon: <Target className="w-6 h-6" />,
    color: 'from-green-500 to-green-600',
    borderColor: 'border-green-200',
    buttonVariant: 'default' as const,
    buttonText: 'Upgrade to Achiever',
    popular: true,
    features: [
      'Multi-class access (ideal for siblings)',
      'Exam-mode: AI adapts questions based on previous performance',
      'AI-generated mock tests (subject-wise)',
      'Image upload for handwritten questions',
      'Audio explanations (for language or weak readers)'
    ]
  },
  {
    id: 'premium',
    name: 'Genius+',
    price: '₹599',
    annualPrice: '₹5,229',
    annualMonthlyEquivalent: '₹436',
    annualSavings: '27%',
    badge: 'Premium',
    badgeColor: 'bg-purple-100 text-purple-700',
    ideal: 'Top-performing students, exam-focused',
    icon: <Crown className="w-6 h-6" />,
    color: 'from-purple-500 to-purple-600',
    borderColor: 'border-purple-200',
    buttonVariant: 'default' as const,
    buttonText: 'Upgrade to Genius+',
    popular: false,
    features: [
      'Includes all Achiever features +',
      'Homework auto-check + suggestions',
      'Parent dashboard with analytics + alerts',
      'Monthly AI progress report (PDF)',
      'One-on-one chat access to human mentor (limited)',
      'Early access to new features / beta tools'
    ]
  }
]

export default function DashboardPricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const { preferences } = useUserPreferences()
  const { initiatePayment, isLoading } = useRazorpay()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Handle success message from payment
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({
        title: 'Payment Successful!',
        description: 'Your subscription has been activated successfully.',
      })
    }
  }, [searchParams, toast])

  const handleTierSelect = (tierId: string) => {
    if (tierId === 'free') {
      // Handle free tier separately
      return
    }

    setSelectedTier(tierId)
    
    // Find the selected tier
    const tier = pricingTiers.find(t => t.id === tierId)
    if (!tier) return

    // Calculate amount based on billing cycle
    const amount = billingCycle === 'annual' 
      ? parseInt(tier.annualPrice?.replace('₹', '').replace(',', '') || '0')
      : parseInt(tier.price.replace('₹', '').replace(',', '') || '0')

    // Initiate payment
    initiatePayment({
      amount,
      planId: tierId,
      planName: tier.name,
      billingCycle,
    })
  }

  // Get current plan display name
  const getCurrentPlanName = () => {
    switch (preferences.subscriptionType) {
      case 'explorer': return 'Explorer (Free)'
      case 'scholar': return 'Scholar'
      case 'achiever': return 'Achiever'
      case 'genius_plus': return 'Genius+'
      default: return 'Explorer (Free)'
    }
  }

  const getCurrentPlanDescription = () => {
    switch (preferences.subscriptionType) {
      case 'explorer': return "You're currently on our free plan with basic features"
      case 'scholar': return "You have unlimited questions for your selected class"
      case 'achiever': return "You have access to all premium features and multi-class support"
      case 'genius_plus': return "You have access to all features including mentor support"
      default: return "You're currently on our free plan with basic features"
    }
  }

  return (
    <AuthGuard>
      <AppLayout>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
                <p className="text-gray-600">Choose the perfect plan for your learning journey</p>
              </div>
            </div>
            
            {/* Current Plan Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">Current Plan: {getCurrentPlanName()}</p>
                    <p className="text-sm text-blue-700">{getCurrentPlanDescription()}</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Active</Badge>
              </div>
            </div>
          </div>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'annual' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Annual
            </span>
            <Badge className="bg-green-100 text-green-700 ml-2">Save 27%</Badge>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {pricingTiers.map((tier) => (
              <Card 
                key={tier.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  tier.popular ? 'ring-2 ring-blue-500 shadow-lg scale-105' : ''
                } ${tier.borderColor} bg-white`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-2 text-sm font-medium">
                    🌟 Recommended
                  </div>
                )}
                
                <CardHeader className={`${tier.popular ? 'pt-12' : 'pt-6'} pb-4`}>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={tier.badgeColor}>
                      {tier.badge}
                    </Badge>
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${tier.color} text-white`}>
                      {tier.icon}
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </CardTitle>
                  
                  <div className="mb-4">
                    {billingCycle === 'monthly' ? (
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-900">
                          {tier.price}
                        </span>
                        {tier.price !== '₹0' && (
                          <span className="text-gray-500 ml-2">/month</span>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold text-gray-900">
                            {tier.annualMonthlyEquivalent || tier.price}
                          </span>
                          {tier.price !== '₹0' && (
                            <span className="text-gray-500 ml-2">/month</span>
                          )}
                        </div>
                        {tier.annualPrice && (
                          <div className="mt-1">
                            <span className="text-sm text-gray-600">
                              {tier.annualPrice} billed annually
                            </span>
                            <Badge className="bg-green-100 text-green-700 ml-2 text-xs">
                              Save {tier.annualSavings}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-6">
                    {tier.ideal}
                  </p>
                  
                  <Button 
                    variant={tier.id === 'free' ? 'outline' : tier.buttonVariant}
                    className={`w-full ${
                      tier.id === 'free' 
                        ? 'border-gray-300 text-gray-500 cursor-not-allowed' 
                        : tier.popular 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : ''
                    }`}
                    onClick={() => tier.id !== 'free' && handleTierSelect(tier.id)}
                    disabled={tier.id === 'free' || (isLoading && selectedTier === tier.id)}
                  >
                    {isLoading && selectedTier === tier.id ? 'Processing...' : tier.buttonText}
                  </Button>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Features included:</h4>
                      <ul className="space-y-2">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Billing Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
              Billing Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Payment Methods</h3>
                <p className="text-gray-600 text-sm mb-4">
                  We accept all major credit cards, debit cards, UPI, net banking, and digital wallets.
                </p>
                <div className="flex space-x-2">
                  <div className="w-8 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    VISA
                  </div>
                  <div className="w-8 h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    MC
                  </div>
                  <div className="w-8 h-6 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    UPI
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Subscription Benefits</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Cancel anytime with no hidden fees</li>
                  <li>• 7-day free trial for all paid plans</li>
                  <li>• Instant access to premium features</li>
                  <li>• 24/7 customer support</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What happens if I cancel?</h3>
                <p className="text-gray-600 text-sm">
                  You'll continue to have access until the end of your billing period, then revert to the free plan.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! All paid plans come with a 7-day free trial. No credit card required to start.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  )
} 