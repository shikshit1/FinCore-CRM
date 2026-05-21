import { useEffect, useState } from 'react';
import { bankService } from '../services/apiService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Building2, CheckCircle, Plus, X } from 'lucide-react';

export default function Banks() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    contactPerson: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bankService.getAll();
      // Handle both direct array and { banks: [...] } structure
      const bankList = Array.isArray(data) ? data : (data.banks || []);
      setBanks(bankList);
    } catch (err) {
      console.error('Error fetching banks:', err);
      setError('Failed to fetch banks');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBank = async (e) => {
    e.preventDefault();
    setFormError(null);
    
    if (!formData.name || !formData.code) {
      setFormError('Please fill in required fields: Bank Name and Code');
      return;
    }

    try {
      setFormLoading(true);
      await bankService.create(formData);
      setSuccess('Bank added successfully!');
      setFormData({ name: '', code: '', contactPerson: '', email: '', phone: '' });
      setShowForm(false);
      setFormError(null);
      // Refresh the banks list
      await fetchBanks();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Bank creation error:', err);
      
      // Handle specific error cases
      if (err.message && err.message.includes('duplicate')) {
        setFormError('A bank with this name already exists. Please use a different name.');
      } else if (err.message && err.message.includes('E11000')) {
        setFormError('Bank name must be unique. This bank name is already in use.');
      } else {
        setFormError(err.message || 'Failed to add bank. Please try again.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Banks</h1>
                <p className="text-gray-500 mt-1">Manage partner banks and financial institutions</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 font-medium shadow-md flex items-center gap-2"
              >
                <Plus size={20} /> Add Bank
              </button>
            </div>

            {/* Alerts */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex justify-between items-center">
                <span>✓ {success}</span>
                <button onClick={() => setSuccess(null)} className="text-green-700 hover:text-green-900">
                  <X size={20} />
                </button>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Add Bank Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Add New Bank</h2>
                    <button
                      onClick={() => { setShowForm(false); setFormError(null); }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {formError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
                      <span className="text-sm">{formError}</span>
                      <button onClick={() => setFormError(null)} className="text-red-700 hover:text-red-900">
                        <X size={18} />
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleAddBank} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="HDFC Bank"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Code *
                      </label>
                      <input
                        type="text"
                        name="code"
                        required
                        placeholder="HDFC0000001"
                        value={formData.code}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        placeholder="Name"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="bank@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex gap-3 pt-6 border-t">
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 rounded-lg transition font-medium"
                      >
                        {formLoading ? 'Saving...' : 'Save Bank'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowForm(false); setFormError(null); }}
                        className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-lg transition font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {loading ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading banks...</p>
              </div>
            ) : banks.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No banks added yet</p>
                <p className="text-gray-400 mt-2">Start by adding your partner banks</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banks.map((bank) => (
                  <div key={bank._id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Building2 className="w-10 h-10 text-blue-600" />
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{bank.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Code: {bank.code}</p>
                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <p><strong>Contact:</strong> {bank.contactPerson || 'N/A'}</p>
                      <p><strong>Email:</strong> {bank.email || 'N/A'}</p>
                      <p><strong>Phone:</strong> {bank.phone || 'N/A'}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Approvals this month</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {bank.approvalStats?.approved || 0}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
