"use client"

import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FlaskConical, AlertTriangle, BookOpen, Target, ChevronRight, Clock, Beaker } from "lucide-react"
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

const chemistryExperiments: Experiment[] = [
  {
    id: "acid-base-reactions",
    title: "Acid-Base Reactions",
    description: "Study the properties of acids and bases, and observe neutralization reactions with indicators.",
    duration: "50 minutes",
    difficulty: "Medium",
    materials: ["HCl solution", "NaOH solution", "Phenolphthalein", "Litmus paper", "Test tubes", "Beakers"],
    procedure: [
      "Test various solutions with litmus paper to identify acids and bases",
      "Add phenolphthalein indicator to sodium hydroxide solution",
      "Gradually add hydrochloric acid and observe color changes",
      "Record pH changes during neutralization",
      "Test the resulting salt solution"
    ],
    questions: 14,
    objectives: ["Identify acids and bases using indicators", "Observe neutralization reactions", "Understand pH scale"]
  },
  {
    id: "metal-reactivity",
    title: "Metal Reactivity Series",
    description: "Determine the reactivity of different metals by observing their reactions with acids and displacement reactions.",
    duration: "45 minutes",
    difficulty: "Medium",
    materials: ["Zinc strip", "Copper strip", "Iron nail", "Dilute HCl", "CuSO₄ solution", "ZnSO₄ solution"],
    procedure: [
      "Add zinc, iron, and copper to dilute hydrochloric acid",
      "Observe and record gas evolution and reaction rates",
      "Place iron nail in copper sulfate solution",
      "Place copper strip in zinc sulfate solution",
      "Arrange metals in order of reactivity based on observations"
    ],
    questions: 12,
    objectives: ["Understand metal reactivity", "Observe displacement reactions", "Arrange metals in reactivity series"]
  },
  {
    id: "carbon-compounds",
    title: "Carbon Compounds Testing",
    description: "Test for the presence of carbon in organic compounds and study their combustion properties.",
    duration: "40 minutes",
    difficulty: "Easy",
    materials: ["Sugar", "Candle wax", "Alcohol", "Lime water", "Test tubes", "Bunsen burner"],
    procedure: [
      "Heat sugar in a test tube and observe charring",
      "Burn candle and test products with lime water",
      "Test alcohol vapor combustion",
      "Observe formation of carbon dioxide and water",
      "Compare combustion of different organic compounds"
    ],
    questions: 10,
    objectives: ["Identify carbon in organic compounds", "Study combustion reactions", "Test for CO₂ formation"]
  },
  {
    id: "chemical-equations",
    title: "Chemical Equations & Reactions",
    description: "Balance chemical equations and observe different types of chemical reactions.",
    duration: "55 minutes",
    difficulty: "Hard",
    materials: ["Various chemicals", "Balanced scales", "Measuring cylinders", "pH indicators", "Test tubes"],
    procedure: [
      "Observe combination reaction (burning of magnesium)",
      "Study decomposition reaction (heating of copper carbonate)",
      "Perform displacement reaction (zinc + copper sulfate)",
      "Balance equations for observed reactions",
      "Calculate reactant and product masses"
    ],
    questions: 16,
    objectives: ["Balance chemical equations", "Classify reaction types", "Apply conservation of mass"]
  },
  {
    id: "salt-preparation",
    title: "Salt Preparation Methods",
    description: "Prepare different salts using various methods and study their properties.",
    duration: "60 minutes",
    difficulty: "Medium",
    materials: ["Copper oxide", "Sulfuric acid", "Sodium carbonate", "Evaporating dish", "Filter paper"],
    procedure: [
      "Prepare copper sulfate by reacting copper oxide with sulfuric acid",
      "Filter the solution to remove excess copper oxide",
      "Evaporate water to obtain copper sulfate crystals",
      "Prepare sodium sulfate using displacement method",
      "Compare properties of different salts formed"
    ],
    questions: 13,
    objectives: ["Learn salt preparation methods", "Understand crystallization", "Study salt properties"]
  }
]

const safetyGuidelines = [
  "Always wear safety goggles and aprons when handling chemicals",
  "Work in well-ventilated areas or under fume hoods when specified",
  "Never mix chemicals unless instructed to do so",
  "Handle acids and bases with extreme care using proper dilution techniques",
  "Report any chemical spills or accidents immediately",
  "Wash hands thoroughly after handling any chemicals",
  "Never taste or smell chemicals directly",
  "Use proper heating techniques and equipment"
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
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
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
                  <Target className="w-3 h-3 mr-2 mt-0.5 text-blue-500" />
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
          <Link href={`/questions/10/chemistry-labs?experiment=${experiment.id}`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <span>Start Experiment & Questions</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ChemistryLabsPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FlaskConical className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chemistry Laboratory</h1>
              <p className="text-gray-600">Class 10 ICSE - Practical experiments in chemical sciences</p>
            </div>
          </div>
        </div>

        {/* Safety Guidelines */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              <span>Chemical Safety Guidelines</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {safetyGuidelines.map((guideline, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-red-800">{guideline}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Experiments Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Laboratory Experiments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chemistryExperiments.map((experiment) => (
              <ExperimentCard key={experiment.id} experiment={experiment} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}