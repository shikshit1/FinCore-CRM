import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRegister, validateLogin, handleValidationErrors } from '../utils/validators.js';

const router = express.Router();

router.post('/register', validateRegister, handleValidationErrors, authController.registerUser);
router.post('/login', validateLogin, handleValidationErrors, authController.loginUser);
router.post('/refresh-token', authController.refreshAccessToken);
router.post('/logout', authenticateToken, authController.logoutUser);
router.get('/me', authenticateToken, authController.getCurrentUser);

export default router;
