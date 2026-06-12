import { useEffect, useState } from 'react';
import { customerService } from '../services/apiService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Modal from '../components/ui/Modal';
import { Link } from 'react-router-dom';
import { Search, Plus, X } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    status: 'active',
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setFormLoading(true);
      const customerStatus = ['active', 'inactive'].includes(formData.status)
        ? formData.status
        : 'active';

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        status: customerStatus,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
      };
      await customerService.create(payload);
      setSuccess('Customer added successfully!');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        status: 'active',
      });
      setShowForm(false);
      fetchCustomers();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to add customer');
      setTimeout(() => setError(null), 3000);
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300',
      inactive: 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-600 dark:text-slate-400';
  };

  const formatCustomerStatus = (status) => {
    if (status === 'active' || status === 'inactive') return status;
    return 'inactive';
  };

  return (
    <div className="fincore-page">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100">Customers</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">Manage and track all customer information</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 font-medium flex items-center gap-2 shadow-md"
              >
                <Plus size={20} /> Add Customer
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
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-lg flex justify-between items-center">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
                  <X size={20} />
                </button>
              </div>
            )}

            <Modal
              isOpen={showForm}
              onClose={() => setShowForm(false)}
              title="Add New Customer"
              size="xl"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="last name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="phone"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Mumbai"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Maharashtra"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="400001"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="flex gap-3 pt-6 border-t">
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-medium disabled:bg-blue-400"
                      >
                        {formLoading ? 'Saving...' : 'Save Customer'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 border border-gray-300 text-gray-700 dark:text-slate-300 hover:bg-gray-50 px-6 py-2 rounded-lg transition font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
            </Modal>

            {/* Search Bar */}
            <div className="mb-6 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search customers by name, email, or phone..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="fincore-card p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 dark:text-slate-400">Loading customers...</p>
              </div>
            ) : customers.length === 0 ? (
              <div className="fincore-card p-8 text-center">
                <p className="text-gray-600 dark:text-slate-400 text-lg">No customers found</p>
                <p className="text-gray-400 mt-2">Add your first customer to get started</p>
              </div>
            ) : (
              <div className="fincore-card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-800/80 border-b dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Phone</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer._id} className="border-b hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-slate-100">
                          {customer.firstName} {customer.lastName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{customer.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{customer.phone}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(formatCustomerStatus(customer.status))}`}>
                            {formatCustomerStatus(customer.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Link
                            to={`/customers/${customer._id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium transition"
                          >
                            View Details →
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
