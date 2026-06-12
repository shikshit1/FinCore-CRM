import mongoose from 'mongoose';
import { LEAD_STATUSES } from '../config/leadStatuses.js';

const leadSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  city: { type: String, trim: true },
  employmentType: {
    type: String,
    enum: ['employed', 'self-employed', 'unemployed', 'student', 'retired'],
    default: 'employed',
  },
  monthlyIncome: { type: Number, default: 0 },
  loanType: {
    type: String,
    enum: ['personal', 'business', 'home', 'auto', 'education'],
    required: true,
  },
  requestedAmount: { type: Number, required: true },
  notes: { type: String, trim: true },
  status: {
    type: String,
    enum: LEAD_STATUSES,
    default: 'new_lead',
  },
  source: { type: String, default: 'website' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  convertedCustomer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  convertedLoan: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanApplication' },
  timeline: [
    {
      action: String,
      status: String,
      remarks: String,
      date: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

leadSchema.index({ email: 1, status: 1 });
leadSchema.index({ phone: 1, status: 1 });
leadSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Lead', leadSchema);
