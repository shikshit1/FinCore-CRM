import express from 'express';
import * as callController from '../controllers/callController.js';
import { authenticateToken, authorizeStaff } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, authorizeStaff);
router.get('/analytics', callController.getCallAnalytics);
router.get('/', callController.getAllCalls);
router.post('/', callController.createCall);

export default router;
