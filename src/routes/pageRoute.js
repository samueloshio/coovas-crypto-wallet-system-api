import { Router } from 'express';

const router = Router();

import { isAdmin, withAuthAdmin } from '../middlewares/authMiddleware.js';

import {
  getAllPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
} from '../controllers/pageController.js';

router.get('/pages', getAllPages);
router.get('/pages/:slug', getPageBySlug);
router.post('/pages', withAuthAdmin, isAdmin, createPage);
router.put('/pages/:slug', withAuthAdmin, isAdmin, updatePage);
router.delete('/pages/:slug', withAuthAdmin, isAdmin, deletePage);

export default router;
