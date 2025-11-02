// Image Gallery component for displaying user's uploaded question images
// Shows thumbnails in grid with click to view/reuse functionality

'use client'

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Image as ImageIcon,
  Trash2,
  Calendar,
  FileText,
  Loader2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  HelpCircle,
  Link,
  Users
} from 'lucide-react'
import { UploadedImage } from '@/lib/supabase'
import { format } from 'date-fns'

interface ImageGalleryProps {
  onImageClick?: (image: UploadedImage) => void
  onImageDelete?: (imageId: string) => void
  selectedImageId?: string
}

export interface ImageGalleryRef {
  refresh: () => void
}

export const ImageGallery = forwardRef<ImageGalleryRef, ImageGalleryProps>(
  function ImageGallery({ onImageClick, onImageDelete, selectedImageId }, ref) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  // Expose refresh method to parent component
  useImperativeHandle(ref, () => ({
    refresh: fetchImages
  }))

  const fetchImages = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/my-images')

      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }

      const data = await response.json()

      if (data.success) {
        setImages(data.images || [])
      } else {
        throw new Error(data.error || 'Failed to load images')
      }
    } catch (err) {
      console.error('Error fetching images:', err)
      setError(err instanceof Error ? err.message : 'Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    setDeleting(imageId)

    try {
      const response = await fetch(`/api/my-images/${imageId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      // Remove from local state
      setImages(images.filter(img => img.id !== imageId))

      // Call callback if provided
      if (onImageDelete) {
        onImageDelete(imageId)
      }
    } catch (err) {
      console.error('Error deleting image:', err)
      alert('Failed to delete image. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const handleImageClick = (image: UploadedImage) => {
    setSelectedImage(image)
    if (onImageClick) {
      onImageClick(image)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your images...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Images</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchImages} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-2xl border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <ImageIcon className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              No Images Yet
            </h3>
            <p className="text-gray-700 mb-6 text-lg">
              Upload your first question image using the Study Helper to get started!
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-purple-800 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg px-6 py-3 max-w-md mx-auto border border-purple-200">
              <HelpCircle className="w-5 h-5 flex-shrink-0" />
              <span>Click "Upload New Image" above to add your first image</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Images</h2>
          <p className="text-gray-600 mt-1">
            {images.length} image{images.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <Button onClick={fetchImages} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => {
          const isSelected = selectedImageId === image.id
          return (
            <Card
            key={image.id}
            className={`group hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden bg-white ${
              isSelected ? 'ring-4 ring-purple-500 shadow-xl' : ''
            }`}
            onClick={() => handleImageClick(image)}
          >
            <div className="relative aspect-square bg-gray-100">
              <img
                src={image.image_url}
                alt={image.file_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              {isSelected && (
                <div className="absolute top-2 left-2 bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  <span>Selected</span>
                </div>
              )}
              {image.analyzed && !isSelected && (
                <Badge className="absolute top-2 right-2 bg-green-600 text-white">
                  Analyzed
                </Badge>
              )}
            </div>

            <CardContent className="p-4 space-y-3 bg-white">
              {/* File Info */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 truncate" title={image.file_name}>
                  {image.file_name}
                </p>
                <div className="flex items-center text-xs text-gray-900">
                  <FileText className="w-3 h-3 mr-1" />
                  {(image.file_size / 1024).toFixed(1)} KB
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center text-xs text-gray-900">
                <Calendar className="w-3 h-3 mr-1" />
                {format(new Date(image.uploaded_at), 'MMM d, yyyy h:mm a')}
              </div>

              {/* Class & Subject */}
              {(image.class_level || image.subject) && (
                <div className="flex gap-2">
                  {image.class_level && (
                    <Badge variant="outline" className="text-xs text-gray-900">
                      Class {image.class_level}
                    </Badge>
                  )}
                  {image.subject && (
                    <Badge variant="outline" className="text-xs text-gray-900">
                      {image.subject}
                    </Badge>
                  )}
                </div>
              )}

              {/* Question Link Status */}
              {image.question_id && (
                <div className="flex gap-2 items-center">
                  <Badge className="text-xs bg-blue-100 text-blue-800 flex items-center gap-1">
                    <Link className="w-3 h-3" />
                    Linked to Question #{image.question_id}
                  </Badge>
                  {image.is_community && (
                    <Badge className="text-xs bg-purple-100 text-purple-800 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Community
                    </Badge>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleImageClick(image)
                  }}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Use in Chat
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={deleting === image.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(image.id)
                  }}
                >
                  {deleting === image.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Trash2 className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{selectedImage.file_name}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedImage(null)}>
                  ✕
                </Button>
              </div>

              <img
                src={selectedImage.image_url}
                alt={selectedImage.file_name}
                className="w-full h-auto max-h-[60vh] object-contain mb-4"
              />

              {selectedImage.analyzed && selectedImage.analysis_text && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-900 mb-2">Analysis</h4>
                  <p className="text-sm text-green-800 whitespace-pre-wrap">{selectedImage.analysis_text}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    if (onImageClick) onImageClick(selectedImage)
                    setSelectedImage(null)
                  }}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Use in Study Helper
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(selectedImage.id)
                    setSelectedImage(null)
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
