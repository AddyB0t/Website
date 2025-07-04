#!/bin/bash

# Setup script for ZapUp website environment variables
echo "Setting up environment variables..."

# Create .env.local file with Supabase configuration
cat > .env.local << EOF
# Supabase Configuration (replace with your actual values)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Clerk Configuration (replace with your actual keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
EOF

echo "Environment file created successfully!"
echo "Please update the Supabase and Clerk keys in .env.local with your actual values."
echo ""
echo "To get your Supabase keys:"
echo "1. Go to https://supabase.com/dashboard"
echo "2. Select your project"
echo "3. Go to Settings > API"
echo "4. Copy the Project URL and anon/service_role keys"
echo ""
echo "To get your Clerk keys:"
echo "1. Go to https://clerk.com/dashboard"
echo "2. Select your application"
echo "3. Go to API Keys section"
echo "4. Copy the keys and paste them in .env.local"
echo ""
echo "Then restart your development server with: npm run dev" 