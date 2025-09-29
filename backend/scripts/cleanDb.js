/*
  Utility to clean the MongoDB database configured in .env (development use).
  Safety checks prevent accidental production drops. Use the --force flag.

  Usage:
    node scripts/cleanDb.js --force [--seed]
*/

const mongoose = require('mongoose');
require('dotenv').config();

const { seedDatabase } = require('./seedData');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/snafleshub';
const NODE_ENV = process.env.NODE_ENV || 'development';

const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force');
const RESEED = args.has('--seed');

const isSafeUri = (uri) => uri.includes('localhost') || uri.includes('127.0.0.1');

async function clean() {
  if (!FORCE) {
    console.error('Refusing to clean DB without --force flag.');
    console.error('Usage: node scripts/cleanDb.js --force [--seed]');
    process.exit(1);
  }

  if (NODE_ENV === 'production') {
    console.error('Safety: NODE_ENV=production. Aborting.');
    process.exit(1);
  }

  if (!isSafeUri(MONGODB_URI)) {
    console.error(`Safety: MONGODB_URI does not look local: ${MONGODB_URI}`);
    console.error('Aborting to protect non-local databases.');
    process.exit(1);
  }

  console.log(`Connecting to ${MONGODB_URI} ...`);
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const { db } = mongoose.connection;
  const dbName = db.databaseName;

  try {
    console.log(`Dropping database '${dbName}' ...`);
    await db.dropDatabase();
    console.log('✓ Database dropped successfully');
  } catch (err) {
    console.error('✗ Failed to drop database:', err?.message || err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }

  if (RESEED) {
    console.log('Reseeding database ...');
    await seedDatabase();
  }
}

clean();

