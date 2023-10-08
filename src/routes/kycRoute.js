import { Router } from 'express';

const router = Router();
import upload from '../config/multerConfig.js';

import {
  withAuth,
  isAdmin,
  withAuthAdmin,
} from '../middlewares/authMiddleware.js';

import {
  getKycByUser,
  getAllKyc,
  createKyc,
  acceptKyc,
  declineKyc,
  resubmitKyc,
  getKycByUserId,
} from '../controllers/kycController.js';

router.get('/kyc', withAuthAdmin, isAdmin, getAllKyc);
router.get('/kyc/me', withAuth, getKycByUser);
router.get('/kyc/:id', withAuthAdmin, isAdmin, getKycByUserId);
router.post(
  '/kyc',
  withAuth,
  upload.fields([
    { name: 'front', maxCount: 1 },
    { name: 'back', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
  ]),
  createKyc
);
router.post('/kyc/resubmit', withAuth, resubmitKyc);
router.put('/kyc/:id/accept', withAuthAdmin, isAdmin, acceptKyc);
router.put('/kyc/:id/decline', withAuthAdmin, isAdmin, declineKyc);

export default router;
