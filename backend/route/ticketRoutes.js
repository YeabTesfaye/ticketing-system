import express from 'express';
import {
  createTicket,
  deleteTicket,
  getTicketById,
  getTickets,
  updateTicket,
} from '../controller/ticketController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createTicket).get(protect, getTickets);

router
  .route('/:id')
  .get(protect, getTicketById)
  .delete(protect, admin, deleteTicket)
  .put(protect, updateTicket);

export { router as ticketRouter };
