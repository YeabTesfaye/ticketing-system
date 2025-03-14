import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import {
  generateSecurePassword,
  generateToken,
} from '../utils/generateToken.js';
import { ZodError } from 'zod';
import {
  registerSchema,
  loginSchema,
  createUserSchema,
} from '../utils/validator.js';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/mailer.js';
// @desc Auth user/set token
// route POST /api/users/auth
// @access Public

export const authUser = asyncHandler(async (req, res) => {
  try {
    // Validate and extract sanitized data
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await User.findOne({ email });

    if (user && (await user.matchPasswords(password))) {
      user.isPasswordChanged = true;
      generateToken(res, user._id);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    throw error;
  }
});

// @desc Register a new user
// route POST /api/users
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
  try {
    // Validate and extract sanitized data
    const validatedData = registerSchema.parse(req.body);
    const { email, name, password } = validatedData;

    const userExist = await User.findOne({ email });

    if (userExist) {
      res.status(400);
      throw new Error('User Already Exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      isPasswordChanged: true,
    });

    if (user) {
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400);
      throw new Error('Invalid User Data');
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    throw error;
  }
});

// @desc logoout user
// route POST /api/users/logout
// @access Public
export const logOutUSer = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    message: 'User loged Out',
  });
});

// @desc get  user profile
// route GET /api/users/profile
// @access private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  res.status(200).json(user);
});

// @desc Auth user/set token
// route PUT /api/users/profile
// @access private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    generateToken(res, user._id);
    return res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not Found');
  }
});

// @desc Create a new user
// @route POST /api/users
// @access Private/Admin
export const createUser = asyncHandler(async (req, res) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    const { name, email, role } = validatedData;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const password = generateSecurePassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      role,
      isPasswordChanged: false,
      password: hashedPassword,
    });
    await sendEmail(email, name, password);
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc Get all users (Admin Only)
// @route GET /api/users
// @access Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const totalUsers = await User.countDocuments();
  const users = await User.find().skip(skip).limit(limit);
  res.json({
    users,
    totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
    currentPage: page,
  });
});

// @desc Delete a user (Admin Only)
// @route DELETE /api/users/:id
// @access Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();
  res.json({ message: 'User removed' });
});
