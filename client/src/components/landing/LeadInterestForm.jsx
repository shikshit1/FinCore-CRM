import { LOAN_PRODUCTS } from '../../data/loanProducts';
import { Loader2 } from 'lucide-react';

const EMPLOYMENT_OPTIONS = [
  { value: 'employed', label: 'Employed' },
  { value: 'self-employed', label: 'Self Employed' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'student', label: 'Student' },
  { value: 'retired', label: 'Retired' },
];

export default function LeadInterestForm({
  form,
  onChange,
  onSubmit,
  loading,
  error,
  isEligibility = false,
  compact = false,
}) {
  const handleChange = (e) => {
    onChange({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className={compact ? 'space-y-3' : 'space-y-4'}>
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Full Name *</label>
        <input name="fullName" required value={form.fullName} onChange={handleChange} className="fincore-input" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Phone *</label>
          <input
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            className="fincore-input"
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email *</label>
          <input name="email" type="email" required value={form.email} onChange={handleChange} className="fincore-input" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">City</label>
        <input name="city" value={form.city} onChange={handleChange} className="fincore-input" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Employment Type</label>
          <select name="employmentType" value={form.employmentType} onChange={handleChange} className="fincore-input">
            {EMPLOYMENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Monthly Income (₹)</label>
          <input name="monthlyIncome" type="number" value={form.monthlyIncome} onChange={handleChange} className="fincore-input" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Interested Loan Type *</label>
          <select name="loanType" required value={form.loanType} onChange={handleChange} className="fincore-input">
            {LOAN_PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Required Loan Amount (₹) *</label>
          <input
            name="requestedAmount"
            type="number"
            required
            min={10000}
            value={form.requestedAmount}
            onChange={handleChange}
            className="fincore-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Notes</label>
        <textarea
          name="notes"
          rows={compact ? 2 : 3}
          value={form.notes}
          onChange={handleChange}
          className="fincore-input"
          placeholder="Add any additional information (optional)"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-semibold disabled:opacity-60 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} /> Submitting...
          </>
        ) : (
          isEligibility ? 'Check Eligibility' : 'Submit Interest'
        )}
      </button>

      <p className="text-xs text-center text-gray-500 dark:text-slate-500">
        By submitting, you agree to be contacted by FinCore. No loan is created automatically.
      </p>
    </form>
  );
}
