"use client"

import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, AlertTriangle, BookOpen, Target, ChevronRight, Clock, Activity } from "lucide-react"
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

const physicsExperiments: Experiment[] = [
  {
    id: "light-reflection-refraction",
    title: "Light Reflection & Refraction",
    description: "Study the laws of reflection and refraction using mirrors, lenses, and optical instruments.",
    duration: "50 minutes",
    difficulty: "Medium",
    materials: ["Concave mirror", "Convex lens", "Ray box", "Screen", "Measuring scale", "Protractor"],
    procedure: [
      "Set up ray box to produce parallel light rays",
      "Study reflection from concave mirror at different object distances",
      "Measure focal length of concave mirror using distant object method",
      "Observe refraction through convex lens",
      "Find focal length of lens using lens formula"
    ],
    questions: 15,
    objectives: ["Verify laws of reflection", "Understand image formation", "Calculate focal lengths"]
  },
  {
    id: "electric-circuits",
    title: "Electric Circuits & Current",
    description: "Build circuits to study current, voltage, and resistance relationships following Ohm's law.",
    duration: "45 minutes",
    difficulty: "Medium",
    materials: ["Battery", "Resistors", "Ammeter", "Voltmeter", "Connecting wires", "Switch"],
    procedure: [
      "Connect simple circuit with battery, resistor, and ammeter",
      "Measure current for different resistance values",
      "Connect voltmeter in parallel to measure voltage",
      "Plot V-I graph to verify Ohm's law",
      "Study series and parallel combinations of resistors"
    ],
    questions: 12,
    objectives: ["Verify Ohm's law", "Understand circuit connections", "Calculate equivalent resistance"]
  },
  {
    id: "magnetic-effects",
    title: "Magnetic Effects of Electric Current",
    description: "Demonstrate electromagnetic induction and study magnetic field patterns around current-carrying conductors.",
    duration: "40 minutes",
    difficulty: "Easy",
    materials: ["Bar magnet", "Coil of wire", "Galvanometer", "Iron filings", "Compass needle", "Battery"],
    procedure: [
      "Map magnetic field lines around bar magnet using iron filings",
      "Study magnetic field around current-carrying straight conductor",
      "Observe magnetic field pattern around circular coil",
      "Demonstrate electromagnetic induction using moving magnet and coil",
      "Record galvanometer deflections"
    ],
    questions: 10,
    objectives: ["Visualize magnetic fields", "Understand electromagnetic induction", "Study current-carrying conductors"]
  },
  {
    id: "ohms-law-verification",
    title: "Ohm's Law Verification",
    description: "Experimentally verify Ohm's law by plotting voltage vs current graphs for different resistors.",
    duration: "55 minutes",
    difficulty: "Hard",
    materials: ["Variable voltage source", "Standard resistors", "Digital ammeter", "Digital voltmeter", "Graph paper"],
    procedure: [
      "Set up circuit with variable voltage source and known resistor",
      "Vary voltage in steps and record corresponding current values",
      "Repeat experiment with different resistance values",
      "Plot V vs I graphs for each resistor",
      "Calculate resistance from slope and compare with actual values"
    ],
    questions: 16,
    objectives: ["Verify Ohm's law experimentally", "Plot and analyze V-I graphs", "Calculate experimental errors"]
  },
  {
    id: "energy-conservation",
    title: "Energy Conservation Principles",
    description: "Study conservation of mechanical energy using pendulum and inclined plane experiments.",
    duration: "60 minutes",
    difficulty: "Medium",
    materials: ["Simple pendulum", "Inclined plane", "Spherical ball", "Measuring tape", "Stopwatch", "Spring balance"],
    procedure: [
      "Measure period of simple pendulum for different lengths",
      "Calculate potential and kinetic energy at different positions",
      "Study motion of ball on inclined plane",
      "Measure time for different angles and distances",
      "Verify conservation of mechanical energy"
    ],
    questions: 13,
    objectives: ["Understand energy conservation", "Calculate kinetic and potential energy", "Study periodic motion"]
  }
]

const safetyGuidelines = [
  "Handle electrical equipment with dry hands only",
  "Never exceed the maximum voltage or current ratings of components",
  "Always switch off power before making circuit connections",
  "Use safety goggles when working with light sources or lasers",
  "Handle optical instruments and mirrors carefully to avoid breakage",
  "Keep magnetic materials away from electronic devices",
  "Report any equipment malfunction immediately",
  "Follow proper grounding procedures for electrical experiments"
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
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
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
                  <Target className="w-3 h-3 mr-2 mt-0.5 text-purple-500" />
                  {objective}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Key Equipment:</h4>
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
          <Link href={`/questions/10/physics-labs?experiment=${experiment.id}`}>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <span>Start Experiment & Questions</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PhysicsLabsPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Physics Laboratory</h1>
              <p className="text-gray-600">Class 10 ICSE - Practical experiments in physical sciences</p>
            </div>
          </div>
        </div>

        {/* Safety Guidelines */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-amber-800">
              <AlertTriangle className="w-5 h-5" />
              <span>Electrical & Optical Safety</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {safetyGuidelines.map((guideline, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-amber-800">{guideline}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Experiments Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Laboratory Experiments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {physicsExperiments.map((experiment) => (
              <ExperimentCard key={experiment.id} experiment={experiment} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}