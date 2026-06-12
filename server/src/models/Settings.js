import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  profile: {
    fullName: String,
    email: String,
    phone: String,
    company: String,
  },
  notifications: {
    emailNotifications: { type: Boolean, default: true },
    loanUpdates: { type: Boolean, default: true },
    weeklyReport: { type: Boolean, default: false },
    monthlyReport: { type: Boolean, default: true },
  },
  privacy: {
    profileVisibility: { type: String, default: 'private' },
    dataSharing: { type: Boolean, default: false },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Settings', settingsSchema);
