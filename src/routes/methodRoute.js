import { Router } from 'express';

const router = Router();

import {
  withAuth,
  isAdmin,
  withAuthAdmin,
} from '../middlewares/authMiddleware.js';

import {
  getAllMethods,
  getMethodById,
  createMethod,
  updateMethod,
  deleteMethod,
} from '../controllers/methodController.js';

router.get('/methods', withAuth, getAllMethods);
router.get('/methods/admin', withAuthAdmin, isAdmin, getAllMethods);
router.get('/methods/:id/admin', withAuthAdmin, isAdmin, getMethodById);
router.get('/methods/:id', withAuth, getMethodById);
router.post('/methods', withAuthAdmin, isAdmin, createMethod);
router.put('/methods/:id', withAuthAdmin, isAdmin, updateMethod);
router.delete('/methods/:id', withAuthAdmin, isAdmin, deleteMethod);

export default router;
