'use client'

import { useState } from 'react'
import Image from "next/image"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CopyrightYear } from "../components/CopyrightYear"
import { MobileMenuButton } from "../components/MobileMenuButton"
import { ClassSelectionModal } from "../components/ClassSelectionModal"
import { UserInfo } from "../components/UserInfo"
import { 
  BookOpen, 
  Users, 
  Award, 
  Target, 
  CheckCircle, 
  Star, 
  TrendingUp,
  Brain,
  Lightbulb,
  Shield,
  Zap,
  PlayCircle,
  ArrowRight,
  Quote,
  GraduationCap,
  Trophy,
  Clock,
  Globe
} from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [showClassSelection, setShowClassSelection] = useState(false)

  const handleClassSelect = (classId: string) => {
    router.push(`/preview/${classId}`)
  }

  const handlePreviewClick = () => {
    setShowClassSelection(true)
  }

  const handleSubjectClick = (subjectName: string) => {
    // Redirect to classes page to choose learning path
    router.push('/classes')
  }

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Curriculum Aligned",
      description: "Perfectly aligned with NCERT and state board textbooks for seamless learning"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Learning",
      description: "Adaptive learning system that personalizes your study experience"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Teachers",
      description: "Learn from India's best educators with years of teaching experience"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Proven Results",
      description: "98% of our students show improved grades within 3 months"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Access",
      description: "Study anytime, anywhere with our mobile-friendly platform"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safe & Secure",
      description: "Child-safe environment with parental controls and monitoring"
    }
  ]



  const testimonials = [
    {
      text: "ZapUp has completely transformed my daughter's learning experience. Her math grades improved from C to A+ in just 4 months!",
      author: "Mrs. Priya Sharma",
      role: "Parent of Class 9 student",
      rating: 5
    },
    {
      text: "The interactive lessons and personalized practice tests helped me crack my board exams with 95% marks. Highly recommended!",
      author: "Arjun Kumar",
      role: "Class 12 Graduate",
      rating: 5
    },
    {
      text: "As a working parent, ZapUp's flexible learning schedule is perfect. My son can study at his own pace while I monitor his progress.",
      author: "Dr. Rajesh Patel",
      role: "Parent of Class 7 student",
      rating: 5
    }
  ]

  const subjects = [
    {
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      title: "Mathematics",
      description: "From basic arithmetic to advanced calculus, master every mathematical concept with step-by-step solutions and interactive practice.",
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    {
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      title: "Science",
      description: "Explore Physics, Chemistry, and Biology with interactive experiments, 3D simulations, and real-world applications.",
      color: "bg-green-50 border-green-200 text-green-800"
    },
    {
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 16V8a2 2 0 00-1-1.73L14 2a2 2 0 00-2 0L6 4.27A2 2 0 005 6v10a2 2 0 001 1.73L12 22a2 2 0 002 0l6-4.27A2 2 0 0021 16z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      title: "Social Studies",
      description: "Journey through History, Geography, and Civics with interactive maps, timelines, and engaging storytelling.",
      color: "bg-purple-50 border-purple-200 text-purple-800"
    },
    {
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.5 2H20v20H6.5a2.5 2.5 0 010-5H20" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      title: "English",
      description: "Enhance language skills, literature comprehension, and creative writing with personalized feedback and grammar assistance.",
      color: "bg-orange-50 border-orange-200 text-orange-800"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white py-4 px-6 md:px-12 flex items-center justify-between border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M20 5L5 20L20 35L35 20L20 5Z" stroke="#3B82F6" strokeWidth="2" fill="white" />
                <path d="M20 12L12 20L20 28L28 20L20 12Z" fill="#3B82F6" />
                <path d="M20 16V24M16 20H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-gray-800 font-bold tracking-wide text-xl">ZapUp</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            About
          </Link>
          <Link href="#subjects" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Subjects
          </Link>
          <Link href="#learning" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Learning
          </Link>
          <Link href="/classes" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Classes
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Contact
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Pricing
          </Link>
          <div className="flex items-center space-x-3">
            <UserInfo />
          </div>
        </nav>
        <MobileMenuButton />
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
          <img
            src="/students-learning.png"
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
          />
          <div className="absolute inset-0 hero-overlay-dark z-10" />
          <div className="relative z-20 flex flex-col items-center justify-center w-full h-full text-center px-4">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 drop-shadow-lg">
              Empowering the Next<br />
              Generation of Thinkers and Achievers
            </h1>
            <div className="w-16 h-1 bg-white/70 rounded-full mx-auto mb-6" />
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow">
              A comprehensive learning platform aligned with your school textbooks<br />
              and curriculum
            </p>
          </div>
        </section>



        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose ZapUp?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the future of education with our innovative features designed to make learning engaging, effective, and enjoyable.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="text-blue-600 mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Subjects Section */}
        <section id="subjects" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Master Every Subject
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive coverage of all major subjects with interactive content, practice tests, and personalized learning paths.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {subjects.map((subject, index) => (
                <Card 
                  key={index} 
                  className={`border-2 ${subject.color} hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 transform`}
                  onClick={() => handleSubjectClick(subject.title)}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="text-current">{subject.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-3">{subject.title}</h3>
                        <p className="text-gray-700 leading-relaxed">{subject.description}</p>
                        <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
                          <span>Select Class to Start Learning</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Approach Section */}
        <section id="learning" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Our Learning Approach
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    At ZapUp, we believe that effective learning comes from a blend of structured content, 
                    interactive practice, and personalized feedback. Our approach is centered around proven educational principles.
                  </p>
                </div>
                
                <div className="space-y-6">
                  {[
                    {
                      title: "Personalized Learning Paths",
                      description: "AI-powered system adapts to your child's learning style and pace, ensuring optimal progress."
                    },
                    {
                      title: "Interactive Content",
                      description: "Engaging videos, animations, and simulations make complex concepts easy to understand."
                    },
                    {
                      title: "Regular Assessments",
                      description: "Continuous evaluation helps identify strengths and areas for improvement."
                    },
                    {
                      title: "Expert Support",
                      description: "Get help from qualified teachers whenever you need it, available 24/7."
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <Image
                  src="/students-learning-laptop.png"
                  alt="Students learning with technology"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </section>

          {/* Class Programs Section */}
          <section id="classes" className="py-16 px-6 md:px-12 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
                  Programs for Every Grade
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Choose the learning path that fits your academic journey. Each program is carefully designed 
                  to match the specific needs and challenges of different educational stages.
                </p>
              </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Middle School",
                  subtitle: "Classes 6-8",
                  description: "Build strong foundations with engaging content designed for young learners transitioning to middle school.",
                  image: "/children-learning-illustration.png",
                  href: "/preview/classes-6-8",
                  accessible: true, // Always accessible for preview
                  highlight: "Foundation Building"
                },
                {
                  title: "Secondary School",
                  subtitle: "Classes 9-10",
                  description: "Comprehensive board exam preparation with detailed explanations and practice tests.",
                  image: "/secondary-school-illustration.png",
                  href: "/preview/classes-9-10",
                  accessible: true, // Always accessible for preview
                  highlight: "Board Exam Prep"
                },
                {
                  title: "Higher Secondary",
                  subtitle: "Classes 11-12",
                  description: "Advanced concepts and competitive exam preparation for science, commerce, and humanities streams.",
                  image: "/higher-secondary-illustration.png",
                  href: "/preview/classes-11-12",
                  accessible: true, // Always accessible for preview
                  highlight: "College Prep"
                }
              ].map((program, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                  <div className="h-48 overflow-hidden">
                    {program.image ? (
                      <Image
                        src={program.image}
                        alt={program.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <GraduationCap className="w-16 h-16 text-white opacity-80" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                        {program.highlight}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                    <p className="text-gray-700 font-medium mb-3">{program.subtitle}</p>
                    <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
                      onClick={() => router.push(program.href)}
                    >
                      Explore Program
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Access to Specific Classes */}
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-light text-gray-900 mb-6">Or Browse by Class</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((className, index) => (
                  <Button
                    key={className}
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors"
                    onClick={handlePreviewClick}
                  >
                    {className}
                  </Button>
                ))}
              </div>
              <p className="text-gray-500 text-sm mt-4">Preview content available for all classes</p>
            </div>
            </div>
          </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Parents & Students Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Don't just take our word for it. Here's what our community has to say about their ZapUp experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-lg bg-white">
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                      <div className="relative">
                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-gray-200" />
                        <p className="text-gray-700 italic leading-relaxed pl-6">{testimonial.text}</p>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <p className="font-semibold text-gray-900">{testimonial.author}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>


      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8">
                  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M20 5L5 20L20 35L35 20L20 5Z" stroke="#3B82F6" strokeWidth="2" fill="white" />
                    <path d="M20 12L12 20L20 28L28 20L20 12Z" fill="#3B82F6" />
                    <path d="M20 16V24M16 20H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-xl font-bold">ZapUp</span>
              </div>
              <p className="text-gray-400">
                Empowering the next generation of thinkers and achievers through innovative education technology.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/classes" className="text-gray-400 hover:text-white transition-colors">Classes</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Subjects</h3>
              <ul className="space-y-2">
                <li><Link href="/classroom/mathematics" className="text-gray-400 hover:text-white transition-colors">Mathematics</Link></li>
                <li><Link href="/classroom/science" className="text-gray-400 hover:text-white transition-colors">Science</Link></li>
                <li><Link href="/classroom/social-studies" className="text-gray-400 hover:text-white transition-colors">Social Studies</Link></li>
                <li><Link href="/classroom/english" className="text-gray-400 hover:text-white transition-colors">English</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/cancellation-refunds" className="text-gray-400 hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; <CopyrightYear /> ZapUp Learning. All rights reserved. Made with ❤️ for Indian students.
            </p>
          </div>
        </div>
      </footer>

      {/* Class Selection Modal */}
      <ClassSelectionModal 
        open={showClassSelection}
        onOpenChange={setShowClassSelection}
        onClassSelect={handleClassSelect}
      />
    </div>
  )
}
