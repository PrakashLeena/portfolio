# Railway Backend Deployment Guide

## Current Issue
The Railway backend URL `https://portfolio-backend-production-b85d.up.railway.app` is returning a "Bad Gateway" error, which means the deployment is either down or the URL has changed.

## Steps to Fix Railway Backend Connection

### 1. Check Railway Dashboard
1. Go to [Railway.app](https://railway.app)
2. Login to your account
3. Find your portfolio backend project
4. Check the deployment status
5. Get the correct URL from the "Domains" section

### 2. Update Environment Variables
Once you have the correct Railway URL, update it in two places:

#### A. In Vercel Dashboard:
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Update or add `REACT_APP_API_URL` with your Railway backend URL
4. Example: `REACT_APP_API_URL=https://your-new-railway-url.up.railway.app`

#### B. In vercel.json (optional):
Update line 25 in `vercel.json`:
```json
"REACT_APP_API_URL": "https://your-new-railway-url.up.railway.app"
```

### 3. Redeploy Railway Backend (if needed)
If the Railway deployment is down:

1. In Railway dashboard, go to your project
2. Click on "Deploy" or "Redeploy"
3. Wait for deployment to complete
4. Test the new URL by visiting: `https://your-url.up.railway.app/health`

### 4. Alternative: Deploy Backend to Railway from Local
If you need to redeploy from your local machine:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to backend directory
cd backend

# Link to your Railway project
railway link

# Deploy
railway up
```

### 5. Test the Connection
After updating the URL:
1. Redeploy your Vercel frontend
2. Visit your Vercel site
3. Go to the Contact page
4. Check if the backend status shows "Connected" (green dot)

## Current Configuration Status ✅

### Fixed Issues:
- ✅ CORS configuration updated to allow all Vercel domains
- ✅ API configuration supports Railway backend
- ✅ Better error handling and timeout for API requests
- ✅ Environment variable support for dynamic URL configuration

### What You Need to Do:
1. 🔍 Find your correct Railway backend URL
2. 🔧 Update the `REACT_APP_API_URL` environment variable in Vercel
3. 🚀 Redeploy your Vercel frontend

## Testing Commands

### Test Railway Backend Directly:
```bash
# Replace with your actual Railway URL
curl https://your-railway-url.up.railway.app/health
```

### Test from Frontend:
Open browser console on your Vercel site and run:
```javascript
// This will test the API connection
fetch('/api/health').then(r => r.json()).then(console.log)
```

## Common Railway URLs Format:
- `https://projectname-production-xxxx.up.railway.app`
- `https://portfolio-backend-production-xxxx.up.railway.app`

## Need Help?
If you're still having issues:
1. Share your Railway project URL or deployment logs
2. Check if Railway deployment is active and healthy
3. Verify environment variables are set correctly in both Railway and Vercel
