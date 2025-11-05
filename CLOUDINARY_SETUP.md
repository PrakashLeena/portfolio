# Cloudinary Integration Setup

Your portfolio now uses **Cloudinary** for image and file storage instead of local storage. This is perfect for serverless deployments like Vercel and Railway.

## ✅ What's Been Done

1. **Backend Changes**:
   - Installed `cloudinary` package
   - Configured Cloudinary with your credentials
   - Updated upload endpoints to use Cloudinary
   - Images are automatically optimized (1200x800, auto quality)
   - PDFs (resumes) are stored in Cloudinary
   - Delete operations now remove files from Cloudinary

2. **Database Schema Updates**:
   - Added `imagePublicId` field to Projects
   - Added `imagePublicId` field to Certifications
   - Added `publicId` field to Resume
   - Added `publicId` field to ProfilePhoto

3. **Frontend Changes**:
   - Updated to save Cloudinary publicId with images
   - No changes needed for displaying images (URLs work the same)

## 🚀 Deployment Steps

### For Railway Backend:

1. Go to your Railway dashboard
2. Select your backend project
3. Go to **Variables** tab
4. Add these environment variables:
   ```
   CLOUDINARY_CLOUD_NAME=do7zgo52m
   CLOUDINARY_API_KEY=569572175847242
   CLOUDINARY_API_SECRET=O67YFujWkfYGH-SkjYpao57EGdI
   ```
5. Redeploy the backend

### For Vercel Backend (if using):

1. Go to Vercel dashboard
2. Select your backend project (`portfolio-5ixb`)
3. Go to **Settings** → **Environment Variables**
4. Add the same three variables above
5. Redeploy

### Local Development:

1. Navigate to `backend/backend/` folder
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. The Cloudinary credentials are already in `.env.example`
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

## 📁 Cloudinary Folder Structure

Your files will be organized in Cloudinary as:
- **Images**: `portfolio/projects/` folder
- **Resumes**: `portfolio/resumes/` folder

## 🔐 Security Note

Your Cloudinary credentials are currently hardcoded in the config file as fallback values. For production:
- Always use environment variables
- Never commit `.env` file to Git (it's already in `.gitignore`)
- The credentials in `.env.example` are just examples

## 🎨 Image Optimization

All uploaded images are automatically:
- Resized to max 1200x800 pixels
- Optimized for web (auto quality)
- Converted to efficient formats
- Cached globally via Cloudinary CDN

## 📝 Next Steps

1. **Install dependencies**: Run `npm install` in the backend folder
2. **Set environment variables** in your deployment platform (Railway/Vercel)
3. **Redeploy** your backend
4. **Test** by uploading a new project with an image

## ✨ Benefits

- ✅ No file storage issues on serverless platforms
- ✅ Automatic image optimization
- ✅ Global CDN for fast image delivery
- ✅ Easy image transformations
- ✅ Reliable file storage
- ✅ No need to manage uploads folder

## 🐛 Troubleshooting

If uploads fail:
1. Check that environment variables are set correctly
2. Verify Cloudinary credentials in your dashboard
3. Check backend logs for error messages
4. Ensure `cloudinary` package is installed (`npm install`)

Your Cloudinary Dashboard: https://console.cloudinary.com/
