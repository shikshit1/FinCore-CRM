import express from 'express';
import * as customerController from '../controllers/customerController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateCustomer, handleValidationErrors } from '../utils/validators.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', customerController.getAllCustomers);
router.post('/', validateCustomer, handleValidationErrors, customerController.createCustomer);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;
