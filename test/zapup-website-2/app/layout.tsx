import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from '@clerk/nextjs'
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext'
import { ClientBodyWrapper } from '@/components/ClientBodyWrapper'

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })

export const metadata: Metadata = {
  title: "ZapUp - Empowering Digital Innovation",
  description:
    "ZapUp is a dynamic technology platform dedicated to empowering digital innovation through accessible solutions.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <ClientBodyWrapper baseClassName={inter.className}>
          <ClerkProvider>
            <UserPreferencesProvider>
              <ThemeProvider 
                attribute="class" 
                defaultTheme="system" 
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </UserPreferencesProvider>
          </ClerkProvider>
        </ClientBodyWrapper>
      </body>
    </html>
  )
}
