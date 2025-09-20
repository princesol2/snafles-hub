#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 SNAFLEShub Setup Script');
console.log('==========================\n');

// Check if Git is installed
function checkGit() {
  const { execSync } = require('child_process');
  try {
    execSync('git --version', { stdio: 'ignore' });
    console.log('✅ Git is installed');
    return true;
  } catch (error) {
    console.log('❌ Git is not installed. Please install Git first.');
    console.log('   Download from: https://git-scm.com/downloads');
    return false;
  }
}

// Check if Node.js is installed
function checkNode() {
  try {
    const version = process.version;
    console.log(`✅ Node.js is installed (${version})`);
    return true;
  } catch (error) {
    console.log('❌ Node.js is not installed. Please install Node.js first.');
    console.log('   Download from: https://nodejs.org/');
    return false;
  }
}

// Create environment files
function createEnvFiles() {
  console.log('\n📝 Creating environment files...');
  
  // Frontend .env.local
  const frontendEnv = `# Frontend Environment Variables
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
VITE_APP_NAME=SNAFLEShub
VITE_APP_DESCRIPTION=Your one-stop e-commerce platform
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=true
VITE_DEBUG=false`;

  if (!fs.existsSync('.env.local')) {
    fs.writeFileSync('.env.local', frontendEnv);
    console.log('✅ Created .env.local for frontend');
  } else {
    console.log('⚠️  .env.local already exists, skipping...');
  }

  // Backend .env
  const backendEnv = `# Backend Environment Variables
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/snafleshub
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure_${Date.now()}
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/`;

  if (!fs.existsSync('backend/.env')) {
    fs.writeFileSync('backend/.env', backendEnv);
    console.log('✅ Created backend/.env');
  } else {
    console.log('⚠️  backend/.env already exists, skipping...');
  }
}

// Install dependencies
function installDependencies() {
  console.log('\n📦 Installing dependencies...');
  
  try {
    console.log('Installing frontend dependencies...');
    const { execSync } = require('child_process');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Frontend dependencies installed');
    
    console.log('Installing backend dependencies...');
    execSync('npm install', { stdio: 'inherit', cwd: 'backend' });
    console.log('✅ Backend dependencies installed');
  } catch (error) {
    console.log('❌ Error installing dependencies:', error.message);
  }
}

// Initialize Git repository
function initGit() {
  console.log('\n🔧 Initializing Git repository...');
  
  try {
    const { execSync } = require('child_process');
    
    // Check if already a git repository
    try {
      execSync('git status', { stdio: 'ignore' });
      console.log('⚠️  Git repository already initialized');
      return;
    } catch (error) {
      // Not a git repository, initialize it
    }
    
    execSync('git init', { stdio: 'inherit' });
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Initial commit: SNAFLEShub e-commerce platform"', { stdio: 'inherit' });
    console.log('✅ Git repository initialized');
  } catch (error) {
    console.log('❌ Error initializing Git:', error.message);
  }
}

// Main setup function
function main() {
  console.log('Checking prerequisites...\n');
  
  const hasGit = checkGit();
  const hasNode = checkNode();
  
  if (!hasNode) {
    console.log('\n❌ Please install Node.js first and run this script again.');
    process.exit(1);
  }
  
  createEnvFiles();
  
  if (hasGit) {
    initGit();
  }
  
  installDependencies();
  
  console.log('\n🎉 Setup completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Update the environment variables in .env.local and backend/.env');
  console.log('2. Start the backend server: cd backend && npm run dev');
  console.log('3. Start the frontend server: npm run dev');
  console.log('4. Open your browser to the URL shown in the terminal');
  console.log('\nFor detailed instructions, see setup.md');
}

// Run the setup
main();

