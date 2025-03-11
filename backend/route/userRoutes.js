import express from 'express';
import {
  authUser,
  getAllUsers,
  getUserProfile,
  logOutUSer,
  registerUser,
  deleteUser,
  updateUserProfile,
  createUser,
} from '../controller/userController.js';

import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/auth', authUser);
router.post('/create', createUser);
router.post('/', registerUser);
router.get('/', protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);
router.post('/logout', logOutUSer);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export { router as UserRouter };
