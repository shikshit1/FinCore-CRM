import { useEffect, useState } from 'react';
import { loanService, customerService, bankService } from '../services/apiService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import { FileText, TrendingUp, Plus, X } from 'lucide-react';

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    bank: '',
    loanAmount: '',
    loanType: 'personal',
    tenure: 12,
    purpose: '',
  });

  useEffect(() => {
    fetchLoans();
    fetchCustomers();
    fetchBanks();
  }, [filter]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const data = await loanService.getAll({ status: filter || undefined });
      setLoans(data.loans || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await customerService.getAll({ limit: 100 });
      setCustomers(data.customers || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const fetchBanks = async () => {
    try {
      const data = await bankService.getAll();
      setBanks(Array.isArray(data) ? data : (data.banks || []));
    } catch (err) {
      console.error('Error fetching banks:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'loanAmount' || name === 'tenure' ? parseInt(value) || '' : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    
    if (!formData.customer || !formData.loanAmount) {
      setFormError('Please fill in all required fields');
      return;
    }

    try {
      setFormLoading(true);
      // Convert tenure to number
      const payload = {
        customer: formData.customer,
        loanAmount: parseInt(formData.loanAmount),
        loanType: formData.loanType,
        tenure: parseInt(formData.tenure) || 12,
        purpose: formData.purpose || '',
      };
      
      // Add bank if selected
      if (formData.bank) {
        payload.bank = formData.bank;
      }
      
      await loanService.create(payload);
      setSuccess('Loan application created successfully!');
      setFormData({ customer: '', bank: '', loanAmount: '', loanType: 'personal', tenure: 12, purpose: '' });
      setShowForm(false);
      fetchLoans();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMsg = err.message || 'Failed to create loan application';
      setFormError(errorMsg);
      console.error('Loan creation error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      submitted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      disbursed: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusDot = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      submitted: 'bg-blue-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500',
      disbursed: 'bg-indigo-500',
      completed: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
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
                <h1 className="text-4xl font-bold text-gray-900">Loan Applications</h1>
                <p className="text-gray-500 mt-1">Track and manage all loan applications</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 font-medium shadow-md flex items-center gap-2"
              >
                <Plus size={20} /> New Application
              </button>
            </div>

            {/* Add Loan Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">New Loan Application</h2>
                    <button
                      onClick={() => { setShowForm(false); setFormError(null); }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {formError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
                      <span>{formError}</span>
                      <button onClick={() => setFormError(null)} className="text-red-700 hover:text-red-900">
                        <X size={18} />
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer *
                      </label>
                      <select
                        name="customer"
                        required
                        value={formData.customer}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- Select Customer --</option>
                        {customers.map((customer) => (
                          <option key={customer._id} value={customer._id}>
                            {customer.firstName} {customer.lastName} ({customer.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank
                      </label>
                      <select
                        name="bank"
                        value={formData.bank}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- Select Bank --</option>
                        {banks.map((bank) => (
                          <option key={bank._id} value={bank._id}>
                            {bank.name} ({bank.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loan Amount (₹) *
                      </label>
                      <input
                        type="number"
                        name="loanAmount"
                        required
                        value={formData.loanAmount}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="500000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loan Type
                      </label>
                      <select
                        name="loanType"
                        value={formData.loanType}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="personal">Personal Loan</option>
                        <option value="business">Business Loan</option>
                        <option value="home">Home Loan</option>
                        <option value="auto">Auto Loan</option>
                        <option value="education">Education Loan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tenure (Months)
                      </label>
                      <select
                        name="tenure"
                        value={formData.tenure}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={6}>6 months</option>
                        <option value={12}>12 months</option>
                        <option value={24}>24 months</option>
                        <option value={36}>36 months</option>
                        <option value={60}>60 months</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Purpose
                      </label>
                      <textarea
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Loan purpose..."
                        rows="2"
                      ></textarea>
                    </div>

                    <div className="flex gap-3 pt-6 border-t">
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition font-medium"
                      >
                        {formLoading ? 'Creating...' : 'Create Application'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowForm(false); setFormError(null); }}
                        className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex justify-between items-center">
                <span>✓ {success}</span>
                <button onClick={() => setSuccess(null)} className="text-green-700 hover:text-green-900">
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                <p className="text-gray-600 text-sm mb-2">Pending Review</p>
                <p className="text-3xl font-bold text-gray-900">{loans.filter(l => l.status === 'pending').length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <p className="text-gray-600 text-sm mb-2">Approved</p>
                <p className="text-3xl font-bold text-gray-900">{loans.filter(l => l.status === 'approved').length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <p className="text-gray-600 text-sm mb-2">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{loans.length}</p>
              </div>
            </div>

            {/* Filter */}
            <div className="mb-6 flex gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="disbursed">Disbursed</option>
              </select>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {loading ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading loans...</p>
              </div>
            ) : loans.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No loan applications found</p>
                <p className="text-gray-400 mt-2">Create your first loan application</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {loans.map((loan) => (
                  <div key={loan._id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`${getStatusDot(loan.status)} w-3 h-3 rounded-full mt-1.5 flex-shrink-0`}></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              {loan.customer?.firstName} {loan.customer?.lastName}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(loan.status)}`}>
                              {loan.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">App # {loan.applicationNumber}</p>
                        </div>
                      </div>
                      <Link
                        to={`/loans/${loan._id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium transition"
                      >
                        View Details →
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Loan Amount</p>
                        <p className="text-lg font-bold text-gray-900">₹{loan.amount?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Type</p>
                        <p className="text-lg font-bold text-gray-900 capitalize">{loan.loanType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Tenure</p>
                        <p className="text-lg font-bold text-gray-900">{loan.tenure || 'N/A'} months</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Bank</p>
                        <p className="text-lg font-bold text-gray-900">{loan.bank?.name || 'Pending'}</p>
                      </div>
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
