import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blumiq_db";

// Parse database name from URI or use default
const getDatabaseName = (uri: string): string => {
  const dbName = uri.split('/').pop()?.split('?')[0];
  return dbName && dbName !== '' ? dbName : 'blumiq_db';
};

const databaseName = getDatabaseName(MONGODB_URI);

// Create the full URI with database name
const fullMongoUri = MONGODB_URI.endsWith('/') 
  ? `${MONGODB_URI}${databaseName}?retryWrites=true&w=majority`
  : MONGODB_URI.includes('?') 
    ? MONGODB_URI 
    : `${MONGODB_URI}/${databaseName}?retryWrites=true&w=majority`;

let isConnected = false;

export async function connectMongoose(): Promise<void> {
  if (isConnected) {
    console.log('Mongoose already connected');
    return;
  }

  if (mongoose.connections.length > 0) {
    isConnected = mongoose.connections[0].readyState === 1;
    if (isConnected) {
      console.log('Using existing Mongoose connection');
      return;
    }
  }

  try {
    console.log(`Connecting Mongoose to: ${fullMongoUri.replace(/\/\/.*@/, '//***:***@')}`);
    
    await mongoose.connect(fullMongoUri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
    });

    isConnected = true;
    console.log(`Mongoose connected to database: ${databaseName}`);
    
    // Test the connection
    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
      console.log('Mongoose connection ping successful');
    }
    
  } catch (error) {
    console.error('Mongoose connection failed:', error);
    isConnected = false;
    throw error;
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
  isConnected = false;
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed through app termination');
  process.exit(0);
});
