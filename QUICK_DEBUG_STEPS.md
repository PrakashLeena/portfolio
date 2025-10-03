# 🚨 QUICK DEBUG STEPS - Run These Now

## Step 1: Test Your Current Setup

### A. Open Your Vercel Site
Go to your deployed Vercel site and open the **Contact page**.

### B. Open Browser Console (F12)
Press F12 and go to the Console tab.

### C. Run This Test Command
Copy and paste this into the console:

```javascript
// Test 1: Check environment variables
console.log('Environment Check:', {
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  hostname: window.location.hostname,
  origin: window.location.origin
});

// Test 2: Test Railway backend directly
fetch('https://portfolio-backend-production-b85d.up.railway.app/health')
  .then(r => r.json())
  .then(data => console.log('✅ Railway Backend Working:', data))
  .catch(err => console.error('❌ Railway Backend Error:', err));

// Test 3: Test CORS
fetch('https://portfolio-backend-production-b85d.up.railway.app/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Test', message: 'Test message' })
})
  .then(r => r.json())
  .then(data => console.log('✅ CORS Working:', data))
  .catch(err => console.error('❌ CORS Error:', err));
```

## Step 2: Check Results

### If You See CORS Errors:
- The error will mention "blocked by CORS policy"
- **Solution**: Your Vercel domain needs to be added to Railway backend CORS

### If You See Network Errors:
- The error will mention "Failed to fetch" or "Network error"
- **Solution**: Environment variables not set correctly

### If You See 404 Errors:
- The error will show "404 Not Found"
- **Solution**: API endpoints don't exist or wrong URL

## Step 3: Quick Fixes

### Fix 1: Update Vercel Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add/Update:
   ```
   REACT_APP_API_URL = https://portfolio-backend-production-b85d.up.railway.app
   REACT_APP_ENVIRONMENT = production
   ```
3. Redeploy your site

### Fix 2: Get Your Actual Vercel Domain
1. In browser console, run: `console.log(window.location.origin)`
2. Copy the result (e.g., `https://your-project-abc123.vercel.app`)
3. Add this domain to Railway backend CORS settings

### Fix 3: Test with ConnectionDebugger
The ConnectionDebugger component is now added to your Contact page. It will show:
- ✅ Green: Connection working
- ❌ Red: Connection failed
- 🟡 Yellow: Testing in progress

## Step 4: Common Issues & Solutions

### Issue: "REACT_APP_API_URL is undefined"
**Fix**: Environment variables not set in Vercel
- Go to Vercel → Settings → Environment Variables
- Add the variables and redeploy

### Issue: "Access to fetch blocked by CORS policy"
**Fix**: Your Vercel domain not allowed in Railway backend
- Find your exact Vercel domain
- Update Railway backend CORS settings
- Redeploy Railway backend

### Issue: "Failed to fetch" or timeout
**Fix**: Railway backend might be down
- Test Railway URL directly: `https://portfolio-backend-production-b85d.up.railway.app/health`
- If it doesn't work, redeploy Railway backend

## Step 5: Immediate Actions

1. **Run the console test above** ⬆️
2. **Check the ConnectionDebugger** on your Contact page
3. **Report back what errors you see**

The most likely issue is that your actual Vercel domain is not in the Railway backend's CORS allowlist. Once we identify your exact domain, we can fix it immediately.

## Need Help?
Share the console output from Step 1, and I'll provide the exact fix!
