import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { ZodError } from 'zod';
import { registerSchema, loginSchema } from '../utils/validator.js';
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
      generateToken(res, user._id);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400);
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
    });

    if (user) {
      const token = generateToken(res, user._id);
      res.status(201).json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
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
    message: 'User Loged Out',
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
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not Found');
  }
});
