@echo off
echo 🚀 SNAFLEShub Setup Script
echo ==========================
echo.

echo Checking prerequisites...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first.
    echo    Download from: https://git-scm.com/download/win
    echo.
    echo Continuing without Git...
) else (
    echo ✅ Git is installed
)

echo.
echo 📝 Creating environment files...

REM Create frontend .env.local if it doesn't exist
if not exist ".env.local" (
    echo # Frontend Environment Variables > .env.local
    echo VITE_API_URL=http://localhost:5000/api >> .env.local
    echo VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here >> .env.local
    echo VITE_APP_NAME=SNAFLEShub >> .env.local
    echo VITE_APP_DESCRIPTION=Your one-stop e-commerce platform >> .env.local
    echo VITE_APP_VERSION=1.0.0 >> .env.local
    echo VITE_DEV_MODE=true >> .env.local
    echo VITE_DEBUG=false >> .env.local
    echo ✅ Created .env.local for frontend
) else (
    echo ⚠️  .env.local already exists, skipping...
)

REM Create backend .env if it doesn't exist
if not exist "backend\.env" (
    echo # Backend Environment Variables > backend\.env
    echo NODE_ENV=development >> backend\.env
    echo PORT=5000 >> backend\.env
    echo MONGODB_URI=mongodb://localhost:27017/snafleshub >> backend\.env
    echo JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure >> backend\.env
    echo FRONTEND_URL=http://localhost:5173 >> backend\.env
    echo STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here >> backend\.env
    echo STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here >> backend\.env
    echo EMAIL_HOST=smtp.gmail.com >> backend\.env
    echo EMAIL_PORT=587 >> backend\.env
    echo EMAIL_USER=your_email@gmail.com >> backend\.env
    echo EMAIL_PASS=your_app_password >> backend\.env
    echo MAX_FILE_SIZE=10485760 >> backend\.env
    echo UPLOAD_PATH=uploads/ >> backend\.env
    echo ✅ Created backend\.env
) else (
    echo ⚠️  backend\.env already exists, skipping...
)

echo.
echo 📦 Installing dependencies...

echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error installing frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed

echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error installing backend dependencies
    pause
    exit /b 1
)
cd ..
echo ✅ Backend dependencies installed

echo.
echo 🔧 Initializing Git repository...

REM Check if already a git repository
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit: SNAFLEShub e-commerce platform"
    echo ✅ Git repository initialized
) else (
    echo ⚠️  Git repository already initialized
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Update the environment variables in .env.local and backend\.env
echo 2. Start the backend server: cd backend ^&^& npm run dev
echo 3. Start the frontend server: npm run dev
echo 4. Open your browser to the URL shown in the terminal
echo.
echo For detailed instructions, see setup.md
echo.
pause

