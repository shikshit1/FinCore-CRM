import { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import { getHomePath } from '../utils/roles';

import { User, Mail, Phone, ArrowRight, Loader2 } from 'lucide-react';

import AuthLayout from '../components/auth/AuthLayout';

import AuthInput from '../components/auth/AuthInput';

import PasswordInput from '../components/auth/PasswordInput';



export default function Register() {

  const [formData, setFormData] = useState({

    name: '',

    email: '',

    phone: '',

    password: '',

  });

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const { registerCustomer } = useAuth();

  const navigate = useNavigate();



  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.name]: e.target.value });

  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');



    if (!formData.phone?.trim()) {

      setError('Phone number is required');

      return;

    }



    setLoading(true);

    try {

      const result = await registerCustomer(

        formData.name,

        formData.email,

        formData.password,

        formData.phone

      );



      if (result.user) {

        navigate(getHomePath(result.user));

      } else {

        setError(result.error || 'Registration failed');

      }

    } catch (err) {

      setError(err.message || 'Registration failed');

    } finally {

      setLoading(false);

    }

  };



  return (

    <AuthLayout

      title="Create customer account"

      subtitle="Register for the FinCore Customer Portal to track loans and documents"

    >

      {error && (

        <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm rounded-xl">

          {error}

        </div>

      )}



      <form onSubmit={handleSubmit} className="space-y-4">

        <AuthInput label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" icon={User} required />

        <AuthInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@email.com" icon={Mail} required />

        <AuthInput

          label="Phone"

          name="phone"

          type="tel"

          value={formData.phone}

          onChange={handleChange}

          placeholder="9876543210"

          icon={Phone}

          required

        />

        <PasswordInput value={formData.password} onChange={handleChange} placeholder="Create a strong password" autoComplete="new-password" />



        <button

          type="submit"

          disabled={loading}

          className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-semibold shadow-lg disabled:opacity-60 transition mt-2"

        >

          {loading ? (

            <>

              <Loader2 className="w-5 h-5 animate-spin" /> Creating account...

            </>

          ) : (

            <>

              Create customer account <ArrowRight className="w-5 h-5" />

            </>

          )}

        </button>

      </form>



      <p className="mt-4 text-xs text-center text-gray-500 dark:text-slate-400">

        Need CRM access? Contact your FinCore administrator — employee accounts cannot be created here.

      </p>



      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700 text-center text-sm text-gray-600 dark:text-slate-400 space-y-2">

        <p>

          Already have an account?{' '}

          <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400">

            Sign in

          </Link>

        </p>

        <p>

          <Link to="/" className="text-xs text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">

            ← Back to public website

          </Link>

        </p>

      </div>

    </AuthLayout>

  );

}

