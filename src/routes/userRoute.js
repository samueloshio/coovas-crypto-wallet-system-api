import { Router } from 'express';

const router = Router();

import {
  withAuth,
  isAdmin,
  withAuthAdmin,
} from '../middlewares/authMiddleware.js';
import {
  getAllUsers,
  countUsers,
  updateUser,
  updateUserAdmin,
  deleteUser,
  getUserDetails,
  getUserById,
} from '../controllers/userController.js';

router.get('/users/count', withAuthAdmin, isAdmin, countUsers);
router.get('/users', withAuthAdmin, isAdmin, getAllUsers);
router.get('/users/me', withAuth, getUserDetails);
router.get('/users/me/admin', withAuthAdmin, isAdmin, getUserDetails);
router.get('/users/:id', withAuthAdmin, isAdmin, getUserById);
router.put('/users/me', withAuth, updateUser);
router.put('/users/:id', withAuthAdmin, isAdmin, updateUserAdmin);
router.delete('/users/:id', withAuthAdmin, isAdmin, deleteUser);

export default router;
