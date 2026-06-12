import { useState, useEffect } from 'react';

import { Link, useSearchParams } from 'react-router-dom';

import PublicNavbar from '../../components/landing/PublicNavbar';

import PublicFooter from '../../components/landing/PublicFooter';

import LeadInterestForm from '../../components/landing/LeadInterestForm';

import { leadService } from '../../services/apiService';

import { CheckCircle2, ArrowLeft } from 'lucide-react';



const initialForm = {

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



export default function ApplyLoan() {

  const [searchParams] = useSearchParams();

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({

    ...initialForm,

    loanType: searchParams.get('type') || 'personal',

  });



  const isEligibility = searchParams.get('eligibility') === '1';



  useEffect(() => {

    const type = searchParams.get('type');

    if (type) setForm((f) => ({ ...f, loanType: type }));

  }, [searchParams]);



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



  if (success) {

    return (

      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">

        <PublicNavbar />

        <div className="max-w-lg mx-auto px-4 py-24 text-center">

          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />

          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-6">Interest Submitted!</h1>

          <p className="text-gray-600 dark:text-slate-400 mt-3">

            Thank you. Our loan officer will contact you shortly. This is not a final loan approval — we will guide you

            through documents and bank verification.

          </p>

          <Link to="/" className="inline-block mt-8 text-blue-600 dark:text-blue-400 font-medium">

            Back to Home

          </Link>

        </div>

        <PublicFooter />

      </div>

    );

  }



  return (

    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">

      <PublicNavbar />

      <div className="max-w-2xl mx-auto px-4 py-12">

        <Link to="/" className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-6">

          <ArrowLeft size={16} /> Back to website

        </Link>

        <div className="fincore-card p-8 shadow-lg">

          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">

            {isEligibility ? 'Check Eligibility' : 'Apply for Loan Interest'}

          </h1>

          <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">

            Submit your details — our team will reach out. No loan is created automatically.

          </p>



          <div className="mt-6">

            <LeadInterestForm

              form={form}

              onChange={setForm}

              onSubmit={handleSubmit}

              loading={loading}

              error={error}

              isEligibility={isEligibility}

            />

          </div>

        </div>

      </div>

      <PublicFooter />

    </div>

  );

}

