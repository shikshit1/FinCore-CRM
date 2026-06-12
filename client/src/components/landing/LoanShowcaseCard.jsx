import { Percent, IndianRupee, Clock } from 'lucide-react';

const ICONS = {
  personal: '💳',
  home: '🏠',
  business: '💼',
  education: '🎓',
  auto: '🚗',
};

export default function LoanShowcaseCard({ product, onApply, onEligibility }) {
  return (
    <div className="fincore-card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />
      <div className="flex items-start gap-3">
        <span className="text-3xl" aria-hidden>
          {ICONS[product.id] || '📋'}
        </span>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">{product.title}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{product.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
        <div className="flex items-center gap-1.5 text-gray-600 dark:text-slate-400">
          <Percent size={14} className="text-blue-500" /> From {product.rate}
        </div>
        <div className="flex items-center gap-1.5 text-gray-600 dark:text-slate-400">
          <IndianRupee size={14} className="text-green-500" /> {product.maxAmount}
        </div>
        <div className="flex items-center gap-1.5 text-gray-600 dark:text-slate-400 col-span-2">
          <Clock size={14} className="text-orange-500" /> {product.approvalTime}
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <button
          type="button"
          onClick={() => onApply(product.id)}
          className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition"
        >
          Apply Now
        </button>
        <button
          type="button"
          onClick={() => onEligibility(product.id)}
          className="flex-1 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition"
        >
          Check Eligibility
        </button>
      </div>
    </div>
  );
}
