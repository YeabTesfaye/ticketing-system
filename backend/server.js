import express from 'express';
import dotenv from 'dotenv';
import { UserRouter } from './route/userRoutes.js';
import { connectDB } from './utils/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { ticketRouter } from './route/ticketRoutes.js';
import cookieParser from 'cookie-parser';
dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/users', UserRouter);
app.use('/api/tickets', ticketRouter);
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server Started at PORT ${PORT}`);
});
