import { Router } from 'express';

const router = Router();

import { withAuth, isAdmin, withAuthAdmin } from '../middlewares/authMiddleware.js';

import { getAllExchangesByUser, getAllExchanges, getExchangeById, createExchange, getExchangeByIdAdmin, acceptExchange, declineExchange } from '../controllers/exchangeController.js';

router.get('/exchanges/admin', withAuthAdmin, isAdmin, getAllExchanges);
router.get('/exchanges', withAuth, getAllExchangesByUser);
router.get('/exchanges/:id', withAuth, getExchangeById);
router.get('/exchanges/:id/admin', withAuthAdmin, isAdmin, getExchangeByIdAdmin);
router.post('/exchanges', withAuth, createExchange);
router.put('/exchanges/:id/accept', withAuthAdmin, isAdmin, acceptExchange);
router.put('/exchanges/:id/decline', withAuthAdmin, isAdmin, declineExchange);

export default router;
