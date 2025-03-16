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

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    generateToken(res, user._id);

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'Loged in successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    return res.status(500).json({ success: false, message: 'Server Error' });
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
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user data',
      });
    }

    generateToken(res, user._id);

    return res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'User Created successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    return res.status(500).json({ success: false, message: 'Server Error' });
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

  return res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
});

// @desc get  user profile
// route GET /api/users/profile
// @access private
export const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  return res.status(200).json({
    success: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

// @desc Auth user/set token
// route PUT /api/users/profile
// @access private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();
  generateToken(res, updatedUser._id);

  return res.status(200).json({
    success: true,
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    },
  });
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
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const password = generateSecurePassword();
    const user = await User.create({
      name,
      email,
      role,
      password,
    });

    await sendEmail(email, name, password);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user data',
      });
    }

    return res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
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

  return res.status(200).json({
    success: true,
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
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'User removed successfully',
  });
});
