import mongoose from 'mongoose';
import { LOAN_STATUSES } from '../config/loanStatuses.js';

const loanApplicationSchema = new mongoose.Schema({
  applicationNumber: {
    type: String,
    unique: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  loanType: {
    type: String,
    enum: ['personal', 'business', 'home', 'auto', 'education'],
    required: true,
  },
  loanAmount: {
    type: Number,
    required: [true, 'Loan amount is required'],
  },
  tenure: {
    type: Number,
    required: [true, 'Tenure is required'],
    default: 60,
  },
  interestRate: {
    type: Number,
  },
  monthlyEMI: Number,
  totalAmount: Number,
  purpose: String,
  status: {
    type: String,
    enum: LOAN_STATUSES,
    default: 'pending',
  },
  bank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bank',
  },
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  documents: [
    {
      docType: String,
      url: String,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      uploadedAt: Date,
    },
  ],
  approvalDate: Date,
  disbursalDate: Date,
  rejectionReason: String,
  comments: String,
  timeline: [
    {
      action: { type: String, default: 'status_change' },
      status: String,
      previousStatus: String,
      date: { type: Date, default: Date.now },
      remarks: String,
      notificationSent: { type: Boolean, default: false },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
  statusHistory: [
    {
      fromStatus: String,
      toStatus: String,
      remarks: String,
      notificationSent: { type: Boolean, default: false },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      updatedAt: { type: Date, default: Date.now },
    },
  ],
  lastWhatsAppAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

loanApplicationSchema.pre('save', async function (next) {
  if (this.isNew && !this.applicationNumber) {
    const count = await mongoose.model('LoanApplication').countDocuments();
    this.applicationNumber = `LOAN-${Date.now()}-${count + 1}`;
  }
  next();
});

export default mongoose.model('LoanApplication', loanApplicationSchema);
