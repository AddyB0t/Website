import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileMenuButton } from "@/components/MobileMenuButton";

export default function AboutPage() {
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
          <Link href="about" className="text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light">
            About
          </Link>
          <Link
            href="/#subjects"
            className="text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light"
          >
            Subjects
          </Link>
          <Link
            href="/#learning"
            className="text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light"
          >
            Learning
          </Link>
          <Link
            href="/classes"
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
        <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image src="/images/pattern.png" alt="Background pattern" fill className="object-cover" />
          </div>
          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-6 tracking-wide">About ZapUp</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-8"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Empowering Indian students with accessible, quality education through innovative learning experiences
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a4.5 4.5 0 105.386 5.386M6.75 15a4.5 4.5 0 015.386-5.386m0 0a4.5 4.5 0 105.386 5.386M6.75 15a4.5 4.5 0 015.386-5.386m0 0a4.5 4.5 0 105.386 5.386" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-medium text-gray-800">Our Mission</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    To democratize quality education by providing comprehensive, curriculum-aligned learning resources 
                    that empower every Indian student to achieve academic excellence and unlock their full potential.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-medium text-gray-800">Our Vision</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    To become India's most trusted educational platform, fostering a generation of critical thinkers, 
                    problem solvers, and lifelong learners who are prepared for the challenges of tomorrow.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-medium text-gray-800 mb-6">Why Choose ZapUp?</h3>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#3B82F6" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Curriculum Aligned</h4>
                        <p className="text-gray-600 text-sm">Perfectly aligned with NCERT and state board curricula</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#3B82F6" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Expert Content</h4>
                        <p className="text-gray-600 text-sm">Created by experienced educators and subject matter experts</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#3B82F6" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Interactive Learning</h4>
                        <p className="text-gray-600 text-sm">Engaging videos, animations, and practice exercises</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#3B82F6" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Personalized Progress</h4>
                        <p className="text-gray-600 text-sm">Adaptive learning paths tailored to individual needs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Removed the three colored statistic circles section as requested */}

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-medium text-gray-800 mb-6">Our Story</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    ZapUp was born from a simple yet powerful vision: to bridge the gap between classroom learning 
                    and self-study. Founded by a team of experienced educators and technology experts, we recognized 
                    the challenges that Indian students face in accessing quality educational resources.
                  </p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Our journey began with a deep understanding of the Indian education system and the unique needs 
                    of students from Class 6 to Class 12. We combined traditional pedagogical approaches with modern 
                    educational technology to create a learning experience that is both effective and engaging.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Today, ZapUp serves thousands of students across India, helping them achieve academic excellence 
                    and develop the skills they need for future success. Our commitment to quality education remains 
                    unwavering as we continue to innovate and expand our offerings.
                  </p>
                </div>
                <div className="relative h-80 rounded-xl overflow-hidden">
                  <Image
                    src="/children-learning-illustration.png"
                    alt="Students learning together"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 