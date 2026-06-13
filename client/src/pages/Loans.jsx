import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loanService, customerService, bankService } from '../services/apiService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Modal from '../components/ui/Modal';
import { FileText, Plus, X, Eye, MessageCircle } from 'lucide-react';
import { STATUS_BADGE, formatStatusLabel, LOAN_STATUS_OPTIONS } from '../utils/loanStatus';

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
      const params = { limit: 100 };
      if (filter && filter.trim() !== '') {
        params.status = filter;
      }
      const data = await loanService.getAll(params);
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

  const pendingCount = loans.filter(l =>
    ['pending', 'under_review', 'documents_pending', 'submitted'].includes(l.status)
  ).length;

  return (
    <div className="fincore-page">
      <Sidebar />
      <div className="fincore-main">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="fincore-content">
            <div className="fincore-page-header">
              <div>
                <h1 className="fincore-page-title">Loan Applications</h1>
                <p className="fincore-page-subtitle">Track and manage all loan applications</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="fincore-btn-action"
              >
                <Plus size={20} /> New Application
              </button>
            </div>

            <Modal
              isOpen={showForm}
              onClose={() => { setShowForm(false); setFormError(null); }}
              title="New Loan Application"
              size="md"
            >
              {formError && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-lg flex justify-between items-center">
                      <span>{formError}</span>
                      <button onClick={() => setFormError(null)} className="text-red-700 hover:text-red-900">
                        <X size={18} />
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Customer *
                      </label>
                      <select
                        name="customer"
                        required
                        value={formData.customer}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Bank
                      </label>
                      <select
                        name="bank"
                        value={formData.bank}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- Select Bank --</option>
                        {banks.map((bank) => (
                          <option key={bank._id} value={bank._id}>
                            {bank.name}{bank.code ? ` (${bank.code})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Loan Amount (₹) *
                      </label>
                      <input
                        type="number"
                        name="loanAmount"
                        required
                        value={formData.loanAmount}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="500000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Loan Type
                      </label>
                      <select
                        name="loanType"
                        value={formData.loanType}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="personal">Personal Loan</option>
                        <option value="business">Business Loan</option>
                        <option value="home">Home Loan</option>
                        <option value="auto">Auto Loan</option>
                        <option value="education">Education Loan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Tenure (Months)
                      </label>
                      <select
                        name="tenure"
                        value={formData.tenure}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={6}>6 months</option>
                        <option value={12}>12 months</option>
                        <option value={24}>24 months</option>
                        <option value={36}>36 months</option>
                        <option value={60}>60 months</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Purpose
                      </label>
                      <textarea
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Loan purpose..."
                        rows="2"
                      ></textarea>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition font-medium"
                      >
                        {formLoading ? 'Creating...' : 'Create Application'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowForm(false); setFormError(null); }}
                        className="w-full sm:flex-1 border border-gray-300 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 px-4 py-2 rounded-lg transition font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
            </Modal>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex justify-between items-center">
                <span>✓ {success}</span>
                <button onClick={() => setSuccess(null)} className="text-green-700 hover:text-green-900">
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="fincore-card-sm p-4 border-l-4 border-yellow-500">
                <p className="text-gray-500 dark:text-slate-400 text-xs mb-1">In Pipeline</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{pendingCount}</p>
              </div>
              <div className="fincore-card-sm p-4 border-l-4 border-green-500">
                <p className="text-gray-500 dark:text-slate-400 text-xs mb-1">Approved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{loans.filter(l => l.status === 'approved').length}</p>
              </div>
              <div className="fincore-card-sm p-4 border-l-4 border-indigo-500">
                <p className="text-gray-500 dark:text-slate-400 text-xs mb-1">Disbursed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{loans.filter(l => l.status === 'disbursed').length}</p>
              </div>
              <div className="fincore-card-sm p-4 border-l-4 border-blue-500">
                <p className="text-gray-500 dark:text-slate-400 text-xs mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{loans.length}</p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 flex items-start gap-2">
              <MessageCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                Update loan status from the detail page after bank response — customers receive automatic WhatsApp for Approved, Rejected, Documents Pending, and Disbursed.
              </span>
            </div>

            {/* Filter */}
            <div className="mb-6">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                {LOAN_STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}

            {loading ? (
              <div className="fincore-card p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 dark:text-slate-400">Loading loans...</p>
              </div>
            ) : loans.length === 0 ? (
              <div className="fincore-card p-10 text-center">
                <FileText className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-700 dark:text-slate-300 text-lg font-medium">No loan applications found</p>
                <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm">
                  {filter
                    ? 'No loans match this status filter. Select "All Status" to see every application.'
                    : 'Create your first loan application to get started.'}
                </p>
                {filter && (
                  <button
                    type="button"
                    onClick={() => setFilter('')}
                    className="mt-4 w-full sm:w-auto text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            ) : (
              <div className="fincore-table-wrap">
                <div className="fincore-table-scroll">
                <table className="w-full min-w-[720px]">
                  <thead className="bg-gray-50 dark:bg-slate-800/80 border-b dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Bank</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Created</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan) => (
                      <tr key={loan._id} className="border-b hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-slate-100">
                          {loan.customer?.firstName} {loan.customer?.lastName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{loan.bank?.name || '—'}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-slate-100">
                          ₹{(loan.loanAmount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400 capitalize">{loan.loanType}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_BADGE[loan.status] || STATUS_BADGE.pending}`}>
                            {formatStatusLabel(loan.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">
                          {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString('en-IN') : '—'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Link
                            to={`/loans/${loan._id}`}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <Eye size={16} /> Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
