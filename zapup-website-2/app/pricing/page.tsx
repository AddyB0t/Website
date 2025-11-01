'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CopyrightYear } from '@/components/CopyrightYear'
import { MobileMenuButton } from '@/components/MobileMenuButton'
import { AppLayout } from '@/components/AppLayout'
import { useRazorpay } from '@/hooks/useRazorpay'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
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
      'Audio explanations (Coming Soon)'
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
    badgeColor: 'bg-amber-100 text-amber-700',
    ideal: 'Top-performing students, exam-focused',
    icon: <Crown className="w-6 h-6" />,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-200',
    buttonVariant: 'default' as const,
    buttonText: 'Coming Soon',
    popular: false,
    comingSoon: true,
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

// Map subscription types to plan IDs
const subscriptionToPlanId = {
  explorer: 'free',
  scholar: 'basic',
  achiever: 'plus',
  genius_plus: 'premium'
} as const

export default function PricingPage() {
  // Show Coming Soon message
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <Sparkles className="w-20 h-20 text-blue-600 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Coming Soon</h1>
          <p className="text-xl text-gray-600 mb-6">
            We're working hard to bring you our pricing plans. Check back soon!
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Back to Home
              </Button>
            </Link>
            <Link href="/questions">
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                Explore Questions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 