import express from 'express';
import * as loanController from '../controllers/loanController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateLoanApplication, handleValidationErrors } from '../utils/validators.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', loanController.getAllLoans);
router.post('/', validateLoanApplication, handleValidationErrors, loanController.createLoan);
router.get('/:id', loanController.getLoanById);
router.put('/:id', loanController.updateLoan);
router.post('/:id/approve', loanController.approveLoan);
router.post('/:id/reject', loanController.rejectLoan);

export default router;
