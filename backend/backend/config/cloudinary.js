const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'do7zgo52m',
  api_key: process.env.CLOUDINARY_API_KEY || '569572175847242',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'O67YFujWkfYGH-SkjYpao57EGdI'
});

console.log('☁️  Cloudinary configured:', {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key ? '***' + cloudinary.config().api_key.slice(-4) : 'Not set'
});

module.exports = cloudinary;
