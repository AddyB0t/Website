"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M20 5L5 20L20 35L35 20L20 5Z" stroke="#333" strokeWidth="2" fill="white" />
                  <path d="M20 12L12 20L20 28L28 20L20 12Z" fill="#333" />
                  <path d="M20 16V24M16 20H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-gray-800 font-light tracking-widest uppercase text-lg">ZapUp Admin</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <nav className="w-64 border-r border-gray-200 bg-white">
          <div className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">Management</p>
            <ul className="space-y-1">
              <li>
                <Link 
                  href="/admin/dashboard" 
                  className={`flex items-center px-3 py-2 text-sm rounded-md ${
                    isActive('/admin/dashboard') 
                      ? 'bg-gray-100 text-gray-900 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/questions" 
                  className={`flex items-center px-3 py-2 text-sm rounded-md ${
                    isActive('/admin/questions') 
                      ? 'bg-gray-100 text-gray-900 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  Question Bank
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="flex-1 bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 