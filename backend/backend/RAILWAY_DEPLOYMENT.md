# Railway Deployment Guide

## Prerequisites
- Railway account (https://railway.app)
- GitHub repository with your code

## Environment Variables Required

Set these environment variables in Railway dashboard:

### Required Variables:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Optional Variables:
```
CORS_ORIGIN=your_frontend_domain
```

## Deployment Steps

1. **Connect Repository**:
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Set Root Directory**:
   - In Railway project settings
   - Set "Root Directory" to `backend` (since your files are in the backend folder)

3. **Configure Environment Variables**:
   - Go to Variables tab in Railway
   - Add all required environment variables listed above

4. **Deploy**:
   - Railway will automatically detect Node.js and deploy
   - Check logs for any errors

## Troubleshooting

### Common Issues:

1. **Port Binding Error**:
   - Railway automatically sets PORT environment variable
   - Our code uses `process.env.PORT || 5000`

2. **CORS Issues**:
   - Add your frontend domain to CORS_ORIGIN
   - Railway domains (*.railway.app) are already allowed

3. **Database Connection**:
   - Ensure MONGODB_URI is correctly set
   - Check MongoDB Atlas network access allows Railway IPs

4. **Build Failures**:
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json

## Testing Deployment

After deployment, test these endpoints:
- `GET /` - Root endpoint (should return API info)
- `GET /health` - Health check
- `POST /contact` - Contact form
- `GET /blogs` - Blog posts

## Files Added/Modified for Railway:

- ✅ `railway.json` - Railway configuration
- ✅ `Procfile` - Process file (backup)
- ✅ Updated `index.js` - Fixed server startup logic
- ✅ Updated `package.json` - Added engine specifications
- ✅ Updated CORS - Added Railway domain patterns

## Railway-Specific Features Used:

- Health check endpoint at `/`
- Proper port binding with `0.0.0.0`
- Environment-aware server startup
- Railway domain CORS support
