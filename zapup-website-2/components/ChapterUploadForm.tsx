// zapup-website-2/components/ChapterUploadForm.tsx
// Chapter upload form component for state_school_books
// Allows admins to upload chapters for specific books

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Upload, X, Loader2, FileText, CheckCircle, BookOpen } from 'lucide-react'

interface ChapterUploadFormProps {
  bookId?: string
  onUploadComplete?: (chapter: any) => void
  onClose?: () => void
}

export function ChapterUploadForm({ bookId, onUploadComplete, onClose }: ChapterUploadFormProps) {
  const [formData, setFormData] = useState({
    bookId: bookId || '',
    chapterNumber: '',
    title: '',
    description: '',
    pageStart: '',
    pageEnd: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [books, setBooks] = useState<any[]>([])
  const [loadingBooks, setLoadingBooks] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    setLoadingBooks(true)
    try {
      const response = await fetch('/api/admin/state-school-books')
      const data = await response.json()
      setBooks(data.books || [])
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoadingBooks(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setUploadError(null)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
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

      // Validate file size (25MB max for chapters)
      const maxSize = 25 * 1024 * 1024
      if (file.size > maxSize) {
        setUploadError('File size must be less than 25MB')
        return
      }

      setSelectedFile(file)
      setUploadError(null)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!formData.bookId || !formData.chapterNumber || !formData.title) {
      setUploadError('Please fill in all required fields: Book, Chapter Number, and Title')
      return
    }

    // Validate chapter number
    const chapterNum = parseInt(formData.chapterNumber)
    if (isNaN(chapterNum) || chapterNum <= 0) {
      setUploadError('Chapter number must be a positive integer')
      return
    }

    // Validate page range if provided
    if (formData.pageStart && formData.pageEnd) {
      const startPage = parseInt(formData.pageStart)
      const endPage = parseInt(formData.pageEnd)
      if (isNaN(startPage) || isNaN(endPage) || startPage > endPage) {
        setUploadError('Invalid page range. Start page must be less than or equal to end page')
        return
      }
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const submitData = new FormData()
      if (selectedFile) {
        submitData.append('file', selectedFile)
      }
      submitData.append('bookId', formData.bookId)
      submitData.append('chapterNumber', formData.chapterNumber)
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('pageStart', formData.pageStart)
      submitData.append('pageEnd', formData.pageEnd)

      const response = await fetch('/api/admin/chapters', {
        method: 'POST',
        body: submitData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      setUploadSuccess(true)
      onUploadComplete?.(result.chapter)
      
      // Reset form after successful upload
      setTimeout(() => {
        setFormData({
          bookId: bookId || '',
          chapterNumber: '',
          title: '',
          description: '',
          pageStart: '',
          pageEnd: ''
        })
        setSelectedFile(null)
        setUploadSuccess(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
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
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-800 mb-2">Chapter Uploaded Successfully!</h3>
          <p className="text-gray-600 mb-6">Your chapter has been added to the book and is now available.</p>
          <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
            Close
          </Button>
        </CardContent>
      </Card>
    )
  }

  const selectedBook = books.find(book => book.id === formData.bookId)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5" />
          <span>Upload Chapter</span>
        </CardTitle>
        {selectedBook && (
          <div className="text-sm text-gray-600">
            <p><strong>Book:</strong> {selectedBook.title}</p>
            <p><strong>State:</strong> {selectedBook.state} | <strong>School:</strong> {selectedBook.school} | <strong>Class:</strong> {selectedBook.class_level}</p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Book Selection */}
          <div className="space-y-2">
            <Label htmlFor="book">Select Book *</Label>
            <Select 
              value={formData.bookId} 
              onValueChange={(value) => handleInputChange('bookId', value)}
              disabled={!!bookId || loadingBooks}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingBooks ? "Loading books..." : "Select a book"} />
              </SelectTrigger>
              <SelectContent>
                {books.map((book) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.title} - {book.state} ({book.school}, Class {book.class_level})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chapter Number */}
          <div className="space-y-2">
            <Label htmlFor="chapterNumber">Chapter Number *</Label>
            <Input
              id="chapterNumber"
              type="number"
              value={formData.chapterNumber}
              onChange={(e) => handleInputChange('chapterNumber', e.target.value)}
              placeholder="Enter chapter number (e.g., 1, 2, 3...)"
              min="1"
              required
            />
          </div>

          {/* Chapter Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Chapter Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter chapter title"
              required
            />
          </div>

          {/* Page Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pageStart">Start Page</Label>
              <Input
                id="pageStart"
                type="number"
                value={formData.pageStart}
                onChange={(e) => handleInputChange('pageStart', e.target.value)}
                placeholder="Start page"
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pageEnd">End Page</Label>
              <Input
                id="pageEnd"
                type="number"
                value={formData.pageEnd}
                onChange={(e) => handleInputChange('pageEnd', e.target.value)}
                placeholder="End page"
                min="1"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter chapter description (optional)"
              rows={3}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm font-medium">
              Chapter File (Optional)
            </Label>
            {!selectedFile ? (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to select a chapter file</p>
                <p className="text-sm text-gray-500">PDF, EPUB, DOC, DOCX, PPT, PPTX, Images (Max 25MB)</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
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
              disabled={isUploading || !formData.bookId || !formData.chapterNumber || !formData.title}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Chapter
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 