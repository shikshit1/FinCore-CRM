import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  validateRegister,
  validateCustomerRegister,
  validateLogin,
  handleValidationErrors,
} from '../utils/validators.js';

const router = express.Router();

/** Legacy path — employee self-signup disabled; use /register/customer for public signup */
router.post('/register', validateRegister, handleValidationErrors, authController.registerUser);
router.post('/register/customer', validateCustomerRegister, handleValidationErrors, authController.registerCustomer);
router.post('/login', validateLogin, handleValidationErrors, authController.loginUser);
router.post('/refresh-token', authController.refreshAccessToken);
router.post('/logout', authenticateToken, authController.logoutUser);
router.get('/me', authenticateToken, authController.getCurrentUser);

export default router;
