import express from 'express';
import {
  authUser,
  getUserProfile,
  logOutUSer,
  registerUser,
  updateUserProfile,
} from '../controller/userController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/auth', authUser);
router.post('/', registerUser);
router.post('/logout', logOutUSer);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export { router as UserRouter };
