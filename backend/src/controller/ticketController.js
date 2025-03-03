import Ticket from '../models/Ticket.js';
import { createTicketSchema, updateTicketSchema } from '../utils/validator.js';
import { ZodError } from 'zod';
import asyncHandler from 'express-async-handler';

// @desc Create a new ticket
// @route POST /api/tickets
// @access Private (User)
export const createTicket = asyncHandler(async (req, res) => {
  try {
    const validatedData = createTicketSchema.parse(req.body);
    const { title, description, status } = validatedData;

    const ticket = await Ticket.create({
      user: req.user._id,
      title,
      description,
      status,
    });

    res.status(201).json(ticket);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    throw error;
  }
});

// @desc Get all tickets (Users see only their own, Admins see all)
// @route GET /api/tickets
// @access Private
export const getTickets = asyncHandler(async (req, res) => {
  let tickets;

  if (req.user.role === 'admin') {
    tickets = await Ticket.find().populate('user', 'name email'); // Admin sees all
  } else {
    tickets = await Ticket.find({ user: req.user._id }); // User sees only their own tickets
  }

  res.status(200).json(tickets);
});

// @desc Update ticket status
// @route PUT /api/tickets/:id
// @access Private (Admin Only)
export const updateTicket = asyncHandler(async (req, res) => {
  try {
    const validatedData = updateTicketSchema.parse(req.body);
    const { status } = validatedData;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    if (req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized');
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json(ticket);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    throw error;
  }
});
