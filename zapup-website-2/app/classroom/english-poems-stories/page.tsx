"use client"

import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Target, ChevronRight, Clock, Feather, Heart, Brain } from "lucide-react"
import Link from "next/link"

interface LiteraryWork {
  id: string
  title: string
  type: 'Poem' | 'Short Story' | 'Speech' | 'Essay'
  author: string
  description: string
  duration: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  themes: string[]
  literaryDevices: string[]
  questions: number
  objectives: string[]
}

const literaryWorks: LiteraryWork[] = [
  {
    id: "cold-within",
    title: "The Cold Within",
    type: "Poem",
    author: "James Patrick Kinney",
    description: "A powerful poem about human prejudice and the consequences of hatred and discrimination.",
    duration: "1 week study",
    difficulty: "Medium",
    themes: ["Prejudice", "Discrimination", "Unity", "Human Nature", "Social Commentary"],
    literaryDevices: ["Metaphor", "Symbolism", "Irony", "Repetition", "Imagery"],
    questions: 12,
    objectives: ["Analyze symbolic meaning", "Understand social criticism", "Explore themes of unity"]
  },
  {
    id: "glove-lions",
    title: "The Glove and the Lions",
    type: "Poem",
    author: "Leigh Hunt",
    description: "A narrative poem about true love, courage, and the difference between genuine affection and mere infatuation.",
    duration: "1 week study",
    difficulty: "Easy",
    themes: ["True Love", "Courage", "Honor", "Testing Love", "Nobility"],
    literaryDevices: ["Narrative", "Dialogue", "Dramatic Irony", "Symbolism", "Characterization"],
    questions: 10,
    objectives: ["Distinguish true love from infatuation", "Analyze character motivations", "Understand moral lessons"]
  },
  {
    id: "chief-seattle-speech",
    title: "Chief Seattle's Speech",
    type: "Speech",
    author: "Chief Seattle",
    description: "A profound speech about environmental preservation, respect for nature, and indigenous wisdom.",
    duration: "1.5 weeks study",
    difficulty: "Hard",
    themes: ["Environmental Conservation", "Indigenous Wisdom", "Respect for Nature", "Cultural Understanding", "Legacy"],
    literaryDevices: ["Rhetorical Questions", "Metaphor", "Parallelism", "Imagery", "Persuasive Language"],
    questions: 15,
    objectives: ["Understand environmental themes", "Analyze rhetorical devices", "Appreciate indigenous perspectives"]
  },
  {
    id: "mirror-sylvia-plath",
    title: "Mirror",
    type: "Poem",
    author: "Sylvia Plath",
    description: "A poem exploring themes of aging, self-perception, and the relationship between truth and appearance.",
    duration: "1 week study",
    difficulty: "Medium",
    themes: ["Aging", "Self-Perception", "Truth", "Appearance vs Reality", "Time"],
    literaryDevices: ["Personification", "Metaphor", "Imagery", "Symbolism", "Tone"],
    questions: 11,
    objectives: ["Analyze personification techniques", "Explore themes of aging", "Understand symbolic meaning"]
  },
  {
    id: "animals-walt-whitman",
    title: "Animals",
    type: "Poem",
    author: "Walt Whitman",
    description: "A contemplative poem comparing human and animal behavior, questioning human civilization.",
    duration: "1 week study",
    difficulty: "Easy",
    themes: ["Human vs Animal Behavior", "Simplicity", "Natural Living", "Social Criticism", "Philosophy"],
    literaryDevices: ["Comparison", "Free Verse", "Imagery", "Rhetorical Questions", "Repetition"],
    questions: 9,
    objectives: ["Compare human and animal traits", "Understand social commentary", "Analyze free verse structure"]
  },
  {
    id: "television-roald-dahl",
    title: "Television",
    type: "Poem",
    author: "Roald Dahl",
    description: "A humorous yet critical poem about the negative effects of television on children's imagination and reading habits.",
    duration: "1 week study",
    difficulty: "Easy",
    themes: ["Technology Criticism", "Reading vs TV", "Child Development", "Imagination", "Modern Society"],
    literaryDevices: ["Satire", "Humor", "Rhyme Scheme", "Exaggeration", "Direct Address"],
    questions: 8,
    objectives: ["Understand satirical elements", "Analyze social criticism", "Appreciate humor in poetry"]
  },
  {
    id: "poetry-analysis-techniques",
    title: "Poetry Analysis Techniques",
    type: "Essay",
    author: "Multiple Authors",
    description: "Comprehensive guide to analyzing poetry including structure, themes, and literary devices.",
    duration: "2 weeks study",
    difficulty: "Medium",
    themes: ["Literary Analysis", "Poetic Structure", "Interpretation", "Critical Thinking", "Academic Writing"],
    literaryDevices: ["All Major Devices", "Structural Analysis", "Thematic Analysis", "Comparative Study", "Critical Writing"],
    questions: 20,
    objectives: ["Master analysis techniques", "Understand poetic forms", "Develop critical thinking"]
  },
  {
    id: "story-comprehension",
    title: "Story Comprehension Skills",
    type: "Essay",
    author: "Educational Framework",
    description: "Techniques for understanding and analyzing short stories, character development, and narrative structure.",
    duration: "1.5 weeks study",
    difficulty: "Medium",
    themes: ["Narrative Structure", "Character Development", "Plot Analysis", "Setting", "Theme Identification"],
    literaryDevices: ["Plot Structure", "Characterization", "Setting Description", "Foreshadowing", "Conflict"],
    questions: 18,
    objectives: ["Analyze narrative elements", "Understand character arcs", "Identify themes effectively"]
  }
]

const studyStrategies = [
  "Read each work multiple times to deepen understanding",
  "Create mind maps connecting themes across different works",
  "Practice identifying literary devices and their effects",
  "Write personal responses to explore your interpretation",
  "Discuss works with classmates to gain different perspectives",
  "Connect themes to contemporary issues and personal experiences",
  "Practice writing analytical essays with proper structure",
  "Use annotation techniques while reading to track important elements"
]

function LiteraryWorkCard({ work }: { work: LiteraryWork }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Poem': return 'bg-purple-100 text-purple-800'
      case 'Short Story': return 'bg-blue-100 text-blue-800'
      case 'Speech': return 'bg-green-100 text-green-800'
      case 'Essay': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Poem': return <Feather className="w-5 h-5 text-rose-600" />
      case 'Short Story': return <BookOpen className="w-5 h-5 text-rose-600" />
      case 'Speech': return <Heart className="w-5 h-5 text-rose-600" />
      case 'Essay': return <Brain className="w-5 h-5 text-rose-600" />
      default: return <BookOpen className="w-5 h-5 text-rose-600" />
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Badge className={getTypeColor(work.type)}>
              {work.type}
            </Badge>
            <Badge className={getDifficultyColor(work.difficulty)}>
              {work.difficulty}
            </Badge>
          </div>
          {getTypeIcon(work.type)}
        </div>
        <CardTitle className="text-lg text-gray-800 mb-1">{work.title}</CardTitle>
        <p className="text-sm text-gray-600 italic mb-2">by {work.author}</p>
        <CardDescription className="text-gray-600">
          {work.description}
        </CardDescription>
        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-3">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {work.duration}
          </div>
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            {work.questions} questions
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Learning Objectives:</h4>
            <ul className="space-y-1">
              {work.objectives.map((objective, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <Target className="w-3 h-3 mr-2 mt-0.5 text-rose-500" />
                  {objective}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Key Themes:</h4>
            <div className="flex flex-wrap gap-1">
              {work.themes.slice(0, 3).map((theme, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {theme}
                </Badge>
              ))}
              {work.themes.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{work.themes.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Literary Devices:</h4>
            <div className="flex flex-wrap gap-1">
              {work.literaryDevices.slice(0, 3).map((device, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {device}
                </Badge>
              ))}
              {work.literaryDevices.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{work.literaryDevices.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link href={`/questions/10/english-poems-stories?work=${work.id}`}>
            <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white">
              <span>Study & Practice Questions</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PoemsStoriesEnglishPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-rose-100 rounded-xl">
              <BookOpen className="w-8 h-8 text-rose-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">English - Short Poems & Stories</h1>
              <p className="text-gray-600">Class 10 ICSE - The Bhawanipur Gujarati Education Society School</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            Discover the beauty and depth of English literature through carefully selected poems and short stories. 
            This specialized curriculum for The Bhawanipur Gujarati Education Society School focuses on developing 
            critical analysis skills, literary appreciation, and comprehensive understanding required for ICSE board examinations.
          </p>
        </div>

        {/* Study Strategies */}
        <Card className="mb-8 border-emerald-200 bg-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-emerald-800">
              <Brain className="w-5 h-5" />
              <span>Literary Analysis Strategies</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {studyStrategies.map((strategy, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-emerald-800">{strategy}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Literary Works Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Literary Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {literaryWorks.map((work) => (
              <LiteraryWorkCard key={work.id} work={work} />
            ))}
          </div>
        </div>

        {/* Assessment Information */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">Assessment & Examination Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Feather className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Poetry Analysis</h4>
                <p className="text-sm text-gray-600">Structure, rhythm, literary devices</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <BookOpen className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Theme Identification</h4>
                <p className="text-sm text-gray-600">Central themes and their development</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Brain className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Critical Writing</h4>
                <p className="text-sm text-gray-600">Analytical essays and responses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}