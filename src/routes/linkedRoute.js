import { Router } from 'express';

const router = Router();

import { withAuth } from '../middlewares/authMiddleware.js';

import {
  getUserLinkeds,
  createLinked,
  deleteLinked,
} from '../controllers/linkedController.js';

router.get('/linkeds/me', withAuth, getUserLinkeds);
router.post('/linkeds', withAuth, createLinked);
router.delete('/linkeds/:id', withAuth, deleteLinked);

export default router;
