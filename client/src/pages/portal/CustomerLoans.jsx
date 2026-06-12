import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/portal/PortalLayout';
import { portalService } from '../../services/apiService';
import { formatStatusLabel, STATUS_BADGE } from '../../utils/loanStatus';
import { Eye } from 'lucide-react';

export default function CustomerLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portalService.getLoans().then(d => setLoans(d.loans || [])).finally(() => setLoading(false));
  }, []);

  return (
    <PortalLayout title="My Loans" subtitle="All your loan applications">
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : loans.length === 0 ? (
        <div className="fincore-card p-12 text-center text-gray-500 dark:text-slate-400">No loan applications found.</div>
      ) : (
        <div className="fincore-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800/80 border-b dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-300">Application</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-300">Bank</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-300">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-300">EMI</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-300">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-300">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loans.map(loan => (
                <tr key={loan._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{loan.applicationNumber}</td>
                  <td className="px-4 py-3">{loan.bank?.name || '—'}</td>
                  <td className="px-4 py-3">₹{(loan.loanAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">{loan.monthlyEMI ? `₹${loan.monthlyEMI.toLocaleString('en-IN')}` : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${STATUS_BADGE[loan.status]}`}>
                      {formatStatusLabel(loan.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-400">
                    {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/customer/loans/${loan._id}`} className="text-indigo-600 flex items-center gap-1">
                      <Eye size={16} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PortalLayout>
  );
}
