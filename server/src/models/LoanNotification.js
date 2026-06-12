import mongoose from 'mongoose';

const loanNotificationSchema = new mongoose.Schema({
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoanApplication',
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  phone: String,
  status: String,
  message: String,
  channel: {
    type: String,
    default: 'whatsapp',
  },
  provider: {
    type: String,
    enum: ['twilio', 'meta', 'simulated', 'none'],
    default: 'none',
  },
  success: {
    type: Boolean,
    default: false,
  },
  externalId: String,
  error: String,
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('LoanNotification', loanNotificationSchema);
