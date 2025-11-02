# Test the Image Upload Feature

## Step 1: Check if Dev Server is Running

Make sure your Next.js dev server is running:
```bash
cd /mnt/data/Website/zapup-website-2
npm run dev
```

Server should be at: `http://localhost:3000`

## Step 2: Navigate to Question #36966

1. Go to: `http://localhost:3000/questions/9/mathematics?board=CBSE`
2. Look for the chapter with circles/arcs questions
3. Find Question: "Find ZBOC if arc AXB is equal to arc BYC."

## Step 3: Verify Image Upload Section Appears

You should see:
```
┌─────────────────────────────────────┐
│ 📷 Question Image                   │
│ ┌─────────────────────────────────┐ │
│ │   [Your Uploaded Screenshot]    │ │
│ │       (if exists)               │ │
│ └─────────────────────────────────┘ │
│ [Replace Image]          [X]        │
└─────────────────────────────────────┘
     OR
┌─────────────────────────────────────┐
│ 📷 Question Image                   │
│                                     │
│    [Upload Question Image]          │
│  Add an image if the question...    │
└─────────────────────────────────────┘
```

## Step 4: Test the API Directly

Open browser console (F12) and run:

```javascript
// Test 1: Check if API endpoint exists
fetch('/api/question-images/36966')
  .then(r => {
    console.log('Status:', r.status);
    return r.json();
  })
  .then(data => {
    console.log('Response:', data);
    if (data.image) {
      console.log('✅ Image found!');
      console.log('Image URL:', data.image.image_url);
      console.log('Source:', data.source);
    } else {
      console.log('ℹ️ No image linked to this question');
    }
  })
  .catch(err => console.error('❌ Error:', err));
```

Expected result if image exists:
```json
{
  "image": {
    "id": "fa227f05-cfa7-4cdb-801d-a895ea273e35",
    "image_url": "https://dvftucyedgalwglihhxm.supabase.co/storage/v1/object/public/...",
    "question_id": 36966,
    "user_id": "user_...",
    "is_community": false
  },
  "source": "user",
  "message": "Your uploaded image"
}
```

## Step 5: Test Image Upload

1. Click "Upload Question Image" button
2. Select an image file (max 5MB)
3. Wait for upload to complete
4. You should see:
   - "Image uploaded successfully!" alert
   - Image preview appears
   - Badge shows "Your Image"
   - "Replace Image" and "X" buttons appear

## Step 6: Check Browser Console for Errors

Look for any errors in the console:
- ❌ Red errors mean something is wrong
- ⚠️ Yellow warnings are usually OK
- ✅ Green/blue logs are good

Common errors to look for:
- `Failed to fetch` - Network/CORS issue
- `Unauthorized` - Authentication issue
- `404` - API endpoint not found
- `500` - Server error

## Step 7: Verify in My Images

1. Go to "My Images" page
2. Look for your uploaded image
3. Should show badge: "Linked to Question #36966"
4. Should show badge: "Your Image" (if not community)

## Debugging Commands

If something isn't working, run these in the project directory:

```bash
# Check if migration was run
cd /mnt/data/Website/zapup-website-2
node scripts/check-image-link.js

# Check all images
node scripts/check-all-images.js

# Restart dev server
pkill -f "next dev"
npm run dev
```

## Known Issues

### Issue: `Error: [object Event]`
**Cause**: Unhandled promise rejection or event handler error
**Fix**: ✅ Added better error handling in the code

### Issue: Image not showing
**Causes**:
1. Wrong question ID (must be #36966)
2. Browser cache (hard refresh: Ctrl+Shift+R)
3. Not logged in
4. API endpoint returning error

**Fix**: Check browser console and follow troubleshooting steps above

### Issue: Upload button not appearing
**Cause**: Component not rendered or hidden
**Fix**: Check if you're on the correct page and logged in

## Success Checklist

- [ ] Dev server running at localhost:3000
- [ ] Logged in to the application
- [ ] Navigated to Class 9 Mathematics
- [ ] Found Question #36966
- [ ] "Question Image" section visible
- [ ] Can upload an image
- [ ] Image preview shows after upload
- [ ] Image appears in "My Images" with link badge
- [ ] Can replace or remove the image
- [ ] Generate Answer button still works

## Additional Testing

### Test Community Images
1. Upload an image on one account
2. Mark it as community (using API):
```javascript
fetch('/api/community-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageId: 'YOUR_IMAGE_ID',
    questionId: 36966
  })
}).then(r => r.json()).then(console.log);
```
3. Log in with another account
4. Navigate to the same question
5. Should see "Community" badge

### Test Replace Functionality
1. Upload an image for a question
2. Upload another image for the same question
3. Old image should be unlinked (not deleted)
4. New image should appear
5. Old image still in "My Images" but without link badge

---

**Status**: Feature is implemented and working. Follow these steps to verify and test!
