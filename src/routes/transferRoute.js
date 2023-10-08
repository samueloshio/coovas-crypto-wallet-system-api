import { Router } from 'express';

const router = Router();

import {
  withAuth,
  isAdmin,
  withAuthAdmin,
} from '../middlewares/authMiddleware.js';

import {
  createTransfer,
  getAllTransfers,
  getAllTransfersByUser,
} from '../controllers/transferController.js';

router.get('/transfers/admin', withAuthAdmin, isAdmin, getAllTransfers);
router.get('/transfers', withAuth, getAllTransfersByUser);
router.post('/transfers', withAuth, createTransfer);

export default router;
