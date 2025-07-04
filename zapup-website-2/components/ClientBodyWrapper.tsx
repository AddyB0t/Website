'use client'

import { useEffect } from 'react'

interface ClientBodyWrapperProps {
  children: React.ReactNode
  baseClassName: string
}

export function ClientBodyWrapper({ children, baseClassName }: ClientBodyWrapperProps) {
  useEffect(() => {
    // Ensure the body has the correct base classes after hydration
    if (typeof window !== 'undefined') {
      document.body.className = baseClassName
    }
  }, [baseClassName])

  return <>{children}</>
} 