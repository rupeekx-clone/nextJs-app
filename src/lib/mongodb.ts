import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blumiq_db";
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    console.log("Using cached MongoDB connection.");
    return cachedDb;
  }

  console.log(`Attempting to connect to MongoDB at ${MONGODB_URI}`);
  
  // Enhanced connection options for better timeout handling
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 30000, // 30 seconds
    connectTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 30000, // 30 seconds
    maxPoolSize: 10, // Maintain up to 10 socket connections
    minPoolSize: 2, // Maintain a minimum of 2 socket connections
    maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  });

  try {
    await client.connect();
    
    // Test the connection with a ping
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connection ping successful");
    
    // If the database name is part of the MONGODB_URI, client.db() will use it.
    // Otherwise, you can pass the database name directly, e.g., client.db("blumiq_db")
    const dbName = MONGODB_URI.split('/').pop()?.split('?')[0]; // Basic parsing to get DB name from URI
    const finalDbName = dbName && dbName !== '' ? dbName : 'blumiq_db'; // Default to blumiq_db if no name in URI
    const db = client.db(finalDbName); 
    console.log(`Successfully connected to MongoDB database: ${db.databaseName}.`);
    
    // Test database access with a simple operation
    await db.listCollections().toArray();
    console.log("Database access verified");
    
    cachedDb = db;
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    console.error("Connection URI:", MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
    
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        console.error("Connection timeout - check your network connection and MongoDB server status");
      } else if (error.message.includes('authentication')) {
        console.error("Authentication failed - check your MongoDB credentials");
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        console.error("Cannot reach MongoDB server - check the connection string and server status");
      }
    }
    
    throw error;
  }
}

// Example usage (can be removed or kept for testing):
/*
async function testConnection() {
  try {
    const db = await connectToDatabase();
    // Perform a simple operation to test, like listing collections
    const collections = await db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    
    // Example: Insert a document into a test collection
    const testCollection = db.collection('test_items');
    const insertResult = await testCollection.insertOne({ name: "Test Item", createdAt: new Date() });
    console.log("Inserted test item with id:", insertResult.insertedId);

    // Example: Find the test document
    const foundItem = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log("Found test item:", foundItem);

    // Clean up the test document
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log("Cleaned up test item.");

  } catch (error) {
    console.error("Test connection failed:", error);
  } finally {
    // In a serverless environment, you typically don't manually close the connection like this
    // because each function invocation might get a new connection or reuse a cached one.
    // However, if you were running a long-lived server process, you might handle shutdowns.
    // For now, we don't have a global client instance exposed to close easily,
    // and `cachedDb` is just the `Db` instance, not the `MongoClient`.
    // If a dedicated close function is needed, the MongoClient instance should be managed accordingly.
    console.log("Test connection function finished.");
  }
}

// To run the test (e.g., if you execute this file directly with ts-node or similar):
// testConnection();
*/
