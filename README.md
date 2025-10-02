# Prakash Leena Portfolio

A full-stack portfolio website built with React frontend and Node.js backend, featuring a blog system, contact form, and admin dashboard.

## 🚀 Features

- **Responsive Design**: Modern, mobile-first design with Tailwind CSS
- **Blog System**: Create, read, update, and delete articles with MongoDB
- **Contact Form**: Email integration with Nodemailer
- **Admin Dashboard**: Secure admin panel for content management
- **Project Showcase**: Display of projects, certifications, and skills
- **Dynamic Background**: Interactive animated background

## 🛠 Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Nodemailer
- CORS

## 📁 Project Structure

```
portfolio/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── config/     # API configuration
│   │   └── ...
│   ├── public/
│   └── package.json
├── backend/            # Node.js API
│   ├── config/         # Database configuration
│   ├── scripts/        # Utility scripts
│   ├── index.js        # Main server file
│   └── package.json
├── vercel.json         # Vercel deployment config
└── package.json        # Root package.json
```

## 🔧 Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=production
```

### Frontend
```
REACT_APP_API_URL=/api
REACT_APP_ENVIRONMENT=production
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Build Settings**:
   - Framework Preset: Other
   - Build Command: `npm run vercel-build`
   - Output Directory: `frontend/build`
3. **Environment Variables**: Add your MongoDB URI and other secrets
4. **Deploy**: Vercel will automatically deploy on push to main branch

### Manual Deployment

1. **Install Dependencies**:
   ```bash
   npm run install:all
   ```

2. **Build Frontend**:
   ```bash
   cd frontend && npm run build
   ```

3. **Start Production Server**:
   ```bash
   cd backend && npm start
   ```

## 🔐 Admin Access

- **Username**: `admin`
- **Password**: `portfolio2024`

Access the admin dashboard at `/admin` to manage:
- Blog articles
- Projects
- Work experience
- Skills and certifications

## 📧 Contact Form Setup

1. **Gmail App Password**:
   - Enable 2-Step Verification in Google Account
   - Generate App Password for Mail
   - Add credentials to MongoDB collection `BulkMail`

2. **MongoDB Collections**:
   - `Blogs`: Article storage
   - `ContactMessages`: Contact form submissions
   - `BulkMail`: Email credentials

## 🔄 API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /blogs` - Get all published blogs
- `GET /blogs/:id` - Get single blog
- `POST /contact` - Submit contact form
- `POST /blogs/:id/like` - Like a blog post

### Admin Endpoints
- `POST /admin/login` - Admin authentication
- `POST /blogs` - Create new blog
- `PUT /blogs/:id` - Update blog
- `DELETE /blogs/:id` - Delete blog
- `POST /projects` - Add project
- `POST /experiences` - Add work experience
- `POST /skills` - Add technical skills
- `POST /certifications` - Add certifications

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Check that your domain is added to the CORS configuration
2. **MongoDB Connection**: Ensure IP whitelist includes your deployment server
3. **Environment Variables**: Verify all required env vars are set in production
4. **Build Failures**: Check Node.js version compatibility (>=16.0.0)

### Development

```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev

# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

## 📝 License

MIT License - feel free to use this project as a template for your own portfolio!

## 👨‍💻 Author

**Prakash Leena**
- Email: kiboxsonleena2004@gmail.com
- GitHub: [@PrakashLeena](https://github.com/PrakashLeena)
- LinkedIn: [kiboxson-leena5111](https://www.linkedin.com/in/kiboxson-leena5111)

---

Built with ❤️ using React and Node.js
