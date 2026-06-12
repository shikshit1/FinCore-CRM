import Settings from '../models/Settings.js';

const defaultSettings = {
  profile: {
    fullName: '',
    email: '',
    phone: '',
    company: '',
  },
  notifications: {
    emailNotifications: true,
    loanUpdates: true,
    weeklyReport: false,
    monthlyReport: true,
  },
  privacy: {
    profileVisibility: 'private',
    dataSharing: false,
  },
};

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ user: req.user.userId });
    if (!settings) {
      return res.json(defaultSettings);
    }
    res.json({
      fullName: settings.profile?.fullName || '',
      email: settings.profile?.email || '',
      phone: settings.profile?.phone || '',
      company: settings.profile?.company || '',
      notifications: settings.notifications || defaultSettings.notifications,
      privacy: settings.privacy || defaultSettings.privacy,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { fullName, email, phone, company, notifications, privacy } = req.body;

    const settings = await Settings.findOneAndUpdate(
      { user: req.user.userId },
      {
        user: req.user.userId,
        profile: { fullName, email, phone, company },
        notifications: notifications || defaultSettings.notifications,
        privacy: privacy || defaultSettings.privacy,
        updatedAt: new Date(),
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      message: 'Settings saved successfully',
      settings: {
        fullName: settings.profile?.fullName,
        email: settings.profile?.email,
        phone: settings.profile?.phone,
        company: settings.profile?.company,
        notifications: settings.notifications,
        privacy: settings.privacy,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
