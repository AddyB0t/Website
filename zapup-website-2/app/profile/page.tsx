// zapup-website-2/app/profile/page.tsx
// User profile page showing account information and academic preferences
// Main landing page after login

'use client'

import { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Mail, Calendar, Settings, Edit, GraduationCap, School, Camera, Trash2, Upload, MapPin } from 'lucide-react'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { getStateNames, getSchoolsByState } from '@/lib/states-schools-data'
import { SUBSCRIPTION_FEATURES } from '@/lib/subscriptions';

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const { preferences, updatePreferences, isLoading, uploadProfilePicture, deleteProfilePicture } = useUserPreferences()
  const [selectedBoard, setSelectedBoard] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedStream, setSelectedStream] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedSchool, setSelectedSchool] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingPicture, setIsUploadingPicture] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const schoolBoards = [
    { value: 'CBSE', label: 'CBSE (Central Board of Secondary Education)' },
    { value: 'ICSE', label: 'ICSE (Indian Certificate of Secondary Education)' },
    { value: 'State Board', label: 'State Board' },
    { value: 'IB', label: 'IB (International Baccalaureate)' },
    { value: 'Cambridge', label: 'Cambridge International' },
    { value: 'Other', label: 'Other' }
  ]

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

  const features = SUBSCRIPTION_FEATURES[preferences.subscriptionType];
  const allowedClasses = classes.filter(cls => features.allowedClasses.includes(cls.value));
  
  // For Scholar users, lock class selection after initial selection
  const isScholarMode = preferences.subscriptionType === 'scholar';
  const hasExistingClassSelection = preferences.currentClass && preferences.currentClass.trim() !== '';
  const isClassSelectionLocked = isScholarMode && hasExistingClassSelection;

  // Check if stream selection is required (for classes 11 and 12)
  const isStreamRequired = selectedClass === '11' || selectedClass === '12'

  // Load saved preferences on mount
  useEffect(() => {
    if (!isLoading) {
      if (preferences.state) setSelectedState(preferences.state)
      if (preferences.school) setSelectedSchool(preferences.school)
      if (preferences.schoolBoard) setSelectedBoard(preferences.schoolBoard)
      if (preferences.currentClass) setSelectedClass(preferences.currentClass)
      if (preferences.stream) setSelectedStream(preferences.stream)
    }
  }, [preferences, isLoading])

  // Reset stream when class changes to non-senior classes
  const handleClassChange = (value: string) => {
    setSelectedClass(value)
    if (value !== '11' && value !== '12') {
      setSelectedStream('')
    }
  }

  // Reset school when state changes
  const handleStateChange = (value: string) => {
    setSelectedState(value)
    setSelectedSchool('') // Reset school selection when state changes
    setSelectedBoard('') // Reset board selection when state changes
  }

  // Auto-fill school board when school is selected
  const handleSchoolChange = (value: string) => {
    setSelectedSchool(value)
    
    // Find the selected school and auto-fill the board
    if (selectedState) {
      const schools = getSchoolsByState(selectedState)
      const selectedSchoolData = schools.find(school => school.name === value)
      if (selectedSchoolData) {
        setSelectedBoard(selectedSchoolData.board)
      }
    }
  }

  const handleSavePreferences = async () => {
    setIsSaving(true)
    try {
      const newPreferences = {
        schoolBoard: selectedBoard,
        currentClass: selectedClass,
        state: selectedState,
        school: selectedSchool,
        ...(isStreamRequired && { stream: selectedStream })
      }
      
      await updatePreferences(newPreferences)
      console.log('Preferences saved:', newPreferences)
    } catch (error) {
      console.error('Error saving preferences:', error)
      alert('Error saving preferences. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.')
      return
    }

    setIsUploadingPicture(true)
    try {
      const success = await uploadProfilePicture(file)
      if (success) {
        alert('Profile picture updated successfully!')
      } else {
        alert('Error uploading profile picture. Please try again.')
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      alert('Error uploading profile picture. Please try again.')
    } finally {
      setIsUploadingPicture(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteProfilePicture = async () => {
    if (!confirm('Are you sure you want to delete your profile picture?')) return

    setIsUploadingPicture(true)
    try {
      const success = await deleteProfilePicture()
      if (success) {
        alert('Profile picture deleted successfully!')
      } else {
        alert('Error deleting profile picture. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting profile picture:', error)
      alert('Error deleting profile picture. Please try again.')
    } finally {
      setIsUploadingPicture(false)
    }
  }

  if (!isLoaded || isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  const currentProfilePicture = preferences.profilePictureUrl || user?.imageUrl

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to ZapUp!</h1>
          <p className="text-gray-600">Complete your profile to get personalized learning content</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1 bg-white border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
              <CardTitle className="flex items-center space-x-2 text-gray-800">
                <User className="w-5 h-5 text-blue-600" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  {currentProfilePicture ? (
                    <img
                      src={currentProfilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-blue-100 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                      <User className="w-12 h-12 text-blue-600" />
                    </div>
                  )}
                  {isUploadingPicture && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {preferences.firstName || user?.firstName} {preferences.lastName || user?.lastName}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium">Student</p>
                </div>

                <div className="flex space-x-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPicture}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  {preferences.profilePictureUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      onClick={handleDeleteProfilePicture}
                      disabled={isUploadingPicture}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card className="lg:col-span-2 bg-white border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
              <CardTitle className="flex items-center space-x-2 text-gray-800">
                <Settings className="w-5 h-5 text-green-600" />
                <span>Account Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <p className="text-gray-900 bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                    {preferences.firstName || user?.firstName || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <p className="text-gray-900 bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                    {preferences.lastName || user?.lastName || 'Not provided'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1 text-blue-600" />
                  Email Address
                </label>
                <p className="text-gray-900 bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                  {preferences.email || user?.emailAddresses[0]?.emailAddress}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1 text-blue-600" />
                  Member Since
                </label>
                <p className="text-gray-900 bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Academic Preferences */}
        <Card className="mt-6 bg-white border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
            <CardTitle className="flex items-center space-x-2 text-gray-800">
              <School className="w-5 h-5 text-purple-600" />
              <span>Academic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* State - First Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1 text-purple-600" />
                  State
                </label>
                <Select value={selectedState} onValueChange={handleStateChange}>
                  <SelectTrigger className="w-full">
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

              {/* School - Second Field (only shows when state is selected) */}
              {selectedState && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <School className="w-4 h-4 inline mr-1 text-purple-600" />
                    School
                  </label>
                  <Select value={selectedSchool} onValueChange={handleSchoolChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your school" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSchoolsByState(selectedState).map((school) => (
                        <SelectItem key={school.name} value={school.name}>
                          {school.name} - {school.city} ({school.board})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* School Board - Third Field (auto-filled when school is selected) */}
              {selectedSchool && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <School className="w-4 h-4 inline mr-1 text-purple-600" />
                    School Board
                    <span className="text-xs text-gray-500 ml-1">(Auto-filled)</span>
                  </label>
                  <Select value={selectedBoard} onValueChange={setSelectedBoard} disabled>
                    <SelectTrigger className="w-full bg-gray-50">
                      <SelectValue placeholder="Auto-filled from school selection" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolBoards.map((board) => (
                        <SelectItem key={board.value} value={board.value}>
                          {board.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Current Class - Fourth Field (only shows when school board is set) */}
              {selectedBoard && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <GraduationCap className="w-4 h-4 inline mr-1 text-purple-600" />
                    Current Class
                    {isClassSelectionLocked && (
                      <span className="text-xs text-amber-600 ml-1">(Locked in Scholar Plan)</span>
                    )}
                  </label>
                  <Select 
                    value={selectedClass} 
                    onValueChange={handleClassChange}
                    disabled={isClassSelectionLocked ? true : undefined}
                  >
                    <SelectTrigger className={`w-full ${isClassSelectionLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`}>
                      <SelectValue placeholder="Select your class" />
                    </SelectTrigger>
                    <SelectContent>
                      {allowedClasses.map((classItem) => (
                        <SelectItem key={classItem.value} value={classItem.value}>
                          {classItem.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isClassSelectionLocked && (
                    <p className="text-xs text-amber-600 mt-1 flex items-center">
                      <span className="mr-1">🔒</span>
                      Class selection is locked in Scholar Plan. Upgrade to Achiever Plan to access multiple classes.
                    </p>
                  )}
                </div>
              )}

              {/* Stream - Fifth Field (only for classes 11 and 12) */}
              {isStreamRequired && selectedClass && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <GraduationCap className="w-4 h-4 inline mr-1 text-purple-600" />
                    Stream
                  </label>
                  <Select value={selectedStream} onValueChange={setSelectedStream}>
                    <SelectTrigger className="w-full">
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

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button 
                onClick={handleSavePreferences}
                className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!selectedState || !selectedSchool || !selectedBoard || !selectedClass || (isStreamRequired && !selectedStream) || isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Academic Preferences'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}

      </div>
    </AppLayout>
  )
} 