import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  alternatePhone: String,
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  panNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  aadhaarNumber: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  employment: {
    status: {
      type: String,
      enum: ['employed', 'self-employed', 'unemployed', 'student', 'retired'],
    },
    companyName: String,
    designation: String,
    yearsOfExperience: Number,
    monthlyIncome: Number,
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  leadSource: {
    type: String,
    enum: ['referral', 'website', 'advertisement', 'direct', 'other'],
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blacklisted'],
    default: 'active',
  },
  notes: String,
  documents: [
    {
      type: String,
      url: String,
      uploadedAt: Date,
    },
  ],
  loanApplications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LoanApplication',
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

// Index for search performance
customerSchema.index({ email: 1, phone: 1 });
customerSchema.index({ status: 1 });

export default mongoose.model('Customer', customerSchema);
