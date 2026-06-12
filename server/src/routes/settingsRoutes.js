import express from 'express';
import * as settingsController from '../controllers/settingsController.js';
import { authenticateToken, authorizeStaff } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, authorizeStaff);
router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);

export default router;
