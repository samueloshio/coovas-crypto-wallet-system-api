import { Router } from 'express';
import {
  balanceManage,
  deleteSettings,
  getAllSettings,
  getBasicInfo,
  getGatewayByValueAdmin,
  getGatewayCurrencies,
  getGateways,
  getGatewaysAdmin,
  getSettingByValue,
  getSettings,
  handleImageUpload,
  sendUserEmail,
  updateAdjustments,
  updateFees,
  updateFooterMenu,
  updateGateways,
  updateGeneral,
  updateLogoFav,
  updateMainMenu,
  updateRepeater,
  updateRewards,
  updateSettings,
  updateSettingsByValue,
} from '../controllers/settingsController.js';
import { isAdmin, withAuthAdmin } from '../middlewares/authMiddleware.js';
import upload from '../config/multerConfig.js';

const router = Router();

router.get('/settings', getSettings);
router.put('/settings/new', updateSettings); // update existing settings by value or create if not exist
router.put('/settings/byvalue/:value', updateSettingsByValue); // update existing settings by value or create if not exist
router.get('/settings/:value', getSettingByValue);
router.get('/settings/getall', getAllSettings);
router.delete('/settings/remove/:id', deleteSettings);
router.put('/settings/fee', withAuthAdmin, isAdmin, updateFees);
router.put('/settings/rewards', withAuthAdmin, isAdmin, updateRewards);
router.put('/settings/adjustments', withAuthAdmin, isAdmin, updateAdjustments);
router.put('/settings/general', withAuthAdmin, isAdmin, updateGeneral);
router.put('/payments/:value', updateGateways);
router.get('/gateways', getGateways);
router.get('/gateways/currencies', getGatewayCurrencies);
router.get('/gateways/admin', withAuthAdmin, isAdmin, getGatewaysAdmin);
router.get('/gateways/:value', withAuthAdmin, isAdmin, getGatewayByValueAdmin);
router.get('/info', getBasicInfo);
router.put('/menu/main', withAuthAdmin, isAdmin, updateMainMenu);
router.put('/menu/footer', withAuthAdmin, isAdmin, updateFooterMenu);
router.put('/repeater/:value', withAuthAdmin, isAdmin, updateRepeater);
router.put(
  '/logo',
  withAuthAdmin,
  isAdmin,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 },
  ]),
  updateLogoFav
);
router.post(
  '/upload',
  withAuthAdmin,
  isAdmin,
  upload.single('image'),
  handleImageUpload
);
router.post('/email', withAuthAdmin, isAdmin, sendUserEmail);
router.post('/balance', withAuthAdmin, isAdmin, balanceManage);

export default router;
