import { Router } from 'express';

const router = Router();

import {
  withAuth,
  isAdmin,
  isMerchant,
  withAuthAdmin,
} from '../middlewares/authMiddleware.js';

import {
  getAllRequests,
  getAllRequestsByMerchant,
  createRequest,
  getRequestById,
  getRequestByTrxId,
  deleteRequest,
} from '../controllers/requestController.js';

router.get('/requests/admin', withAuthAdmin, isAdmin, getAllRequests);
router.get('/requests', withAuth, isMerchant, getAllRequestsByMerchant);
router.get('/requests/:id', withAuth, isMerchant, getRequestById);
router.get('/requests/trx/:trxId', withAuth, getRequestByTrxId);
router.post('/requests', withAuth, isMerchant, createRequest);
router.delete('/requests/:id', withAuthAdmin, isAdmin, deleteRequest);

export default router;
