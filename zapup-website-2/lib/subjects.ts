// zapup-website-2/lib/subjects.ts
// Subject mapping by class and stream
// Used for organizing questions, books, and other educational content

export interface Subject {
  id: string
  name: string
  icon?: string
}

export interface ClassSubjects {
  [key: string]: Subject[]
}

// Subjects for classes 6-10 (common for all boards)
export const getSubjectsByClass = (classNum: string, stream?: string): Subject[] => {
  const subjectMappings: ClassSubjects = {
    '6': [
      { id: 'mathematics', name: 'Mathematics' },
      { id: 'science', name: 'Science' },
      { id: 'social-science', name: 'Social Science' },
      { id: 'english', name: 'English' },
      { id: 'hindi', name: 'Hindi' }
    ],
    '7': [
      { id: 'mathematics', name: 'Mathematics' },
      { id: 'science', name: 'Science' },
      { id: 'social-science', name: 'Social Science' },
      { id: 'english', name: 'English' },
      { id: 'hindi', name: 'Hindi' }
    ],
    '8': [
      { id: 'english', name: 'English' },
      { id: 'hindi', name: 'Hindi' },
      { id: 'mathematics', name: 'Mathematics' },
      { id: 'science', name: 'Science' },
      { id: 'social-science', name: 'Social Science' }
    ],
    '9': [
      { id: 'english', name: 'English' },
      { id: 'hindi', name: 'Hindi' },
      { id: 'mathematics', name: 'Mathematics' },
      { id: 'physics', name: 'Physics' },
      { id: 'chemistry', name: 'Chemistry' },
      { id: 'biology', name: 'Biology' },
      { id: 'history', name: 'History' },
      { id: 'geography', name: 'Geography' },
      { id: 'economics', name: 'Economics' },
      { id: 'political-science', name: 'Political Science' }
    ],
    '10': [
      { id: 'english', name: 'English' },
      { id: 'hindi', name: 'Hindi' },
      { id: 'mathematics', name: 'Mathematics' },
      { id: 'physics', name: 'Physics' },
      { id: 'chemistry', name: 'Chemistry' },
      { id: 'biology', name: 'Biology' },
      { id: 'history', name: 'History' },
      { id: 'geography', name: 'Geography' },
      { id: 'economics', name: 'Economics' },
      { id: 'political-science', name: 'Political Science' }
    ]
  }

  // For classes 11 and 12, subjects depend on stream
  if (classNum === '11' || classNum === '12') {
    if (!stream) return []
    
    const streamSubjects: { [key: string]: Subject[] } = {
      'science': [
        { id: 'physics', name: 'Physics' },
        { id: 'chemistry', name: 'Chemistry' },
        { id: 'mathematics', name: 'Mathematics' },
        { id: 'biology', name: 'Biology' }, // Optional - PCB
        { id: 'english', name: 'English' },
        { id: 'computer-science', name: 'Computer Science' } // Optional
      ],
      'commerce': [
        { id: 'accountancy', name: 'Accountancy' },
        { id: 'business-studies', name: 'Business Studies' },
        { id: 'economics', name: 'Economics' },
        { id: 'mathematics', name: 'Mathematics' }, // Optional
        { id: 'english', name: 'English' },
        { id: 'informatics-practices', name: 'Informatics Practices' } // Optional
      ],
      'arts': [
        { id: 'history', name: 'History' },
        { id: 'geography', name: 'Geography' },
        { id: 'political-science', name: 'Political Science' },
        { id: 'economics', name: 'Economics' },
        { id: 'english', name: 'English' },
        { id: 'psychology', name: 'Psychology' }, // Optional
        { id: 'sociology', name: 'Sociology' }, // Optional
        { id: 'hindi', name: 'Hindi' }
      ]
    }

    return streamSubjects[stream] || []
  }

  return subjectMappings[classNum] || []
}

// Get subject display name
export const getSubjectDisplayName = (subjectId: string): string => {
  const displayNames: { [key: string]: string } = {
    'mathematics': 'Mathematics',
    'science': 'Science',
    'social-science': 'Social Science',
    'english': 'English',
    'hindi': 'Hindi',
    'physics': 'Physics',
    'chemistry': 'Chemistry',
    'biology': 'Biology',
    'history': 'History',
    'geography': 'Geography',
    'economics': 'Economics',
    'political-science': 'Political Science',
    'accountancy': 'Accountancy',
    'business-studies': 'Business Studies',
    'computer-science': 'Computer Science',
    'informatics-practices': 'Informatics Practices',
    'psychology': 'Psychology',
    'sociology': 'Sociology'
  }
  
  return displayNames[subjectId] || subjectId
}

// Check if a class requires stream selection
export const isStreamRequired = (classNum: string): boolean => {
  return classNum === '11' || classNum === '12'
} 