import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { loanService } from '../services/apiService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import {
  ArrowLeft,
  Building2,
  User,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Send,
  Bell,
  Loader2,
} from 'lucide-react';
import {
  LOAN_STATUS_OPTIONS,
  STATUS_BADGE,
  WHATSAPP_STATUSES,
  formatStatusLabel,
} from '../utils/loanStatus';

export default function LoanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: '',
    remarks: '',
    rejectionReason: '',
  });

  useEffect(() => {
    fetchLoan();
  }, [id]);

  const fetchLoan = async () => {
    try {
      setLoading(true);
      const data = await loanService.getById(id);
      setLoan(data);
      setStatusForm(prev => ({ ...prev, status: data.status }));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!statusForm.status || statusForm.status === loan.status) return;

    try {
      setStatusLoading(true);
      setSuccess(null);
      const result = await loanService.updateStatus(id, {
        status: statusForm.status,
        remarks: statusForm.remarks,
        rejectionReason: statusForm.status === 'rejected' ? statusForm.rejectionReason : undefined,
      });

      setLoan(result.loan);
      setStatusForm({ status: result.loan.status, remarks: '', rejectionReason: '' });

      let msg = 'Loan status updated successfully.';
      if (result.notification) {
        if (result.notification.sent) {
          msg += ' WhatsApp notification sent to customer.';
        } else if (result.notification.simulated) {
          msg += ' WhatsApp logged (simulated — configure API keys for live send).';
        } else if (result.notification.error) {
          msg += ` WhatsApp failed: ${result.notification.error}`;
        }
      }
      setSuccess(msg);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setStatusLoading(false);
    }
  };

  const timeline = [
    ...(loan?.timeline || []).map(t => ({ ...t, type: 'timeline' })),
    ...(loan?.statusHistory || []).map(h => ({
      ...h,
      type: 'statusHistory',
      date: h.updatedAt,
      action: 'status_change',
      previousStatus: h.fromStatus,
      status: h.toStatus,
      remarks: h.remarks,
    })),
  ].sort((a, b) => new Date(b.date || b.updatedAt) - new Date(a.date || a.updatedAt));

  if (loading) {
    return (
      <div className="fincore-page">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !loan) {
    return (
      <div className="fincore-page">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="p-8">
            <button onClick={() => navigate('/loans')} className="text-blue-600 flex items-center gap-2 mb-4">
              <ArrowLeft size={18} /> Back to Loans
            </button>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const customer = loan.customer;

  return (
    <div className="fincore-page">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-6xl">
            <button
              onClick={() => navigate('/loans')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-5 text-sm font-medium"
            >
              <ArrowLeft size={18} /> Back to Loans
            </button>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  {loan.applicationNumber || 'Loan Application'}
                </h1>
                <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
                  {customer?.firstName} {customer?.lastName} · ₹{(loan.loanAmount || 0).toLocaleString('en-IN')} ·{' '}
                  <span className="capitalize">{loan.loanType}</span>
                </p>
              </div>
              <span
                className={`inline-flex self-start px-4 py-1.5 rounded-full text-sm font-semibold border ${
                  STATUS_BADGE[loan.status] || STATUS_BADGE.pending
                }`}
              >
                {formatStatusLabel(loan.status)}
              </span>
            </div>

            {success && (
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/50 text-green-800 dark:text-green-300 rounded-xl text-sm flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                {success}
              </div>
            )}
            {error && loan && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-xl text-sm">{error}</div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: workflow + timeline */}
              <div className="lg:col-span-2 space-y-6">
                {/* Status update workflow */}
                <div className="fincore-card p-6">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-1 flex items-center gap-2">
                    <Send className="w-5 h-5 text-blue-600" />
                    Update Loan Status
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                    After receiving bank response, update status here. Customer receives WhatsApp for Approved,
                    Rejected, Documents Pending, and Disbursed.
                  </p>

                  <form onSubmit={handleStatusUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">New Status *</label>
                      <select
                        value={statusForm.status}
                        onChange={e => setStatusForm({ ...statusForm, status: e.target.value })}
                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      >
                        {LOAN_STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {WHATSAPP_STATUSES.includes(statusForm.status) && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <MessageCircle size={12} /> WhatsApp will be sent automatically
                        </p>
                      )}
                    </div>

                    {statusForm.status === 'rejected' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Rejection Reason</label>
                        <input
                          type="text"
                          value={statusForm.rejectionReason}
                          onChange={e => setStatusForm({ ...statusForm, rejectionReason: e.target.value })}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Reason from bank..."
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Employee Notes</label>
                      <textarea
                        value={statusForm.remarks}
                        onChange={e => setStatusForm({ ...statusForm, remarks: e.target.value })}
                        rows={2}
                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Bank response details, internal notes..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={statusLoading || statusForm.status === loan.status}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition"
                    >
                      {statusLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />}
                      {statusLoading ? 'Updating...' : 'Update Status & Notify'}
                    </button>
                  </form>
                </div>

                {/* Timeline */}
                <div className="fincore-card p-6">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Activity Timeline
                  </h2>
                  {timeline.length === 0 ? (
                    <p className="text-gray-500 dark:text-slate-400 text-sm">No activity yet.</p>
                  ) : (
                    <div className="space-y-0">
                      {timeline.map((entry, idx) => (
                        <div key={idx} className="flex gap-4 pb-6 last:pb-0 relative">
                          {idx < timeline.length - 1 && (
                            <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-200" />
                          )}
                          <div
                            className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${
                              entry.action === 'created'
                                ? 'bg-blue-100'
                                : entry.status === 'approved'
                                ? 'bg-green-100'
                                : entry.status === 'rejected'
                                ? 'bg-red-100'
                                : 'bg-gray-100'
                            }`}
                          >
                            <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-slate-100 text-sm">
                                {entry.action === 'created'
                                  ? 'Loan Created'
                                  : `Status: ${formatStatusLabel(entry.previousStatus || '')} → ${formatStatusLabel(entry.status || entry.toStatus)}`}
                              </span>
                              {entry.notificationSent && (
                                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <MessageCircle size={10} /> WhatsApp sent
                                </span>
                              )}
                            </div>
                            {entry.remarks && <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">{entry.remarks}</p>}
                            <p className="text-xs text-gray-400 mt-1">
                              {entry.updatedBy?.name && `${entry.updatedBy.name} · `}
                              {new Date(entry.date || entry.updatedAt).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right sidebar */}
              <div className="space-y-6">
                <div className="fincore-card p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <User size={18} className="text-blue-600" /> Customer
                  </h3>
                  <p className="font-medium">{customer?.firstName} {customer?.lastName}</p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{customer?.email}</p>
                  <p className="text-sm text-gray-600 dark:text-slate-400 flex items-center gap-1 mt-1">
                    <MessageCircle size={14} /> {customer?.phone || 'No phone'}
                  </p>
                  {customer?._id && (
                    <Link to={`/customers/${customer._id}`} className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                      View profile →
                    </Link>
                  )}
                </div>

                <div className="fincore-card p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Building2 size={18} className="text-blue-600" /> Loan Details
                  </h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500 dark:text-slate-400">Bank</dt>
                      <dd className="font-medium">{loan.bank?.name || '—'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500 dark:text-slate-400">Tenure</dt>
                      <dd>{loan.tenure} months</dd>
                    </div>
                    {loan.approvalDate && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500 dark:text-slate-400">Approved</dt>
                        <dd>{new Date(loan.approvalDate).toLocaleDateString('en-IN')}</dd>
                      </div>
                    )}
                    {loan.disbursalDate && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500 dark:text-slate-400">Disbursed</dt>
                        <dd>{new Date(loan.disbursalDate).toLocaleDateString('en-IN')}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* WhatsApp notifications */}
                <div className="fincore-card p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Bell size={18} className="text-green-600" /> WhatsApp Log
                  </h3>
                  {(loan.notifications || []).length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-slate-400">No notifications sent yet.</p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {loan.notifications.map(n => (
                        <div
                          key={n._id}
                          className={`p-3 rounded-lg text-xs border ${
                            n.success ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold capitalize">{formatStatusLabel(n.status)}</span>
                            {n.success ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-red-600" />
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-slate-400 line-clamp-2">{n.message}</p>
                          <p className="text-gray-400 mt-1">
                            {n.provider} · {new Date(n.createdAt).toLocaleString('en-IN')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Workflow guide */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900">
                  <p className="font-semibold mb-2 flex items-center gap-1">
                    <FileText size={16} /> Workflow
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-800/90 text-xs">
                    <li>Employee creates application (Pending)</li>
                    <li>Bank reviews externally</li>
                    <li>Employee updates status in CRM</li>
                    <li>Customer gets WhatsApp automatically</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
