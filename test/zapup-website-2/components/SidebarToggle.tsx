// zapup-website-2/components/SidebarToggle.tsx
// Toggle button for opening/closing the sidebar
// Shows hamburger menu icon and handles click events

'use client'

import { Menu } from 'lucide-react'
import { Button } from './ui/button'

interface SidebarToggleProps {
  onClick: () => void
  className?: string
}

export function SidebarToggle({ onClick, className = '' }: SidebarToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`lg:hidden ${className}`}
      aria-label="Toggle sidebar"
    >
      <Menu className="w-5 h-5" />
    </Button>
  )
} 