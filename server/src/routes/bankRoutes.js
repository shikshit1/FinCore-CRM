import express from 'express';
import * as bankController from '../controllers/bankController.js';
import { authenticateToken, authorizeStaff } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, authorizeStaff);

router.get('/analytics/summary', bankController.getBanksAnalytics);
router.get('/', bankController.getAllBanks);
router.post('/', bankController.createBank);
router.get('/:id', bankController.getBankById);
router.put('/:id', bankController.updateBank);
router.get('/:id/approvals', bankController.getBankApprovals);

export default router;
