import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { leadService, bankService } from '../services/apiService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { LEAD_STATUS_OPTIONS, LEAD_STATUS_BADGE, formatLeadStatus } from '../utils/leadStatus';
import { ArrowLeft, Clock, Send, GitBranch, Loader2, CheckCircle2 } from 'lucide-react';

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusForm, setStatusForm] = useState({ status: '', remarks: '' });
  const [note, setNote] = useState('');
  const [convertForm, setConvertForm] = useState({ tenure: 60, bank: '', purpose: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchLead();
    bankService.getAll().then((d) => setBanks(Array.isArray(d) ? d : d.banks || [])).catch(() => {});
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const data = await leadService.getById(id);
      setLead(data);
      setStatusForm({ status: data.status, remarks: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!statusForm.status || statusForm.status === lead.status) return;
    setActionLoading(true);
    try {
      const res = await leadService.updateStatus(id, statusForm);
      setLead(res.lead);
      setMessage({ type: 'success', text: 'Status updated' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setActionLoading(true);
    try {
      const res = await leadService.addNote(id, note);
      setLead(res.lead);
      setNote('');
      setMessage({ type: 'success', text: 'Note added' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConvert = async () => {
    if (!window.confirm('Convert this lead to a customer and loan application?')) return;
    setActionLoading(true);
    try {
      const res = await leadService.convert(id, convertForm);
      setLead(res.lead);
      setMessage({ type: 'success', text: `Converted! Loan ${res.loan?.applicationNumber}` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fincore-page">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="fincore-page">
        <Sidebar />
        <div className="p-8">Lead not found</div>
      </div>
    );
  }

  const isConverted = lead.status === 'converted';

  return (
    <div className="fincore-page">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6 lg:p-8 max-w-5xl">
          <button onClick={() => navigate('/leads')} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm mb-4">
            <ArrowLeft size={16} /> Back to Leads
          </button>

          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
              }`}
            >
              {message.text}
              {isConverted && lead.convertedLoan && (
                <Link to={`/loans/${lead.convertedLoan._id || lead.convertedLoan}`} className="block mt-1 underline">
                  View loan application →
                </Link>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{lead.fullName}</h1>
              <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
                {lead.email} · {lead.phone} {lead.city && `· ${lead.city}`}
              </p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${LEAD_STATUS_BADGE[lead.status]}`}>
              {formatLeadStatus(lead.status)}
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="fincore-card p-6 space-y-3 text-sm">
              <h2 className="font-bold text-gray-900 dark:text-slate-100">Lead Details</h2>
              <div className="flex justify-between"><span className="text-gray-500">Loan type</span><span className="capitalize font-medium">{lead.loanType}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Requested amount</span><span className="font-medium">₹{lead.requestedAmount?.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Monthly income</span><span>₹{(lead.monthlyIncome || 0).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Employment</span><span className="capitalize">{lead.employmentType}</span></div>
              {lead.notes && <p className="pt-2 border-t dark:border-slate-700 text-gray-600 dark:text-slate-400">{lead.notes}</p>}
            </div>

            {!isConverted && (
              <div className="fincore-card p-6">
                <h2 className="font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Send size={18} /> Update Status
                </h2>
                <form onSubmit={handleStatusUpdate} className="space-y-3">
                  <select
                    value={statusForm.status}
                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                    className="fincore-input"
                  >
                    {LEAD_STATUS_OPTIONS.filter((o) => o.value !== 'converted').map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <input
                    placeholder="Remarks (optional)"
                    value={statusForm.remarks}
                    onChange={(e) => setStatusForm({ ...statusForm, remarks: e.target.value })}
                    className="fincore-input"
                  />
                  <button type="submit" disabled={actionLoading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium">
                    Update Status
                  </button>
                </form>
              </div>
            )}

            {!isConverted && (
              <div className="fincore-card p-6 lg:col-span-2 border-2 border-dashed border-blue-200 dark:border-blue-900/50">
                <h2 className="font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <GitBranch size={18} className="text-blue-600" /> Convert to Loan Application
                </h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                  Creates customer record (if new) and a pending loan application linked to this lead.
                </p>
                <div className="grid sm:grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="text-xs text-gray-500">Tenure (months)</label>
                    <input
                      type="number"
                      value={convertForm.tenure}
                      onChange={(e) => setConvertForm({ ...convertForm, tenure: e.target.value })}
                      className="fincore-input mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Bank (optional)</label>
                    <select
                      value={convertForm.bank}
                      onChange={(e) => setConvertForm({ ...convertForm, bank: e.target.value })}
                      className="fincore-input mt-1"
                    >
                      <option value="">Select bank</option>
                      {banks.map((b) => (
                        <option key={b._id} value={b._id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Purpose</label>
                    <input
                      value={convertForm.purpose}
                      onChange={(e) => setConvertForm({ ...convertForm, purpose: e.target.value })}
                      className="fincore-input mt-1"
                      placeholder="Loan purpose"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold"
                >
                  {actionLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle2 size={18} />}
                  Convert to Loan Application
                </button>
              </div>
            )}

            {isConverted && lead.convertedCustomer && (
              <div className="fincore-card p-6 lg:col-span-2 bg-green-50 dark:bg-green-950/30">
                <p className="text-green-800 dark:text-green-300 font-medium">This lead was converted.</p>
                <div className="flex gap-4 mt-3 text-sm">
                  <Link to={`/customers/${lead.convertedCustomer._id || lead.convertedCustomer}`} className="text-blue-600 underline">
                    View Customer
                  </Link>
                  {lead.convertedLoan && (
                    <Link to={`/loans/${lead.convertedLoan._id || lead.convertedLoan}`} className="text-blue-600 underline">
                      View Loan
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="fincore-card p-6 lg:col-span-2">
              <h2 className="font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Clock size={18} /> Timeline & Notes
              </h2>
              {!isConverted && (
                <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
                  <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add employee note..." className="fincore-input flex-1" />
                  <button type="submit" className="px-4 bg-gray-800 dark:bg-slate-700 text-white rounded-lg text-sm">Add</button>
                </form>
              )}
              <div className="space-y-3">
                {(lead.timeline || [])
                  .slice()
                  .reverse()
                  .map((t, i) => (
                    <div key={i} className="border-l-2 border-blue-200 dark:border-blue-800 pl-4 py-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-slate-100 capitalize">{t.action?.replace(/_/g, ' ')}</p>
                      {t.remarks && <p className="text-sm text-gray-600 dark:text-slate-400">{t.remarks}</p>}
                      <p className="text-xs text-gray-400 mt-1">{new Date(t.date).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
