import { Router } from 'express';

const router = Router();

import {
  withAuth,
  isAdmin,
  withAuthAdmin,
} from '../middlewares/authMiddleware.js';

import {
  getAllPaysByUser,
  getAllPays,
  getPaysByTrxId,
  createPays,
  deletePays,
  createPaysByTrx,
} from '../controllers/payController.js';

router.get('/pays/admin', withAuthAdmin, isAdmin, getAllPays);
router.get('/pays', withAuth, getAllPaysByUser);
router.get('/pays/trx/:trxId', withAuth, getPaysByTrxId);
router.post('/pays', withAuth, createPays);
router.post('/pays/trx', withAuth, createPaysByTrx);
router.delete('/pays/:id', withAuthAdmin, isAdmin, deletePays);

export default router;
