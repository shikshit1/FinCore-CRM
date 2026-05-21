import express from 'express';
import * as taskController from '../controllers/taskController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.post('/:id/complete', taskController.completeTask);
router.delete('/:id', taskController.deleteTask);

export default router;
