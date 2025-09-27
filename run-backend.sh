#!/bin/bash

# SNAFLEShub Backend Startup Script
# This script sets up and runs the backend server

echo "?? Starting SNAFLEShub Backend Server..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Navigate to backend directory
if [ ! -d "backend" ]; then
    print_error "Backend directory not found. Please run this script from the project root."
    exit 1
fi

cd backend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found in backend directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully!"
    else
        print_error "Failed to install dependencies."
        exit 1
    fi
else
    print_status "Dependencies already installed."
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    if [ -f "env.example" ]; then
        print_warning ".env file not found. Creating from env.example..."
        cp env.example .env
        print_success ".env file created. Please update the values as needed."
    else
        print_warning "No .env file found. Using default configuration."
    fi
else
    print_status ".env file found."
fi

# Create uploads directory if it doesn't exist
if [ ! -d "uploads" ]; then
    print_status "Creating uploads directory..."
    mkdir -p uploads
    print_success "Uploads directory created."
fi

# Check if MongoDB is running (optional)
print_status "Checking MongoDB connection..."
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        print_success "MongoDB is running."
    else
        print_warning "MongoDB is not running. Please start MongoDB before running the server."
        echo "To start MongoDB:"
        echo "  - On macOS with Homebrew: brew services start mongodb-community"
        echo "  - On Ubuntu: sudo systemctl start mongod"
        echo "  - On Windows: net start MongoDB"
        echo ""
        echo "Or use MongoDB Atlas (cloud) and update MONGODB_URI in .env file"
    fi
else
    print_warning "MongoDB not found. Please install MongoDB or use MongoDB Atlas."
    echo "Visit: https://www.mongodb.com/try/download/community"
fi

# Seed database if requested
if [ "$1" = "--seed" ] || [ "$1" = "-s" ]; then
    print_status "Seeding database..."
    npm run seed
    if [ $? -eq 0 ]; then
        print_success "Database seeded successfully!"
    else
        print_error "Failed to seed database."
    fi
fi

# Parse flags
RUN_DEV=0
USE_MOCK=0

for arg in "$@"; do
  case $arg in
    --dev|-d)
      RUN_DEV=1
      ;;
    --mock|-m)
      USE_MOCK=1
      ;;
  esac
done

# Start the server
print_status "Starting the server..."
echo ""
echo "?? Server will be available at: http://localhost:5000"
echo "?? API Health:        http://localhost:5000/api/health"
echo "?? Environment: ${NODE_ENV:-development}"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server (mock or real)
if [ "$USE_MOCK" -eq 1 ]; then
  if [ "$RUN_DEV" -eq 1 ]; then
    print_status "Using MOCK API in development mode..."
    npm run dev:mock
  else
    print_status "Using MOCK API in production mode..."
    npm run start:mock
  fi
else
  if [ "$RUN_DEV" -eq 1 ]; then
    print_status "Starting REAL API in development mode..."
    npm run dev
  else
    print_status "Starting REAL API in production mode..."
    npm start
  fi
fi

