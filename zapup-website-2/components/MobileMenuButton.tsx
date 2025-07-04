"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

export function MobileMenuButton() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="md:hidden">
      <Button 
        variant="ghost" 
        className="text-blue-800 ml-auto"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle mobile menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </Button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-50">
          <nav className="flex flex-col p-4">
            <Link href="/#about" className="py-2 text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light">
              About
            </Link>
            <Link href="/#subjects" className="py-2 text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light">
              Subjects
            </Link>
            <Link href="/#learning" className="py-2 text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light">
              Learning
            </Link>
            <Link href="/#classes" className="py-2 text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light">
              Classes
            </Link>
            <Link href="/#contact" className="py-2 text-gray-600 hover:text-blue-800 uppercase text-sm tracking-wider font-light">
              Contact
            </Link>
            <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-gray-100">
              <Link href="/sign-in" className="py-2 text-blue-800 uppercase text-xs tracking-wider">
                Sign In
              </Link>
              <Link href="/sign-up" className="py-2 text-blue-800 uppercase text-xs tracking-wider">
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
} 