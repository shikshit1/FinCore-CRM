import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticateToken, authorize, authorizeStaff } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, authorizeStaff);

router.get('/team/list', userController.getTeamUsers);
router.get('/', authorize('admin'), userController.getAllUsers);
router.post('/', authorize('admin'), userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', authorize('admin'), userController.updateUser);
router.post('/:id/deactivate', authorize('admin'), userController.deactivateUser);
router.post('/:id/activate', authorize('admin'), userController.activateUser);
router.post('/:id/reset-password', authorize('admin'), userController.resetUserPassword);

export default router;
