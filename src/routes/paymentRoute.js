import { Router } from 'express';

const router = Router();

import {
  verifyMollie,
  verifyCoinbase,
  verifyCoinPayments,
  verifyPaypal,
  verifyStripe,
  verifyPaystack,
  verifyCoingate,
} from '../controllers/paymentController.js';

router.post('/payments/mollie', verifyMollie);
router.post('/payments/coinbase', verifyCoinbase);
router.post('/payments/coinpayments', verifyCoinPayments);
router.post('/payments/coingate', verifyCoingate);
router.get('/payments/paypal', verifyPaypal);
router.post('/payments/stripe', verifyStripe);
router.get('/payments/paystack', verifyPaystack);

export default router;
