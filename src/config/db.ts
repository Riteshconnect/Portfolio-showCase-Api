import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`[database]: MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`[database]: Error: ${error.message}`);
    } else {
      console.error('[database]: An unknown error occurred');
    }
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;