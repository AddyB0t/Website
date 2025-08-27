import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/pricing(.*)',
  '/preview(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/test-db-simple(.*)',
  '/api/test-question-availability(.*)',
  '/api/ping(.*)',
  '/api/webhook(.*)',  // Allow all webhook routes (Supabase, external services)
  '/api/questions/available-subjects(.*)',  // Public API for checking available subjects
  '/api/questions/unified(.*)',  // Public API for fetching questions
  '/api/questions/stats(.*)',  // Public API for question statistics
  '/api/admin/question-availability(.*)'  // Admin API for diagnostics (temporary)
])

export default clerkMiddleware(async (auth, req) => {
  // Skip authentication for public routes
  if (isPublicRoute(req)) return NextResponse.next()
  
  // Protect all other routes
  const { userId } = await auth()
  if (!userId) {
    // Redirect to sign-in if not authenticated
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
} 