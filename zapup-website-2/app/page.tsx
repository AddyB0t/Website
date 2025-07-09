import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CopyrightYear } from "../components/CopyrightYear"
import { MobileMenuButton } from "../components/MobileMenuButton"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white py-4 px-6 md:px-12 flex items-center justify-between border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M20 5L5 20L20 35L35 20L20 5Z" stroke="#333" strokeWidth="2" fill="white" />
                <path d="M20 12L12 20L20 28L28 20L20 12Z" fill="#333" />
                <path d="M20 16V24M16 20H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-gray-800 font-light tracking-widest uppercase text-lg">ZapUp</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#about" className="text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light">
            About
          </Link>
          <Link
            href="#subjects"
            className="text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light"
          >
            Subjects
          </Link>
          <Link
            href="#learning"
            className="text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light"
          >
            Learning
          </Link>
          <Link
            href="#classes"
            className="text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light"
          >
            Classes
          </Link>
          <Link
            href="/contact"
            className="text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light"
          >
            Contact
          </Link>
          <Link
            href="/pricing"
            className="text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light"
          >
            Pricing
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-blue-800 hover:bg-blue-50 uppercase text-xs tracking-wider">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                variant="outline"
                className="text-blue-800 border-blue-300 hover:bg-blue-50 uppercase text-xs tracking-wider"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </nav>
        <MobileMenuButton />
      </header>

      <main className="flex-grow">
        <section className="relative h-[90vh] bg-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="/students-learning.png"
              alt="Students engaged in various learning activities"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40">
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-wide leading-tight">
              Empowering the Next Generation of Thinkers and Achievers
            </h1>
            <div className="w-20 h-1 bg-white mb-8"></div>
            <p className="text-xl text-white/90 mb-10 font-light max-w-2xl">
              A comprehensive learning platform aligned with your school textbooks and curriculum
            </p>
          </div>
        </section>

        <section id="about" className="py-24 bg-white relative">
          <div className="absolute inset-0 opacity-5">
            <Image src="/images/pattern.png" alt="Background pattern" fill className="object-cover" />
          </div>
          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-light text-gray-800 mb-6 tracking-wide text-center">About ZapUp</h2>
              <div className="h-0.5 w-16 bg-blue-600 mx-auto mb-12"></div>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                ZapUp is a dedicated learning platform designed specifically for Indian students from Class 6 to Class
                12. We provide comprehensive study materials, practice questions, and interactive learning experiences
                that align perfectly with your school textbooks.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our approach combines traditional learning methods with modern educational technology, making complex
                concepts easier to understand and remember. We believe that every student deserves access to quality
                education resources that complement their classroom learning.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded by experienced educators and education technology experts, ZapUp aims to bridge the gap between
                classroom teaching and self-study, helping students excel in their academic journey from middle school
                through higher secondary education.
              </p>
            </div>
          </div>
        </section>

        <section id="subjects" className="py-24 bg-gray-50 relative">
          <div className="absolute inset-0 opacity-5">
            <Image src="/placeholder.svg" alt="Education pattern" fill className="object-cover" />
          </div>
          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <h2 className="text-3xl font-light text-gray-800 mb-6 tracking-wide text-center">Core Subjects</h2>
            <div className="h-0.5 w-16 bg-blue-600 mx-auto mb-16"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-white p-10 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mb-6 text-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-4">Mathematics</h3>
                <p className="text-gray-600">
                  Comprehensive coverage of all mathematics topics from arithmetic to calculus, with step-by-step
                  solutions and practice problems aligned with NCERT and state board curricula.
                </p>
              </div>

              <div className="bg-white p-10 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mb-6 text-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714a2.25 2.25 0 0 1-.659 1.591L9.5 14.5m0-11.313V5.75a2.25 2.25 0 0 1-2.25 2.25h-1.5A2.25 2.25 0 0 1 3.5 5.75V4.5c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3 1.5Zm1.5 0c.251.023.501.05.75.082M10.5 3.104V5.75c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V4.5a1.875 1.875 0 0 0-1.875-1.875h-.375a3.75 3.75 0 0 0-3 1.5Zm7.5 0v5.714a2.25 2.25 0 0 0 .659 1.591L22.5 14.5M18 3.104c.251.023.501.05.75.082M18 3.104V5.75a2.25 2.25 0 0 0 2.25 2.25h1.5A2.25 2.25 0 0 0 24 5.75V4.5c0-1.036-.84-1.875-1.875-1.875h-.375a3.75 3.75 0 0 0-3 1.5Z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-4">Science</h3>
                <p className="text-gray-600">
                  Engaging content covering Physics, Chemistry, and Biology with interactive simulations, diagrams, and
                  experiments that make scientific concepts clear and memorable.
                </p>
              </div>

              <div className="bg-white p-10 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mb-6 text-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-4">Social Studies</h3>
                <p className="text-gray-600">
                  Comprehensive coverage of History, Geography, Civics, and Economics with maps, timelines, and case
                  studies that bring social sciences to life for students of all ages.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="learning" className="relative py-24 bg-white">
          <div className="absolute inset-0 opacity-5">
            <Image src="/placeholder.svg" alt="Learning pattern" fill className="object-cover" />
          </div>
          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-light text-gray-800 mb-6 tracking-wide">Our Learning Approach</h2>
                <div className="h-0.5 w-16 bg-blue-600 mb-8"></div>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  At ZapUp, we believe that effective learning comes from a blend of structured content, interactive
                  practice, and personalized feedback. Our approach is centered around three core principles:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-4 text-gray-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Curriculum Alignment</h3>
                      <p className="text-gray-600">
                        Our content is perfectly aligned with NCERT and state board textbooks, ensuring that what you
                        learn with us directly supports your school curriculum.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 text-gray-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Interactive Learning</h3>
                      <p className="text-gray-600">
                        We use videos, animations, questions, and interactive exercises to make learning engaging and
                        effective, catering to different learning styles.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 text-gray-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Personalized Progress</h3>
                      <p className="text-gray-600">
                        Our adaptive learning system identifies your strengths and areas for improvement, creating a
                        personalized learning path that evolves as you progress.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="relative h-[400px] md:h-[500px]">
                <Image
                  src="/students-learning-laptop.png"
                  alt="Students collaborating on digital learning"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="classes" className="py-24 bg-gray-50 relative">
          <div className="absolute inset-0 opacity-5">
            <Image src="/placeholder.svg" alt="Education pattern" fill className="object-cover" />
          </div>
          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <h2 className="text-3xl font-light text-gray-800 mb-6 tracking-wide text-center">
              Class-Specific Programs
            </h2>
            <div className="h-0.5 w-16 bg-blue-600 mx-auto mb-16"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white overflow-hidden group">
                <div className="relative h-64">
                  <Image
                    src="/children-learning-illustration.png"
                    alt="Middle school program"
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-medium text-gray-800 mb-4">Middle School (Classes 6-8)</h3>
                  <p className="text-gray-600 mb-6">
                    Build a strong foundation in core subjects with our engaging content designed specifically for
                    students transitioning from primary to middle school education.
                  </p>
                  <Link href="/classroom/class-6" className="text-blue-800 font-medium hover:underline inline-flex items-center">
                    Explore Classes 6-8
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 ml-2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="bg-white overflow-hidden group">
                <div className="relative h-64">
                  <Image
                    src="/secondary-school-illustration.png"
                    alt="Secondary school program"
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-medium text-gray-800 mb-4">Secondary School (Classes 9-10)</h3>
                  <p className="text-gray-600 mb-6">
                    Comprehensive preparation for board examinations with detailed explanations, practice tests, and
                    exam strategies aligned with CBSE, ICSE, and state board requirements.
                  </p>
                  <Link href="/classroom/class-9" className="text-blue-800 font-medium hover:underline inline-flex items-center">
                    Explore Classes 9-10
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 ml-2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="bg-white overflow-hidden group">
                <div className="relative h-64">
                  <Image
                    src="/higher-secondary-illustration.png"
                    alt="Higher secondary program"
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-medium text-gray-800 mb-4">Higher Secondary (Classes 11-12)</h3>
                  <p className="text-gray-600 mb-6">
                    In-depth coverage of specialized subjects with advanced concepts, solved examples, and preparation
                    materials for board exams and competitive entrance tests.
                  </p>
                  <Link href="/classroom/class-11" className="text-blue-800 font-medium hover:underline inline-flex items-center">
                    Explore Classes 11-12
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 ml-2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="bg-white overflow-hidden group">
                <div className="relative h-64">
                  <Image
                    src="/exam-preparation-illustration.png"
                    alt="Exam preparation"
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-medium text-gray-800 mb-4">Exam Preparation</h3>
                  <p className="text-gray-600 mb-6">
                    Specialized modules for competitive exams like JEE, NEET, and Olympiads with mock tests, previous
                    years' papers, and personalized performance analysis.
                  </p>
                  <Link href="#" className="text-blue-800 font-medium hover:underline inline-flex items-center">
                    Explore Exam Prep
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 ml-2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-24 bg-white relative">
          <div className="absolute inset-0 opacity-5">
            <Image src="/placeholder.svg" alt="Connection pattern" fill className="object-cover" />
          </div>
          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-light text-gray-800 mb-6 tracking-wide">Start Learning Today</h2>
              <div className="h-0.5 w-16 bg-blue-600 mx-auto mb-8"></div>
              <p className="text-lg text-gray-600 mb-12">
                Join thousands of students across India who are achieving academic excellence with ZapUp. Sign up today
                to access our comprehensive learning resources.
              </p>
              <Link href="/sign-up">
                <Button className="bg-blue-700 text-white hover:bg-blue-800 px-8 py-6 text-sm uppercase tracking-wider font-light">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-12 relative">
        <div className="absolute inset-0 opacity-5">
          <Image src="/subtle-grid-pattern.png" alt="Footer pattern" fill className="object-cover" />
        </div>
        <div className="container mx-auto px-4 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 mr-2">
                  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M20 5L5 20L20 35L35 20L20 5Z" stroke="#333" strokeWidth="2" fill="white" />
                    <path d="M20 12L12 20L20 28L28 20L20 12Z" fill="#333" />
                    <path d="M20 16V24M16 20H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-gray-800 font-light tracking-widest uppercase text-sm">ZapUp</span>
              </div>
              <p className="text-gray-600 text-sm">Empowering Indian students with accessible, quality education.</p>
            </div>

            <div>
              <h3 className="text-gray-800 font-medium mb-4 uppercase text-sm tracking-wider">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#about" className="text-gray-600 hover:text-blue-800 text-sm">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#subjects" className="text-gray-600 hover:text-blue-800 text-sm">
                    Subjects
                  </Link>
                </li>
                <li>
                  <Link href="#learning" className="text-gray-600 hover:text-blue-800 text-sm">
                    Learning
                  </Link>
                </li>
                <li>
                  <Link href="#classes" className="text-gray-600 hover:text-blue-800 text-sm">
                    Classes
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-blue-800 text-sm">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-gray-800 font-medium mb-4 uppercase text-sm tracking-wider">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-800 text-sm">
                    Study Materials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-800 text-sm">
                    Practice Tests
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-800 text-sm">
                    Video Lessons
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-blue-800 text-sm">
                    Academic Calendar
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-gray-800 font-medium mb-4 uppercase text-sm tracking-wider">Contact</h3>
              <address className="not-italic text-gray-600 text-sm">
                <p>123 Innovation Hub</p>
                <p>Sector 18, Gurugram</p>
                <p>Haryana 122015</p>
                <p className="mt-2">support@zapup.org</p>
                <p>+91 9876543210</p>
              </address>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-600 text-sm">&copy; <CopyrightYear /> ZapUp Learning. All rights reserved.</p>
              
              <div className="flex flex-wrap justify-center space-x-6">
                <Link href="/privacy-policy" className="text-gray-600 hover:text-blue-800 text-sm">
                  Privacy Policy
                </Link>
                <Link href="/terms-and-conditions" className="text-gray-600 hover:text-blue-800 text-sm">
                  Terms & Conditions
                </Link>
                <Link href="/cancellation-refunds" className="text-gray-600 hover:text-blue-800 text-sm">
                  Cancellation & Refunds
                </Link>
                <Link href="/contact" className="text-gray-600 hover:text-blue-800 text-sm">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
