// Stream-based subject mappings for Classes 11-12
// This file defines which subjects are available for each stream

import { Calculator, Atom, TestTube, Leaf, Building, TrendingUp, Receipt, Clock, Globe, Scale, Brain, Languages, BookOpen, FlaskConical } from 'lucide-react'

export interface SubjectInfo {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

export interface StreamInfo {
  id: string
  name: string
  description: string
  subjects: SubjectInfo[]
}

// Subject definitions with icons and colors
const SUBJECT_DEFINITIONS: Record<string, SubjectInfo> = {
  physics: {
    id: 'physics',
    name: 'Physics',
    description: 'Mechanics, Waves, Thermodynamics, Electromagnetism, Modern Physics',
    icon: <Atom className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50 to-cyan-50'
  },
  chemistry: {
    id: 'chemistry',
    name: 'Chemistry',
    description: 'Physical Chemistry, Inorganic Chemistry, Organic Chemistry',
    icon: <TestTube className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-50 to-emerald-50'
  },
  biology: {
    id: 'biology',
    name: 'Biology',
    description: 'Cell Biology, Genetics, Evolution, Ecology, Human Physiology',
    icon: <Leaf className="w-6 h-6" />,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'from-emerald-50 to-teal-50'
  },
  mathematics: {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Calculus, Algebra, Coordinate Geometry, Statistics, Probability',
    icon: <Calculator className="w-6 h-6" />,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'from-purple-50 to-indigo-50'
  },
  'business-studies': {
    id: 'business-studies',
    name: 'Business Studies',
    description: 'Business Management, Marketing, Finance, Entrepreneurship',
    icon: <Building className="w-6 h-6" />,
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-50 to-red-50'
  },
  economics: {
    id: 'economics',
    name: 'Economics',
    description: 'Microeconomics, Macroeconomics, Indian Economic Development',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'from-yellow-50 to-orange-50'
  },
  accountancy: {
    id: 'accountancy',
    name: 'Accountancy',
    description: 'Financial Accounting, Partnership Accounting, Company Accounts',
    icon: <Receipt className="w-6 h-6" />,
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'from-teal-50 to-cyan-50'
  },
  history: {
    id: 'history',
    name: 'History',
    description: 'Ancient History, Medieval History, Modern History, World History',
    icon: <Clock className="w-6 h-6" />,
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'from-amber-50 to-yellow-50'
  },
  geography: {
    id: 'geography',
    name: 'Geography',
    description: 'Physical Geography, Human Geography, Practical Geography',
    icon: <Globe className="w-6 h-6" />,
    color: 'from-blue-500 to-teal-500',
    bgColor: 'from-blue-50 to-teal-50'
  },
  'political-science': {
    id: 'political-science',
    name: 'Political Science',
    description: 'Indian Government, Political Theory, International Relations',
    icon: <Scale className="w-6 h-6" />,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'from-indigo-50 to-purple-50'
  },
  psychology: {
    id: 'psychology',
    name: 'Psychology',
    description: 'Cognitive Psychology, Social Psychology, Developmental Psychology',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'from-pink-50 to-rose-50'
  },
  english: {
    id: 'english',
    name: 'English',
    description: 'Literature, Grammar, Composition, Communication Skills',
    icon: <Languages className="w-6 h-6" />,
    color: 'from-slate-500 to-gray-500',
    bgColor: 'from-slate-50 to-gray-50'
  },
  hindi: {
    id: 'hindi',
    name: 'Hindi',
    description: 'साहित्य, व्याकरण, काव्य, गद्य',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'from-orange-500 to-amber-500',
    bgColor: 'from-orange-50 to-amber-50'
  },
  bengali: {
    id: 'bengali',
    name: 'Bengali',
    description: 'সাহিত্য, ব্যাকরণ, কবিতা, গদ্য',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'from-rose-500 to-pink-500',
    bgColor: 'from-rose-50 to-pink-50'
  },
  computer: {
    id: 'computer',
    name: 'Computer',
    description: 'Computer Science fundamentals, Programming, Algorithms',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'from-cyan-50 to-blue-50'
  },
  'english-shakespeare': {
    id: 'english-shakespeare',
    name: 'English - Shakespeare',
    description: 'Shakespeare\'s plays, sonnets, and dramatic works',
    icon: <Languages className="w-6 h-6" />,
    color: 'from-purple-600 to-indigo-600',
    bgColor: 'from-purple-50 to-indigo-50'
  },
  'english-poetry': {
    id: 'english-poetry',
    name: 'English - Poetry',
    description: 'Classical and modern poetry, literary devices, poetic forms',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'from-pink-500 to-purple-500',
    bgColor: 'from-pink-50 to-purple-50'
  },
  'history-civics': {
    id: 'history-civics',
    name: 'History & Civics',
    description: 'Historical events, Civic studies, Political systems',
    icon: <Globe className="w-6 h-6" />,
    color: 'from-amber-600 to-orange-600',
    bgColor: 'from-amber-50 to-orange-50'
  },
  'biology-lab': {
    id: 'biology-lab',
    name: 'Biology Lab',
    description: 'Microscopy, Dissection, Cell Studies, Practical experiments',
    icon: <FlaskConical className="w-6 h-6" />,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'from-emerald-50 to-teal-50'
  },
  'chemistry-lab': {
    id: 'chemistry-lab',
    name: 'Chemistry Lab',
    description: 'Chemical reactions, Titrations, Analysis, Practical experiments',
    icon: <FlaskConical className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-50 to-emerald-50'
  },
  'physics-lab': {
    id: 'physics-lab',
    name: 'Physics Lab',
    description: 'Mechanics, Optics, Electricity, Magnetism, Practical experiments',
    icon: <FlaskConical className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50 to-cyan-50'
  },
  'commercial-studies': {
    id: 'commercial-studies',
    name: 'Commercial Studies',
    description: 'Business, Trade, Commerce, Economic concepts',
    icon: <Receipt className="w-6 h-6" />,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'from-amber-50 to-orange-50'
  },
  history: {
    id: 'history',
    name: 'History',
    description: 'Historical events, Civilizations, World history',
    icon: <Clock className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-50 to-pink-50'
  },
  'environmental-studies': {
    id: 'environmental-studies',
    name: 'Environmental Studies',
    description: 'Ecology, Conservation, Sustainability, Environmental Science',
    icon: <Leaf className="w-6 h-6" />,
    color: 'from-green-600 to-teal-600',
    bgColor: 'from-green-50 to-teal-50'
  },
  'computer-science': {
    id: 'computer-science',
    name: 'Computer Science',
    description: 'Programming, Data Structures, Algorithms, Database Management',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'from-indigo-50 to-purple-50'
  },
  commerce: {
    id: 'commerce',
    name: 'Commerce',
    description: 'Commercial Applications, Trade, Banking, Insurance',
    icon: <Receipt className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'from-yellow-50 to-orange-50'
  }
}

// Stream definitions for Classes 11-12
export const STREAM_SUBJECTS: Record<string, Record<string, StreamInfo>> = {
  '11': {
    science: {
      id: 'science',
      name: 'Science Stream',
      description: 'Physics, Chemistry, Biology/Mathematics with practical focus',
      subjects: [
        SUBJECT_DEFINITIONS.physics,
        SUBJECT_DEFINITIONS.chemistry,
        SUBJECT_DEFINITIONS.biology,
        SUBJECT_DEFINITIONS.mathematics,
        SUBJECT_DEFINITIONS['environmental-studies'],
        SUBJECT_DEFINITIONS.english
      ]
    },
    commerce: {
      id: 'commerce',
      name: 'Commerce Stream',
      description: 'Business Studies, Economics, Accountancy with practical applications',
      subjects: [
        SUBJECT_DEFINITIONS['business-studies'],
        SUBJECT_DEFINITIONS.economics,
        SUBJECT_DEFINITIONS.accountancy,
        SUBJECT_DEFINITIONS.mathematics,
        SUBJECT_DEFINITIONS['environmental-studies'],
        SUBJECT_DEFINITIONS.english
      ]
    },
    arts: {
      id: 'arts',
      name: 'Arts/Humanities Stream',
      description: 'History, Geography, Political Science, Psychology with liberal arts focus',
      subjects: [
        SUBJECT_DEFINITIONS.history,
        SUBJECT_DEFINITIONS.geography,
        SUBJECT_DEFINITIONS['political-science'],
        SUBJECT_DEFINITIONS.psychology,
        SUBJECT_DEFINITIONS['environmental-studies'],
        SUBJECT_DEFINITIONS.english,
        SUBJECT_DEFINITIONS.hindi,
        SUBJECT_DEFINITIONS.bengali
      ]
    }
  },
  '12': {
    science: {
      id: 'science',
      name: 'Science Stream',
      description: 'Advanced Physics, Chemistry, Biology/Mathematics for competitive exams',
      subjects: [
        SUBJECT_DEFINITIONS.physics,
        SUBJECT_DEFINITIONS.chemistry,
        SUBJECT_DEFINITIONS.biology,
        SUBJECT_DEFINITIONS.mathematics,
        SUBJECT_DEFINITIONS['environmental-studies'],
        SUBJECT_DEFINITIONS.english
      ]
    },
    commerce: {
      id: 'commerce',
      name: 'Commerce Stream',
      description: 'Advanced Business Studies, Economics, Accountancy for professional courses',
      subjects: [
        SUBJECT_DEFINITIONS['business-studies'],
        SUBJECT_DEFINITIONS.economics,
        SUBJECT_DEFINITIONS.accountancy,
        SUBJECT_DEFINITIONS.commerce,
        SUBJECT_DEFINITIONS['computer-science'],
        SUBJECT_DEFINITIONS.mathematics,
        SUBJECT_DEFINITIONS['environmental-studies'],
        SUBJECT_DEFINITIONS.english
      ]
    },
    arts: {
      id: 'arts',
      name: 'Arts/Humanities Stream',
      description: 'Advanced Humanities subjects for civil services and higher studies',
      subjects: [
        SUBJECT_DEFINITIONS.history,
        SUBJECT_DEFINITIONS.geography,
        SUBJECT_DEFINITIONS['political-science'],
        SUBJECT_DEFINITIONS.psychology,
        SUBJECT_DEFINITIONS['environmental-studies'],
        SUBJECT_DEFINITIONS.english,
        SUBJECT_DEFINITIONS.hindi,
        SUBJECT_DEFINITIONS.bengali
      ]
    }
  }
}

// Default subjects for classes 1-10 (non-stream based)
export const DEFAULT_SUBJECTS: Record<string, SubjectInfo[]> = {
  '6': [
    SUBJECT_DEFINITIONS.mathematics,
    {
      id: 'science',
      name: 'Science',
      description: 'Basic Science concepts, Experiments, Nature study',
      icon: <Atom className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      id: 'social-science',
      name: 'Social Science',
      description: 'History, Geography, Civics basics',
      icon: <Globe className="w-6 h-6" />,
      color: 'from-blue-500 to-teal-500',
      bgColor: 'from-blue-50 to-teal-50'
    },
    SUBJECT_DEFINITIONS.english,
    SUBJECT_DEFINITIONS.hindi,
    SUBJECT_DEFINITIONS.bengali
  ],
  '7': [
    SUBJECT_DEFINITIONS.mathematics,
    {
      id: 'science',
      name: 'Science',
      description: 'Physics, Chemistry, Biology concepts',
      icon: <Atom className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      id: 'social-science',
      name: 'Social Science',
      description: 'History, Geography, Civics',
      icon: <Globe className="w-6 h-6" />,
      color: 'from-blue-500 to-teal-500',
      bgColor: 'from-blue-50 to-teal-50'
    },
    SUBJECT_DEFINITIONS.english,
    SUBJECT_DEFINITIONS.hindi,
    SUBJECT_DEFINITIONS.bengali
  ],
  '8': [
    SUBJECT_DEFINITIONS.mathematics,
    {
      id: 'science',
      name: 'Science',
      description: 'Chemical Effects, Force and Pressure, Light, Stars and Solar System',
      icon: <Atom className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      id: 'social-science',
      name: 'Social Science',
      description: 'Modern India, Resources, Democracy, Social Change',
      icon: <Globe className="w-6 h-6" />,
      color: 'from-blue-500 to-teal-500',
      bgColor: 'from-blue-50 to-teal-50'
    },
    SUBJECT_DEFINITIONS.english,
    SUBJECT_DEFINITIONS.hindi,
    SUBJECT_DEFINITIONS.bengali
  ],
  '9': [
    SUBJECT_DEFINITIONS.mathematics,
    SUBJECT_DEFINITIONS.physics,
    SUBJECT_DEFINITIONS.chemistry,
    SUBJECT_DEFINITIONS.computer,
    SUBJECT_DEFINITIONS['english-shakespeare'],
    SUBJECT_DEFINITIONS['english-poetry'],
    SUBJECT_DEFINITIONS.geography,
    SUBJECT_DEFINITIONS['history-civics'],
    SUBJECT_DEFINITIONS['biology-lab'],
    SUBJECT_DEFINITIONS['chemistry-lab'],
    SUBJECT_DEFINITIONS['physics-lab'],
    SUBJECT_DEFINITIONS.hindi,
    SUBJECT_DEFINITIONS.bengali
  ],
  '10': [
    SUBJECT_DEFINITIONS.mathematics,
    SUBJECT_DEFINITIONS.physics,
    SUBJECT_DEFINITIONS.chemistry,
    SUBJECT_DEFINITIONS.biology,
    SUBJECT_DEFINITIONS['biology-lab'],
    SUBJECT_DEFINITIONS['chemistry-lab'],
    SUBJECT_DEFINITIONS['physics-lab'],
    SUBJECT_DEFINITIONS.computer,
    SUBJECT_DEFINITIONS['commercial-studies'],
    SUBJECT_DEFINITIONS['english-shakespeare'],
    SUBJECT_DEFINITIONS.geography,
    SUBJECT_DEFINITIONS.history,
    SUBJECT_DEFINITIONS.hindi,
    SUBJECT_DEFINITIONS.bengali
  ]
}

// Helper functions
export function getSubjectsForClass(classLevel: string, stream?: string): SubjectInfo[] {
  if (['11', '12'].includes(classLevel) && stream) {
    const streamData = STREAM_SUBJECTS[classLevel]?.[stream.toLowerCase()]
    return streamData ? streamData.subjects : []
  }
  
  return DEFAULT_SUBJECTS[classLevel] || []
}

export function getStreamsForClass(classLevel: string): StreamInfo[] {
  if (['11', '12'].includes(classLevel)) {
    return Object.values(STREAM_SUBJECTS[classLevel] || {})
  }
  
  return []
}

export function getStreamInfo(classLevel: string, streamId: string): StreamInfo | null {
  if (['11', '12'].includes(classLevel)) {
    return STREAM_SUBJECTS[classLevel]?.[streamId.toLowerCase()] || null
  }
  
  return null
}

export function isStreamBasedClass(classLevel: string): boolean {
  return ['11', '12'].includes(classLevel)
}