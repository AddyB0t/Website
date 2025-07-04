"use client"

export function CopyrightYear() {
  // Return the current year directly to ensure it's the same on both server and client
  return <>{new Date().getFullYear()}</>
} 