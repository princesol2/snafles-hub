const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/snafleshub';
const MAX_RETRIES = parseInt(process.env.DB_MAX_RETRIES || '5', 10);
const BASE_DELAY_MS = parseInt(process.env.DB_RETRY_DELAY_MS || '2000', 10); // 2s
const MAX_DELAY_MS = 30000; // cap at 30s

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async () => {
  let attempt = 0;
  while (attempt <= MAX_RETRIES) {
    try {
      attempt += 1;
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ MongoDB connected');
      return mongoose.connection;
    } catch (err) {
      const delayMs = Math.min(BASE_DELAY_MS * attempt, MAX_DELAY_MS);
      console.error(`MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES}). Retrying in ${delayMs}ms`, err?.message || err);
      if (attempt >= MAX_RETRIES) {
        console.error('❌ Could not connect to MongoDB after retries');
        throw err;
      }
      await delay(delayMs);
    }
  }
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

