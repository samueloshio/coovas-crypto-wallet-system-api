import { Router } from 'express';

const router = Router();

import { isAdmin, withAuthAdmin } from '../middlewares/authMiddleware.js';

import { getAllCurrencies, createCurrency, getCurrencyById, updateCurrency, deleteCurrency, fetchCurrencyRates, getCurrencyList } from '../controllers/currencyController.js';
import upload from '../config/multerConfig.js';

router.get('/currencies', getAllCurrencies);
router.get('/currencies/list', getCurrencyList);
router.get('/currencies/:id', getCurrencyById);
router.post('/fetchrates', withAuthAdmin, isAdmin, fetchCurrencyRates);
router.post('/currencies', withAuthAdmin, isAdmin, upload.single('icon'), createCurrency);
router.put('/currencies/:id', withAuthAdmin, isAdmin, upload.single('icon'), updateCurrency);
router.delete('/currencies/:id', withAuthAdmin, isAdmin, deleteCurrency);

export default router;
