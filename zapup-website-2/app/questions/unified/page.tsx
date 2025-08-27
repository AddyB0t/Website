'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, BarChart3, Clock, ArrowRight, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClassSubjectStats {
  class_level: string;
  subject: string;
  board_type: string;
  total_books: number;
  total_chapters: number;
  total_questions: number;
  total_exercises: number;
  total_examples: number;
}

interface SubjectCard {
  id: string;
  name: string;
  description: string;
  classes: {
    classLevel: string;
    stats: ClassSubjectStats[];
  }[];
}

const UnifiedQuestionsHomePage: React.FC = () => {
  const router = useRouter();
  const [allStats, setAllStats] = useState<ClassSubjectStats[]>([]);
  const [subjects, setSubjects] = useState<SubjectCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedBoard, setSelectedBoard] = useState<'all' | 'CBSE' | 'ICSE'>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchAllStats();
  }, []);
  
  const fetchAllStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const statsResponse = await fetch('/api/questions/stats');
      
      if (!statsResponse.ok) {
        throw new Error(`Failed to fetch statistics: ${statsResponse.statusText}`);
      }
      
      const data = await statsResponse.json();
      setAllStats(data.statistics || []);
      
      // Group stats by subject (only for the 4 main subjects)
      const allowedSubjects = ['mathematics', 'science', 'english', 'social-studies'];
      const subjectGroups = (data.statistics || [])
        .filter((stat: ClassSubjectStats) => allowedSubjects.includes(stat.subject))
        .reduce((acc: Record<string, any>, stat: ClassSubjectStats) => {
          if (!acc[stat.subject]) {
            acc[stat.subject] = {
              id: stat.subject,
              name: getSubjectDisplayName(stat.subject),
              description: getSubjectDescription(stat.subject),
              classes: {}
            };
          }
          
          if (!acc[stat.subject].classes[stat.class_level]) {
            acc[stat.subject].classes[stat.class_level] = {
              classLevel: stat.class_level,
              stats: []
            };
          }
          
          acc[stat.subject].classes[stat.class_level].stats.push(stat);
          return acc;
        }, {});
      
      // Convert to array format
      const subjectsArray = Object.values(subjectGroups).map((subject: any) => ({
        ...subject,
        classes: Object.values(subject.classes)
      }));
      
      setSubjects(subjectsArray);
      
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError(error instanceof Error ? error.message : 'Failed to load statistics');
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
    return subjectNames[subject] || subject.charAt(0).toUpperCase() + subject.slice(1).replace(/-/g, ' ');
  };
  
  const getSubjectDescription = (subject: string) => {
    const descriptions: Record<string, string> = {
      'mathematics': 'Master mathematical concepts with comprehensive practice questions and worked examples',
      'science': 'Explore physics, chemistry, and biology through interactive questions and experiments',
      'english': 'Improve language skills with grammar, comprehension, and literature questions',
      'social-studies': 'Understand history, geography, and civics through detailed questions and analysis'
    };
    return descriptions[subject] || 'Comprehensive question bank for this subject';
  };
  
  const getSubjectIcon = (subject: string) => {
    const icons: Record<string, React.ReactNode> = {
      'mathematics': <BarChart3 className="w-8 h-8 text-blue-600" />,
      'science': <BookOpen className="w-8 h-8 text-green-600" />,
      'english': <BookOpen className="w-8 h-8 text-purple-600" />,
      'social-studies': <Users className="w-8 h-8 text-orange-600" />
    };
    return icons[subject] || <BookOpen className="w-8 h-8 text-gray-600" />;
  };
  
  const filteredSubjects = subjects.filter(subject => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!subject.name.toLowerCase().includes(query) && 
          !subject.description.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    // Filter classes within subject based on selected class and board
    subject.classes = subject.classes.filter(classGroup => {
      if (selectedClass !== 'all' && classGroup.classLevel !== selectedClass) {
        return false;
      }
      
      // Filter board within class stats
      if (selectedBoard !== 'all') {
        classGroup.stats = classGroup.stats.filter(stat => stat.board_type === selectedBoard);
      }
      
      return classGroup.stats.length > 0;
    });
    
    return subject.classes.length > 0;
  });
  
  const getTotalStats = () => {
    const totals = {
      books: 0,
      chapters: 0,
      questions: 0,
      examples: 0
    };
    
    // Only count stats for the 4 main subjects
    const allowedSubjects = ['mathematics', 'science', 'english', 'social-studies'];
    allStats
      .filter(stat => allowedSubjects.includes(stat.subject))
      .forEach(stat => {
        totals.books += stat.total_books || 0;
        totals.chapters += stat.total_chapters || 0;
        totals.questions += stat.total_questions || 0;
        totals.examples += stat.total_examples || 0;
      });
    
    return totals;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto text-center py-16">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Error Loading Questions</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={fetchAllStats} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  const totalStats = getTotalStats();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Practice Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access thousands of practice questions, worked examples, and solutions 
            organized by class and subject
          </p>
        </div>
        
        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="flex items-center p-6">
              <BookOpen className="h-10 w-10 text-blue-600 mr-4" />
              <div>
                <p className="text-3xl font-bold text-gray-800">{totalStats.books}</p>
                <p className="text-sm text-gray-600">Total Books</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <BarChart3 className="h-10 w-10 text-green-600 mr-4" />
              <div>
                <p className="text-3xl font-bold text-gray-800">{totalStats.chapters}</p>
                <p className="text-sm text-gray-600">Total Chapters</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-10 w-10 text-purple-600 mr-4" />
              <div>
                <p className="text-3xl font-bold text-gray-800">{totalStats.questions}</p>
                <p className="text-sm text-gray-600">Practice Questions</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Clock className="h-10 w-10 text-orange-600 mr-4" />
              <div>
                <p className="text-3xl font-bold text-gray-800">{totalStats.examples}</p>
                <p className="text-sm text-gray-600">Worked Examples</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {['6', '7', '8', '9', '10'].map(cls => (
                    <SelectItem key={cls} value={cls}>
                      Class {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedBoard} onValueChange={(value: 'all' | 'CBSE' | 'ICSE') => setSelectedBoard(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Board" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Boards</SelectItem>
                  <SelectItem value="CBSE">CBSE</SelectItem>
                  <SelectItem value="ICSE">ICSE</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedClass('all');
                  setSelectedBoard('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSubjects.map(subject => (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {getSubjectIcon(subject.id)}
                  <CardTitle className="text-xl">{subject.name}</CardTitle>
                </div>
                <p className="text-sm text-gray-600">{subject.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {subject.classes.map(classGroup => (
                    <div key={classGroup.classLevel} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">Class {classGroup.classLevel}</h4>
                        <div className="flex gap-1">
                          {classGroup.stats.map(stat => (
                            <Badge key={stat.board_type} variant="outline" className="text-xs">
                              {stat.board_type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {classGroup.stats.map(stat => (
                        <div key={`${stat.class_level}-${stat.board_type}`} className="mb-4 last:mb-0">
                          <div className="flex justify-between items-center mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {stat.board_type}
                            </Badge>
                            <div className="text-sm text-gray-600">
                              {stat.total_questions} questions
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-3">
                            <div>{stat.total_books} books</div>
                            <div>{stat.total_chapters} chapters</div>
                            <div>{stat.total_examples} examples</div>
                          </div>
                          
                          <Button
                            onClick={() => router.push(`/questions/unified/${stat.class_level}/${subject.id}?board=${stat.board_type}`)}
                            className="w-full"
                            size="sm"
                          >
                            <span>Practice Questions</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* No Results State */}
        {filteredSubjects.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Questions Found
              </h3>
              <p className="text-gray-600 mb-6">
                No questions match your current filters. Try adjusting your search criteria.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedClass('all');
                  setSelectedBoard('all');
                }}
                variant="outline"
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UnifiedQuestionsHomePage;