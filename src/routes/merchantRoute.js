import { Router } from 'express';

const router = Router();

import {
  withAuth,
  isAdmin,
  withAuthAdmin,
} from '../middlewares/authMiddleware.js';

import {
  updateMerchant,
  updateMerchantAdmin,
  getAllMerchants,
  getMerchantById,
  deleteMerchant,
  createMerchant,
} from '../controllers/merchantController.js';

router.get('/merchants', withAuthAdmin, isAdmin, getAllMerchants);
router.get('/merchants/:id', withAuthAdmin, isAdmin, getMerchantById);
router.post('/merchants', withAuthAdmin, isAdmin, createMerchant);
router.put('/merchants/me', withAuth, updateMerchant);
router.put('/merchants/:id', withAuthAdmin, isAdmin, updateMerchantAdmin);
router.delete('/merchants/:id', withAuthAdmin, isAdmin, deleteMerchant);

export default router;
