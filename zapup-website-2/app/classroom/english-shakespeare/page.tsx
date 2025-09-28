"use client"

import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Languages, BookOpen, Target, ChevronRight, Clock, Users, Theater } from "lucide-react"
import Link from "next/link"

interface ShakespeareWork {
  id: string
  title: string
  type: 'Play' | 'Sonnet' | 'Collection'
  description: string
  duration: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  themes: string[]
  characters: string[]
  questions: number
  objectives: string[]
}

const shakespeareWorks: ShakespeareWork[] = [
  {
    id: "romeo-juliet",
    title: "Romeo and Juliet",
    type: "Play",
    description: "The tragic love story of two young star-crossed lovers whose deaths unite their feuding families.",
    duration: "3-4 weeks study",
    difficulty: "Medium",
    themes: ["Love", "Fate vs Free Will", "Youth vs Age", "Light vs Dark", "Death"],
    characters: ["Romeo Montague", "Juliet Capulet", "Friar Lawrence", "Mercutio", "Tybalt", "Nurse"],
    questions: 25,
    objectives: ["Analyze tragic elements", "Understand character development", "Explore themes of love and fate"]
  },
  {
    id: "merchant-venice",
    title: "The Merchant of Venice",
    type: "Play",
    description: "A complex drama exploring themes of mercy, justice, and prejudice through Shylock's bond with Antonio.",
    duration: "3-4 weeks study",
    difficulty: "Hard",
    themes: ["Justice vs Mercy", "Prejudice", "Friendship", "Love", "Appearance vs Reality"],
    characters: ["Shylock", "Antonio", "Portia", "Bassanio", "Jessica", "Lorenzo"],
    questions: 28,
    objectives: ["Understand moral complexities", "Analyze character motivations", "Explore themes of justice"]
  },
  {
    id: "julius-caesar",
    title: "Julius Caesar",
    type: "Play",
    description: "Political drama about the assassination of Caesar and its aftermath, exploring loyalty and betrayal.",
    duration: "3-4 weeks study",
    difficulty: "Medium",
    themes: ["Ambition", "Loyalty vs Betrayal", "Honor", "Manipulation", "Public vs Private"],
    characters: ["Julius Caesar", "Brutus", "Mark Antony", "Cassius", "Portia", "Calpurnia"],
    questions: 24,
    objectives: ["Analyze political themes", "Study rhetorical devices", "Understand tragic consequences"]
  },
  {
    id: "sonnets-collection",
    title: "Shakespeare's Sonnets",
    type: "Collection",
    description: "Study of selected sonnets exploring themes of love, beauty, time, and mortality.",
    duration: "2-3 weeks study",
    difficulty: "Easy",
    themes: ["Love", "Beauty", "Time", "Mortality", "Nature"],
    characters: ["Fair Youth", "Dark Lady", "Rival Poet"],
    questions: 18,
    objectives: ["Understand sonnet structure", "Analyze poetic devices", "Explore universal themes"]
  },
  {
    id: "character-analysis",
    title: "Character Studies",
    type: "Collection",
    description: "In-depth analysis of major Shakespearean characters and their psychological development.",
    duration: "2 weeks study",
    difficulty: "Medium",
    themes: ["Character Development", "Psychological Depth", "Moral Complexity", "Human Nature"],
    characters: ["Hamlet", "Lady Macbeth", "Iago", "Portia", "Beatrice", "Rosalind"],
    questions: 20,
    objectives: ["Analyze character psychology", "Compare character types", "Understand human complexity"]
  },
  {
    id: "dramatic-techniques",
    title: "Dramatic Techniques",
    type: "Collection", 
    description: "Study of Shakespeare's use of soliloquy, aside, dramatic irony, and other theatrical devices.",
    duration: "2 weeks study",
    difficulty: "Hard",
    themes: ["Dramatic Irony", "Soliloquy", "Metaphor", "Symbolism", "Foreshadowing"],
    characters: ["Various characters across plays"],
    questions: 15,
    objectives: ["Identify dramatic devices", "Understand theatrical techniques", "Analyze literary effects"]
  }
]

const studyTips = [
  "Read the original text alongside modern translations for better understanding",
  "Watch film adaptations to visualize characters and settings",
  "Practice reading aloud to appreciate the rhythm and flow of the language",
  "Create character maps to track relationships and motivations",
  "Study the historical context of Elizabethan England",
  "Focus on major themes and how they relate to modern life",
  "Memorize famous quotes and understand their significance in context"
]

function ShakespeareWorkCard({ work }: { work: ShakespeareWork }) {
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
      case 'Play': return 'bg-purple-100 text-purple-800'
      case 'Sonnet': return 'bg-blue-100 text-blue-800'
      case 'Collection': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50 border-b">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Badge className={getTypeColor(work.type)}>
              {work.type}
            </Badge>
            <Badge className={getDifficultyColor(work.difficulty)}>
              {work.difficulty}
            </Badge>
          </div>
          <Theater className="w-5 h-5 text-red-600" />
        </div>
        <CardTitle className="text-lg text-gray-800 mb-2">{work.title}</CardTitle>
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
                  <Target className="w-3 h-3 mr-2 mt-0.5 text-red-500" />
                  {objective}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Key Themes:</h4>
            <div className="flex flex-wrap gap-1">
              {work.themes.slice(0, 4).map((theme, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {theme}
                </Badge>
              ))}
              {work.themes.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{work.themes.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Main Characters:</h4>
            <div className="flex flex-wrap gap-1">
              {work.characters.slice(0, 3).map((character, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {character}
                </Badge>
              ))}
              {work.characters.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{work.characters.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link href={`/questions/10/english-shakespeare?work=${work.id}`}>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
              <span>Study & Practice Questions</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ShakespeareEnglishPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <Languages className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">English - Shakespeare</h1>
              <p className="text-gray-600">Class 10 ICSE - The Bhawanipur Gujarati Education Society School</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            Explore the timeless works of William Shakespeare through comprehensive study of his most celebrated plays and sonnets. 
            This specialized curriculum is designed for students of The Bhawanipur Gujarati Education Society School, 
            focusing on ICSE board examination requirements.
          </p>
        </div>

        {/* Study Tips */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <BookOpen className="w-5 h-5" />
              <span>Study Tips for Shakespeare</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {studyTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-blue-800">{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shakespeare Works Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Shakespeare Studies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shakespeareWorks.map((work) => (
              <ShakespeareWorkCard key={work.id} work={work} />
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Theater className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Performance Videos</h4>
                <p className="text-sm text-gray-600">Watch professional performances</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <BookOpen className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Literary Analysis</h4>
                <p className="text-sm text-gray-600">Critical essays and interpretations</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Discussion Forums</h4>
                <p className="text-sm text-gray-600">Connect with fellow students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}