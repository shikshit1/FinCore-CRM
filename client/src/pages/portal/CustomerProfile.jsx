import { useEffect, useState } from 'react';
import PortalLayout from '../../components/portal/PortalLayout';
import { portalService } from '../../services/apiService';

export default function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ phone: '', alternatePhone: '', city: '', state: '', street: '', pincode: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    portalService.getProfile().then(p => {
      setProfile(p);
      setForm({
        phone: p.phone || '',
        alternatePhone: p.alternatePhone || '',
        street: p.address?.street || '',
        city: p.address?.city || '',
        state: p.address?.state || '',
        pincode: p.address?.pincode || '',
      });
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await portalService.updateProfile({
        phone: form.phone,
        alternatePhone: form.alternatePhone,
        address: { street: form.street, city: form.city, state: form.state, pincode: form.pincode },
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PortalLayout title="Profile"><div className="py-12 text-center">Loading...</div></PortalLayout>;

  return (
    <PortalLayout title="My Profile" subtitle="Your account information">
      {success && <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-lg text-sm">Profile updated successfully.</div>}

      <div className="max-w-2xl fincore-card p-6">
        <div className="mb-6 pb-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{profile?.firstName} {profile?.lastName}</h2>
          <p className="text-gray-600 dark:text-slate-400">{profile?.email}</p>
          <span className="inline-block mt-2 text-xs px-2 py-1 bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300 rounded-full capitalize">{profile?.status}</span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Alternate Phone</label>
              <input value={form.alternatePhone} onChange={e => setForm({ ...form, alternatePhone: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Street</label>
            <input value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Pincode" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} className="border rounded-lg px-3 py-2" />
          </div>
          <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </PortalLayout>
  );
}
