# ZapUp Classroom - Setup Guide

## System Requirements

### Node.js and Package Manager
- Node.js version 18.0 or higher
- npm (comes with Node.js) or yarn or pnpm

### Environment Dependencies
- Clerk account and application (for authentication)
- Supabase account and project (for database)
- OpenAI API key (for AI-generated answers)
- Razorpay account and API keys (for payment processing)

## Installation Steps

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd zapup-website-2
```

### 2. Install Dependencies
Choose one of the following package managers:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm (recommended - project has pnpm-lock.yaml)
pnpm install
```

### 3. Environment Configuration
Create a `.env.local` file in the project root with the following variables:

```env
# Clerk Authentication (Get from https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key-here
CLERK_SECRET_KEY=sk_test_your-secret-key-here

# Clerk URLs (optional - customize sign-in/up pages)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/classroom
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase Configuration (Get from https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI Configuration (Get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=your-openai-api-key

# Razorpay Configuration (Get from https://razorpay.com)
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here

# Optional: Node Environment
NODE_ENV=development
```

### 4. Authentication Setup (Clerk)
1. Create a Clerk account at https://clerk.com
2. Create a new application
3. Copy the Publishable Key and Secret Key to your `.env.local` file
4. Configure sign-in/sign-up methods in Clerk Dashboard (email, social, etc.)
5. Set up redirect URLs in Clerk Dashboard:
   - Add your domain: `complete-satyr-29.clerk.accounts.dev`
   - Configure allowed redirect URLs for your application

### 5. Database Setup (Supabase)
1. Create a Supabase project at https://supabase.com
2. Go to your Supabase dashboard
3. Navigate to SQL Editor
4. Run the `schema-fixed.sql` file contents to create the database structure

### 6. Payment Setup (Razorpay)
1. Create a Razorpay account at https://razorpay.com
2. Complete business verification (required for live payments)
3. Go to Settings → API Keys and generate test keys
4. Copy the Key ID and Key Secret to your `.env.local` file
5. For detailed setup instructions, see `RAZORPAY_SETUP.md`

### 7. Launch the Application

For development:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

For production build:
```bash
npm run build && npm start
# or
yarn build && yarn start
# or
pnpm build && pnpm start
```

## Project Dependencies

### Core Framework
- Next.js 15.2.4 (React framework)
- React 19 (UI library)
- TypeScript 5 (Type safety)

### UI Components
- Tailwind CSS 3.4.17 (Styling)
- Radix UI components (Accessible UI primitives)
- Lucide React (Icons)
- shadcn/ui components

### Database & API
- Clerk (Authentication)
- Supabase 2.49.5 (Backend as a Service)
- OpenAI 4.98.0 (AI integration)

### Forms & Validation
- React Hook Form 7.54.1
- Zod 3.24.1 (Schema validation)

### PDF Processing
- PDF-lib 1.17.1
- PDF-parse 1.1.1
- pdfjs-dist 2.16.105

## Access Points

- Development server: http://localhost:3000
- Main classroom: http://localhost:3000/classroom
- Admin dashboard: http://localhost:3000/admin/dashboard

## Troubleshooting

### Common Issues

1. **Node version conflicts**: Ensure Node.js 18+ is installed
2. **Canvas dependency issues**: May require system libraries on Linux:
   ```bash
   sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
   ```
3. **Environment variables**: Ensure `.env.local` is properly configured
4. **Database connection**: Verify Supabase credentials and database schema

### Port Conflicts
If port 3000 is occupied, Next.js will automatically use the next available port (3001, 3002, etc.)

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure
```
zapup-website-2/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── classroom/         # Main application pages
│   ├── admin/            # Admin interface
│   └── globals.css       # Global styles
├── components/           # Reusable UI components
├── lib/                 # Utility functions
├── public/             # Static assets
├── schema.sql          # Database schema
└── package.json        # Node.js dependencies
``` 