const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/snafleshub';
const MAX_RETRIES = parseInt(process.env.DB_MAX_RETRIES || '5', 10);
const BASE_DELAY_MS = parseInt(process.env.DB_RETRY_DELAY_MS || '2000', 10); // 2s
const MAX_DELAY_MS = 30000; // cap at 30s

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async () => {
  // For development, we'll use mock data instead of MongoDB
  console.log('🔧 Running in development mode with mock data');
  console.log('📝 Note: MongoDB connection disabled for demo purposes');
  return null;
};

// Helpful connection state logs
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});
mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err?.message || err);
});

module.exports = connectDB;

