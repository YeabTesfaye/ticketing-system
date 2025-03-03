import express from 'express';
import dotenv from 'dotenv';
import { UserRouter } from './src/route/userRoutes.js';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/utils/db.js';
import { errorHandler, notFound } from './src/middleware/errorMiddleware.js';
import { ticketRouter } from './src/route/ticketRoutes.js';

dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: '1mb',
    parameterLimit: 5000,
    // type: 'application/x-www-form-urlencoded',
  }),
);
app.use(cookieParser());
app.use('/api/users', UserRouter);
app.use('/api/tickets', ticketRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server Started at PORT ${PORT}`);
});
