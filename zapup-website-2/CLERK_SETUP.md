# Clerk Authentication Setup Guide

## Your Clerk Configuration

**Clerk Domain**: `complete-satyr-29.clerk.accounts.dev`

## Environment Variables

Add these to your `.env.local` file:

```env
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key-here
CLERK_SECRET_KEY=sk_test_your-secret-key-here

# Clerk Configuration URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/profile
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/profile
```

## Clerk Dashboard Configuration

### 1. Get Your Keys
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application: `complete-satyr-29`
3. Go to **API Keys** section
4. Copy the **Publishable Key** and **Secret Key**

### 2. Configure Allowed Origins
In your Clerk Dashboard:
1. Go to **Domains** section
2. Add your development domain: `http://localhost:3000`
3. Add your production domain when ready

### 3. Configure Redirect URLs
In **Account Portal** → **Redirects** section, configure:

**User redirects** (fallback URLs):
- **After sign-up fallback**: `http://localhost:3000/profile`
- **After sign-in fallback**: `http://localhost:3000/profile`  
- **After logo click**: `http://localhost:3000`

**Note**: Replace `http://localhost:3000` with your production domain when deploying.

In **Paths** section, also configure:
- **Sign-in URL**: `/sign-in`
- **Sign-up URL**: `/sign-up`

### 4. Enable Authentication Methods
In **User & Authentication** → **Email, Phone, Username**:
- ✅ Email address (recommended)
- ✅ Password (recommended)
- Optional: Social logins (Google, GitHub, etc.)

## Testing Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit these URLs to test:
   - Sign In: `http://localhost:3000/sign-in`
   - Sign Up: `http://localhost:3000/sign-up`
   - Protected Route: `http://localhost:3000/classroom`

## Troubleshooting

### Common Issues:

1. **"Invalid publishable key"**
   - Check that your publishable key starts with `pk_test_`
   - Ensure no extra spaces in `.env.local`

2. **Redirect loops**
   - Verify redirect URLs in Clerk Dashboard match your routes
   - Check middleware configuration

3. **"Origin not allowed"**
   - Add `http://localhost:3000` to allowed origins in Clerk Dashboard
   - For production, add your production domain

### Debug Steps:
1. Check browser console for errors
2. Verify environment variables are loaded: `console.log(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)`
3. Check Clerk Dashboard logs for authentication attempts

## Production Deployment

When deploying to production:
1. Update allowed origins in Clerk Dashboard
2. Set production environment variables
3. Update redirect URLs if domain changes
4. Test authentication flow on production domain 