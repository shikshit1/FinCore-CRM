import { useEffect, useState } from 'react';
import { customerService } from '../services/apiService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Modal from '../components/ui/Modal';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    panNumber: '',
    leadSource: 'website',
  });

  useEffect(() => {
    fetchCustomers();
  }, [page, search]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll({ page, limit: 10, search });
      setCustomers(data.customers || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveCustomer = async () => {
    try {
      setFormError(null);
      setFormLoading(true);

      // Validation
      if (!formData.firstName.trim()) {
        setFormError('First name is required');
        return;
      }
      if (!formData.lastName.trim()) {
        setFormError('Last name is required');
        return;
      }
      if (!formData.email.trim()) {
        setFormError('Email is required');
        return;
      }
      if (!formData.phone.trim()) {
        setFormError('Phone is required');
        return;
      }

      const response = await customerService.create(formData);
      
      if (response) {
        setSuccess('Customer added successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          panNumber: '',
          leadSource: 'website',
        });
        setShowForm(false);
        setTimeout(() => setSuccess(null), 3000);
        
        // Refresh customer list
        fetchCustomers();
      }
    } catch (err) {
      setFormError(err.message || 'Failed to add customer');
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300',
      inactive: 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-blue-100 text-blue-800';
  };

  const getKycColor = (status) => {
    const colors = {
      verified: 'bg-green-50 text-green-700',
      pending: 'bg-yellow-50 text-yellow-700',
      rejected: 'bg-red-50 text-red-700',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 dark:text-slate-300';
  };

  return (
    <div className="fincore-page">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100">Customers</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">Manage customer and lead information</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 font-medium shadow-md"
              >
                + Add Customer
              </button>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex justify-between items-center">
                <span>{success}</span>
                <button onClick={() => setSuccess(null)}>
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-lg flex justify-between items-center">
                <span>{error}</span>
                <button onClick={() => setError(null)}>
                  <X size={18} />
                </button>
              </div>
            )}

            <Modal
              isOpen={showForm}
              onClose={() => { setShowForm(false); setFormError(null); }}
              title="Add New Customer"
              size="md"
            >
              {formError && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-sm">
                      {formError}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                      type="text"
                      name="panNumber"
                      placeholder="PAN Number (Optional)"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                      name="leadSource"
                      value={formData.leadSource}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="website">Website</option>
                      <option value="referral">Referral</option>
                      <option value="social_media">Social Media</option>
                      <option value="cold_call">Cold Call</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={handleSaveCustomer}
                      disabled={formLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 rounded-lg transition duration-200 font-medium"
                    >
                      {formLoading ? 'Saving...' : 'Save Customer'}
                    </button>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setFormError(null);
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 dark:text-slate-100 px-4 py-3 rounded-lg transition duration-200 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
            </Modal>

            {/* Search */}
            <div className="mb-6 flex gap-4">
              <input
                type="text"
                placeholder="Search customers by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Table */}
            {loading ? (
              <div className="fincore-card p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 dark:text-slate-400">Loading customers...</p>
              </div>
            ) : customers.length === 0 ? (
              <div className="fincore-card p-8 text-center">
                <p className="text-gray-600 dark:text-slate-400 text-lg">No customers found</p>
                <p className="text-gray-400 mt-2">Start by adding your first customer</p>
              </div>
            ) : (
              <div className="fincore-card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-800/80 border-b dark:border-slate-700 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">KYC Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                    {customers.map((customer) => (
                      <tr key={customer._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-slate-100">
                          {customer.firstName} {customer.lastName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{customer.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{customer.phone}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getKycColor(customer.kycStatus)}`}>
                            {customer.kycStatus || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                            {customer.status || 'active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Link
                            to={`/customers/${customer._id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium transition"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
