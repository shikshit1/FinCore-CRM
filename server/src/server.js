import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import bankRoutes from './routes/bankRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import callRoutes from './routes/callRoutes.js';
import portalRoutes from './routes/portalRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


connectDB();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FinCore CRM API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/banks', bankRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/portal', portalRoutes);
app.use('/api/leads', leadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ FinCore CRM Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health\n`);
});

export default app;
