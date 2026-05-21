import mongoose from 'mongoose';

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
    enum: ['pending', 'submitted', 'approved', 'rejected', 'disbursed', 'completed'],
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
      status: String,
      date: Date,
      remarks: String,
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate application number
loanApplicationSchema.pre('save', async function (next) {
  if (this.isNew && !this.applicationNumber) {
    const count = await mongoose.model('LoanApplication').countDocuments();
    this.applicationNumber = `LOAN-${Date.now()}-${count + 1}`;
  }
  next();
});

export default mongoose.model('LoanApplication', loanApplicationSchema);
