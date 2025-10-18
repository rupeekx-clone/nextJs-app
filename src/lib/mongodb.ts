import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blumiq_db";
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    console.log("Using cached MongoDB connection.");
    return cachedDb;
  }

  console.log(`Attempting to connect to MongoDB at ${MONGODB_URI}`);
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    // If the database name is part of the MONGODB_URI, client.db() will use it.
    // Otherwise, you can pass the database name directly, e.g., client.db("blumiq_db")
    const dbName = MONGODB_URI.split('/').pop()?.split('?')[0]; // Basic parsing to get DB name from URI
    const db = client.db(dbName); 
    console.log(`Successfully connected to MongoDB database: ${db.databaseName}.`);
    cachedDb = db;
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    // It's often better to let the application crash or handle this more gracefully
    // depending on the use case, rather than just throwing the error again.
    // For now, we re-throw to make it clear the connection failed.
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
