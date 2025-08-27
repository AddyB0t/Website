'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { BookOpen, Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { ExerciseBadge } from '@/components/ExerciseBadge';

interface Question {
  id: string;
  question_text: string;
  question_number: number | null;
  question_type: string;
  difficulty_level: string;
  is_example: boolean;
  page_number: number | null;
  topics: string[];
  keywords: string[];
  chapter_name: string;
  chapter_number: number;
  book_name: string;
  exercise_name: string | null;
  exercise_number: string | null;
}

interface ChapterGroup {
  chapter_number: number;
  chapter_name: string;
  questions: Question[];
}

interface QuestionsListProps {
  classLevel: string;
  subject: string;
  initialFilters?: {
    chapter?: string;
    exercise?: string;
    type?: string;
    difficulty?: string;
  };
}

const QuestionsList: React.FC<QuestionsListProps> = ({
  classLevel,
  subject,
  initialFilters = {}
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsByChapter, setQuestionsByChapter] = useState<Record<string, ChapterGroup>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [chapterFilter, setChapterFilter] = useState(initialFilters.chapter || 'all');
  const [exerciseFilter, setExerciseFilter] = useState(initialFilters.exercise || 'all');
  const [typeFilter, setTypeFilter] = useState(initialFilters.type || 'all');
  const [difficultyFilter, setDifficultyFilter] = useState(initialFilters.difficulty || 'all');
  const [includeExamples, setIncludeExamples] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Available filter options
  const [filterOptions, setFilterOptions] = useState<{
    questionTypes: string[];
    difficulties: string[];
    exercises: string[];
  }>({ questionTypes: [], difficulties: [], exercises: [] });
  
  // UI state
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'chapters'>('chapters');
  
  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        class: classLevel,
        subject: subject,
        board: 'CBSE (Central Board of Secondary Education)',
        examples: includeExamples.toString(),
        limit: '200'
      });
      
      // Add basic filters
      if (chapterFilter !== 'all') params.set('chapter', chapterFilter);
      if (exerciseFilter !== 'all') params.set('exercise', exerciseFilter);
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (difficultyFilter !== 'all') params.set('difficulty', difficultyFilter);
      
      const response = await fetch(`/api/questions/unified?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.statusText}`);
      }
      
      const data = await response.json();
      setQuestions(data.questions);
      setQuestionsByChapter(data.questionsByChapter);
      
      // Auto-expand first chapter if in chapter view
      if (Object.keys(data.questionsByChapter).length > 0) {
        const firstChapter = Object.keys(data.questionsByChapter)[0];
        setExpandedChapters(new Set([firstChapter]));
      }
      
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError(error instanceof Error ? error.message : 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchFilterOptions = async () => {
    try {
      const params = new URLSearchParams({
        class: classLevel,
        subject: subject,
        board: 'CBSE'
      });
      
      const response = await fetch(`/api/questions/stats?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setFilterOptions(data.filterOptions);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };
  
  useEffect(() => {
    fetchQuestions();
    fetchFilterOptions();
  }, [classLevel, subject, chapterFilter, exerciseFilter, typeFilter, difficultyFilter, includeExamples]);
  
  const filteredQuestions = questions.filter(question => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        question.question_text.toLowerCase().includes(query) ||
        question.chapter_name.toLowerCase().includes(query) ||
        question.topics.some(topic => topic.toLowerCase().includes(query)) ||
        question.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    }
    return true;
  });
  
  const toggleChapter = (chapterKey: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterKey)) {
      newExpanded.delete(chapterKey);
    } else {
      newExpanded.add(chapterKey);
    }
    setExpandedChapters(newExpanded);
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'multiple choice': return 'bg-blue-100 text-blue-800';
      case 'short answer': return 'bg-purple-100 text-purple-800';
      case 'long answer': return 'bg-indigo-100 text-indigo-800';
      case 'numerical': return 'bg-orange-100 text-orange-800';
      case 'worked example': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const QuestionCard = ({ question }: { question: Question }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {question.question_number && (
                <Badge variant="outline" className="text-xs">
                  Q{question.question_number}
                </Badge>
              )}
              <Badge className={getDifficultyColor(question.difficulty_level)}>
                {question.difficulty_level}
              </Badge>
              <Badge className={getTypeColor(question.question_type)}>
                {question.question_type}
              </Badge>
              {question.is_example && (
                <Badge variant="secondary">Example</Badge>
              )}
            </div>
          </div>
          
          {question.page_number && (
            <Badge variant="outline" className="text-xs">
              Page {question.page_number}
            </Badge>
          )}
        </div>
        
        <p className="text-gray-800 leading-relaxed mb-3">
          {question.question_text}
        </p>
        
        {question.topics.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {question.topics.map((topic, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        )}
        
        <ExerciseBadge 
          exerciseName={question.exercise_name}
          exerciseNumber={question.exercise_number}
          variant="inline"
          className="text-sm text-gray-500"
        />
      </CardContent>
    </Card>
  );
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-32" />
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchQuestions} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Class {classLevel} {subject.charAt(0).toUpperCase() + subject.slice(1)} Questions
            </h2>
          </div>
          <Badge variant="outline" className="text-sm">
            {filteredQuestions.length} questions
          </Badge>
        </div>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Select value={chapterFilter} onValueChange={setChapterFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Chapters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chapters</SelectItem>
                {Object.values(questionsByChapter).map(chapter => (
                  <SelectItem 
                    key={chapter.chapter_number} 
                    value={chapter.chapter_number.toString()}
                  >
                    Ch {chapter.chapter_number}: {chapter.chapter_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {filterOptions.questionTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {filterOptions.difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={exerciseFilter} onValueChange={setExerciseFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Exercises" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exercises</SelectItem>
                {filterOptions.exercises.map(exercise => (
                  <SelectItem key={exercise} value={exercise}>
                    {exercise}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeExamples"
                checked={includeExamples}
                onChange={(e) => setIncludeExamples(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="includeExamples" className="text-sm">
                Include Examples
              </label>
            </div>
            
            <Select value={viewMode} onValueChange={(value: 'list' | 'chapters') => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chapters">By Chapter</SelectItem>
                <SelectItem value="list">All Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Questions Display */}
      {viewMode === 'chapters' ? (
        <div className="space-y-6">
          {Object.entries(questionsByChapter).map(([chapterKey, chapter]) => {
            const chapterQuestions = chapter.questions.filter(q => 
              filteredQuestions.some(fq => fq.id === q.id)
            );
            
            if (chapterQuestions.length === 0) return null;
            
            return (
              <Card key={chapterKey}>
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleChapter(chapterKey)}
                >
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      Chapter {chapter.chapter_number}: {chapter.chapter_name}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{chapterQuestions.length} questions</Badge>
                      {expandedChapters.has(chapterKey) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                
                {expandedChapters.has(chapterKey) && (
                  <CardContent>
                    <div className="space-y-4">
                      {chapterQuestions.map(question => (
                        <QuestionCard key={question.id} question={question} />
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map(question => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      )}
      
      {filteredQuestions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No questions found matching your filters.</p>
          <Button 
            onClick={() => {
              setChapterFilter('all');
              setExerciseFilter('all');
              setTypeFilter('all');
              setDifficultyFilter('all');
              setSearchQuery('');
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuestionsList;