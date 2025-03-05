import mongoose from 'mongoose';
export const connectDB = async () => {
  try {
    const MONGO_URI="mongodb+srv://yeab:root@cluster0.ue4xj.mongodb.net/"
    const conn = await mongoose.connect(process.env.MONGO_URI || MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
