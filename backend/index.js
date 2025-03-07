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
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000', // Local development
      ];

      // Regex to match URLs containing 'ticketing-system-frontend-mern' anywhere in the domain/subdomain
      const regex =
        /^https:\/\/.*ticketing-system-frontend-mern.*\.vercel\.app$/;

      if (!origin || allowedOrigins.includes(origin) || regex.test(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error('Not allowed by CORS')); // Block the request
      }
    },
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
