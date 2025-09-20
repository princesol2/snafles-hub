@echo off
REM SNAFLEShub Backend Startup Script for Windows
REM This script sets up and runs the backend server

echo 🚀 Starting SNAFLEShub Backend Server...
echo ========================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ [ERROR] Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ [INFO] Node.js version: 
node --version
echo ✅ [INFO] npm version: 
npm --version

REM Navigate to backend directory
if not exist "backend" (
    echo ❌ [ERROR] Backend directory not found. Please run this script from the project root.
    pause
    exit /b 1
)

cd backend

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ [ERROR] package.json not found in backend directory.
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 [INFO] Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
    echo ✅ [SUCCESS] Dependencies installed successfully!
) else (
    echo ✅ [INFO] Dependencies already installed.
)

REM Check if .env file exists
if not exist ".env" (
    if exist "env.example" (
        echo ⚠️ [WARNING] .env file not found. Creating from env.example...
        copy env.example .env
        echo ✅ [SUCCESS] .env file created. Please update the values as needed.
    ) else (
        echo ⚠️ [WARNING] No .env file found. Using default configuration.
    )
) else (
    echo ✅ [INFO] .env file found.
)

REM Create uploads directory if it doesn't exist
if not exist "uploads" (
    echo 📁 [INFO] Creating uploads directory...
    mkdir uploads
    echo ✅ [SUCCESS] Uploads directory created.
)

REM Check for MongoDB
echo 🔍 [INFO] Checking MongoDB connection...
where mongod >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ [WARNING] MongoDB not found. Please install MongoDB or use MongoDB Atlas.
    echo Visit: https://www.mongodb.com/try/download/community
    echo Or use MongoDB Atlas (cloud) and update MONGODB_URI in .env file
) else (
    echo ✅ [SUCCESS] MongoDB found.
)

REM Seed database if requested
if "%1"=="--seed" (
    echo 🌱 [INFO] Seeding database...
    npm run seed
    if %errorlevel% neq 0 (
        echo ❌ [ERROR] Failed to seed database.
    ) else (
        echo ✅ [SUCCESS] Database seeded successfully!
    )
)

REM Start the server
echo 🚀 [INFO] Starting the server...
echo.
echo 🌐 Server will be available at: http://localhost:5000
echo 📚 API Documentation: http://localhost:5000/api/health
echo 🔧 Environment: %NODE_ENV%
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
if "%1"=="--dev" (
    echo 🔧 [INFO] Starting in development mode with nodemon...
    npm run dev
) else (
    echo 🏭 [INFO] Starting in production mode...
    npm start
)
