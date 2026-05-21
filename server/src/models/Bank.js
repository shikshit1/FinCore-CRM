import mongoose from 'mongoose';

const bankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bank name is required'],
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  contactPerson: String,
  contactEmail: String,
  contactPhone: String,
  products: [
    {
      name: String,
      type: String,
      minAmount: Number,
      maxAmount: Number,
      baseRate: Number,
      maxTenure: Number,
    },
  ],
  approvalRate: {
    type: Number,
    default: 0,
  },
  totalApplications: {
    type: Number,
    default: 0,
  },
  approvedApplications: {
    type: Number,
    default: 0,
  },
  rejectedApplications: {
    type: Number,
    default: 0,
  },
  processingTime: {
    type: Number,
    default: 5,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Bank', bankSchema);
