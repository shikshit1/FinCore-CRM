import express from 'express';
import * as leadController from '../controllers/leadController.js';
import { authenticateToken, authorizeStaff } from '../middleware/auth.js';
import {
  validateLeadSubmit,
  validateLeadStatus,
  handleValidationErrors,
} from '../utils/validators.js';

const router = express.Router();

/** Public — no auth */
router.post('/submit', validateLeadSubmit, handleValidationErrors, leadController.submitLead);

/** Staff CRM */
router.use(authenticateToken, authorizeStaff);
router.get('/stats', leadController.getLeadStats);
router.get('/', leadController.getAllLeads);
router.get('/:id', leadController.getLeadById);
router.patch('/:id/status', validateLeadStatus, handleValidationErrors, leadController.updateLeadStatus);
router.post('/:id/notes', leadController.addLeadNote);
router.post('/:id/convert', leadController.convertLead);

export default router;
