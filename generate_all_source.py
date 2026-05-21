#!/usr/bin/env python3
"""
FinCore CRM - Full Source Code Generation
Generates all server and client source files
Run after COMPLETE_SETUP.py
"""

import os
import json
from pathlib import Path

def write_file(path, content):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    return path

def main():
    base = r"C:\Users\SHIKSHIT\Desktop\FinCore  CRM"
    os.chdir(base)
    
    print("=" * 70)
    print(" 🚀 FinCore CRM - Full Source Code Generator")
    print("=" * 70 + "\n")
    
    files_created = 0
    
    # ==================== SERVER SOURCE FILES ====================
    print("📝 Generating server source code...\n")
    
    # server/src/server.js
    write_file("server/src/server.js", '''import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FinCore CRM API is running' });
});

// Routes will be added here
// app.use('/api/auth', authRoutes);
// app.use('/api/customers', customerRoutes);
// app.use('/api/loans', loanRoutes);
// etc...

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
''')
    print(f"  ✓ server/src/server.js")
    files_created += 1
    
    # server/src/config/database.js
    write_file("server/src/config/database.js", '''import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
''')
    print(f"  ✓ server/src/config/database.js")
    files_created += 1
    
    # server/src/config/constants.js
    write_file("server/src/config/constants.js", '''export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee'
};

export const LOAN_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DISBURSED: 'disbursed'
};

export const CUSTOMER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked'
};

export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const LOAN_TYPES = {
  PERSONAL: 'personal',
  BUSINESS: 'business',
  HOME: 'home',
  AUTO: 'auto'
};

export const DOCUMENT_TYPES = {
  KYC: 'kyc',
  INCOME_PROOF: 'income_proof',
  BANK_STATEMENT: 'bank_statement',
  EMPLOYMENT_LETTER: 'employment_letter',
  OTHER: 'other'
};
''')
    print(f"  ✓ server/src/config/constants.js")
    files_created += 1
    
    # server/src/middleware/auth.js
    write_file("server/src/middleware/auth.js", '''import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
''')
    print(f"  ✓ server/src/middleware/auth.js")
    files_created += 1
    
    # server/src/middleware/errorHandler.js
    write_file("server/src/middleware/errorHandler.js", '''export const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  
  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(400).json({ message: 'This record already exists' });
  }
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
''')
    print(f"  ✓ server/src/middleware/errorHandler.js")
    files_created += 1
    
    # server/src/utils/tokenUtils.js
    write_file("server/src/utils/tokenUtils.js", '''import jwt from 'jsonwebtoken';

export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
  
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );
  
  return { accessToken, refreshToken };
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};
''')
    print(f"  ✓ server/src/utils/tokenUtils.js")
    files_created += 1
    
    # server/src/utils/validators.js
    write_file("server/src/utils/validators.js", '''export const validateEmail = (email) => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9+\\-\\s()]{10,}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  // At least 6 characters, 1 uppercase, 1 number
  return password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};

export const validateMongoId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
''')
    print(f"  ✓ server/src/utils/validators.js")
    files_created += 1
    
    # Models
    models = {
        "server/src/models/User.js": '''import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  department: String,
  phone: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  profileImage: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
''',
        "server/src/models/Customer.js": '''import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  status: { type: String, enum: ['active', 'inactive', 'blocked'], default: 'active' },
  sourceOfLead: { type: String, enum: ['referral', 'web', 'advertisement', 'cold_call', 'other'] },
  assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  kycStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  documents: [String],
  notes: String,
  lastInteraction: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

customerSchema.index({ email: 1, phone: 1 });

export default mongoose.model('Customer', customerSchema);
''',
        "server/src/models/LoanApplication.js": '''import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  loanAmount: { type: Number, required: true },
  loanTenure: { type: Number, required: true },
  loanType: { type: String, enum: ['personal', 'business', 'home', 'auto'], default: 'personal' },
  status: { type: String, enum: ['pending', 'processing', 'approved', 'rejected', 'disbursed'], default: 'pending' },
  bank: { type: mongoose.Schema.Types.ObjectId, ref: 'Bank' },
  bankApprovalStatus: String,
  assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  roi: Number,
  applicationDate: { type: Date, default: Date.now },
  approvalDate: Date,
  disbursementDate: Date,
  documents: [String],
  remarks: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

loanSchema.index({ customer: 1, status: 1 });

export default mongoose.model('LoanApplication', loanSchema);
''',
        "server/src/models/Bank.js": '''import mongoose from 'mongoose';

const bankSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  contact: {
    email: String,
    phone: String,
    address: String
  },
  approvalRate: { type: Number, default: 0 },
  minLoanAmount: Number,
  maxLoanAmount: Number,
  availableProducts: [String],
  processingTime: String,
  interestRate: Number,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Bank', bankSchema);
''',
        "server/src/models/Task.js": '''import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  relatedCustomer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  relatedLoan: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanApplication' },
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: Date,
  completedDate: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

taskSchema.index({ assignedTo: 1, dueDate: 1 });

export default mongoose.model('Task', taskSchema);
''',
        "server/src/models/Document.js": '''import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: String,
  fileSize: Number,
  filePath: { type: String, required: true },
  documentType: { type: String, enum: ['kyc', 'income_proof', 'bank_statement', 'employment_letter', 'other'], default: 'other' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  loanApplication: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanApplication' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending_review', 'approved', 'rejected'], default: 'pending_review' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Document', documentSchema);
''',
        "server/src/models/ActivityLog.js": '''import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: String,
  entityType: String,
  entityId: String,
  details: String,
  ipAddress: String,
  createdAt: { type: Date, default: Date.now }
});

activitySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('ActivityLog', activitySchema);
'''
    }
    
    for path, content in models.items():
        write_file(path, content)
        print(f"  ✓ {path.split('/')[-1]}")
        files_created += 1
    
    print(f"\n✅ Generated {files_created} server files!\n")
    print("📋 Created Files:")
    print("   ✓ Main server file (server.js)")
    print("   ✓ Database configuration")
    print("   ✓ Authentication middleware")
    print("   ✓ Error handling middleware")
    print("   ✓ Token utilities")
    print("   ✓ Validators")
    print("   ✓ 7 MongoDB models\n")
    
    print("🎯 Next Steps:")
    print("   1. npm install (in server/ and client/ directories)")
    print("   2. Configure .env with MongoDB Atlas connection")
    print("   3. Generate API routes (use generate_routes.py)")
    print("   4. Create React components")
    print("   5. npm run dev\n")

if __name__ == "__main__":
    try:
        main()
        print("🎉 Source code generation complete!")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
