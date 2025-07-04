import fs from 'fs'
import path from 'path'

export interface Question {
  id: number
  text: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface Section {
  id: string
  title: string
  questions: Question[]
}

export interface Chapter {
  id: string
  title: string
  sections: Section[]
  totalQuestions: number
}

// Base directory for Class 7th Mathematics questions
const baseDir = 'D:\\Addy\\Client\\Questions\\Class 7th\\Mathematics'

// Question chapters mapping
const questionChapters = [
  'Large Number Around Us',
  'Arithmetic Expressions',
  'A Peek Beyond The Point',
  'Expressions Using Letter-Numbers',
  'Parallel And Intersecting Lines',
  'Number Play',
  'A Tale Of Three Intersecting Lines',
  'Working With Fractions'
]

// Function to parse markdown question file
function parseQuestionFile(content: string, chapterTitle: string): Section[] {
  const lines = content.split('\n')
  const sections: Section[] = []
  let currentSection: string | null = null
  let currentQuestions: string[] = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Check for main chapter header (# Chapter X: Title)
    if (line.match(/^#\s+Chapter\s+\d+:/)) {
      continue // Skip main chapter header
    }
    
    // Check for section headers (## X.X or ## Title)
    if (line.match(/^##\s+/)) {
      // Save previous section
      if (currentSection && currentQuestions.length > 0) {
        sections.push({
          id: generateSectionId(currentSection),
          title: currentSection,
          questions: currentQuestions.map((text, index) => ({
            id: sections.length * 100 + index + 1,
            text: cleanQuestionText(text),
            difficulty: getDifficulty(text)
          }))
        })
      }
      
      // Start new section
      currentSection = line.replace(/^##\s+/, '').trim()
      currentQuestions = []
    }
    
    // Check for subsection headers (### Something)
    else if (line.match(/^###\s+/)) {
      // Skip subsection headers - don't append to section title
      continue
    }
    
    // Check for numbered questions
    else if (line.match(/^\d+\.\s+/)) {
      const questionText = line.replace(/^\d+\.\s+/, '').trim()
      if (questionText) {
        currentQuestions.push(questionText)
      }
    }
    
    // Check for lettered sub-questions or continuation
    else if (line.match(/^\s*-\s+\([a-z]\)/)) {
      const subQuestion = line.trim()
      if (currentQuestions.length > 0 && subQuestion) {
        // Append to the last question
        currentQuestions[currentQuestions.length - 1] += '\n' + subQuestion
      }
    }
    
    // Check for bullet points that might be part of a question
    else if (line.match(/^\s*-\s+/) && currentQuestions.length > 0) {
      const bulletPoint = line.trim()
      if (bulletPoint && !bulletPoint.match(/^-\s*$/)) {
        // Append to the last question
        currentQuestions[currentQuestions.length - 1] += '\n' + bulletPoint
      }
    }
  }
  
  // Save the last section
  if (currentSection && currentQuestions.length > 0) {
    sections.push({
      id: generateSectionId(currentSection),
      title: currentSection,
      questions: currentQuestions.map((text, index) => ({
        id: sections.length * 100 + index + 1,
        text: cleanQuestionText(text),
        difficulty: getDifficulty(text)
      }))
    })
  }
  
  return sections
}

// Function to generate section ID from title
function generateSectionId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)
}

// Function to clean and format question text
function cleanQuestionText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
    .replace(/`(.*?)`/g, '$1')       // Remove code markdown
    .replace(/^\s+|\s+$/g, '')       // Trim whitespace
    .replace(/\s+/g, ' ')            // Normalize spaces
}

// Function to determine question difficulty based on content
function getDifficulty(text: string): 'easy' | 'medium' | 'hard' {
  const lowerText = text.toLowerCase()
  
  // Hard difficulty indicators
  if (lowerText.includes('prove') || 
      lowerText.includes('explain why') || 
      lowerText.includes('theorem') ||
      lowerText.includes('derive') ||
      lowerText.length > 200) {
    return 'hard'
  }
  
  // Easy difficulty indicators
  if (lowerText.includes('find') || 
      lowerText.includes('calculate') || 
      lowerText.includes('draw') ||
      lowerText.includes('measure') ||
      lowerText.length < 80) {
    return 'easy'
  }
  
  // Default to medium
  return 'medium'
}

// Function to load all questions for Class 7 Mathematics
export function loadClass7MathQuestions(): Chapter[] {
  const chapters: Chapter[] = []
  
  for (let chapterIndex = 0; chapterIndex < questionChapters.length; chapterIndex++) {
    const chapterTitle = questionChapters[chapterIndex]
    const chapterDir = path.join(baseDir, chapterTitle)
    const questionFile = path.join(chapterDir, 'questions.md')
    
    // Check if file exists
    if (!fs.existsSync(questionFile)) {
      console.warn(`Question file not found: ${questionFile}`)
      continue
    }
    
    try {
      // Read and parse the file
      const content = fs.readFileSync(questionFile, 'utf8')
      const sections = parseQuestionFile(content, chapterTitle)
      
      if (sections.length > 0) {
        const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0)
        
        chapters.push({
          id: generateSectionId(chapterTitle),
          title: chapterTitle,
          sections,
          totalQuestions
        })
      }
    } catch (error) {
      console.error(`Error reading file ${questionFile}:`, error)
    }
  }
  
  return chapters
}

// Function to get a specific chapter by ID
export function getChapterById(chapterId: string): Chapter | null {
  const chapters = loadClass7MathQuestions()
  return chapters.find(ch => ch.id === chapterId) || null
}

// Function to get a specific section by chapter and section ID
export function getSectionById(chapterId: string, sectionId: string): Section | null {
  const chapter = getChapterById(chapterId)
  return chapter?.sections.find(sec => sec.id === sectionId) || null
} 