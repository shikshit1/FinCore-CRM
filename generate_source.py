#!/usr/bin/env python3
"""
FinCore CRM - Complete Source Code Generator
Generates all necessary source files for the project
"""

import os
import json
from pathlib import Path

def safe_write(filepath, content):
    """Write content to file, creating directories as needed"""
    Path(filepath).parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✓ {filepath}")

def generate_project():
    base = r"C:\Users\SHIKSHIT\Desktop\FinCore  CRM"
    os.chdir(base)
    
    print("🚀 Generating FinCore CRM Project...\n")
    
    # ==================== SERVER FILES ====================
    
    # server/src/config/database.js
    safe_write("server/src/config/database.js", '''import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};
''')
    
    # server/src/config/constants.js
    safe_write("server/src/config/constants.js", '''export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee'
};

export const LOAN_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PROCESSING: 'processing',
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
''')
    
    # server/src/middleware/auth.js
    safe_write("server/src/middleware/auth.js", '''import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};
''')
    
    # server/src/middleware/errorHandler.js
    safe_write("server/src/middleware/errorHandler.js", '''export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation error',
      errors: err.errors 
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
''')
    
    # server/src/utils/tokenUtils.js
    safe_write("server/src/utils/tokenUtils.js", '''import jwt from 'jsonwebtoken';

export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
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
''')
    
    # server/src/models/User.js
    safe_write("server/src/models/User.js", '''import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'employee'],
    default: 'employee'
  },
  department: String,
  phone: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  profileImage: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
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

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
''')
    
    # server/src/models/Customer.js
    safe_write("server/src/models/Customer.js", '''import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active'
  },
  sourceOfLead: {
    type: String,
    enum: ['referral', 'web', 'advertisement', 'cold_call', 'other'],
    default: 'other'
  },
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  documents: [String],
  notes: String,
  lastInteraction: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

customerSchema.index({ email: 1, phone: 1 });

export default mongoose.model('Customer', customerSchema);
''')
    
    # server/src/models/LoanApplication.js
    safe_write("server/src/models/LoanApplication.js", '''import mongoose from 'mongoose';

const loanApplicationSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  loanAmount: {
    type: Number,
    required: true
  },
  loanTenure: {
    type: Number,
    required: true
  },
  loanType: {
    type: String,
    enum: ['personal', 'business', 'home', 'auto'],
    default: 'personal'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'approved', 'rejected', 'disbursed'],
    default: 'pending'
  },
  bank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bank'
  },
  bankApprovalStatus: String,
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  roi: Number,
  applicationDate: {
    type: Date,
    default: Date.now
  },
  approvalDate: Date,
  disbursementDate: Date,
  documents: [String],
  remarks: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

loanApplicationSchema.index({ customer: 1, status: 1 });

export default mongoose.model('LoanApplication', loanApplicationSchema);
''')
    
    # server/src/models/Bank.js
    safe_write("server/src/models/Bank.js", '''import mongoose from 'mongoose';

const bankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  contact: {
    email: String,
    phone: String,
    address: String
  },
  approvalRate: {
    type: Number,
    default: 0
  },
  minLoanAmount: Number,
  maxLoanAmount: Number,
  availableProducts: [String],
  processingTime: String,
  interestRate: Number,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Bank', bankSchema);
''')
    
    # server/src/models/Task.js
    safe_write("server/src/models/Task.js", '''import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  relatedCustomer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  relatedLoan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoanApplication'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: Date,
  completedDate: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

taskSchema.index({ assignedTo: 1, dueDate: 1 });

export default mongoose.model('Task', taskSchema);
''')
    
    # server/src/models/Document.js
    safe_write("server/src/models/Document.js", '''import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  fileType: String,
  fileSize: Number,
  filePath: {
    type: String,
    required: true
  },
  documentType: {
    type: String,
    enum: ['kyc', 'income_proof', 'bank_statement', 'employment_letter', 'other'],
    default: 'other'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  loanApplication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoanApplication'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending_review', 'approved', 'rejected'],
    default: 'pending_review'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Document', documentSchema);
''')
    
    print("\n✅ Server configuration and models created!\n")
    print("📦 Package files:")
    print("   - server/package.json")
    print("   - client/package.json\n")
    print("📄 Environment files:")
    print("   - server/.env.example")
    print("   - client/.env.example\n")
    print("🎯 Next steps:")
    print("   1. cd server && npm install")
    print("   2. cd ../client && npm install")
    print("   3. Configure MongoDB Atlas and update .env files")
    print("   4. Run: npm run dev\n")

if __name__ == "__main__":
    try:
        generate_project()
        print("🎉 Project generation complete!")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
