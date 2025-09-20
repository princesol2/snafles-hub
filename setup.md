# SNAFLEShub Setup Guide

## 🚀 Quick Setup

### 1. Install Git (if not already installed)
- **Windows**: Download from [git-scm.com](https://git-scm.com/download/win)
- **macOS**: `brew install git` or download from [git-scm.com](https://git-scm.com/download/mac)
- **Linux**: `sudo apt install git` (Ubuntu/Debian) or `sudo yum install git` (CentOS/RHEL)

### 2. Initialize Git Repository
```bash
# Navigate to your project directory
cd C:\Users\saura\OneDrive\Desktop\BUSSINESS

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: SNAFLEShub e-commerce platform"
```

### 3. Environment Configuration

#### Frontend Environment (.env.local)
Create a file named `.env.local` in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
VITE_APP_NAME=SNAFLEShub
VITE_APP_DESCRIPTION=Your one-stop e-commerce platform
```

#### Backend Environment (.env)
Create a file named `.env` in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/snafleshub
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 4. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 5. Start Development Servers

#### Option 1: Mock API (No Database Required)
```bash
# Start mock backend server
cd backend
node server-mock.js

# In another terminal, start frontend
npm run dev
```

#### Option 2: Full API (Requires MongoDB)
```bash
# Install and start MongoDB
# Windows: Download from mongodb.com
# macOS: brew install mongodb-community
# Linux: sudo apt install mongodb

# Start backend server
cd backend
npm run dev

# In another terminal, start frontend
npm run dev
```

### 6. Access the Application
- **Frontend**: https://localhost:5173 (or the port shown in terminal)
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🔧 Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
npm run dev          # Start with nodemon
npm start            # Start production server
npm run seed         # Seed database with sample data
```

## 📁 Project Structure
```
SNAFLEShub/
├── .gitignore           # Git ignore rules
├── README.md            # Project documentation
├── setup.md             # This setup guide
├── package.json         # Frontend dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── src/                 # Frontend source code
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── contexts/       # React contexts
│   ├── services/       # API services
│   └── utils/          # Utility functions
├── public/             # Static assets
└── backend/            # Backend source code
    ├── routes/         # API routes
    ├── models/         # Database models
    ├── middleware/     # Custom middleware
    ├── config/         # Configuration files
    ├── server.js       # Main server file
    ├── server-mock.js  # Mock server (no DB)
    └── package.json    # Backend dependencies
```

## 🔒 Security Notes

### Environment Variables
- Never commit `.env` files to version control
- Use strong, unique JWT secrets
- Keep API keys secure and rotate them regularly
- Use different keys for development and production

### Database Security
- Use strong MongoDB passwords
- Enable authentication in production
- Use connection strings with authentication
- Regularly backup your database

### API Security
- All API endpoints are protected with JWT authentication
- Rate limiting is enabled to prevent abuse
- CORS is configured for security
- Input validation is implemented

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in deployment platform

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy the backend folder
3. Ensure MongoDB connection

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in `vite.config.js` or `backend/server.js`
   - Kill processes using the port

2. **MongoDB connection failed**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Use mock server as fallback

3. **CORS errors**
   - Check `FRONTEND_URL` in backend `.env`
   - Ensure frontend and backend URLs match

4. **Environment variables not loading**
   - Restart the development server
   - Check file names (`.env.local` for frontend, `.env` for backend)
   - Ensure variables start with `VITE_` for frontend

### Getting Help
- Check the console for error messages
- Review the README.md for detailed documentation
- Check the API health endpoint: http://localhost:5000/api/health

## 📞 Support
For additional help, create an issue in the repository or contact the development team.

---

**Happy Coding! 🚀**

