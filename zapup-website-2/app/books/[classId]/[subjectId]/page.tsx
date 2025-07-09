// zapup-website-2/app/books/[classId]/[subjectId]/page.tsx
// Subject-specific books page with different book types and resources
// Final destination in the navigation: Books → Class → Subject

'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Download, Eye, FileText, ChevronRight, ArrowLeft, ExternalLink } from 'lucide-react'
import { getSubjectDisplayName } from '@/lib/subjects'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { canAccessClass } from '@/lib/access-control'

export default function SubjectBooksPage() {
  const params = useParams()
  const router = useRouter()
  const { preferences, isProfileComplete } = useUserPreferences()
  
  const classId = params.classId as string
  const subjectId = params.subjectId as string
  const classNumber = classId?.replace('class-', '').replace('th', '')
  const subjectName = getSubjectDisplayName(subjectId)

  // Check if user can access this class
  useEffect(() => {
    if (!isProfileComplete()) {
      router.push('/profile')
      return
    }
    
    // Check if user can access this class based on subscription type
    if (!canAccessClass(classNumber, {
      currentClass: preferences.currentClass,
      subscriptionType: preferences.subscriptionType
    })) {
      // Redirect to user's accessible class
      router.push(`/books/class-${preferences.currentClass}th`)
      return
    }
  }, [classNumber, preferences, isProfileComplete, router])

  // Sample books data (in real app, this would come from database)
  const getBooks = () => {
    const books = {
      'mathematics': [
        { 
          id: 'ncert-math', 
          title: 'NCERT Mathematics', 
          type: 'Textbook', 
          author: 'NCERT', 
          pages: 280, 
          format: 'PDF',
          description: 'Official NCERT textbook for Mathematics',
          downloadUrl: '#'
        },
        { 
          id: 'rd-sharma', 
          title: 'RD Sharma Mathematics', 
          type: 'Reference', 
          author: 'R.D. Sharma', 
          pages: 450, 
          format: 'PDF',
          description: 'Comprehensive mathematics reference book',
          downloadUrl: '#'
        },
        { 
          id: 'rs-aggarwal', 
          title: 'RS Aggarwal Mathematics', 
          type: 'Practice', 
          author: 'R.S. Aggarwal', 
          pages: 380, 
          format: 'PDF',
          description: 'Practice problems and solutions',
          downloadUrl: '#'
        }
      ],
      'science': [
        { 
          id: 'ncert-science', 
          title: 'NCERT Science', 
          type: 'Textbook', 
          author: 'NCERT', 
          pages: 320, 
          format: 'PDF',
          description: 'Official NCERT textbook for Science',
          downloadUrl: '#'
        },
        { 
          id: 'lakhmir-singh', 
          title: 'Lakhmir Singh Science', 
          type: 'Reference', 
          author: 'Lakhmir Singh', 
          pages: 400, 
          format: 'PDF',
          description: 'Detailed explanations and examples',
          downloadUrl: '#'
        }
      ],
      'english': [
        { 
          id: 'ncert-english', 
          title: 'NCERT English', 
          type: 'Textbook', 
          author: 'NCERT', 
          pages: 200, 
          format: 'PDF',
          description: 'Official NCERT textbook for English',
          downloadUrl: '#'
        },
        { 
          id: 'english-grammar', 
          title: 'English Grammar & Composition', 
          type: 'Reference', 
          author: 'Wren & Martin', 
          pages: 350, 
          format: 'PDF',
          description: 'Complete grammar reference',
          downloadUrl: '#'
        }
      ]
    }
    
    return books[subjectId as keyof typeof books] || [
      { 
        id: 'general', 
        title: `${subjectName} Textbook`, 
        type: 'Textbook', 
        author: 'NCERT', 
        pages: 250, 
        format: 'PDF',
        description: `Official textbook for ${subjectName}`,
        downloadUrl: '#'
      }
    ]
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'textbook': return 'bg-blue-100 text-blue-700'
      case 'reference': return 'bg-green-100 text-green-700'
      case 'practice': return 'bg-purple-100 text-purple-700'
      case 'solutions': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleViewBook = (bookId: string) => {
    // In real app, this would open the book viewer
    console.log('Opening book:', bookId)
  }

  const handleDownloadBook = (bookId: string) => {
    // In real app, this would initiate download
    console.log('Downloading book:', bookId)
  }

  const books = getBooks()

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <button 
              onClick={() => router.back()} 
              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <ChevronRight className="w-4 h-4" />
            <span>Books</span>
            <ChevronRight className="w-4 h-4" />
            <span className="capitalize">{classId?.replace('-', ' ')}</span>
            <ChevronRight className="w-4 h-4" />
            <span>{subjectName}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-green-600" />
            <span>{subjectName} Books</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Class {classNumber} • Access textbooks, references, and study materials
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card 
              key={book.id}
              className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200 group"
            >
              <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-50 border-b border-gray-100">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded border-2 border-green-300 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-green-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-800 font-semibold text-sm leading-tight">{book.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">by {book.author}</p>
                    </div>
                  </div>
                  <Badge className={getTypeColor(book.type)}>
                    {book.type}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{book.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>{book.pages} pages</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Download className="w-4 h-4" />
                      <span>{book.format}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm"
                      onClick={() => handleViewBook(book.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 border-green-200 text-green-700 hover:bg-green-50 text-sm"
                      onClick={() => handleDownloadBook(book.id)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subject Resources */}

      </div>
    </AppLayout>
  )
} 