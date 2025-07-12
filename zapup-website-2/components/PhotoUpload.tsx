// zapup-website-2/components/PhotoUpload.tsx
// Photo upload component for question images
// Allows camera capture and file upload for Achiever/Genius+ users

'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, Upload, X, Loader2, Image as ImageIcon, Crown } from 'lucide-react'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { SUBSCRIPTION_FEATURES } from '@/lib/subscriptions'

interface PhotoUploadProps {
  onImageUploaded: (imageData: string, imageUrl: string) => void
  onAnalysisResult: (analysis: string) => void
  isAnalyzing?: boolean
  maxSizeMB?: number
}

export function PhotoUpload({ 
  onImageUploaded, 
  onAnalysisResult, 
  isAnalyzing = false,
  maxSizeMB = 5 
}: PhotoUploadProps) {
  const { preferences } = useUserPreferences()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const subscriptionFeatures = SUBSCRIPTION_FEATURES[preferences.subscriptionType]
  const canUploadImages = subscriptionFeatures.imageUpload

  // Check if user has photo upload access
  if (!canUploadImages) {
    return (
      <Card className="border-2 border-dashed border-orange-300 bg-orange-50">
        <CardContent className="p-6 text-center">
          <Crown className="w-12 h-12 text-orange-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-orange-800 mb-2">Premium Feature</h3>
          <p className="text-orange-700 mb-4">
            Photo upload is available for Achiever and Genius+ plan users
          </p>
          <Button 
            onClick={() => window.location.href = '/pricing'}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade Plan
          </Button>
        </CardContent>
      </Card>
    )
  }

  const handleFileSelect = (file: File) => {
    setUploadError(null)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPG, PNG, etc.)')
      return
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setUploadError(`Image size should be less than ${maxSizeMB}MB`)
      return
    }

    // Convert to base64 and preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      const imageUrl = URL.createObjectURL(file)
      
      setSelectedImage(imageData)
      onImageUploaded(imageData, imageUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const clearImage = () => {
    setSelectedImage(null)
    setUploadError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          type: 'question-analysis'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const data = await response.json()
      onAnalysisResult(data.analysis)
    } catch (error) {
      console.error('Error analyzing image:', error)
      setUploadError('Failed to analyze image. Please try again.')
    }
  }

  return (
    <div className="space-y-4">
      {/* Subscription Badge */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Upload Question Image</h3>
        <Badge className="bg-blue-100 text-blue-800 text-xs">
          <Crown className="w-3 h-3 mr-1" />
          Premium Feature
        </Badge>
      </div>

      {/* Upload Area */}
      {!selectedImage ? (
        <Card 
          className={`border-2 border-dashed transition-all duration-200 ${
            dragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="p-8 text-center bg-gray-50 rounded-lg">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Question Image
            </h3>
            <p className="text-gray-600 mb-6">
              Take a photo or upload an image of your question
            </p>
            
            <div className="flex justify-center space-x-4">
              {/* Camera Button */}
              <Button
                onClick={() => cameraInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
              
              {/* Upload Button */}
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="border-blue-500 text-blue-700 hover:bg-blue-50 px-6 py-3"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Supports JPG, PNG up to {maxSizeMB}MB
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Image Preview */
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Question to analyze"
                className="w-full max-h-64 object-contain rounded-lg border"
              />
              <Button
                onClick={clearImage}
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex justify-center mt-4">
              <Button
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Analyze Question
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{uploadError}</p>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  )
} 