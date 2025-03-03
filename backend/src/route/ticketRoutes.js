import express from 'express';
import {
  createTicket,
  getTickets,
  updateTicket,
} from '../controller/ticketController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('api/ticket/')
  .post(protect, createTicket)
  .get(protect, getTickets);

router.route('api/ticket/:id').put(protect, admin, updateTicket);

export { router as ticketRouter };
