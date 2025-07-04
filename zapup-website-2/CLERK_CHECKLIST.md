# Clerk Configuration Checklist

## ✅ Quick Setup Steps

### 1. Get API Keys
- [ ] Go to Clerk Dashboard → API Keys
- [ ] Copy **Publishable Key** (starts with `pk_test_`)
- [ ] Copy **Secret Key** (starts with `sk_test_`)

### 2. Configure Environment Variables
Create `.env.local` file with:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-key-here
CLERK_SECRET_KEY=sk_test_your-secret-key-here
```

### 3. Configure Redirects in Clerk Dashboard
Go to **Account Portal** → **Redirects** tab and set:

**After sign-up fallback**:
```
http://localhost:3000/
```

**After sign-in fallback**:
```
http://localhost:3000/classroom
```

**After logo click**:
```
http://localhost:3000
```

### 4. Configure Domains
Go to **Domains** section and add:
```
http://localhost:3000
```

### 5. Enable Authentication Methods
Go to **User & Authentication** → **Email, Phone, Username**:
- [x] Email address
- [x] Password
- [ ] Optional: Social logins (Google, GitHub, etc.)

### 6. Test Setup
```bash
npm run dev
```

Visit these URLs:
- http://localhost:3000/sign-in
- http://localhost:3000/sign-up
- http://localhost:3000/classroom (should redirect if not signed in)

## 🔧 Troubleshooting

If you see redirect errors:
1. Check that all URLs in Clerk Dashboard match exactly
2. Ensure no trailing slashes in URLs
3. Verify environment variables are loaded correctly
4. Check browser console for specific error messages

## 📝 Notes
- The `$DEVHOST` placeholder in Clerk will be replaced with your actual domain
- For production, replace `localhost:3000` with your production domain
- Make sure to save changes in Clerk Dashboard after configuration 