import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable'
  );
}

// Variable to cache the MongoDB connection
let cachedConnection: typeof mongoose | null = null;

async function connectToDatabase(): Promise<typeof mongoose> {
  // If we have a cached connection, use it
  if (cachedConnection) {
    return cachedConnection;
  }

  // Connect to MongoDB
  mongoose.set('strictQuery', true);
  
  const connection = await mongoose.connect(MONGODB_URI);
  
  cachedConnection = connection;
  return connection;
}

export default connectToDatabase; 