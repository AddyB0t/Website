// zapup-website-2/app/profile/page.tsx
// User profile page with classroom-style layout
// Shows subject cards and learning resources

'use client'

import { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { AppLayout } from '@/components/AppLayout'
import { ClassroomLayout, LearningResourcesSection } from '@/components/ClassroomLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  User, 
  Calculator, 
  Atom, 
  Globe, 
  Languages, 
  BookOpen, 
  Laptop, 
  Palette,
  GraduationCap,
  School,
  MapPin,
  Settings
} from 'lucide-react'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { getStateNames, getCitiesByState, getBoardsByStateAndCity, getSchoolsByStateAndCityAndBoard } from '@/lib/enhanced-states-schools-data'
import { getSubjectsByClass } from '@/lib/subjects'
import { canAccessClass } from '@/lib/access-control'
import Head from 'next/head'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const { preferences, updatePreferences, isLoading, isProfileComplete } = useUserPreferences()
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedStream, setSelectedStream] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedBoardType, setSelectedBoardType] = useState('')
  const [selectedSchool, setSelectedSchool] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const preferencesLoadedRef = useRef(false)



  const classes = [
    { value: '6', label: 'Class 6' },
    { value: '7', label: 'Class 7' },
    { value: '8', label: 'Class 8' },
    { value: '9', label: 'Class 9' },
    { value: '10', label: 'Class 10' },
    { value: '11', label: 'Class 11' },
    { value: '12', label: 'Class 12' }
  ]

  const streams = [
    { value: 'Science', label: 'Science (PCM/PCB)' },
    { value: 'Commerce', label: 'Commerce' },
    { value: 'Arts', label: 'Arts/Humanities' }
  ]

  // Check if stream selection is required (for classes 11 and 12)
  const isStreamRequired = selectedClass === '11' || selectedClass === '12'

  // Load saved preferences on mount - prevent infinite loop with ref
  useEffect(() => {
    if (!isLoading && !preferencesLoadedRef.current) {
      if (preferences.state) setSelectedState(preferences.state)
      if (preferences.city) setSelectedCity(preferences.city)
      if (preferences.boardType) setSelectedBoardType(preferences.boardType)
      if (preferences.school) setSelectedSchool(preferences.school)
      if (preferences.currentClass) setSelectedClass(preferences.currentClass)
      if (preferences.stream) setSelectedStream(preferences.stream)
      preferencesLoadedRef.current = true
    }
  }, [isLoading, preferences.state, preferences.city, preferences.boardType, preferences.school, preferences.currentClass, preferences.stream])

  // Get subject icon
  const getSubjectIcon = (subjectId: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'mathematics': <Calculator className="w-6 h-6" />,
      'science': <Atom className="w-6 h-6" />,
      'social-science': <Globe className="w-6 h-6" />,
      'english': <Languages className="w-6 h-6" />,
      'hindi': <Languages className="w-6 h-6" />,
      'physics': <Atom className="w-6 h-6" />,
      'chemistry': <Atom className="w-6 h-6" />,
      'biology': <Atom className="w-6 h-6" />,
      'history': <Globe className="w-6 h-6" />,
      'geography': <Globe className="w-6 h-6" />,
      'economics': <Globe className="w-6 h-6" />,
      'political-science': <Globe className="w-6 h-6" />,
      'accountancy': <Calculator className="w-6 h-6" />,
      'business-studies': <Calculator className="w-6 h-6" />,
      'computer-science': <Laptop className="w-6 h-6" />,
      'informatics-practices': <Laptop className="w-6 h-6" />,
      'psychology': <User className="w-6 h-6" />,
      'sociology': <User className="w-6 h-6" />,
      'art': <Palette className="w-6 h-6" />
    }
    return iconMap[subjectId] || <BookOpen className="w-6 h-6" />
  }

  // Get subject description
  const getSubjectDescription = (subjectId: string, classNum: string) => {
    const descriptions: { [key: string]: string } = {
      'mathematics': `Numbers, algebra, geometry, and more with interactive lessons tailored for Class ${classNum} students.`,
      'science': `Introduction to physics, chemistry, and biology concepts suitable for Class ${classNum} curriculum.`,
      'social-science': `History, geography, and civics topics from the Class ${classNum} syllabus.`,
      'english': `Reading, writing, and communication skills through Class ${classNum} literature and language exercises.`,
      'hindi': `Develop Hindi language skills through stories and activities designed for Class ${classNum}.`,
      'physics': `Mechanics, thermodynamics, and wave motion with comprehensive theory and numerical problems.`,
      'chemistry': `Organic, inorganic, and physical chemistry with detailed molecular structures and reactions.`,
      'biology': `Cell biology, plant physiology, and human anatomy with detailed diagrams and explanations.`,
      'history': `Ancient, medieval, and modern world history with source-based analysis and interpretation.`,
      'geography': `Physical, human, and economic geography with map skills and environmental studies.`,
      'economics': `Microeconomics, macroeconomics, and Indian economic development with case studies.`,
      'political-science': `Political theory, Indian constitution, and comparative politics with contemporary case studies.`,
      'accountancy': `Financial accounting principles, journal entries, and statement preparation.`,
      'business-studies': `Foundational business concepts, organizational structures, and management principles.`,
      'computer-science': `Programming concepts, algorithms, and data structures aligned with Class ${classNum} CS curriculum.`,
      'psychology': `Introduction to human behavior, cognition, and psychological disorders with case studies.`,
      'sociology': `Study of society, social institutions, and human relationships with field research methods.`
    }
    return descriptions[subjectId] || `Comprehensive study materials for ${subjectId} designed for Class ${classNum} students.`
  }

  // Reset stream when class changes to non-senior classes
  const handleClassChange = (value: string) => {
    setSelectedClass(value)
    if (value !== '11' && value !== '12') {
      setSelectedStream('')
    }
  }

  // Reset city, board type, and school when state changes
  const handleStateChange = (value: string) => {
    setSelectedState(value)
    setSelectedCity('')
    setSelectedBoardType('')
    setSelectedSchool('')
  }

  // Reset board type and school when city changes
  const handleCityChange = (value: string) => {
    setSelectedCity(value)
    setSelectedBoardType('')
    setSelectedSchool('')
  }

  // Reset school when board type changes
  const handleBoardTypeChange = (value: string) => {
    setSelectedBoardType(value)
    setSelectedSchool('')
  }

  // Handle school selection
  const handleSchoolChange = (value: string) => {
    setSelectedSchool(value)
  }

  const handleSavePreferences = async () => {
    setIsSaving(true)
    try {
      const newPreferences = {
        state: selectedState,
        city: selectedCity,
        boardType: selectedBoardType,
        school: selectedSchool,
        currentClass: selectedClass,
        ...(isStreamRequired && { stream: selectedStream })
      }
      
      await updatePreferences(newPreferences)
      setShowSettings(false)
    } catch (error) {
      console.error('Error saving preferences:', error)
      alert('Error saving preferences. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isLoaded || isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Check if profile is complete using the context method
  const profileComplete = isProfileComplete()
  
  // Get subjects for the user's class
  const userSubjects = profileComplete ? getSubjectsByClass(preferences.currentClass, preferences.stream) : []
  
  const subjects = userSubjects.map(subject => ({
    id: subject.id,
    name: subject.name,
    icon: getSubjectIcon(subject.id),
    description: getSubjectDescription(subject.id, preferences.currentClass),
    color: 'from-blue-500 to-purple-500',
    bgColor: 'from-blue-50 to-purple-50',
    available: subject.id === 'mathematics' || subject.id === 'science' || subject.id === 'social-science' || subject.id === 'english',
    topics: Math.floor(Math.random() * 20) + 10 // Random number of topics for demo
  }))

  const getWelcomeMessage = () => {
    if (!profileComplete) {
      return {
        title: "Welcome to ZapUp!",
        description: "Complete your profile to get personalized learning content and access to your classroom."
      }
    }
    
    const className = preferences.currentClass
    const stream = preferences.stream ? ` (${preferences.stream})` : ''
    
    return {
      title: `Welcome to Your Class ${className} Classroom!${stream}`,
      description: `Explore your subjects below. Each card leads to lessons, practice exercises, and resources aligned with your Class ${className} curriculum.`
    }
  }

  const { title, description } = getWelcomeMessage()

  const learningResources = [
    {
      title: "Recommended Books",
      items: [
        `NCERT Mathematics Class ${preferences.currentClass || '6'}`,
        `NCERT Science Class ${preferences.currentClass || '6'}`,
        `NCERT Social Studies Class ${preferences.currentClass || '6'}`
      ]
    },
    {
      title: "Weekly Schedule",
      items: [
        "Monday: Mathematics & Science Quiz",
        "Wednesday: Language & Social Studies",
        "Friday: Weekly Review & Activities"
      ]
    }
  ]

  const additionalSections = null;

  return (
    <AppLayout>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap" rel="stylesheet" />
      </Head>
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-white pb-16">
        {/* Settings Button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full shadow-md border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="flex justify-center w-full mb-8">
            <div className="w-full max-w-3xl">
              <Card className="bg-white shadow-2xl rounded-2xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-700 to-teal-500 rounded-t-2xl p-6">
                  <CardTitle className="flex items-center space-x-2 text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <Settings className="w-5 h-5" />
                    <span>Academic Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Step 1: State */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        State
                      </label>
                      <Select value={selectedState} onValueChange={handleStateChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your state" />
                        </SelectTrigger>
                        <SelectContent>
                          {getStateNames().map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Step 2: City */}
                    {selectedState && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          City
                        </label>
                        <Select value={selectedCity} onValueChange={handleCityChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your city" />
                          </SelectTrigger>
                          <SelectContent>
                            {getCitiesByState(selectedState).map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Step 3: Board Type */}
                    {selectedState && selectedCity && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <School className="w-4 h-4 inline mr-1" />
                          Board Type
                        </label>
                        <Select value={selectedBoardType} onValueChange={handleBoardTypeChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select board type" />
                          </SelectTrigger>
                          <SelectContent>
                            {getBoardsByStateAndCity(selectedState, selectedCity).map((board) => (
                              <SelectItem key={board} value={board}>
                                {board}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Step 4: School */}
                    {selectedState && selectedCity && selectedBoardType && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <School className="w-4 h-4 inline mr-1" />
                          School
                        </label>
                        <Select value={selectedSchool} onValueChange={handleSchoolChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your school" />
                          </SelectTrigger>
                          <SelectContent>
                            {getSchoolsByStateAndCityAndBoard(selectedState, selectedCity, selectedBoardType).map((school) => (
                              <SelectItem key={school.name} value={school.name}>
                                {school.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Additional Settings Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Class */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <GraduationCap className="w-4 h-4 inline mr-1" />
                        Class
                      </label>
                      <Select value={selectedClass} onValueChange={handleClassChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((classItem) => {
                            const canAccess = canAccessClass(classItem.value, {
                              currentClass: preferences.currentClass,
                              subscriptionType: preferences.subscriptionType
                            })
                            const isCurrentClass = classItem.value === preferences.currentClass
                            
                            return (
                              <SelectItem 
                                key={classItem.value} 
                                value={classItem.value}
                                disabled={!canAccess && !isCurrentClass}
                              >
                                {classItem.label}
                                {!canAccess && !isCurrentClass && (
                                  <span className="text-orange-600 text-xs ml-2">
                                    (Upgrade to unlock)
                                  </span>
                                )}
                                {preferences.subscriptionType === 'scholar' && !isCurrentClass && canAccess && (
                                  <span className="text-blue-600 text-xs ml-2">
                                    (Switch class)
                                  </span>
                                )}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      {preferences.subscriptionType === 'explorer' && selectedClass && !canAccessClass(selectedClass, {
                        currentClass: preferences.currentClass,
                        subscriptionType: preferences.subscriptionType
                      }) && (
                        <p className="text-xs text-orange-600 mt-1">
                          Classes 9-12 require a Scholar plan or higher. 
                          <Link href="/pricing" className="underline ml-1">Upgrade now</Link>
                        </p>
                      )}
                      {preferences.subscriptionType === 'scholar' && selectedClass && selectedClass !== preferences.currentClass && (
                        <p className="text-xs text-blue-600 mt-1">
                          Scholar plan allows access to one class at a time. Changing will update your accessible content.
                        </p>
                      )}
                    </div>

                    {/* Stream */}
                    {isStreamRequired && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stream
                        </label>
                        <Select value={selectedStream} onValueChange={setSelectedStream}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your stream" />
                          </SelectTrigger>
                          <SelectContent>
                            {streams.map((stream) => (
                              <SelectItem key={stream.value} value={stream.value}>
                                {stream.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <Button variant="outline" className="rounded-full" onClick={() => setShowSettings(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-teal-500 text-white rounded-full shadow-md"
                      onClick={handleSavePreferences}
                      disabled={isSaving || !selectedClass || !selectedState || !selectedCity || !selectedBoardType || !selectedSchool}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="w-full flex justify-center my-8">
          <div className="h-1 w-32 bg-gradient-to-r from-blue-400 via-teal-400 to-blue-400 rounded-full opacity-30" />
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <ClassroomLayout
            title={<span style={{ fontFamily: 'Montserrat, sans-serif' }} className="text-blue-800">{title}</span>}
            description={description}
            subjects={subjects.map(s => ({
              ...s,
              available: s.available,
              badgeColor: s.available ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600',
              cardClass: s.available ? 'shadow-xl border-teal-100' : 'shadow-md border-gray-100',
            }))}
            additionalSections={additionalSections}
          />
        </div>
      </div>
    </AppLayout>
  )
} 