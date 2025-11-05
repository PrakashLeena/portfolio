# Vercel Backend Deployment Guide

## ⚠️ Important Notes

Vercel serverless functions have limitations:
- **File uploads are temporary** - Files saved to `/tmp` are deleted after function execution
- **10-second timeout** for serverless functions
- **Better for APIs without file storage**

For production with file uploads, consider **Railway** or **Render** instead.

## Deployment Steps

### 1. Deploy to Vercel

From the `backend` directory:

```bash
cd backend
vercel
```

Or connect your GitHub repository to Vercel dashboard.

### 2. Configure Environment Variables

In Vercel dashboard, add these environment variables:

```
MONGODB_URI=your_mongodb_atlas_connection_string
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
NODE_ENV=production
```

### 3. Set Root Directory

In Vercel project settings:
- **Root Directory**: `backend`
- **Build Command**: (leave empty)
- **Output Directory**: (leave empty)
- **Install Command**: `cd backend && npm install`

### 4. Update Frontend API URL

Update `frontend/src/config/api.js`:

```javascript
production: {
  baseURL: 'https://your-backend-name.vercel.app'
}
```

## Troubleshooting

### 500 Internal Server Error

1. Check Vercel function logs in dashboard
2. Ensure all environment variables are set
3. Verify MongoDB connection string is correct
4. Check that `vercel.json` is in the `backend` directory

### CORS Errors

Ensure your frontend domain is added to the CORS allowed origins in `backend/index.js`.

### File Upload Issues

File uploads will work but files are **temporary** in `/tmp`. For permanent storage:
- Use **Cloudinary** for images
- Use **AWS S3** for files
- Or deploy to **Railway** instead

## Alternative: Deploy to Railway (Recommended)

Railway is better suited for backends with file uploads and databases:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway up
```

Railway advantages:
- ✅ Persistent file storage
- ✅ Better MongoDB connection handling
- ✅ No timeout limits
- ✅ Optimized for backend APIs
