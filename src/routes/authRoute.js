import express from 'express';
import { check } from 'express-validator';
import {
  activateAccount,
  forgotPassword,
  resetInit,
  signIn,
  signInAdmin,
  signOut,
  signOutAdmin,
  signUp,
  signUpAdmin,
} from '../controllers/authController.js';
import {
  withAuth,
  withAuthAdmin,
  checkAuth,
  checkAuthAdmin,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Authentication
router.post(
  '/signup',
  [
    check('username', 'Name should be at least 3 char').isLength({ min: 3 }),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password should be at least 6 char').isLength({
      min: 6,
    }),
  ],
  signUp
);

router.post(
  '/signin',
  [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password field is required').isLength({ min: 8 }),
  ],
  signIn
);

router.post(
  '/signin/admin',
  [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password field is required').isLength({ min: 8 }),
  ],
  signInAdmin
);
router.post(
  '/signup/admin',
  [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password field is required').isLength({ min: 8 }),
  ],
  signUpAdmin
);

router.post(
  '/forgot',
  [check('email', 'Email is required').isEmail()],
  forgotPassword
);

router.post(
  '/reset',
  [check('password', 'Password must be 8 char').isLength({ min: 6 })],
  resetInit
);

router.post('/activate', activateAccount);

router.get('/checkauth', withAuth, checkAuth);
router.get('/checkauth/admin', withAuthAdmin, checkAuthAdmin);
router.get('/signout', signOut);
router.get('/signout/admin', signOutAdmin);

export default router;
