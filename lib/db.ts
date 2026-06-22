import mongoose from 'mongoose';

let isConnected: boolean = false;

export async function connectDB() {
  // Check if already connected
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    // Connect to MongoDB with proper options
    const conn = await mongoose.connect(mongoUri, {
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log('[v0] Database connected successfully');
    return conn;
  } catch (error) {
    console.error('[v0] Database connection failed:', error);
    isConnected = false;
    throw error;
  }
}

export async function disconnectDB() {
  if (!isConnected) return;
  
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[v0] Database disconnected');
  } catch (error) {
    console.error('[v0] Disconnect error:', error);
  }
}

export default mongoose;
