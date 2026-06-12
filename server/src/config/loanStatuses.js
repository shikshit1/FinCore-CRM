export const LOAN_STATUSES = [
  'pending',
  'under_review',
  'documents_pending',
  'approved',
  'rejected',
  'disbursed',
  // legacy — kept for existing records
  'submitted',
  'completed',
];

export const WHATSAPP_NOTIFY_STATUSES = [
  'approved',
  'rejected',
  'documents_pending',
  'disbursed',
];

export const STATUS_LABELS = {
  pending: 'Pending',
  under_review: 'Under Review',
  documents_pending: 'Documents Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  disbursed: 'Disbursed',
  submitted: 'Submitted',
  completed: 'Completed',
};
