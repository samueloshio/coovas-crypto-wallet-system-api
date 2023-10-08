import { Router } from 'express';

const router = Router();

import {
  withAuth,
  withAuthAdmin,
  isAdmin,
} from '../middlewares/authMiddleware.js';
import {
  getWallet,
  getWalletByUserId,
} from '../controllers/walletController.js';

router.get('/wallets/me', withAuth, getWallet);
router.get('/wallets/:userId', withAuthAdmin, isAdmin, getWalletByUserId);

export default router;
