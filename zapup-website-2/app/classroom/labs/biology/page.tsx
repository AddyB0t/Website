"use client"

import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Microscope, AlertTriangle, BookOpen, Target, ChevronRight, Clock, Users } from "lucide-react"
import Link from "next/link"

interface Experiment {
  id: string
  title: string
  description: string
  duration: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  materials: string[]
  procedure: string[]
  questions: number
  objectives: string[]
}

const biologyExperiments: Experiment[] = [
  {
    id: "cell-structure",
    title: "Cell Structure & Function",
    description: "Observe plant and animal cells under microscope, identify organelles and understand their functions.",
    duration: "45 minutes",
    difficulty: "Medium",
    materials: ["Microscope", "Onion peel", "Cheek cells", "Methylene blue", "Glass slides", "Cover slips"],
    procedure: [
      "Prepare onion peel slide with methylene blue stain",
      "Mount cheek cells on separate slide",
      "Observe under low and high power magnification",
      "Draw and label cellular structures",
      "Compare plant and animal cell features"
    ],
    questions: 15,
    objectives: ["Identify cell organelles", "Compare plant vs animal cells", "Understand cell membrane function"]
  },
  {
    id: "photosynthesis",
    title: "Photosynthesis Process",
    description: "Demonstrate oxygen production during photosynthesis and test for starch in leaves.",
    duration: "60 minutes",
    difficulty: "Medium",
    materials: ["Aquatic plants", "Test tubes", "Iodine solution", "Alcohol", "Beakers", "Sunlight/lamp"],
    procedure: [
      "Set up aquatic plant in inverted test tube filled with water",
      "Expose to bright light and observe oxygen bubbles",
      "Test leaf for starch using iodine after removing chlorophyll",
      "Compare results from light and dark conditions",
      "Record observations and conclusions"
    ],
    questions: 12,
    objectives: ["Demonstrate oxygen production", "Test for starch formation", "Understand light dependency"]
  },
  {
    id: "digestive-system",
    title: "Human Digestive System",
    description: "Study the action of digestive enzymes and observe digestion process.",
    duration: "50 minutes",
    difficulty: "Easy",
    materials: ["Starch solution", "Amylase enzyme", "Benedict's solution", "Test tubes", "Water bath"],
    procedure: [
      "Prepare starch solution in test tubes",
      "Add amylase enzyme to experimental tube",
      "Incubate at body temperature (37°C)",
      "Test for presence of reducing sugars using Benedict's solution",
      "Compare with control tube without enzyme"
    ],
    questions: 10,
    objectives: ["Understand enzyme action", "Observe starch digestion", "Learn about optimal conditions"]
  },
  {
    id: "plant-tissues",
    title: "Plant & Animal Tissues",
    description: "Examine different types of plant and animal tissues under microscope.",
    duration: "40 minutes",
    difficulty: "Medium",
    materials: ["Prepared slides", "Microscope", "Fresh plant specimens", "Mounting medium"],
    procedure: [
      "Observe prepared slides of different plant tissues",
      "Examine xylem and phloem in plant stems",
      "Study animal tissue slides (muscle, nerve, epithelial)",
      "Draw and label tissue structures",
      "Compare structural adaptations to function"
    ],
    questions: 18,
    objectives: ["Identify tissue types", "Relate structure to function", "Compare plant and animal tissues"]
  },
  {
    id: "respiratory-system",
    title: "Respiratory System Study",
    description: "Demonstrate breathing mechanism and test exhaled air for carbon dioxide.",
    duration: "35 minutes",
    difficulty: "Easy",
    materials: ["Lime water", "Straws", "Bell jar model", "Balloons", "Rubber sheet"],
    procedure: [
      "Test exhaled air by bubbling through lime water",
      "Demonstrate breathing using bell jar lung model",
      "Observe diaphragm movement simulation",
      "Measure breathing rate under different conditions",
      "Record and analyze results"
    ],
    questions: 8,
    objectives: ["Understand breathing mechanism", "Test for CO2 in exhaled air", "Relate structure to function"]
  }
]

const safetyGuidelines = [
  "Always wear safety goggles when handling chemicals or biological specimens",
  "Handle microscope slides and glassware carefully to avoid cuts", 
  "Dispose of biological samples in designated waste containers",
  "Wash hands thoroughly with soap before and after experiments",
  "Never eat or drink in the laboratory",
  "Report any accidents or spills to the instructor immediately",
  "Follow proper microscope handling procedures to avoid damage"
]

function ExperimentCard({ experiment }: { experiment: Experiment }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-gray-800 mb-2">{experiment.title}</CardTitle>
            <CardDescription className="text-gray-600">
              {experiment.description}
            </CardDescription>
          </div>
          <Badge className={getDifficultyColor(experiment.difficulty)}>
            {experiment.difficulty}
          </Badge>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-3">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {experiment.duration}
          </div>
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            {experiment.questions} questions
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Learning Objectives:</h4>
            <ul className="space-y-1">
              {experiment.objectives.map((objective, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <Target className="w-3 h-3 mr-2 mt-0.5 text-emerald-500" />
                  {objective}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Key Materials:</h4>
            <div className="flex flex-wrap gap-1">
              {experiment.materials.slice(0, 4).map((material, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {material}
                </Badge>
              ))}
              {experiment.materials.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{experiment.materials.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link href={`/questions/10/biology-labs?experiment=${experiment.id}`}>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              <span>Start Experiment & Questions</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function BiologyLabsPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Microscope className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Biology Laboratory</h1>
              <p className="text-gray-600">Class 10 ICSE - Hands-on experiments in life sciences</p>
            </div>
          </div>
        </div>

        {/* Safety Guidelines */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              <span>Safety Guidelines</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {safetyGuidelines.map((guideline, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-orange-800">{guideline}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Experiments Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Laboratory Experiments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {biologyExperiments.map((experiment) => (
              <ExperimentCard key={experiment.id} experiment={experiment} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}