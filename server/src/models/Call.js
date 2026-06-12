import mongoose from 'mongoose';

const callSchema = new mongoose.Schema({
  telecallerName: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  callStatus: {
    type: String,
    enum: ['connected', 'not-connected', 'busy', 'switched-off', 'interested', 'not-interested', 'follow-up-required'],
    default: 'connected',
  },
  duration: String,
  leadGenerated: {
    type: Boolean,
    default: false,
  },
  followUpDate: Date,
  notes: String,
  loggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Call', callSchema);
