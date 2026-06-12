import express from 'express';
import * as taskController from '../controllers/taskController.js';
import { authenticateToken, authorizeStaff } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, authorizeStaff);

router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.post('/:id/complete', taskController.completeTask);
router.delete('/:id', taskController.deleteTask);

export default router;
