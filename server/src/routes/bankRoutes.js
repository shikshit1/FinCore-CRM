import express from 'express';
import * as bankController from '../controllers/bankController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', bankController.getAllBanks);
router.post('/', bankController.createBank);
router.get('/:id', bankController.getBankById);
router.put('/:id', bankController.updateBank);
router.get('/:id/approvals', bankController.getBankApprovals);

export default router;
