import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHomePath } from '../utils/roles';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import PasswordInput from '../components/auth/PasswordInput';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email.trim(), formData.password);
      if (result.user) {
        navigate(getHomePath(result.user));
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account to continue">
      {error && (
        <div className="mb-5 flex items-start gap-2 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm rounded-xl">
          <span className="flex-1">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          icon={Mail}
          autoComplete="email"
        />

        <PasswordInput
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700 text-center text-sm text-gray-600 dark:text-slate-400 space-y-2">
        <p>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            Register
          </Link>
        </p>
        <p className="text-xs text-gray-500 dark:text-slate-400">
          New here?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
            Register as a customer
          </Link>
          . CRM staff: sign in with credentials from your administrator.
        </p>
        <p>
          <Link to="/" className="text-xs text-gray-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400">
            ← Back to public website
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
