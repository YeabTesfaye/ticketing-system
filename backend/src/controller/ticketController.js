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
    const { title, description } = validatedData;

    const ticket = await Ticket.create({
      user: req.user._id,
      title,
      description,
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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  console.log(page, limit);

  const totalTickets = await Ticket.countDocuments({ user: req.user._id });
  const tickets = await Ticket.find({ user: req.user._id })
    .skip(skip)
    .limit(limit);

  res.json({
    tickets,
    totalTickets,
    totalPages: Math.ceil(totalTickets / limit),
    currentPage: page,
  });
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

// @desc Get a specific ticket by ID
// @route GET /api/tickets/:id
// @access Private
export const getTicketById = asyncHandler(async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      'user',
      'name email',
    );

    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
    throw new Error('Server Error');
  }
});

// @desc Delete a specific ticket by ID
// @route Delete /api/tickets/:id
// @access Private
export const deleteTicket = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }
    // Delete the ticket
    await Ticket.findByIdAndDelete(id);
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});
