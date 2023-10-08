import { Router } from 'express';

const router = Router();

import {
  withAuth,
  isAdmin,
  withAuthAdmin,
} from '../middlewares/authMiddleware.js';

import {
  getAllWithdraws,
  getAllWithdrawsByUser,
  getWithdrawById,
  getWithdrawByIdAdmin,
  createWithdraw,
  acceptWithdraw,
  declineWithdraw,
} from '../controllers/withdrawController.js';

router.get('/withdraws/admin', withAuthAdmin, isAdmin, getAllWithdraws);
router.get('/withdraws', withAuth, getAllWithdrawsByUser);
router.get('/withdraws/:id', withAuth, getWithdrawById);
router.get('/withdraws/:id/admin', withAuthAdmin, isAdmin, getWithdrawByIdAdmin);
router.post('/withdraws', withAuth, createWithdraw);
router.put('/withdraws/:id/accept', withAuthAdmin, isAdmin, acceptWithdraw);
router.put('/withdraws/:id/decline', withAuthAdmin, isAdmin, declineWithdraw);

export default router;
