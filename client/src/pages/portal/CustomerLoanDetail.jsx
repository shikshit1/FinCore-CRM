import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PortalLayout from '../../components/portal/PortalLayout';
import { portalService } from '../../services/apiService';
import { formatStatusLabel, STATUS_BADGE } from '../../utils/loanStatus';
import { ArrowLeft, Building2, MessageCircle, CheckCircle2 } from 'lucide-react';

const WORKFLOW_ORDER = ['pending', 'under_review', 'documents_pending', 'approved', 'rejected', 'disbursed'];

const stepIndex = (status) => {
  const map = { pending: 0, submitted: 0, under_review: 1, documents_pending: 2, approved: 3, rejected: 3, disbursed: 5 };
  return map[status] ?? 0;
};

export default function CustomerLoanDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portalService.getLoanById(id).then(setData).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <PortalLayout title="Loan Details"><div className="py-12 text-center">Loading...</div></PortalLayout>;
  }

  if (!data?.loan) {
    return (
      <PortalLayout title="Loan Details">
        <p className="text-red-600">Loan not found.</p>
        <Link to="/customer/loans" className="text-indigo-600 mt-4 inline-block">← Back</Link>
      </PortalLayout>
    );
  }

  const { loan, notifications, workflowSteps } = data;
  const currentStep = stepIndex(loan.status);
  const timeline = [...(loan.timeline || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <PortalLayout title={loan.applicationNumber} subtitle={`${formatStatusLabel(loan.status)} · ${loan.bank?.name || 'Bank pending'}`}>
      <Link to="/customer/loans" className="inline-flex items-center gap-2 text-indigo-600 text-sm font-medium mb-6">
        <ArrowLeft size={16} /> Back to loans
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Workflow stepper */}
          <div className="fincore-card p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 dark:text-slate-100 mb-4">Application Progress</h2>
            <div className="flex flex-wrap gap-2">
              {(workflowSteps || WORKFLOW_ORDER.map(k => ({ key: k, label: formatStatusLabel(k) }))).map((step, idx) => {
                const key = step.key || step;
                const label = step.label || formatStatusLabel(key);
                const done = stepIndex(key) <= currentStep && loan.status !== 'rejected';
                const active = key === loan.status || (loan.status === 'submitted' && key === 'pending');
                return (
                  <div
                    key={key}
                    className={`flex-1 min-w-[100px] text-center p-2 rounded-lg text-xs font-medium border ${
                      active ? 'bg-indigo-600 text-white border-indigo-600' :
                      done ? 'bg-green-50 text-green-800 border-green-200' :
                      'bg-gray-50 text-gray-500 dark:text-slate-400 border-gray-200'
                    }`}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline */}
          <div className="fincore-card p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 dark:text-slate-100 mb-4">Activity Timeline</h2>
            {timeline.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-slate-400">No activity recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {timeline.map((entry, i) => (
                  <div key={i} className="flex gap-3 border-l-2 border-indigo-100 pl-4">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-slate-100">
                        {entry.action === 'created' ? 'Application Submitted' : `Status: ${formatStatusLabel(entry.status)}`}
                      </p>
                      {entry.remarks && <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">{entry.remarks}</p>}
                      <p className="text-xs text-gray-400 mt-1">
                        {entry.updatedBy?.name && `${entry.updatedBy.name} · `}
                        {new Date(entry.date).toLocaleString('en-IN')}
                      </p>
                      {entry.notificationSent && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                          <MessageCircle size={12} /> WhatsApp sent
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="fincore-card p-5 shadow-sm">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border mb-4 ${STATUS_BADGE[loan.status]}`}>
              {formatStatusLabel(loan.status)}
            </span>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500 dark:text-slate-400">Amount</dt><dd className="font-bold">₹{(loan.loanAmount || 0).toLocaleString('en-IN')}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500 dark:text-slate-400">Type</dt><dd className="capitalize">{loan.loanType}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500 dark:text-slate-400">Tenure</dt><dd>{loan.tenure} months</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500 dark:text-slate-400">EMI</dt><dd>{loan.monthlyEMI ? `₹${loan.monthlyEMI.toLocaleString('en-IN')}` : '—'}</dd></div>
              <div className="flex justify-between items-center gap-2">
                <dt className="text-gray-500 dark:text-slate-400 flex items-center gap-1"><Building2 size={14} /> Bank</dt>
                <dd className="font-medium">{loan.bank?.name || '—'}</dd>
              </div>
              {loan.approvalDate && (
                <div className="flex justify-between"><dt className="text-gray-500 dark:text-slate-400">Approved</dt><dd>{new Date(loan.approvalDate).toLocaleDateString('en-IN')}</dd></div>
              )}
              {loan.disbursalDate && (
                <div className="flex justify-between"><dt className="text-gray-500 dark:text-slate-400">Disbursed</dt><dd>{new Date(loan.disbursalDate).toLocaleDateString('en-IN')}</dd></div>
              )}
              {loan.rejectionReason && (
                <div className="pt-2 border-t"><dt className="text-red-600 text-xs">Rejection reason</dt><dd className="text-red-800">{loan.rejectionReason}</dd></div>
              )}
            </dl>
          </div>

          <div className="fincore-card p-5 shadow-sm">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><MessageCircle size={16} className="text-green-600" /> Notifications</h3>
            {(notifications || []).length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-slate-400">No messages yet.</p>
            ) : (
              notifications.map(n => (
                <div key={n._id} className="text-xs p-2 bg-green-50 rounded-lg mb-2 border border-green-100">
                  {n.success && <CheckCircle2 className="w-3 h-3 text-green-600 inline mr-1" />}
                  <p className="line-clamp-3 text-gray-700 dark:text-slate-300">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
