import express from 'express';
import dotenv from 'dotenv';
import { UserRouter } from './route/userRoutes.js';
import { connectDB } from './utils/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { ticketRouter } from './route/ticketRoutes.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://ticketing-system-frontend-static-6.vercel.app',
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', UserRouter);
app.use('/api/tickets', ticketRouter);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html')),
  );
} else {
  app.get('/', (req, res) => res.send('Server is ready!'));
}
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server Started at PORT ${PORT}`);
});
