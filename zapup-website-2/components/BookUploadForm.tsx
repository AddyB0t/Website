// zapup-website-2/components/BookUploadForm.tsx
// Book upload form component with chapter-wise upload support
// Allows admins to upload books with multiple chapters in one interface

'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Upload, X, Loader2, FileText, CheckCircle, Plus, Trash2, BookOpen } from 'lucide-react'
import { getStateNames, getSchoolsByStateAndBoard } from '@/lib/states-schools-data'

interface Chapter {
  id: string
  chapterNumber: string
  title: string
  description: string
  pageStart: string
  pageEnd: string
  file: File | null
}

interface BookUploadFormProps {
  onUploadComplete?: (book: any) => void
  onClose?: () => void
}

export function BookUploadForm({ onUploadComplete, onClose }: BookUploadFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    classLevel: '',
    schoolType: '',
    stream: '',
    state: '',
    schoolName: ''
  })
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: '1',
      chapterNumber: '1',
      title: '',
      description: '',
      pageStart: '',
      pageEnd: '',
      file: null
    }
  ])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [availableSubjects, setAvailableSubjects] = useState<Array<{ id: string; name: string }>>([])

  // Function to get subjects based on class level
  const getSubjectsForClass = (classLevel: string): Array<{ id: string; name: string }> => {
    // Classes 6-10: Basic subjects with combined Science & Social Science
    if (['6', '7', '8', '9', '10'].includes(classLevel)) {
      return [
        { id: 'Mathematics', name: 'Mathematics' },
        { id: 'Science', name: 'Science' },
        { id: 'English', name: 'English' },
        { id: 'Hindi', name: 'Hindi' },
        { id: 'Social Science', name: 'Social Science' },
        { id: 'Sanskrit', name: 'Sanskrit' },
        { id: 'French', name: 'French' },
        { id: 'German', name: 'German' },
        { id: 'Computer Science', name: 'Computer Science' },
        { id: 'Physical Education', name: 'Physical Education' },
        { id: 'Home Science', name: 'Home Science' },
        { id: 'Fine Arts', name: 'Fine Arts' },
        { id: 'Music', name: 'Music' }
      ]
    }
    
    // Classes 11-12: Advanced subjects with separate sciences & commerce
    if (['11', '12'].includes(classLevel)) {
      return [
        { id: 'Mathematics', name: 'Mathematics' },
        { id: 'English', name: 'English' },
        { id: 'Hindi', name: 'Hindi' },
        // Separate Sciences
        { id: 'Physics', name: 'Physics' },
        { id: 'Chemistry', name: 'Chemistry' },
        { id: 'Biology', name: 'Biology' },
        // Separate Social Studies
        { id: 'History', name: 'History' },
        { id: 'Geography', name: 'Geography' },
        { id: 'Political Science', name: 'Political Science' },
        { id: 'Psychology', name: 'Psychology' },
        { id: 'Sociology', name: 'Sociology' },
        // Commerce Subjects
        { id: 'Accountancy', name: 'Accountancy' },
        { id: 'Business Studies', name: 'Business Studies' },
        { id: 'Economics', name: 'Economics' },
        // Languages & Others
        { id: 'Sanskrit', name: 'Sanskrit' },
        { id: 'French', name: 'French' },
        { id: 'German', name: 'German' },
        { id: 'Computer Science', name: 'Computer Science' },
        { id: 'Physical Education', name: 'Physical Education' },
        { id: 'Home Science', name: 'Home Science' },
        { id: 'Fine Arts', name: 'Fine Arts' },
        { id: 'Music', name: 'Music' }
      ]
    }
    
    return [] // No class selected
  }

  const classLevels = ['6', '7', '8', '9', '10', '11', '12']
  
  const schoolTypes = [
    { id: 'CBSE (Central Board of Secondary Education)', name: 'CBSE (Central Board of Secondary Education)' },
    { id: 'ICSE (Indian Certificate of Secondary Education)', name: 'ICSE (Indian Certificate of Secondary Education)' }
  ]
  
  const streams = [
    { id: 'Science Medical', name: 'Science Medical' },
    { id: 'Science Non-Medical', name: 'Science Non-Medical' },
    { id: 'Commerce', name: 'Commerce' },
    { id: 'Humanities', name: 'Humanities' }
  ]

  const isStreamRequired = (classLevel: string) => {
    return classLevel === '11' || classLevel === '12';
  }

  // Get filtered schools based on current state and school type
  const filteredSchools = getSchoolsByStateAndBoard(formData.state, formData.schoolType);
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Handle class level changes
      if (field === 'classLevel') {
        // Update available subjects based on new class level
        const newAvailableSubjects = getSubjectsForClass(value);
        setAvailableSubjects(newAvailableSubjects);
        
        // Clear subject if it's not available for the new class
        if (prev.subject && !newAvailableSubjects.find(s => s.id === prev.subject)) {
          newData.subject = '';
        }
        
        // Clear stream when class level changes to 6-10
        if (!isStreamRequired(value)) {
          newData.stream = '';
        }
      }
      
      // Clear school name when state or school type changes
      if (field === 'state' || field === 'schoolType') {
        newData.schoolName = '';
      }
      
      return newData;
    })
    setUploadError(null)
  }

  const handleChapterChange = (chapterId: string, field: string, value: string) => {
    setChapters(prev => prev.map(chapter => 
      chapter.id === chapterId ? { ...chapter, [field]: value } : chapter
    ))
    setUploadError(null)
  }

  const handleChapterFileSelect = (chapterId: string, file: File | null) => {
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/epub+zip',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif'
      ]

      if (!allowedTypes.includes(file.type)) {
        setUploadError('Invalid file type. Only PDF, EPUB, DOC, DOCX, PPT, PPTX, and image files are allowed.')
        return
      }

      const maxSize = 100 * 1024 * 1024
      if (file.size > maxSize) {
        setUploadError('File size must be less than 100MB')
        return
      }
    }

    setChapters(prev => prev.map(chapter => 
      chapter.id === chapterId ? { ...chapter, file } : chapter
    ))
    setUploadError(null)
  }

  const addChapter = () => {
    const newChapterNumber = (chapters.length + 1).toString()
    const newChapter: Chapter = {
      id: Date.now().toString(),
      chapterNumber: newChapterNumber,
      title: '',
      description: '',
      pageStart: '',
      pageEnd: '',
      file: null
    }
    setChapters(prev => [...prev, newChapter])
  }

  const removeChapter = (chapterId: string) => {
    if (chapters.length > 1) {
      setChapters(prev => prev.filter(chapter => chapter.id !== chapterId))
    }
  }

  const validateForm = () => {
    // Check required fields with conditional stream validation
    const requiredFields = ['title', 'subject', 'classLevel', 'schoolType', 'state', 'schoolName'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    // Add stream validation only for classes 11 and 12
    if (isStreamRequired(formData.classLevel) && !formData.stream) {
      missingFields.push('stream');
    }

    if (missingFields.length > 0) {
      const streamMsg = isStreamRequired(formData.classLevel) ? ', and stream' : '';
      setUploadError(`Please fill in all required book fields: title, subject, class level, school type, state, school name${streamMsg}`)
      return false
    }

    // Validate that the selected subject is available for the selected class
    if (formData.classLevel && formData.subject) {
      const classSubjects = getSubjectsForClass(formData.classLevel);
      if (!classSubjects.find(s => s.id === formData.subject)) {
        setUploadError(`The selected subject "${formData.subject}" is not available for class ${formData.classLevel}. Please select a different subject.`)
        return false
      }
    }

    for (const chapter of chapters) {
      if (!chapter.title || !chapter.chapterNumber) {
        setUploadError(`Please fill in chapter number and title for all chapters`)
        return false
      }

      const chapterNum = parseInt(chapter.chapterNumber)
      if (isNaN(chapterNum) || chapterNum <= 0) {
        setUploadError(`Chapter number must be a positive integer`)
        return false
      }

      if (chapter.pageStart && chapter.pageEnd) {
        const startPage = parseInt(chapter.pageStart)
        const endPage = parseInt(chapter.pageEnd)
        if (isNaN(startPage) || isNaN(endPage) || startPage > endPage) {
          setUploadError(`Invalid page range for chapter ${chapter.chapterNumber}`)
          return false
        }
      }
    }

    const chapterNumbers = chapters.map(c => c.chapterNumber)
    const uniqueNumbers = new Set(chapterNumbers)
    if (chapterNumbers.length !== uniqueNumbers.size) {
      setUploadError('Chapter numbers must be unique')
      return false
    }

    return true
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const results = []
      
      // Process each chapter individually as separate API calls
      for (let index = 0; index < chapters.length; index++) {
        const chapter = chapters[index]
        
        const chapterFormData = new FormData()
        
        // Add book metadata for each chapter - using backend expected field names
        chapterFormData.append('book_title', formData.title)
        chapterFormData.append('class_level', formData.classLevel)
        chapterFormData.append('school_type', formData.schoolType)
        chapterFormData.append('subject', formData.subject)
        chapterFormData.append('stream', isStreamRequired(formData.classLevel) ? formData.stream : '')
        chapterFormData.append('state', formData.state)
        chapterFormData.append('school_name', formData.schoolName)
        
        // Add chapter-specific data - using backend expected field names
        chapterFormData.append('chapter_number', chapter.chapterNumber)
        chapterFormData.append('chapter_name', chapter.title)
        
        if (chapter.file) {
          chapterFormData.append('pdf_file', chapter.file)
        }

        // Call backend for each chapter individually
        const response = await fetch('/api/admin/process-book', {
          method: 'POST',
          body: chapterFormData
        })

        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(`Chapter ${chapter.chapterNumber} failed: ${result.error || 'Upload failed'}`)
        }
        
        results.push(result)
      }

      setUploadSuccess(true)
      onUploadComplete?.(results)
      
      setTimeout(() => {
        setFormData({
          title: '',
          subject: '',
          classLevel: '',
          schoolType: '',
          stream: '',
          state: '',
          schoolName: ''
        })
        setChapters([{
          id: '1',
          chapterNumber: '1',
          title: '',
          description: '',
          pageStart: '',
          pageEnd: '',
          file: null
        }])
        setUploadSuccess(false)
      }, 2000)

    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsUploading(false)
    }
  }

  if (uploadSuccess) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-800 mb-2">Book Uploaded Successfully!</h3>
          <p className="text-gray-600 mb-6">Your book with chapters has been uploaded and is now available.</p>
          <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
            Close
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5" />
          <span>Upload Book with Chapters</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Book Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Book Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Book Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter book title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select 
                  value={formData.subject} 
                  onValueChange={(value) => handleInputChange('subject', value)}
                  disabled={!formData.classLevel}
                >
                  <SelectTrigger>
                    <SelectValue 
                      placeholder={
                        !formData.classLevel 
                          ? "Select class level first" 
                          : availableSubjects.length === 0 
                            ? "No subjects available" 
                            : "Select subject"
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!formData.classLevel && (
                  <p className="text-xs text-gray-500">Please select a class level to see available subjects</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Class Level *</Label>
                <Select value={formData.classLevel} onValueChange={(value) => handleInputChange('classLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        Class {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schoolType">School Type *</Label>
                <Select value={formData.schoolType} onValueChange={(value) => handleInputChange('schoolType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select school type" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolTypes.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
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

              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name *</Label>
                <Select 
                  value={formData.schoolName} 
                  onValueChange={(value) => handleInputChange('schoolName', value)}
                  disabled={!formData.state || !formData.schoolType}
                >
                  <SelectTrigger>
                    <SelectValue 
                      placeholder={
                        !formData.state ? "Select state first" :
                        !formData.schoolType ? "Select school type first" :
                        filteredSchools.length === 0 ? "No schools available" :
                        "Select school"
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSchools.map((school) => (
                      <SelectItem key={`${school.name}-${school.city}`} value={school.name}>
                        {school.name} ({school.city})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isStreamRequired(formData.classLevel) && (
                <div className="space-y-2">
                  <Label htmlFor="stream">Stream *</Label>
                  <Select value={formData.stream} onValueChange={(value) => handleInputChange('stream', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stream" />
                    </SelectTrigger>
                    <SelectContent>
                      {streams.map((stream) => (
                        <SelectItem key={stream.id} value={stream.id}>
                          {stream.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

          </div>

          {/* Chapters Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Chapters</h3>
              <Button
                type="button"
                onClick={addChapter}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Chapter</span>
              </Button>
            </div>

            {chapters.map((chapter, index) => (
              <ChapterUploadCard
                key={chapter.id}
                chapter={chapter}
                index={index}
                onChapterChange={handleChapterChange}
                onFileSelect={handleChapterFileSelect}
                onRemove={() => removeChapter(chapter.id)}
                canRemove={chapters.length > 1}
              />
            ))}
          </div>

          {/* Error Message */}
          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{uploadError}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isUploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading Book...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Book with Chapters
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Chapter Upload Card Component
interface ChapterUploadCardProps {
  chapter: Chapter
  index: number
  onChapterChange: (chapterId: string, field: string, value: string) => void
  onFileSelect: (chapterId: string, file: File | null) => void
  onRemove: () => void
  canRemove: boolean
}

function ChapterUploadCard({ 
  chapter, 
  index, 
  onChapterChange, 
  onFileSelect, 
  onRemove, 
  canRemove 
}: ChapterUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    onFileSelect(chapter.id, file)
  }

  const clearFile = () => {
    onFileSelect(chapter.id, null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card className="border-2 border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Chapter {index + 1}</CardTitle>
          {canRemove && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRemove}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Chapter Number *</Label>
            <Input
              type="number"
              value={chapter.chapterNumber}
              onChange={(e) => onChapterChange(chapter.id, 'chapterNumber', e.target.value)}
              placeholder="Chapter number"
              min="1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Chapter Title *</Label>
            <Input
              value={chapter.title}
              onChange={(e) => onChapterChange(chapter.id, 'title', e.target.value)}
              placeholder="Enter chapter title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Start Page</Label>
            <Input
              type="number"
              value={chapter.pageStart}
              onChange={(e) => onChapterChange(chapter.id, 'pageStart', e.target.value)}
              placeholder="Start page"
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label>End Page</Label>
            <Input
              type="number"
              value={chapter.pageEnd}
              onChange={(e) => onChapterChange(chapter.id, 'pageEnd', e.target.value)}
              placeholder="End page"
              min="1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Chapter Description</Label>
          <Textarea
            value={chapter.description}
            onChange={(e) => onChapterChange(chapter.id, 'description', e.target.value)}
            placeholder="Enter chapter description (optional)"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Chapter File (Optional)</Label>
          {!chapter.file ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Click to select chapter file</p>
              <p className="text-xs text-gray-500">PDF, EPUB, DOC, DOCX, PPT, PPTX, Images (Max 100MB)</p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <div className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">{chapter.file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(chapter.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearFile}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.epub,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png,.gif"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  )
} 