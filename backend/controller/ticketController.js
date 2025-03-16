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

    return res.status(201).json({
      success: true,
      ticket,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc Get all tickets (Users see only their own, Admins see all)
// @route GET /api/tickets
// @access Private
export const getTickets = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let filter = req.user.role === 'user' ? { user: req.user._id } : {};

  const totalTickets = await Ticket.countDocuments(filter);
  const tickets = await Ticket.find(filter).skip(skip).limit(limit);

  return res.status(200).json({
    success: true,
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
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    ticket.status = status;
    await ticket.save();

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    return res.status(500).json({ success: false, message: 'Server Error' });
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
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Server Error', error: error.message });
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
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    await Ticket.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Server Error', error: error.message });
  }
});
