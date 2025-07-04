# ZapUp Classroom - Production Implementation

## Overview

ZapUp Classroom is a hierarchical educational content platform that allows students to access textbook content, exercises, questions and AI-generated solutions. The system supports multiple subjects, books, classes, chapters, exercises, and questions.

## Architecture

### Database (Supabase)

The content is organized in a hierarchical structure:
- Subjects (Mathematics, Science, etc.)
  - Books (NCERT Mathematics, etc.)
    - Classes (Class 6, Class 7, etc.)
      - Chapters (Knowing Our Numbers, etc.)
        - Exercises (Exercise 1.1, etc.)
          - Questions with solutions

### Frontend (Next.js)

- Dynamic routing based on the hierarchy
- Progressive data loading
- Responsive UI with Tailwind CSS and shadcn/ui
- AI-generated answers through API

## Implementation

### Database Setup

1. Create a Supabase project at https://supabase.com
2. Run the `schema.sql` script in the Supabase SQL editor
3. Configure environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   OPENAI_API_KEY=your-openai-api-key
   ```

### Frontend Structure

```
app/
├── api/                           # API routes
│   ├── subjects/                  # Subjects API
│   ├── subjects/[subjectId]/books # Books by subject API
│   ├── books/[bookId]/classes     # Classes by book API
│   ├── classes/[classId]/chapters # Chapters by class API
│   ├── chapters/[chapterId]/exercises # Exercises by chapter API
│   ├── exercises/[exerciseId]/questions # Questions by exercise API
│   └── generate-answer            # AI answer generation API
├── classroom/                     # Frontend pages
│   ├── page.tsx                   # Subject listing page
│   ├── [subjectId]/               # Subject page (shows books)
│   │   ├── page.tsx
│   │   └── [bookId]/              # Book page (shows classes)
│   │       ├── page.tsx
│   │       └── [classId]/         # Class page (shows NCERT content)
│   │           └── page.tsx
└── (other app directories)
```

### Data Import Process

1. Extract content from PDFs/books using OCR or manual entry
2. Structure the data according to the database schema
3. Import data into Supabase tables

### Performance Considerations

- Database indexes are created for all foreign keys and ordering fields
- Solution caching to prevent duplicate AI generation calls
- Progressive data loading based on user navigation
- Component splitting for optimal rendering

## Getting Started

1. Clone this repository
2. Install dependencies with `npm install`
3. Set up your environment variables in `.env.local`
4. Run the development server with `npm run dev`

## Data Import Tools

For importing book content, consider these approaches:

1. **PDF Parsing**:
   - Use pdf.js or pdf-lib to extract text
   - Apply regex patterns to identify chapters, exercises, questions

2. **Manual Entry**:
   - Create a content management interface for editors
   - Bulk import from structured formats (CSV, Excel)

3. **OCR for Scanned Books**:
   - Tesseract.js for text extraction from images
   - Post-processing to structure the content

## Future Enhancements

1. User authentication and progress tracking
2. Bookmarking and notes functionality
3. Interactive exercises with immediate feedback
4. Additional content types (videos, interactive diagrams)
5. Mobile app version
6. Offline access capability 