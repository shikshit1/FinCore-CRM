import { Link } from 'react-router-dom';
import { Landmark, Shield, TrendingUp, Users, ArrowLeft } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-500">
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-blue-200/90 hover:text-white transition"
        >
          <ArrowLeft size={16} /> Public website
        </Link>
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        <div className="lg:w-[45%] xl:w-[42%] flex flex-col justify-center px-6 py-10 lg:px-12 lg:py-16 text-white">
          <div className="max-w-md mx-auto lg:mx-0 w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 shadow-lg shadow-blue-500/30">
                <Landmark className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">FinCore CRM</h1>
                <p className="text-blue-200/90 text-sm mt-0.5">Finance Direct Selling Management</p>
              </div>
            </div>

            <p className="text-blue-100/80 text-base lg:text-lg leading-relaxed mb-8 hidden sm:block">
              Streamline loans, customers, banks, and telecaller operations in one powerful finance CRM platform.
            </p>

            <div className="space-y-4 hidden md:block">
              {[
                { icon: TrendingUp, text: 'Bank-wise loan analytics & tracking' },
                { icon: Users, text: 'Customer & lead management' },
                { icon: Shield, text: 'Secure, role-based access control' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-blue-100/70">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-blue-300" />
                  </div>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8 lg:py-12 lg:px-8">
          <div className="w-full max-w-md">
            <div className="lg:hidden text-center mb-6">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 shadow-lg mb-3">
                <Landmark className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">FinCore CRM</h2>
              <p className="text-blue-200/80 text-xs mt-1">Finance Direct Selling Management</p>
            </div>

            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/40 border border-white/20 dark:border-slate-700/80 p-6 sm:p-8 transition-all duration-300">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">{title}</h2>
                {subtitle && <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">{subtitle}</p>}
              </div>
              {children}
            </div>

            <p className="text-center text-blue-200/50 text-xs mt-6">
              © {new Date().getFullYear()} FinCore CRM. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
