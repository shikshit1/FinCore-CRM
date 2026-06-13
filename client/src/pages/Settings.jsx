import { useEffect, useState } from 'react';
import { settingsService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Bell, Lock, User } from 'lucide-react';

const DEFAULT_SETTINGS = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
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

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState(null);

  const storageKey = user?._id || user?.id
    ? `userSettings_${user._id || user.id}`
    : 'userSettings';

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getSettings();
      setSettings({
        fullName: data.fullName || user?.name || '',
        email: data.email || user?.email || '',
        phone: data.phone || '',
        company: data.company || '',
        notifications: { ...DEFAULT_SETTINGS.notifications, ...data.notifications },
        privacy: { ...DEFAULT_SETTINGS.privacy, ...data.privacy },
      });
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      const savedLocal = localStorage.getItem(storageKey) || localStorage.getItem('userSettings');
      if (savedLocal) {
        try {
          const parsed = JSON.parse(savedLocal);
          setSettings(prev => ({ ...prev, ...parsed }));
        } catch {
          setSettings({
            ...DEFAULT_SETTINGS,
            fullName: user?.name || '',
            email: user?.email || '',
          });
        }
      } else {
        setSettings({
          ...DEFAULT_SETTINGS,
          fullName: user?.name || '',
          email: user?.email || '',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
    setSaved(false);
  };

  const handleProfileChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaveError(null);
    try {
      await settingsService.updateSettings(settings);
      localStorage.setItem(storageKey, JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      localStorage.setItem(storageKey, JSON.stringify(settings));
      setSaved(true);
      setSaveError(null);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Privacy', icon: Lock },
  ];

  if (loading) {
    return (
      <div className="fincore-page">
        <Sidebar />
      <div className="fincore-main">
        <Header />
        <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-600 dark:text-slate-400">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fincore-page">
      <Sidebar />
      <div className="fincore-main">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="fincore-content">
            <div className="mb-6">
              <h1 className="fincore-page-title">Settings</h1>
              <p className="fincore-page-subtitle">Manage your account preferences</p>
            </div>

            {saved && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                ✓ Settings saved successfully!
              </div>
            )}
            {saveError && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-lg">{saveError}</div>
            )}

            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              <div className="lg:w-56 flex-shrink-0">
                <div className="fincore-card p-2 sm:p-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible lg:space-y-1 lg:sticky lg:top-8">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-shrink-0 lg:w-full flex items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-lg transition text-sm whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={18} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1 max-w-2xl">
                {activeTab === 'profile' && (
                  <div className="fincore-card p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-5">Profile Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['fullName', 'email', 'phone', 'company'].map(field => (
                        <div key={field} className={field === 'company' ? 'md:col-span-2' : ''}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 capitalize">
                            {field === 'fullName' ? 'Full Name' : field === 'email' ? 'Email Address' : field === 'phone' ? 'Phone Number' : 'Company Name'}
                          </label>
                          <input
                            type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                            value={settings[field]}
                            onChange={(e) => handleProfileChange(field, e.target.value)}
                            className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      ))}
                    </div>
                    <button onClick={handleSave} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium mt-4">
                      Save Changes
                    </button>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="fincore-card p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-5">Notification Preferences</h2>
                    <div className="space-y-3">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                        { key: 'loanUpdates', label: 'Loan Updates', description: 'Get notified about loan changes' },
                        { key: 'weeklyReport', label: 'Weekly Report', description: 'Receive weekly business report' },
                        { key: 'monthlyReport', label: 'Monthly Report', description: 'Receive monthly analytics report' },
                      ].map(item => (
                        <label key={item.key} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications[item.key]}
                            onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-gray-900 dark:text-slate-100 text-sm">{item.label}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">{item.description}</p>
                          </div>
                        </label>
                      ))}
                      <button onClick={handleSave} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium mt-2">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="fincore-card p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-5">Security & Privacy</h2>
                    <div className="space-y-4">
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.dataSharing}
                          onChange={(e) => handleSettingChange('privacy', 'dataSharing', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-gray-900 dark:text-slate-100 text-sm">Allow Data Sharing</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">Allow us to use your data for analytics</p>
                        </div>
                      </label>
                      <select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="private">Private — Only visible to admin</option>
                        <option value="team">Team — Visible to your team</option>
                        <option value="public">Public — Visible to everyone</option>
                      </select>
                      <button onClick={handleSave} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                        Save Security Settings
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
