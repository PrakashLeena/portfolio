# 📧 Email Setup Guide - Fix 500 Error

## 🔍 **Issue Identified:**
The 500 error occurs because your Railway backend can't find email credentials to send emails from the contact form.

## 🛠️ **Fixes Applied:**
1. ✅ Updated backend to handle missing email credentials gracefully
2. ✅ Added fallback to environment variables
3. ✅ Better error handling and logging

## 🚀 **Quick Fix Options:**

### Option 1: Add Email Credentials to Railway Environment Variables (Recommended)

1. **Go to Railway Dashboard**
   - Login to [Railway.app](https://railway.app)
   - Find your portfolio backend project
   - Go to **Variables** tab

2. **Add These Environment Variables:**
   ```
   EMAIL_USER = kiboxsonleena51@gmail.com
   EMAIL_PASS = your_gmail_app_password
   ```

3. **Get Gmail App Password:**
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password (not your regular Gmail password)

4. **Redeploy Railway Backend**
   - After adding variables, redeploy your Railway service

### Option 2: Add Credentials to Database (Alternative)

If you prefer to store in database, run this script in your MongoDB:

```javascript
// Connect to your MongoDB and run:
db.BulkMail.insertOne({
  user: "kiboxsonleena51@gmail.com",
  pass: "your_gmail_app_password"
});
```

## 🧪 **Test the Fix:**

### After Setting Up Email Credentials:

1. **Test Railway Backend Health:**
   ```bash
   curl https://portfolio-backend-production-b85d.up.railway.app/health
   ```

2. **Test Contact Form:**
   - Go to your Vercel site
   - Fill out the contact form
   - Submit and check for success

3. **Check Railway Logs:**
   - In Railway dashboard, check the deployment logs
   - Look for email sending confirmations

## 📋 **Expected Results:**

### ✅ Success Messages:
- `📧 Using email credentials from environment variables`
- `📧 Email sent successfully to kiboxsonleena2004@gmail.com`
- Contact form shows "Message sent successfully!"

### ❌ If Still Failing:
- Check Gmail app password is correct
- Verify EMAIL_USER and EMAIL_PASS are set in Railway
- Check Railway deployment logs for specific errors

## 🔧 **Gmail App Password Setup:**

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Go to Google Account Settings** → Security
3. **App Passwords** → Select "Mail" → Generate
4. **Copy the 16-character password** (not your regular password)
5. **Use this in EMAIL_PASS** environment variable

## 🚨 **Security Note:**
- Never commit email passwords to Git
- Use environment variables only
- Use Gmail app passwords, not regular passwords

## 📞 **Quick Test Command:**
After setup, test with this curl command:
```bash
curl -X POST https://portfolio-backend-production-b85d.up.railway.app/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","message":"Test message from curl"}'
```

**Set up the email credentials in Railway and the contact form will work perfectly!**
