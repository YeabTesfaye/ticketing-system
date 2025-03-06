// lib/validation/registerSchema.js
import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .max(20, 'Password must not exceed 20 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Create User Schema
export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 3 characters long' }),
  email: z.string().email({ message: 'Invalid email format' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  role: z.enum(['admin', 'user']).default('user'),
});

export const createTicketSchema = z.object({
  title: z
    .string()
    .min(3, 'Ticket title must be at least 3 characters long')
    .max(100, 'Ticket title must not exceed 100 characters'),
  description: z
    .string()
    .min(5, 'Ticket description must be at least 5 characters long')
    .max(1000, 'Ticket description must not exceed 1000 characters'),
});

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z
    .string()
    .email('Invalid email format')
    .max(100, 'Email cannot exceed 100 characters'),
  password: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 6,
      'Password must be at least 6 characters long',
    ) // Validate if exists
    .refine(
      (val) => !val || val.length <= 20,
      'Password cannot exceed 20 characters',
    ),
});
