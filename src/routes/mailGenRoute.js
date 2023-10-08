import express from 'express';
import signUpMail from '../controllers/mailerController.js';

const router = express.Router();

// Authentication
router.post('/signupMail', signUpMail);

export default router;
