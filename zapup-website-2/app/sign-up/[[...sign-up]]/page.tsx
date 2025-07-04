// zapup-website-2/app/sign-up/[[...sign-up]]/page.tsx
// Clerk sign-up page with custom styling
// Provides user registration using Clerk's built-in components

import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignUpPage() {
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
          <Link
            href="/#about"
            className="text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light"
          >
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
            href="/#classes"
            className="text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light"
          >
            Classes
          </Link>
          <Link
            href="/#contact"
            className="text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light"
          >
            Contact
          </Link>
        </nav>
      </header>

      <main className="flex-grow bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-8 text-center">
                <h1 className="text-2xl md:text-3xl font-light text-gray-800 mb-2">Join ZapUp</h1>
                <p className="text-gray-600">Create your account and start learning</p>
              </div>

              <div className="flex justify-center">
                <SignUp 
                  routing="path"
                  path="/sign-up"
                  redirectUrl="/profile"
                  signInUrl="/sign-in"
                  afterSignInUrl="/profile"
                  afterSignUpUrl="/profile"
                  appearance={{
                    elements: {
                      formButtonPrimary: 
                        "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
                      card: "shadow-none",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden"
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-8 px-6 md:px-12 border-t border-gray-100">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 mr-3">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M20 5L5 20L20 35L35 20L20 5Z" stroke="#333" strokeWidth="2" fill="white" />
                  <path d="M20 12L12 20L20 28L28 20L20 12Z" fill="#333" />
                  <path d="M20 16V24M16 20H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-gray-800 font-light tracking-widest uppercase">ZapUp</span>
            </div>
            <div className="text-gray-600 text-sm">
              © 2024 ZapUp. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 