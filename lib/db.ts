import mongoose from 'mongoose';

let isConnected: boolean = false;

export async function connectDB() {
  if (isConnected) {
    console.log('[v0] Using existing database connection');
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    const conn = await mongoose.connect(mongoUri, {
      bufferCommands: false,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log('[v0] Database connected successfully');
    return conn;
  } catch (error) {
    console.error('[v0] Database connection failed:', error);
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
