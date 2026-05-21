import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', authorize('admin'), userController.getAllUsers);
router.post('/', authorize('admin'), userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', authorize('admin'), userController.updateUser);
router.post('/:id/deactivate', authorize('admin'), userController.deactivateUser);

export default router;
