'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CopyrightYear } from '@/components/CopyrightYear'
import { MobileMenuButton } from '@/components/MobileMenuButton'
import { AppLayout } from '@/components/AppLayout'
import { 
  Check, 
  Star, 
  Users, 
  BookOpen, 
  Brain, 
  Zap, 
  Target, 
  TrendingUp,
  Shield,
  MessageCircle,
  Camera,
  Volume2,
  BarChart3,
  FileText,
  Award,
  Sparkles,
  Crown,
  Calculator,
  Globe,
  Clock,
  Heart
} from 'lucide-react'

const pricingTiers = [
  {
    id: 'free',
    name: 'Explorer',
    price: '₹0',
    originalPrice: null,
    badge: 'Free',
    badgeColor: 'bg-gray-100 text-gray-700',
    ideal: 'Trial users, awareness phase',
    icon: <Globe className="w-6 h-6" />,
    color: 'from-gray-500 to-gray-600',
    borderColor: 'border-gray-200',
    buttonVariant: 'outline' as const,
    buttonText: 'Get Started Free',
    popular: false,
    features: [
      'Access to 3–5 questions per day (per subject)',
      'Limited classes (e.g., Class 6–8 only)',
      'Basic AI explanations (no personalization)',
      'Occasional ads or nudges to upgrade'
    ],
    limitations: [
      'Limited daily questions',
      'No personalization',
      'Basic explanations only',
      'Contains advertisements'
    ]
  },
  {
    id: 'basic',
    name: 'Scholar',
    price: '₹149',
    originalPrice: null,
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
    buttonText: 'Choose Scholar',
    popular: false,
    features: [
      'Unlimited questions for 1 class (e.g., Class 7 only)',
      'Personalized explanations based on school curriculum',
      'Basic progress tracking (daily/weekly insights)',
      'Email or in-app parental summaries (monthly)',
      'Access to doubt-solving chatbot (text only)'
    ],
    highlights: [
      'Unlimited questions',
      'Personalized learning',
      'Progress tracking',
      'Parent updates',
      'AI chatbot support'
    ]
  },
  {
    id: 'plus',
    name: 'Achiever',
    price: '₹349',
    originalPrice: null,
    annualPrice: '₹3,049',
    annualMonthlyEquivalent: '₹254',
    annualSavings: '27%',
    badge: 'Plus',
    badgeColor: 'bg-green-100 text-green-700',
    ideal: 'Serious learners (high usage)',
    icon: <Target className="w-6 h-6" />,
    color: 'from-green-500 to-green-600',
    borderColor: 'border-green-200',
    buttonVariant: 'default' as const,
    buttonText: 'Choose Achiever',
    popular: true,
    features: [
      'Multi-class access (ideal for siblings)',
      'Exam-mode: AI adapts questions based on previous performance',
      'AI-generated mock tests (subject-wise)',
      'Image upload for handwritten questions',
      'Audio explanations (for language or weak readers)'
    ],
    highlights: [
      'Multi-class access',
      'Adaptive AI learning',
      'Mock tests',
      'Image question upload',
      'Audio explanations'
    ]
  },
  {
    id: 'premium',
    name: 'Genius+',
    price: '₹599',
    originalPrice: null,
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
    buttonText: 'Choose Genius+',
    popular: false,
    features: [
      'Includes all Achiever features +',
      'Homework auto-check + suggestions',
      'Parent dashboard with analytics + alerts',
      'Monthly AI progress report (PDF)',
      'One-on-one chat access to human mentor (limited)',
      'Early access to new features / beta tools'
    ],
    highlights: [
      'All Achiever features',
      'Homework auto-check',
      'Parent analytics dashboard',
      'AI progress reports',
      'Human mentor access',
      'Beta feature access'
    ]
  }
]

const featureComparison = [
  {
    category: 'Access & Usage',
    features: [
      { name: 'Daily Questions', free: '3-5 per subject', basic: 'Unlimited (1 class)', plus: 'Unlimited (multi-class)', premium: 'Unlimited (all classes)' },
      { name: 'Class Coverage', free: 'Class 6-8 only', basic: 'Single class', plus: 'Multiple classes', premium: 'All classes' },
      { name: 'Subject Access', free: 'Limited', basic: 'Full (selected class)', plus: 'Full (all classes)', premium: 'Full (all classes)' },
    ]
  },
  {
    category: 'AI & Personalization',
    features: [
      { name: 'AI Explanations', free: 'Basic', basic: 'Personalized', plus: 'Adaptive', premium: 'Advanced + Mentor' },
      { name: 'Performance Tracking', free: '✗', basic: 'Basic', plus: 'Advanced', premium: 'Comprehensive' },
      { name: 'Mock Tests', free: '✗', basic: '✗', plus: '✓', premium: '✓' },
      { name: 'Homework Check', free: '✗', basic: '✗', plus: '✗', premium: '✓' },
    ]
  },
  {
    category: 'Support & Features',
    features: [
      { name: 'Doubt Solving', free: '✗', basic: 'Text chatbot', plus: 'Advanced chatbot', premium: 'Chatbot + Human mentor' },
      { name: 'Image Upload', free: '✗', basic: '✗', plus: '✓', premium: '✓' },
      { name: 'Audio Explanations', free: '✗', basic: '✗', plus: '✓', premium: '✓' },
      { name: 'Parent Dashboard', free: '✗', basic: 'Monthly summaries', plus: 'Basic dashboard', premium: 'Advanced analytics' },
    ]
  }
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const { isSignedIn, isLoaded } = useAuth()

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId)
    // Here you would typically redirect to payment processing
    console.log(`Selected tier: ${tierId}`)
  }

  // Always show the full marketing page for pricing
  // This ensures a consistent experience for all users coming from marketing pages
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white py-4 px-6 md:px-12 flex items-center justify-between border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M20 5L5 20L20 35L35 20L20 5Z" stroke="#333" strokeWidth="2" fill="white" />
                <path d="M20 12L12 20L20 28L28 20L20 12Z" fill="#333" />
                <path d="M20 16V24M16 20H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-gray-800 font-light tracking-widest uppercase text-lg">ZapUp</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light">
            Home
          </Link>
          <Link href="/classroom" className="text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light">
            Classroom
          </Link>
          <Link href="/questions" className="text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light">
            Questions
          </Link>
          <Link href="/pricing" className="text-blue-800 uppercase text-sm tracking-wider font-medium">
            Pricing
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-blue-800 hover:bg-blue-50 uppercase text-xs tracking-wider">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="outline" className="text-blue-800 border-blue-300 hover:bg-blue-50 uppercase text-xs tracking-wider">
                Sign Up
              </Button>
            </Link>
          </div>
        </nav>
        <MobileMenuButton />
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-6 md:px-12">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-light text-gray-800 tracking-wide">
                Choose Your Learning Journey
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Unlock your potential with ZapUp's comprehensive learning platform. From basic exploration to advanced mentorship, we have the perfect plan for every student.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
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
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingTiers.map((tier) => (
                <Card 
                  key={tier.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-white border ${
                    tier.popular ? 'ring-2 ring-blue-500 shadow-lg scale-105' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-2 text-sm font-medium">
                      🌟 Most Popular
                    </div>
                  )}
                  
                                  <CardHeader className={`${tier.popular ? 'pt-12' : 'pt-6'} pb-4`}>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={tier.badgeColor}>
                      {tier.badge}
                    </Badge>
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${tier.color} text-white shadow-sm`}>
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
                    variant={tier.buttonVariant}
                    className={`w-full py-3 font-semibold ${
                      tier.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                        : tier.id === 'free'
                          ? 'border-gray-300 text-gray-600 hover:bg-gray-50'
                          : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                    }`}
                    onClick={() => handleTierSelect(tier.id)}
                  >
                    {tier.buttonText}
                  </Button>
                  </CardHeader>
                  
                                  <CardContent className="pt-0 px-6 pb-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Features included:</h4>
                      <ul className="space-y-3">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-20 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-light text-gray-800 mb-4 tracking-wide">
                Detailed Feature Comparison
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Compare all features across our plans to find the perfect fit for your learning needs.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-900">Features</th>
                    <th className="text-center p-4 font-semibold text-gray-900">Explorer</th>
                    <th className="text-center p-4 font-semibold text-gray-900">Scholar</th>
                    <th className="text-center p-4 font-semibold text-gray-900">Achiever</th>
                    <th className="text-center p-4 font-semibold text-gray-900">Genius+</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((category, categoryIndex) => (
                    <>
                      <tr key={`category-${categoryIndex}`} className="bg-gray-25">
                        <td colSpan={5} className="p-4 font-semibold text-gray-800 bg-gray-100">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featureIndex) => (
                        <tr key={`feature-${categoryIndex}-${featureIndex}`} className="border-b border-gray-100">
                          <td className="p-4 text-gray-700">{feature.name}</td>
                          <td className="p-4 text-center text-sm text-gray-600">{feature.free}</td>
                          <td className="p-4 text-center text-sm text-gray-600">{feature.basic}</td>
                          <td className="p-4 text-center text-sm text-gray-600">{feature.plus}</td>
                          <td className="p-4 text-center text-sm text-gray-600">{feature.premium}</td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6 md:px-12 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-light text-gray-800 mb-4 tracking-wide">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">
                Got questions? We've got answers to help you choose the right plan.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Can I switch between plans?</h3>
                <p className="text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. All payments are processed securely.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Is there a free trial for paid plans?</h3>
                <p className="text-gray-600">
                  Yes! All paid plans come with a 7-day free trial. You can cancel anytime during the trial period without being charged.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">How does the annual discount work?</h3>
                <p className="text-gray-600">
                  When you choose annual billing, you get 2 months free! For example, the Scholar plan costs ₹1,299/year instead of ₹1,788 if paid monthly.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">What happens if I cancel my subscription?</h3>
                <p className="text-gray-600">
                  You'll continue to have access to your paid features until the end of your billing period. After that, your account will revert to the free Explorer plan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 md:px-12 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already achieving their academic goals with ZapUp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/classroom">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Explore Classroom
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 relative">
        <div className="absolute inset-0 opacity-5">
          <Image src="/images/pattern.png" alt="Footer pattern" fill className="object-cover" />
        </div>
        <div className="container mx-auto px-4 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 mr-2">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M20 5L5 20L20 35L35 20L20 5Z" stroke="#333" strokeWidth="2" fill="white" />
                  <path d="M20 12L12 20L20 28L28 20L20 12Z" fill="#333" />
                  <path d="M20 16V24M16 20H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <span className="text-gray-800 font-light tracking-widest uppercase text-sm">ZapUp</span>
                <p className="text-gray-400 text-xs">Learning companion for young minds</p>
              </div>
            </div>

            <div className="flex space-x-6">
              <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Help Center
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Terms of Use
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-6 pt-6 text-center text-gray-600 text-sm">
            <p>&copy; <CopyrightYear /> ZapUp Learning. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 