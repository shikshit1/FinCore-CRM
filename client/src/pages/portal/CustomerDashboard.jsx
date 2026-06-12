import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/portal/PortalLayout';
import { portalService } from '../../services/apiService';
import { formatStatusLabel, STATUS_BADGE } from '../../utils/loanStatus';
import { FileText, CheckCircle, XCircle, Clock, MessageCircle, IndianRupee } from 'lucide-react';

export default function CustomerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portalService.getDashboard().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PortalLayout title="Dashboard">
        <div className="flex justify-center py-20">
          <div className="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full" />
        </div>
      </PortalLayout>
    );
  }

  const { stats, recentLoans, notifications } = data || {};

  return (
    <PortalLayout title="My Dashboard" subtitle="Track your loan applications and updates">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Loans', value: stats?.totalLoans || 0, icon: FileText, iconClass: 'text-blue-600' },
          { label: 'In Progress', value: stats?.pending || 0, icon: Clock, iconClass: 'text-yellow-600' },
          { label: 'Approved', value: stats?.approved || 0, icon: CheckCircle, iconClass: 'text-green-600' },
          { label: 'Disbursed', value: stats?.disbursed || 0, icon: IndianRupee, iconClass: 'text-indigo-600' },
        ].map(card => (
          <div key={card.label} className="fincore-card p-4">
            <card.icon className={`w-5 h-5 ${card.iconClass} mb-2`} />
            <p className="text-xs text-gray-500 dark:text-slate-400">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="fincore-card p-5">
          <h2 className="font-bold text-gray-900 dark:text-slate-100 mb-4">Recent Applications</h2>
          {recentLoans?.length ? (
            <div className="space-y-3">
              {recentLoans.map(loan => (
                <Link
                  key={loan._id}
                  to={`/customer/loans/${loan._id}`}
                  className="block p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-slate-100">{loan.applicationNumber}</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400 capitalize">{loan.loanType} · ₹{(loan.loanAmount || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_BADGE[loan.status] || ''}`}>
                      {formatStatusLabel(loan.status)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-slate-400 text-sm">No loan applications yet.</p>
          )}
          <Link to="/customer/loans" className="inline-block mt-4 text-sm text-indigo-600 font-medium">View all loans →</Link>
        </div>

        <div className="fincore-card p-5">
          <h2 className="font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" /> WhatsApp Updates
          </h2>
          {notifications?.length ? (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {notifications.map(n => (
                <div
                  key={n._id}
                  className={`p-3 rounded-lg text-xs border transition hover:shadow-sm ${
                    n.success ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-slate-100">{formatStatusLabel(n.status)}</span>
                    <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-white/80 text-gray-600 dark:text-slate-400 border border-gray-200">
                      {n.provider || 'simulated'}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-slate-400 line-clamp-3">{n.message}</p>
                  <p className="text-gray-400 mt-1.5 flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {new Date(n.createdAt).toLocaleString('en-IN')}
                    {n.loan?.applicationNumber && ` · ${n.loan.applicationNumber}`}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-slate-400 text-sm border border-dashed border-gray-200 rounded-lg">
              <MessageCircle className="w-8 h-8 mx-auto text-gray-300 mb-2" />
              Status updates from your loan officer will appear here.
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
