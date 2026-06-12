import express from 'express';
import * as portalController from '../controllers/portalController.js';
import {
  authenticateToken,
  authorizeCustomer,
  attachCustomerProfile,
} from '../middleware/auth.js';
import { customerDocumentUpload } from '../middleware/upload.js';

const router = express.Router();

router.use(authenticateToken, authorizeCustomer, attachCustomerProfile);

router.get('/dashboard', portalController.getPortalDashboard);
router.get('/profile', portalController.getPortalProfile);
router.put('/profile', portalController.updatePortalProfile);
router.get('/loans', portalController.getPortalLoans);
router.get('/loans/:id', portalController.getPortalLoanById);
router.get('/documents', portalController.getPortalDocuments);
router.post('/documents/upload', (req, res, next) => {
  customerDocumentUpload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Upload failed' });
    }
    next();
  });
}, portalController.uploadPortalDocument);
router.get('/notifications', portalController.getPortalNotifications);

export default router;
