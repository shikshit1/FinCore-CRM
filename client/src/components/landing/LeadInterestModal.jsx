import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Modal from '../ui/Modal';
import { leadService } from '../../services/apiService';
import LeadInterestForm from './LeadInterestForm';

const emptyForm = {
  fullName: '',
  phone: '',
  email: '',
  city: '',
  employmentType: 'employed',
  monthlyIncome: '',
  loanType: 'personal',
  requestedAmount: '',
  notes: '',
};

export default function LeadInterestModal({ open, onClose, loanType = 'personal', isEligibility = false }) {
  const [form, setForm] = useState({ ...emptyForm, loanType });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, loanType });
      setError('');
      setSuccess(false);
    }
  }, [open, loanType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await leadService.submit({
        ...form,
        monthlyIncome: Number(form.monthlyIncome) || 0,
        requestedAmount: Number(form.requestedAmount),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={success ? 'Submitted' : isEligibility ? 'Check Eligibility' : 'Apply for Loan Interest'}
      size="md"
      panelClassName="sm:rounded-2xl"
    >
      {success ? (
        <div className="text-center py-4">
          <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-slate-400">
            Thank you! Our team will contact you shortly. This is not a final loan approval.
          </p>
          <button type="button" onClick={onClose} className="mt-6 text-blue-600 dark:text-blue-400 font-medium">
            Close
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
            Share your details — an employee will follow up. No loan is booked automatically.
          </p>
          <LeadInterestForm
            form={form}
            onChange={setForm}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            isEligibility={isEligibility}
            compact
          />
          <p className="text-center text-xs text-gray-500 mt-3">
            Prefer full page?{' '}
            <Link to={`/apply?type=${form.loanType}`} className="text-blue-600 dark:text-blue-400" onClick={onClose}>
              Open apply form
            </Link>
          </p>
        </>
      )}
    </Modal>
  );
}
