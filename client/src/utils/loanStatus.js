export const LOAN_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'documents_pending', label: 'Documents Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'disbursed', label: 'Disbursed' },
];

export const STATUS_BADGE = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-900/50',
  under_review: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/50',
  documents_pending: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-900/50',
  approved: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-900/50',
  rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900/50',
  disbursed: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-900/50',
  submitted: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/50',
  completed: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
};

export const WHATSAPP_STATUSES = ['approved', 'rejected', 'documents_pending', 'disbursed'];

export const formatStatusLabel = (status) =>
  LOAN_STATUS_OPTIONS.find((s) => s.value === status)?.label ||
  status?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ||
  status;
