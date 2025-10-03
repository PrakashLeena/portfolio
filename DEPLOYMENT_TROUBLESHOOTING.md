# Deployment Troubleshooting Guide

## Issues Fixed

### 1. ❌ **Backend Path Mismatch**
**Problem**: `vercel.json` was pointing to `/backend/index.js` but actual file is at `/backend/backend/index.js`
**Solution**: Updated `vercel.json` to use correct path

### 2. ❌ **Missing Environment Variables**
**Problem**: Environment variables not being passed to build process
**Solution**: Added environment variables to `vercel.json`

### 3. ❌ **API Route Configuration**
**Problem**: API routes not properly configured for nested backend structure
**Solution**: Updated routes to point to correct backend file

## Current Configuration

### vercel.json
```json
{
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build"
    },
    {
      "src": "backend/backend/index.js",  // ✅ Correct path
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/backend/backend/index.js" },  // ✅ Correct routing
    { "src": "/(.*)", "dest": "/frontend/build/$1" }
  ],
  "env": {
    "NODE_ENV": "production",
    "REACT_APP_API_URL": "/api",           // ✅ Correct API URL
    "REACT_APP_ENVIRONMENT": "production"
  }
}
```

### Environment Files
- `.env.example`: Development settings
- `.env.production`: Production settings (REACT_APP_API_URL=/api)

## Deployment Steps

1. **Commit all changes**:
   ```bash
   git add .
   git commit -m "Fix API configuration for Vercel deployment"
   git push
   ```

2. **Redeploy on Vercel**:
   - Go to Vercel dashboard
   - Trigger a new deployment
   - Check deployment logs for any errors

3. **Test API Connection**:
   - Open browser console on deployed site
   - Look for API configuration logs
   - Test API endpoints manually

## Debugging

### Check Browser Console
Look for these logs on the deployed site:
```
🔧 API Config: {
  environment: "production",
  baseURL: "/api",
  hostname: "your-site.vercel.app"
}
```

### Test API Endpoints
In browser console on deployed site:
```javascript
// Test health endpoint
fetch('/api/health').then(r => r.json()).then(console.log)

// Test contact endpoint
fetch('/api/contact', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({name: 'Test', message: 'Test message'})
}).then(r => r.json()).then(console.log)
```

### Common Issues

1. **404 on API calls**: Backend path incorrect in vercel.json
2. **CORS errors**: Backend CORS not configured for production domain
3. **Environment variables not working**: Not set in vercel.json or Vercel dashboard
4. **Build failures**: Missing dependencies or build script issues

## Next Steps

1. Deploy with the fixed configuration
2. Monitor deployment logs
3. Test API connectivity
4. Check browser console for any errors
5. Use the ApiTest component for comprehensive testing
