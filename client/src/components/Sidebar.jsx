import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../utils/roles';
import {
  LayoutDashboard,
  Users,
  FileText,
  Building2,
  CheckSquare,
  Phone,
  BarChart3,
  Settings,
  UserPlus,
  UserCog,
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { path: '/leads', label: 'Leads', Icon: UserPlus },
    { path: '/customers', label: 'Customers', Icon: Users },
    { path: '/loans', label: 'Loans', Icon: FileText },
    { path: '/banks', label: 'Banks', Icon: Building2 },
    { path: '/tasks', label: 'Tasks', Icon: CheckSquare },
    { path: '/call-tracking', label: 'Call Tracking', Icon: Phone },
    { path: '/reports', label: 'Reports', Icon: BarChart3 },
    ...(isAdmin(user) ? [{ path: '/employees', label: 'Employees', Icon: UserCog }] : []),
    { path: '/settings', label: 'Settings', Icon: Settings },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-700 to-blue-800 dark:from-slate-900 dark:to-slate-950 text-white shadow-xl flex-shrink-0 border-r border-transparent dark:border-slate-800 transition-colors duration-300">
      <div className="p-5 border-b border-blue-600/50 dark:border-slate-700/80">
        <h1 className="text-xl font-bold tracking-tight">FinCore</h1>
        <p className="text-blue-200 dark:text-slate-400 text-xs mt-0.5">Finance CRM</p>
      </div>

      <nav className="mt-4 px-3 space-y-0.5">
        {navItems.map(({ path, label, Icon }) => {
          const active = location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active
                  ? 'bg-white/15 dark:bg-slate-800 text-white shadow-sm'
                  : 'text-blue-100 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-slate-800/80 hover:text-white dark:hover:text-slate-100'
              }`}
            >
              <Icon size={18} className={active ? 'text-blue-200 dark:text-blue-400' : 'text-blue-300 dark:text-slate-500'} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
