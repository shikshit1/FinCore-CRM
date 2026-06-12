import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { leadService } from '../services/apiService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { LEAD_STATUS_OPTIONS, LEAD_STATUS_BADGE, formatLeadStatus } from '../utils/leadStatus';
import { UserPlus, Search, Eye } from 'lucide-react';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, [filter, search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { limit: 50 };
      if (filter) params.status = filter;
      if (search.trim()) params.search = search.trim();
      const [list, st] = await Promise.all([
        leadService.getAll(params),
        leadService.getStats(),
      ]);
      setLeads(list.leads || []);
      setStats(st);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fincore-page">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                <UserPlus className="text-blue-600" /> Leads
              </h1>
              <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Website loan interest submissions</p>
            </div>
          </div>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              {[
                { key: 'new_lead', label: 'New', color: 'blue' },
                { key: 'contacted', label: 'Contacted', color: 'yellow' },
                { key: 'documents_requested', label: 'Docs', color: 'orange' },
                { key: 'converted', label: 'Converted', color: 'green' },
                { key: 'rejected', label: 'Rejected', color: 'red' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(filter === key ? '' : key)}
                  className={`fincore-card p-4 text-left transition ${filter === key ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <p className="text-xs text-gray-500 dark:text-slate-400">{label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{stats[key] || 0}</p>
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="fincore-input pl-10"
              />
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="fincore-input sm:w-48">
              <option value="">All Status</option>
              {LEAD_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="text-gray-500 dark:text-slate-400">Loading leads...</p>
          ) : leads.length === 0 ? (
            <div className="fincore-card p-12 text-center text-gray-500 dark:text-slate-400">
              No leads found. Leads appear when customers submit the public interest form.
            </div>
          ) : (
            <div className="fincore-card overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-800/80 border-b dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-300">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-300">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-300">Loan</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-300">Income</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-300">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-300">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-300">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id} className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-slate-100">{lead.fullName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-400">
                        <div>{lead.phone}</div>
                        <div className="text-xs">{lead.email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm capitalize text-gray-600 dark:text-slate-400">{lead.loanType}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-400">
                        ₹{(lead.monthlyIncome || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-slate-100">
                        ₹{(lead.requestedAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs border ${LEAD_STATUS_BADGE[lead.status] || ''}`}>
                          {formatLeadStatus(lead.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-slate-400">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/leads/${lead._id}`}
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium"
                        >
                          <Eye size={14} /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
