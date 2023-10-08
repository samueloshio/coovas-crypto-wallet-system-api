import { Router } from 'express';

const router = Router();

import { withAuth, isAdmin, withAuthAdmin } from '../middlewares/authMiddleware.js';

import { getAllDeposits, getAllDepositsByUser, getDepositById, getDepositByIdAdmin, createDeposit, acceptDeposit, declineDeposit } from '../controllers/depositController.js';

router.get('/deposits/admin', withAuthAdmin, isAdmin, getAllDeposits);
router.get('/deposits', withAuth, getAllDepositsByUser);
router.get('/deposits/:id', withAuth, getDepositById);
router.get('/deposits/:id/admin', withAuthAdmin, isAdmin, getDepositByIdAdmin);
router.post('/deposits', withAuth, createDeposit);
router.put('/deposits/:id/accept', withAuthAdmin, isAdmin, acceptDeposit);
router.put('/deposits/:id/decline', withAuthAdmin, isAdmin, declineDeposit);

export default router;
