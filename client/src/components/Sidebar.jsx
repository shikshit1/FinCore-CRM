import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { isAdmin } from '../utils/roles';
import {
  LayoutDashboard,
  Users,
  FileText,
  Building2,
  CheckSquare,
  BarChart3,
  Settings,
  UserPlus,
  UserCog,
  X,
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const { isOpen, close } = useSidebar();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { path: '/leads', label: 'Leads', Icon: UserPlus },
    { path: '/customers', label: 'Customers', Icon: Users },
    { path: '/loans', label: 'Loans', Icon: FileText },
    { path: '/banks', label: 'Banks', Icon: Building2 },
    { path: '/tasks', label: 'Tasks', Icon: CheckSquare },
    { path: '/reports', label: 'Reports', Icon: BarChart3 },
    ...(isAdmin(user) ? [{ path: '/employees', label: 'Employees', Icon: UserCog }] : []),
    { path: '/settings', label: 'Settings', Icon: Settings },
  ];

  const sidebarContent = (
    <>
      <div className="p-4 sm:p-5 border-b border-blue-600/50 dark:border-slate-700/80 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">FinCore</h1>
          <p className="text-blue-200 dark:text-slate-400 text-xs mt-0.5">Finance CRM</p>
        </div>
        <button
          type="button"
          onClick={close}
          className="md:hidden p-1.5 rounded-lg text-blue-200 hover:bg-white/10 transition"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="mt-3 px-3 pb-6 space-y-0.5 overflow-y-auto flex-1">
        {navItems.map(({ path, label, Icon }) => {
          const active = location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              onClick={close}
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
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] bg-gradient-to-b from-blue-700 to-blue-800 dark:from-slate-900 dark:to-slate-950 text-white shadow-xl flex flex-col md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-blue-700 to-blue-800 dark:from-slate-900 dark:to-slate-950 text-white shadow-xl flex-shrink-0 border-r border-transparent dark:border-slate-800 transition-colors duration-300 flex-col">
        {sidebarContent}
      </aside>
    </>
  );
}
