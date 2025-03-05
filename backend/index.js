import express from 'express';
import dotenv from 'dotenv';
import { UserRouter } from './src/route/userRoutes.js';
import { connectDB } from './src/utils/db.js';
import { errorHandler, notFound } from './src/middleware/errorMiddleware.js';
import { ticketRouter } from './src/route/ticketRoutes.js';
import cors from 'cors';
dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      'http://localhost:3000', // Local development
      'https://ticketing-system-5.onrender.com', // Deployed frontend
    ],
    credentials: true,
  }),
);

app.use('/api/users', UserRouter);
app.use('/api/tickets', ticketRouter);
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server Started at PORT ${PORT}`);
});
