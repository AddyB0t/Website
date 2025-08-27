'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, BarChart3, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuestionsList from '@/components/QuestionsList';

interface ClassSubjectStats {
  classLevel: string;
  subject: string;
  boardType: string;
  totalBooks: number;
  totalChapters: number;
  totalQuestions: number;
  totalExercises: number;
  totalExamples: number;
}

interface Book {
  id: string;
  name: string;
  author?: string;
  publisher?: string;
}

const UnifiedQuestionsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  
  const classId = params?.classId as string;
  const subjectId = params?.subjectId as string;
  
  const [stats, setStats] = useState<ClassSubjectStats | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<'CBSE' | 'ICSE'>('CBSE');
  
  useEffect(() => {
    fetchStatsAndBooks();
  }, [classId, subjectId, selectedBoard]);
  
  const fetchStatsAndBooks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        class: classId,
        subject: subjectId,
        board: selectedBoard
      });
      
      const response = await fetch(`/api/questions/stats?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Get stats for this specific class/subject/board combination
      const relevantStats = data.statistics.find((stat: any) => 
        stat.class_level === classId && 
        stat.subject === subjectId && 
        stat.board_type === selectedBoard
      );
      
      if (relevantStats) {
        setStats({
          classLevel: relevantStats.class_level,
          subject: relevantStats.subject,
          boardType: relevantStats.board_type,
          totalBooks: relevantStats.total_books || 0,
          totalChapters: relevantStats.total_chapters || 0,
          totalQuestions: relevantStats.total_questions || 0,
          totalExercises: relevantStats.total_exercises || 0,
          totalExamples: relevantStats.total_examples || 0
        });
      }
      
      // Filter books for this class/subject/board
      const relevantBooks = data.books.filter((book: any) => 
        book.class_level === classId && 
        book.subject === subjectId && 
        book.board_type === selectedBoard
      );
      
      setBooks(relevantBooks);
      
    } catch (error) {
      console.error('Error fetching stats and books:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  
  const getSubjectDisplayName = (subject: string) => {
    const subjectNames: Record<string, string> = {
      'mathematics': 'Mathematics',
      'science': 'Science',
      'english': 'English',
      'social-studies': 'Social Studies'
    };
    return subjectNames[subject] || subject.charAt(0).toUpperCase() + subject.slice(1);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Questions</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                Class {classId} {getSubjectDisplayName(subjectId)}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              Comprehensive question bank with solutions and examples
            </p>
            
            {/* Board Selection */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Board:</span>
              <div className="flex gap-1">
                {(['CBSE', 'ICSE'] as const).map(board => (
                  <Button
                    key={board}
                    variant={selectedBoard === board ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedBoard(board)}
                  >
                    {board}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center p-6">
                <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalBooks}</p>
                  <p className="text-sm text-gray-600">Books Available</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalChapters}</p>
                  <p className="text-sm text-gray-600">Chapters</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalQuestions}</p>
                  <p className="text-sm text-gray-600">Questions</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <Clock className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalExamples}</p>
                  <p className="text-sm text-gray-600">Worked Examples</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Available Books */}
        {books.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Available Books</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map(book => (
                  <div 
                    key={book.id} 
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                  >
                    <h3 className="font-semibold text-gray-800 mb-2">{book.name}</h3>
                    {book.author && (
                      <p className="text-sm text-gray-600">Author: {book.author}</p>
                    )}
                    {book.publisher && (
                      <p className="text-sm text-gray-600">Publisher: {book.publisher}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Questions Section */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Questions</TabsTrigger>
            <TabsTrigger value="exercises">Practice Questions</TabsTrigger>
            <TabsTrigger value="examples">Worked Examples</TabsTrigger>
            <TabsTrigger value="by-type">By Question Type</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            <QuestionsList
              classLevel={classId}
              subject={subjectId}
              boardType={selectedBoard}
            />
          </TabsContent>
          
          <TabsContent value="exercises" className="space-y-6">
            <QuestionsList
              classLevel={classId}
              subject={subjectId}
              boardType={selectedBoard}
              initialFilters={{ type: 'Multiple Choice' }}
            />
          </TabsContent>
          
          <TabsContent value="examples" className="space-y-6">
            <QuestionsList
              classLevel={classId}
              subject={subjectId}
              boardType={selectedBoard}
              initialFilters={{ type: 'Worked Example' }}
            />
          </TabsContent>
          
          <TabsContent value="by-type" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Multiple Choice', 'Short Answer', 'Long Answer', 'Numerical', 'True/False', 'Proof'].map(type => (
                <Card key={type} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <QuestionsList
                      classLevel={classId}
                      subject={subjectId}
                      boardType={selectedBoard}
                      initialFilters={{ type }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* No Content State */}
        {stats && stats.totalQuestions === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Questions Available
              </h3>
              <p className="text-gray-600 mb-6">
                Questions for Class {classId} {getSubjectDisplayName(subjectId)} ({selectedBoard}) 
                haven't been added yet.
              </p>
              <Button 
                onClick={() => router.push('/questions')}
                variant="outline"
              >
                Browse Other Subjects
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UnifiedQuestionsPage;