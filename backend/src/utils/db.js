import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export const connectDB = async () => {
  try {
    const MONGO_URI = 'mongodb://127.0.0.1:27017/ticket';

    const conn = await mongoose.connect(process.env.MONGO_URI || MONGO_URI);
    console.log(`Mongo DB Connect : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error ${error.message}`);
    process.exit(1);
  }
};
