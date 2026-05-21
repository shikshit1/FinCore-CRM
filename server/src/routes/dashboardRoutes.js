import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/breakdown', dashboardController.getDashboardBreakdown);
router.get('/activities', dashboardController.getDashboardActivities);
router.get('/my-dashboard', dashboardController.getMyDashboard);

export default router;
