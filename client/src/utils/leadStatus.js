export const LEAD_STATUS_OPTIONS = [
  { value: 'new_lead', label: 'New Lead' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'documents_requested', label: 'Documents Requested' },
  { value: 'converted', label: 'Converted' },
  { value: 'rejected', label: 'Rejected' },
];

export const LEAD_STATUS_BADGE = {
  new_lead: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/50',
  contacted: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-900/50',
  documents_requested: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-900/50',
  converted: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-900/50',
  rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900/50',
};

export const formatLeadStatus = (status) =>
  LEAD_STATUS_OPTIONS.find((s) => s.value === status)?.label ||
  status?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
