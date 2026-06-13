import { useEffect, useState } from 'react';
import { bankService } from '../services/apiService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Modal from '../components/ui/Modal';
import {
  Building2,
  Plus,
  X,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  Eye,
} from 'lucide-react';

const formatCurrency = (amount) =>
  `₹${(amount || 0).toLocaleString('en-IN')}`;

export default function Banks() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankLoans, setBankLoans] = useState([]);
  const [loansLoading, setLoansLoading] = useState(false);
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
      const bankList = Array.isArray(data) ? data : (data.banks || []);
      setBanks(bankList);
    } catch (err) {
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

    if (!formData.name?.trim()) {
      setFormError('Bank name is required.');
      return;
    }
    if (!formData.email?.trim()) {
      setFormError('Email is required.');
      return;
    }

    try {
      setFormLoading(true);
      await bankService.create({
        name: formData.name.trim(),
        code: formData.code?.trim() || undefined,
        contactPerson: formData.contactPerson?.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim(),
      });
      setSuccess('Bank added successfully!');
      setFormData({ name: '', code: '', contactPerson: '', email: '', phone: '' });
      setShowForm(false);
      await fetchBanks();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const msg = err.message || 'Failed to add bank';
      if (msg.includes('duplicate') || msg.includes('E11000') || msg.includes('already exists')) {
        setFormError('A bank with this name already exists. Please use a different name.');
      } else {
        setFormError(msg);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewLoans = async (bank) => {
    setSelectedBank(bank);
    setLoansLoading(true);
    try {
      const data = await bankService.getApprovals(bank._id);
      setBankLoans(data.loans || []);
    } catch {
      setBankLoans([]);
    } finally {
      setLoansLoading(false);
    }
  };

  const closeLoansModal = () => {
    setSelectedBank(null);
    setBankLoans([]);
  };

  const totals = banks.reduce(
    (acc, b) => {
      const a = b.analytics || {};
      return {
        totalLoans: acc.totalLoans + (a.totalLoans || 0),
        approved: acc.approved + (a.approvedLoans || 0),
        rejected: acc.rejected + (a.rejectedLoans || 0),
        pending: acc.pending + (a.pendingLoans || 0),
        disbursed: acc.disbursed + (a.totalAmountDisbursed || 0),
      };
    },
    { totalLoans: 0, approved: 0, rejected: 0, pending: 0, disbursed: 0 }
  );

  const overallApproval =
    totals.approved + totals.rejected > 0
      ? Math.round((totals.approved / (totals.approved + totals.rejected)) * 100)
      : 0;

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      submitted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800',
      disbursed: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200',
    };
    return colors[status] || 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200';
  };

  return (
    <div className="fincore-page">
      <Sidebar />
      <div className="fincore-main">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="fincore-content">
            <div className="fincore-page-header">
              <div>
                <h1 className="fincore-page-title">Banks</h1>
                <p className="fincore-page-subtitle">Partner banks & loan analytics</p>
              </div>
              <button
                onClick={() => { setShowForm(true); setFormError(null); }}
                className="fincore-btn-action"
              >
                <Plus size={18} /> Add Bank
              </button>
            </div>

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex justify-between items-center">
                <span>✓ {success}</span>
                <button onClick={() => setSuccess(null)}><X size={18} /></button>
              </div>
            )}
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-lg flex justify-between items-center">
                <span>{error}</span>
                <button onClick={() => setError(null)}><X size={18} /></button>
              </div>
            )}

            {/* Overall Analytics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
              <div className="fincore-card-sm p-4 border border-gray-100 hover:shadow-md transition">
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Total Loans</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{totals.totalLoans}</p>
              </div>
              <div className="fincore-card-sm p-4 border-l-4 border-green-500 hover:shadow-md transition">
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1 flex items-center gap-1"><CheckCircle size={12} /> Approved</p>
                <p className="text-2xl font-bold text-green-600">{totals.approved}</p>
              </div>
              <div className="fincore-card-sm p-4 border-l-4 border-red-500 hover:shadow-md transition">
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1 flex items-center gap-1"><XCircle size={12} /> Rejected</p>
                <p className="text-2xl font-bold text-red-600">{totals.rejected}</p>
              </div>
              <div className="fincore-card-sm p-4 border-l-4 border-yellow-500 hover:shadow-md transition">
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1 flex items-center gap-1"><Clock size={12} /> Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{totals.pending}</p>
              </div>
              <div className="fincore-card-sm p-4 border-l-4 border-indigo-500 hover:shadow-md transition">
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1 flex items-center gap-1"><IndianRupee size={12} /> Disbursed</p>
                <p className="text-lg font-bold text-indigo-600">{formatCurrency(totals.disbursed)}</p>
              </div>
              <div className="fincore-card-sm p-4 border-l-4 border-blue-500 hover:shadow-md transition">
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1 flex items-center gap-1"><TrendingUp size={12} /> Approval Rate</p>
                <p className="text-2xl font-bold text-blue-600">{overallApproval}%</p>
              </div>
            </div>

            <Modal
              isOpen={showForm}
              onClose={() => { setShowForm(false); setFormError(null); }}
              title="Add New Bank"
              size="md"
            >
              {formError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-sm">
                  {formError}
                </div>
              )}
              <form onSubmit={handleAddBank} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Bank Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="fincore-input" placeholder="HDFC Bank" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Bank Code</label>
                  <input type="text" name="code" value={formData.code} onChange={handleInputChange} className="fincore-input" placeholder="HDFC001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="fincore-input" placeholder="contact@bank.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Contact Person</label>
                  <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className="fincore-input" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="fincore-input" />
                </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button type="submit" disabled={formLoading} className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2.5 rounded-lg font-medium">
                    {formLoading ? 'Saving...' : 'Save Bank'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setFormError(null); }} className="w-full sm:flex-1 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800">
                    Cancel
                  </button>
                </div>
              </form>
            </Modal>

            <Modal
              isOpen={!!selectedBank}
              onClose={closeLoansModal}
              title={selectedBank ? `${selectedBank.name} — Loans` : 'Bank Loans'}
              description={selectedBank ? `${bankLoans.length} loan application(s)` : undefined}
              size="2xl"
              bodyClassName="!p-0"
            >
              <div className="overflow-x-auto max-h-[min(60vh,32rem)]">
                {loansLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  </div>
                ) : bankLoans.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-slate-400 py-12 px-6">No loans linked to this bank yet.</p>
                ) : (
                  <table className="w-full text-sm min-w-[560px]">
                    <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-300">Customer</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-300">Amount</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-300">Status</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-300">Approval Date</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-300">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {bankLoans.map((loan) => (
                        <tr key={loan._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 bg-white dark:bg-slate-900">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-slate-100">
                            {loan.customer?.firstName} {loan.customer?.lastName}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{formatCurrency(loan.loanAmount)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(loan.status)}`}>
                              {loan.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-slate-400">
                            {loan.approvalDate ? new Date(loan.approvalDate).toLocaleDateString('en-IN') : '—'}
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-slate-400">
                            {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString('en-IN') : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Modal>

            {loading ? (
              <div className="fincore-card p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-3 text-gray-600 dark:text-slate-400">Loading banks...</p>
              </div>
            ) : banks.length === 0 ? (
              <div className="fincore-card p-8 text-center">
                <Building2 className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-slate-400">No banks added yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {banks.map(bank => {
                  const a = bank.analytics || {};
                  return (
                    <div key={bank._id} className="fincore-card hover:shadow-md transition p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Building2 className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-slate-100">{bank.name}</h3>
                            {bank.code && <p className="text-xs text-gray-500 dark:text-slate-400">{bank.code}</p>}
                          </div>
                        </div>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500 dark:text-slate-400">Total Loans</p>
                          <p className="font-bold text-gray-900 dark:text-slate-100">{a.totalLoans || 0}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500 dark:text-slate-400">Approved</p>
                          <p className="font-bold text-green-700">{a.approvedLoans || 0}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500 dark:text-slate-400">Rejected</p>
                          <p className="font-bold text-red-700">{a.rejectedLoans || 0}</p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500 dark:text-slate-400">Pending</p>
                          <p className="font-bold text-yellow-700">{a.pendingLoans || 0}</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm mb-4 pt-3 border-t border-gray-100">
                        <span className="text-gray-500 dark:text-slate-400">Disbursed</span>
                        <span className="font-semibold text-indigo-600">{formatCurrency(a.totalAmountDisbursed)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-4">
                        <span className="text-gray-500 dark:text-slate-400">Approval Ratio</span>
                        <span className="font-semibold text-blue-600">{a.approvalRatio || 0}%</span>
                      </div>
                      <button
                        onClick={() => handleViewLoans(bank)}
                        className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-medium transition"
                      >
                        <Eye size={16} /> View Loans
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
